import { Hono } from 'hono';

export const progressRoutes = new Hono()
  .get('/stats', async (c) => {
    const user = c.get('user');
    const progress = await c.env.DB.prepare(
      'SELECT * FROM user_progress WHERE user_id = ?'
    ).bind(user.sub).first();

    return c.json({
      totalTestsTaken: progress?.total_tests_taken || 0,
      totalQuestionsAnswered: progress?.total_questions_answered || 0,
      totalCorrect: progress?.total_correct || 0,
      totalTimeSpentSeconds: progress?.total_time_spent_seconds || 0,
      accuracy: progress?.total_questions_answered
        ? Math.round((progress.total_correct / progress.total_questions_answered) * 100)
        : 0,
      lastStudiedAt: progress?.last_studied_at,
    });
  })
  .get('/weakness-summary', async (c) => {
    const user = c.get('user');

    // Category-level error rates from test history
    const attempts = await c.env.DB.prepare(
      'SELECT answers_json FROM test_attempts WHERE user_id = ? ORDER BY completed_at DESC LIMIT 50'
    ).bind(user.sub).all();

    const catStats: Record<string, { total: number; wrong: number }> = {};
    const questionStats: Record<string, { questionId: number; attempts: number; lastWrongAt: number; level: string }> = {};

    for (const row of attempts.results) {
      let parsed: any;
      try { parsed = JSON.parse(row.answers_json); } catch { continue; }
      // answers_json may be legacy {index: option} or new {questionId: {correct, category}}
      for (const val of Object.values(parsed)) {
        if (typeof val === 'object' && val !== null && 'correct' in (val as any)) {
          const qr = val as any;
          const cat = qr.category || 'Vokabeln';
          if (!catStats[cat]) catStats[cat] = { total: 0, wrong: 0 };
          catStats[cat].total++;
          if (!qr.correct) catStats[cat].wrong++;
        }
      }
    }

    // Weak questions (unmastered, sorted by attempts)
    const weakQs = await c.env.DB.prepare(
      'SELECT question_id, level, attempts, last_wrong_at FROM weak_questions WHERE user_id = ? AND mastered = FALSE ORDER BY attempts DESC, last_wrong_at DESC LIMIT 50'
    ).bind(user.sub).all();

    const categories = Object.entries(catStats).map(([category, s]) => ({
      category,
      total: s.total,
      wrong: s.wrong,
      errorRate: s.total > 0 ? Math.round((s.wrong / s.total) * 100) : 0,
    })).sort((a, b) => b.errorRate - a.errorRate);

    return c.json({
      categories,
      weakQuestions: weakQs.results,
      totalWeak: weakQs.results.length,
    });
  })
  .get('/weak-points', async (c) => {
    const user = c.get('user');
    const weakPoints = await c.env.DB.prepare(
      'SELECT * FROM weak_questions WHERE user_id = ? AND mastered = FALSE ORDER BY attempts DESC, last_wrong_at DESC LIMIT 50'
    ).bind(user.sub).all();

    return c.json({ weakPoints: weakPoints.results });
  })
  .post('/weak-points/:questionId/:level/master', async (c) => {
    const user = c.get('user');
    await c.env.DB.prepare(
      'UPDATE weak_questions SET mastered = TRUE WHERE question_id = ? AND level = ? AND user_id = ?'
    ).bind(c.req.param('questionId'), c.req.param('level'), user.sub).run();

    return c.json({ success: true });
  });