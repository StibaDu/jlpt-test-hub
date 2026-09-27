import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

export const testRoutes = new Hono()
  .post('/submit', zValidator('json', z.object({
    level: z.enum(['N5', 'N4', 'N3']),
    mode: z.enum(['real', 'learning']),
    score: z.number(),
    correctCount: z.number(),
    totalQuestions: z.number(),
    timeSpent: z.number(),
    answers: z.record(z.number()),
    questionResults: z.optional(z.array(z.object({
      questionId: z.number(),
      correct: z.boolean(),
      category: z.string().optional(),
    }))),
  })), async (c) => {
    const user = c.get('user');
    const { level, mode, score, correctCount, totalQuestions, timeSpent, answers, questionResults } = c.req.valid('json');

    const attemptId = crypto.randomUUID();
    // Store per-question data (with category) for weakness analysis; keep raw answers for review
    const answersForStorage = questionResults && questionResults.length > 0
      ? questionResults.reduce((acc, qr) => {
          acc[qr.questionId] = { correct: qr.correct, category: qr.category || 'Vokabeln' };
          return acc;
        }, {} as Record<string, any>)
      : answers;

    await c.env.DB.prepare(
      'INSERT INTO test_attempts (id, user_id, level, mode, score, correct_count, total_questions, time_spent_seconds, completed_at, answers_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(attemptId, user.sub, level, mode, score, correctCount, totalQuestions, timeSpent, Date.now(), JSON.stringify(answersForStorage)).run();

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

    // Populate weak_questions for weakness analysis
    if (questionResults && questionResults.length > 0) {
      for (const qr of questionResults) {
        if (qr.correct) {
          // Correct answer → mark as mastered
          await c.env.DB.prepare(
            `INSERT INTO weak_questions (id, user_id, question_id, level, attempts, last_wrong_at, mastered)
             VALUES (?, ?, ?, ?, 0, NULL, TRUE)
             ON CONFLICT(user_id, question_id, level) DO UPDATE SET mastered = TRUE`
          ).bind(crypto.randomUUID(), user.sub, qr.questionId, level).run();
        } else {
          // Wrong answer → increment attempts, set last_wrong_at, unmaster
          await c.env.DB.prepare(
            `INSERT INTO weak_questions (id, user_id, question_id, level, attempts, last_wrong_at, mastered)
             VALUES (?, ?, ?, ?, 1, ?, FALSE)
             ON CONFLICT(user_id, question_id, level) DO UPDATE SET
               attempts = attempts + 1,
               last_wrong_at = ?,
               mastered = FALSE`
          ).bind(crypto.randomUUID(), user.sub, qr.questionId, level, Date.now(), Date.now()).run();
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