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
  .get('/weak-points', async (c) => {
    const user = c.get('user');
    const weakPoints = await c.env.DB.prepare(
      'SELECT * FROM weak_questions WHERE user_id = ? AND mastered = FALSE ORDER BY attempts DESC, last_wrong_at DESC LIMIT 50'
    ).bind(user.sub).all();

    return c.json({ weakPoints: weakPoints.results });
  })
  .post('/weak-points/:id/master', async (c) => {
    const user = c.get('user');
    await c.env.DB.prepare(
      'UPDATE weak_questions SET mastered = TRUE WHERE id = ? AND user_id = ?'
    ).bind(c.req.param('id'), user.sub).run();

    return c.json({ success: true });
  });