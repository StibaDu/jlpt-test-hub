import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const testRoutes = new Hono();

// GET /api/tests/questions/:level?count=30
const testRoutes = new Hono()
  .get('/questions', async (c) => {
    const user = c.get('user');
    const level = c.req.query('level') || 'N5';
    const count = parseInt(c.req.query('count') || '30');
    const mode = c.req.query('mode') || 'real';

    // Check subscription for unlimited questions
    const sub = await c.env.DB.prepare(
      `SELECT status FROM subscriptions WHERE user_id = ? AND status = 'active'`
    ).bind(c.get('user').sub).first();

    const isPro = sub?.status === 'active';
    const maxQuestions = isPro ? 150 : 30;
    const finalCount = Math.min(count, maxQuestions);

    // Fetch questions from the appropriate level
    // In production, fetch from D1 or KV
    // For now, return mock data structure
    return c.json({
      level,
      count: finalCount,
      mode,
      isPro,
      questions: [], // Would be populated from question bank
    });
  })

  // POST /api/tests/start
  .post('/start', zValidator('json', z.object({
    level: z.enum(['N5', 'N4', 'N3']),
    mode: z.enum(['real', 'learning']),
  }), async (c) => {
    const user = c.get('user');
    const { level, mode } = c.req.valid('json');
    const db = c.env.DB;

    // Check subscription for real mode
    if (mode === 'real') {
      const sub = await c.env.DB.prepare(
        `SELECT status FROM subscriptions WHERE user_id = ? AND status = 'active'`
      ).bind(c.get('user').sub).first();

      if (!sub || sub.status !== 'active') {
        return c.json({ 
          error: 'Pro subscription required for Real Test mode',
          code: 'PRO_REQUIRED',
          upgradeUrl: '/upgrade'
        }, 403);
      }
    }

    // Fetch questions (from D1 or KV)
    // For now, return mock test session
    const testId = crypto.randomUUID();
    const questions = []; // Would fetch from question bank

    return c.json({
      testId,
      level: 'N5',
      mode,
      questions: [],
      timeLimit: 3600, // 60 minutes for N5
    });
  })

  // POST /api/tests/submit
  .post('/submit', zValidator('json', z.object({
    testId: z.string(),
    answers: z.record(z.number()), // questionId -> selectedOption
    timeSpent: z.number(),
  }), async (c) => {
    const user = c.get('user');
    const { testId, answers, timeSpent } = c.req.valid('json');
    const db = c.env.DB;

    // Calculate score
    // const questions = await getQuestionsForTest(testId);
    // let correct = 0;
    // for (const [qId, answer] of Object.entries(answers)) {
    //   if (questions.find(q => q.id === qId)?.correctIndex === answer) correct++;
    // }
    // const score = Math.round((correct / questions.length) * 100);

    // For now, mock
    const score = 75;
    const correctCount = 22;
    const totalQuestions = 30;

    // Save attempt
    const attemptId = crypto.randomUUID();
    await c.env.DB.prepare(`
      INSERT INTO test_attempts (id, user_id, level, mode, score, correct_count, total_questions, time_spent_seconds, completed_at, answers_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      c.get('user').sub,
      'N5',
      'real',
      75,
      22,
      30,
      2400,
      Date.now(),
      JSON.stringify({})
    ).run();

    // Update user progress
    await c.env.DB.prepare(`
      INSERT INTO user_progress (user_id, total_tests_taken, total_questions_answered, total_correct, total_time_spent_seconds, updated_at)
      VALUES (?, 1, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        total_tests_taken = total_tests_taken + 1,
        total_questions_answered = total_questions_answered + ?,
        total_correct = total_correct + ?,
        total_time_spent_seconds = total_time_spent_seconds + ?,
        updated_at = ?
    `).bind(c.get('user').sub, 30, 22, timeSpent, Date.now(), 30, 22, timeSpent, Date.now()).run();

    // Track weak questions
    // For each wrong answer, update weak_questions table

    return c.json({
      score: 75,
      correctCount: 22,
      totalQuestions: 30,
      passed: true,
    });
  })

  // GET /api/tests/history
  .get('/history', async (c) => {
    const user = c.get('user');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const level = c.req.query('level');
    const mode = c.req.query('mode');

    let query = `
      SELECT * FROM test_attempts 
      WHERE user_id = ?
    `;
    const params: any[] = [c.get('user').sub];

    if (level) {
      query += ' AND level = ?';
      params.push(level);
    }
    if (mode) {
      query += ' AND mode = ?';
      params.push(mode);
    }

    query += ' ORDER BY completed_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);

    const attempts = await c.env.DB.prepare(query).bind(...params).all();

    const total = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM test_attempts WHERE user_id = ?`
    ).bind(c.get('user').sub).first();

    return c.json({
      attempts: attempts.results,
      pagination: {
        page,
        limit,
        total: total?.count || 0,
        totalPages: Math.ceil((total?.count || 0) / limit),
      },
    });
  })

  // GET /api/tests/:id
  .get('/:id', async (c) => {
    const user = c.get('user');
    const attempt = await c.env.DB.prepare(
      `SELECT * FROM test_attempts WHERE id = ? AND user_id = ?`
    ).bind(c.req.param('id'), c.get('user').sub).first();

    if (!attempt) {
      return c.json({ error: 'Not found' }, 404);
    }

    return c.json({
      ...attempt,
      answers: JSON.parse(attempt.answers_json),
    });
  });

export { testRoutes };