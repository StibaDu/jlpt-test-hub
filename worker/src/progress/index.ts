import { Hono } from 'hono';
import { sm2, answerToQuality } from './sm2';

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
  })

  // === PRO: Mistake Notebook — actual wrong questions with content ===
  // Frontend joins question_id+level against its local question banks.
  .get('/mistake-notebook', async (c) => {
    const user = c.get('user');
    const rows = await c.env.DB.prepare(
      `SELECT question_id, level, attempts, times_wrong, total_attempts, last_wrong_at, last_wrong_option, last_answer, mastered,
              repetitions, ease_factor, interval_days, next_review_at
       FROM weak_questions
       WHERE user_id = ? AND mastered = FALSE
       ORDER BY times_wrong DESC, last_wrong_at DESC LIMIT 100`
    ).bind(user.sub).all();

    return c.json({
      questions: rows.results,
      total: rows.results.length,
    });
  })

  // === PRO: SRS — questions due for review today (or overdue) ===
  .get('/srs/due', async (c) => {
    const user = c.get('user');
    const now = Date.now();
    const rows = await c.env.DB.prepare(
      `SELECT question_id, level, interval_days, repetitions, next_review_at
       FROM weak_questions
       WHERE user_id = ? AND mastered = FALSE AND next_review_at IS NOT NULL AND next_review_at <= ?
       ORDER BY next_review_at ASC LIMIT 50`
    ).bind(user.sub, now).all();

    const newCards = await c.env.DB.prepare(
      `SELECT question_id, level FROM weak_questions
       WHERE user_id = ? AND mastered = FALSE AND next_review_at IS NULL
       ORDER BY last_wrong_at ASC LIMIT 10`
    ).bind(user.sub).all();

    return c.json({
      due: rows.results,
      newCards: newCards.results,
      dueCount: rows.results.length + newCards.results.length,
    });
  })

  // === PRO: SRS — record a review answer (single question) ===
  .post('/srs/answer', async (c) => {
    const user = c.get('user');
    const body = await c.req.json().catch(() => null);
    if (!body || typeof body.questionId !== 'number' || !body.level) {
      return c.json({ error: 'questionId (number) and level required' }, 400);
    }
    const isCorrect = !!body.correct;
    const quality = answerToQuality(isCorrect);

    const existing = await c.env.DB.prepare(
      'SELECT repetitions, ease_factor, interval_days FROM weak_questions WHERE user_id = ? AND question_id = ? AND level = ?'
    ).bind(user.sub, body.questionId, body.level).first<any>();

    if (!existing) {
      return c.json({ error: 'Question not in notebook' }, 404);
    }

    const next = sm2(quality, {
      repetitions: existing.repetitions ?? 0,
      easeFactor: existing.ease_factor ?? 2.5,
      intervalDays: existing.interval_days ?? 0,
    });

    // 5+ successful reps → consider mastered (graduated)
    const graduated = isCorrect && (next.repetitions >= 5);

    await c.env.DB.prepare(
      `UPDATE weak_questions SET
         repetitions = ?, ease_factor = ?, interval_days = ?, next_review_at = ?,
         mastered = ?, total_attempts = COALESCE(total_attempts, 0) + 1,
         last_answer = ?, last_wrong_at = CASE WHEN ? THEN ? ELSE last_wrong_at END
       WHERE user_id = ? AND question_id = ? AND level = ?`
    ).bind(
      next.repetitions, next.easeFactor, next.intervalDays, next.nextReviewAt,
      graduated ? 1 : 0,
      isCorrect ? 'correct' : 'wrong',
      !isCorrect, !isCorrect ? Date.now() : null,
      user.sub, body.questionId, body.level
    ).run();

    return c.json({
      success: true,
      intervalDays: next.intervalDays,
      nextReviewAt: next.nextReviewAt,
      graduated,
    });
  })

  // === PRO: Category drill — return question IDs for a category+level ===
  .get('/drill/:level/:category', async (c) => {
    const user = c.get('user');
    const level = c.req.param('level');
    const category = c.req.param('category');

    // Which questions in this category has the user actually answered (from history)?
    const attempts = await c.env.DB.prepare(
      'SELECT answers_json FROM test_attempts WHERE user_id = ? AND level = ? ORDER BY completed_at DESC LIMIT 30'
    ).bind(user.sub, level).all();

    const answeredWrong: number[] = [];
    const answeredAll: number[] = [];
    for (const row of attempts.results) {
      let parsed: any;
      try { parsed = JSON.parse(row.answers_json); } catch { continue; }
      for (const [qid, val] of Object.entries(parsed)) {
        if (typeof val === 'object' && val !== null && 'correct' in (val as any)) {
          const qr = val as any;
          if ((qr.category || '') !== category) continue;
          const id = parseInt(qid, 10);
          if (isNaN(id)) continue;
          answeredAll.push(id);
          if (!qr.correct) answeredWrong.push(id);
        }
      }
    }

    return c.json({
      level,
      category,
      answeredWrong: [...new Set(answeredWrong)],
      answeredCount: new Set(answeredAll).size,
    });
  });