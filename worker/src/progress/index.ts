import { Hono } from 'hono';

const progressRoutes = new Hono();

// GET /api/progress/stats
const progressRoutes = new Hono()
  .get('/stats', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;

    const progress = await c.env.DB.prepare(
      `SELECT * FROM user_progress WHERE user_id = ?`
    ).bind(c.get('user').sub).first();

    // Get weak categories from recent wrong answers
    const weakCategories = await c.env.DB.prepare(`
      SELECT 
        q.category,
        COUNT(*) as wrong_count,
        COUNT(*) * 1.0 / (SELECT COUNT(*) FROM test_attempts ta2 
          JOIN test_attempts_questions taq ON ta2.id = taq.test_attempt_id
          WHERE ta2.user_id = ? AND taq.question_id = q.id) as error_rate
      FROM test_attempts ta
      JOIN test_attempts_questions taq ON ta.id = taq.test_attempt_id
      JOIN questions q ON taq.question_id = q.id
      WHERE ta.user_id = ? AND taq.user_answer != q.correct_index
      GROUP BY q.category
      ORDER BY wrong_count DESC
      LIMIT 10
    `).bind(c.get('user').sub, c.get('user').sub).all();

    return c.json({
      totalTestsTaken: progress?.total_tests_taken || 0,
      totalQuestionsAnswered: progress?.total_questions_answered || 0,
      totalCorrect: progress?.total_correct || 0,
      totalTimeSpentSeconds: progress?.total_time_spent_seconds || 0,
      accuracy: progress?.total_questions_answered 
        ? Math.round((progress.total_correct / progress.total_questions_answered) * 100)
        : 0,
      weakCategories: weakCategories.results || [],
      lastStudiedAt: progress?.last_studied_at,
    });
  })

  // GET /api/progress/weak-points
  .get('/weak-points', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;

    const weakPoints = await c.env.DB.prepare(`
      SELECT wq.*, q.text, q.options, q.correct_index, q.category
      FROM weak_questions wq
      JOIN questions q ON wq.question_id = q.id
      WHERE wq.user_id = ? AND wq.mastered = FALSE
      ORDER BY wq.attempts DESC, wq.last_wrong_at DESC
      LIMIT 50
    `).bind(c.get('user').sub).all();

    return c.json({ weakPoints: weakPoints.results });
  })

  // POST /api/progress/weak-points/:id/master
  .post('/weak-points/:id/master', async (c) => {
    const user = c.get('user');
    const id = c.req.param('id');

    await c.env.DB.prepare(
      `UPDATE weak_questions SET mastered = TRUE WHERE id = ? AND user_id = ?`
    ).bind(c.req.param('id'), c.get('user').sub).run();

    return c.json({ success: true });
  })

  // POST /api/progress/export-pdf
  .post('/export-pdf', async (c) => {
    const user = c.get('user');
    // Would generate PDF with jsPDF on frontend
    // This endpoint could generate server-side PDF if needed
    return c.json({ 
      message: 'PDF export available on frontend',
      downloadUrl: '/api/progress/export-pdf/generate' 
    });
  });

export { progressRoutes };