import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { sm2, answerToQuality } from '../progress/sm2';

export const testRoutes = new Hono()
  .post('/submit', zValidator('json', z.object({
    level: z.enum(['N5', 'N4', 'N3']),
    mode: z.enum(['real', 'learning']),
    score: z.number(),
    correctCount: z.number(),
    totalQuestions: z.number(),
    timeSpent: z.number(),
    answers: z.record(z.number()),
    clientTestId: z.string().min(8).max(64).optional(),
    questionResults: z.optional(z.array(z.object({
      questionId: z.number(),
      correct: z.boolean(),
      category: z.string().optional(),
      selectedOption: z.number().optional(),
    }))),
  })), async (c) => {
    const user = c.get('user');
    const { level, mode, score, correctCount, totalQuestions, timeSpent, answers, questionResults, clientTestId } = c.req.valid('json');

    // Idempotency: a retried submission with the same clientTestId is not double-counted
    if (clientTestId) {
      const existing = await c.env.DB.prepare(
        'SELECT id FROM test_attempts WHERE user_id = ? AND client_test_id = ?'
      ).bind(user.sub, clientTestId).first();
      if (existing) {
        return c.json({ id: existing.id, score, correctCount, totalQuestions, passed: score >= 60, duplicate: true });
      }
    }

    const attemptId = crypto.randomUUID();
    // Store per-question data (with category) for weakness analysis; keep raw answers for review
    const answersForStorage = questionResults && questionResults.length > 0
      ? questionResults.reduce((acc, qr) => {
          acc[qr.questionId] = { correct: qr.correct, category: qr.category || 'Vokabeln' };
          return acc;
        }, {} as Record<string, any>)
      : answers;

    await c.env.DB.prepare(
      'INSERT INTO test_attempts (id, user_id, level, mode, score, correct_count, total_questions, time_spent_seconds, completed_at, answers_json, client_test_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(attemptId, user.sub, level, mode, score, correctCount, totalQuestions, timeSpent, Date.now(), JSON.stringify(answersForStorage), clientTestId ?? null).run();

    await c.env.DB.prepare(
      `INSERT INTO user_progress (user_id, total_tests_taken, total_questions_answered, total_correct, total_time_spent_seconds, updated_at)
       VALUES (?, 1, ?, ?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         total_tests_taken = total_tests_taken + 1,
         total_questions_answered = total_questions_answered + ?,
         total_correct = total_correct + ?,
         total_time_spent_seconds = total_time_spent_seconds + ?,
         last_studied_at = ?,
         updated_at = ?`
    ).bind(user.sub, totalQuestions, correctCount, timeSpent, Date.now(), totalQuestions, correctCount, timeSpent, Date.now(), Date.now()).run();

    // Populate weak_questions + feed SM-2 scheduler
    if (questionResults && questionResults.length > 0) {
      for (const qr of questionResults) {
        const quality = answerToQuality(qr.correct);
        const next = sm2(quality, { repetitions: 0, easeFactor: 2.5, intervalDays: 0 });

        if (qr.correct) {
          // Correct: upsert, keep existing SRS state, advance schedule
          const existing = await c.env.DB.prepare(
            'SELECT repetitions, ease_factor, interval_days FROM weak_questions WHERE user_id = ? AND question_id = ? AND level = ?'
          ).bind(user.sub, qr.questionId, level).first<any>();
          const prev = existing
            ? { repetitions: existing.repetitions ?? 0, easeFactor: existing.ease_factor ?? 2.5, intervalDays: existing.interval_days ?? 0 }
            : { repetitions: 0, easeFactor: 2.5, intervalDays: 0 };
          const sched = sm2(5, prev);
          const graduated = sched.repetitions >= 5;

          await c.env.DB.prepare(
            `INSERT INTO weak_questions (id, user_id, question_id, level, attempts, last_wrong_at, mastered, repetitions, ease_factor, interval_days, next_review_at, last_answer, total_attempts)
             VALUES (?, ?, ?, ?, 0, NULL, ?, ?, ?, ?, ?, 'correct', 1)
             ON CONFLICT(user_id, question_id, level) DO UPDATE SET
               mastered = ?,
               repetitions = ?,
               ease_factor = ?,
               interval_days = ?,
               next_review_at = ?,
               last_answer = 'correct',
               total_attempts = COALESCE(total_attempts, 0) + 1`
          ).bind(
            crypto.randomUUID(), user.sub, qr.questionId, level, graduated ? 1 : 0,
            sched.repetitions, sched.easeFactor, sched.intervalDays, sched.nextReviewAt,
            graduated ? 1 : 0,
            sched.repetitions, sched.easeFactor, sched.intervalDays, sched.nextReviewAt
          ).run();
        } else {
          // Wrong: reset schedule (due tomorrow), track wrong option, unmaster
          await c.env.DB.prepare(
            `INSERT INTO weak_questions (id, user_id, question_id, level, attempts, last_wrong_at, mastered, times_wrong, total_attempts, last_wrong_option, last_answer, repetitions, ease_factor, interval_days, next_review_at)
             VALUES (?, ?, ?, ?, 1, ?, FALSE, 1, 1, ?, 'wrong', 0, 2.5, 1, ?)
             ON CONFLICT(user_id, question_id, level) DO UPDATE SET
               attempts = attempts + 1,
               times_wrong = COALESCE(times_wrong, 0) + 1,
               total_attempts = COALESCE(total_attempts, 0) + 1,
               last_wrong_at = ?,
               last_wrong_option = ?,
               last_answer = 'wrong',
               mastered = FALSE,
               repetitions = 0,
               interval_days = 1,
               next_review_at = ?`
          ).bind(
            crypto.randomUUID(), user.sub, qr.questionId, level,
            Date.now(), qr.selectedOption ?? null, Date.now() + 24 * 60 * 60 * 1000,
            Date.now(), qr.selectedOption ?? null, Date.now() + 24 * 60 * 60 * 1000
          ).run();
        }
      }
    }

    return c.json({ id: attemptId, score, correctCount, totalQuestions, passed: score >= 60 });
  })
  .get('/history', async (c) => {
    const user = c.get('user');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = (page - 1) * limit;

    const attempts = await c.env.DB.prepare(
      'SELECT * FROM test_attempts WHERE user_id = ? ORDER BY completed_at DESC LIMIT ? OFFSET ?'
    ).bind(user.sub, limit, offset).all();

    const total = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM test_attempts WHERE user_id = ?'
    ).bind(user.sub).first();

    return c.json({
      attempts: attempts.results,
      pagination: { page, limit, total: total?.count || 0, totalPages: Math.ceil((total?.count || 0) / limit) },
    });
  });