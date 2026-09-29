import { Hono } from 'hono';
import { sm2, answerToQuality, qualityToSM2 } from './sm2';

// Stable signed 32-bit hash for flashcard question_id (keeps UNIQUE(user_id, question_id, level) happy)
function cardIdHash(cardKey: string): number {
  let h = 5381;
  for (let i = 0; i < cardKey.length; i++) {
    h = ((h * 33) ^ cardKey.charCodeAt(i)) | 0;
  }
  return h === 0 ? -1 : h; // avoid 0 (reserved for question rows)
}

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
      'SELECT question_id, level, attempts, times_wrong, last_wrong_at FROM weak_questions WHERE user_id = ? AND mastered = FALSE AND times_wrong > 0 ORDER BY times_wrong DESC, last_wrong_at DESC LIMIT 50'
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
      'SELECT * FROM weak_questions WHERE user_id = ? AND mastered = FALSE AND times_wrong > 0 ORDER BY times_wrong DESC, last_wrong_at DESC LIMIT 50'
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
       WHERE user_id = ? AND mastered = FALSE AND times_wrong > 0
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
      `SELECT question_id, level, card_key, interval_days, repetitions, next_review_at
       FROM weak_questions
       WHERE user_id = ? AND mastered = FALSE AND next_review_at IS NOT NULL AND next_review_at <= ?
       ORDER BY next_review_at ASC LIMIT 50`
    ).bind(user.sub, now).all();

    const newCards = await c.env.DB.prepare(
      `SELECT question_id, level, card_key FROM weak_questions
       WHERE user_id = ? AND mastered = FALSE AND times_wrong > 0 AND next_review_at IS NULL AND card_key IS NULL
       ORDER BY last_wrong_at ASC LIMIT 10`
    ).bind(user.sub).all();

    const flashDue = await c.env.DB.prepare(
      `SELECT card_key, level FROM weak_questions
       WHERE user_id = ? AND mastered = FALSE AND next_review_at IS NOT NULL AND next_review_at <= ? AND card_key IS NOT NULL
       ORDER BY next_review_at ASC LIMIT 50`
    ).bind(user.sub, now).all();

    return c.json({
      due: rows.results,
      newCards: newCards.results,
      flashDue: flashDue.results,
      dueCount: rows.results.length + newCards.results.length,
      flashDueCount: flashDue.results.length,
    });
  })

  // === PRO: SRS — record a review answer (single question) ===
  // === PRO: SRS — record a review answer (single question or flashcard) ===
  // Supports:
  //  - question cards: { questionId: number, level, correct } (legacy) or { quality: 1-4 }
  //  - flashcards:     { cardId: 'k-N5-文' | 'v-N4-怪我' | 'g-N5-q13', quality }
  // Composite cards self-register on first review (upsert).
  .post('/srs/answer', async (c) => {
    const user = c.get('user');
    const body = await c.req.json().catch(() => null);
    const hasQuestionId = body && typeof body.questionId === 'number';
    const hasCardId = body && typeof body.cardId === 'string' && body.cardId.length <= 40;
    if (!body || (!hasQuestionId && !hasCardId) || !body.level) {
      return c.json({ error: 'questionId or cardId, plus level, required' }, 400);
    }

    // Quality: explicit 1-4 rating (flashcards) or boolean legacy
    let quality: number;
    if (typeof body.quality === 'number') {
      quality = qualityToSM2(body.quality);
    } else {
      quality = answerToQuality(!!body.correct);
    }
    const prev0 = { repetitions: 0, easeFactor: 2.5, intervalDays: 0 };

    // Resolve previous SRS state:
    //  - flashcards keyed by card_key (question_id = 0)
    //  - question cards keyed by (question_id, level)
    const isFlashcard = hasCardId;
    const cardKey: string = isFlashcard ? body.cardId : '';
    const qid: number = isFlashcard ? cardIdHash(cardKey) : body.questionId;

    let existing: any = null;
    if (isFlashcard) {
      existing = await c.env.DB.prepare(
        'SELECT repetitions, ease_factor, interval_days, mastered FROM weak_questions WHERE user_id = ? AND card_key = ?'
      ).bind(user.sub, cardKey).first<any>();
    } else {
      existing = await c.env.DB.prepare(
        'SELECT repetitions, ease_factor, interval_days, mastered FROM weak_questions WHERE user_id = ? AND question_id = ? AND level = ?'
      ).bind(user.sub, qid, body.level).first<any>();
      if (!existing) {
        return c.json({ error: 'Question not in notebook' }, 404);
      }
    }

    const prev = existing
      ? { repetitions: existing.repetitions ?? 0, easeFactor: existing.ease_factor ?? 2.5, intervalDays: existing.interval_days ?? 0 }
      : prev0;

    const next = sm2(quality, prev);

    // 5+ successful reps → consider mastered (graduated)
    const isCorrect = quality >= 3;
    const graduated = isCorrect && (next.repetitions >= 5);

    if (isFlashcard) {
      // Flashcard: self-register (upsert on card_key), then apply schedule
      const parsedCard = /-(N[345])-/.exec(cardKey);
      await c.env.DB.prepare(
        `INSERT INTO weak_questions (id, user_id, question_id, level, attempts, times_wrong, total_attempts, mastered, repetitions, ease_factor, interval_days, next_review_at, last_answer, card_key)
         VALUES (?, ?, ?, ?, 0, ?, 1, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id, card_key) DO UPDATE SET
           times_wrong = CASE WHEN ? THEN times_wrong ELSE COALESCE(times_wrong, 0) + 1 END,
           total_attempts = COALESCE(total_attempts, 0) + 1`
      ).bind(
        crypto.randomUUID(), user.sub, qid, (parsedCard ? parsedCard[1] : body.level),
        isCorrect ? 0 : 1,
        graduated ? 1 : 0,
        next.repetitions, next.easeFactor, next.intervalDays, next.nextReviewAt,
        isCorrect ? 'correct' : 'wrong',
        cardKey,
        isCorrect
      ).run();
      // Apply SM-2 schedule
      await c.env.DB.prepare(
        `UPDATE weak_questions SET repetitions = ?, ease_factor = ?, interval_days = ?, next_review_at = ?, mastered = ?, last_answer = ?
         WHERE user_id = ? AND card_key = ?`
      ).bind(
        next.repetitions, next.easeFactor, next.intervalDays, next.nextReviewAt,
        graduated ? 1 : 0, isCorrect ? 'correct' : 'wrong',
        user.sub, cardKey
      ).run();
    } else {
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
        user.sub, qid, body.level
      ).run();
    }

    return c.json({
      success: true,
      intervalDays: next.intervalDays,
      nextReviewAt: next.nextReviewAt,
      graduated,
    });
  })

  // === PRO: Flashcards — batch-register cards from a browsed deck (Mode B) ===
  .post('/flashcards/register', async (c) => {
    const user = c.get('user');
    const body = await c.req.json().catch(() => null);
    const cards = body?.cards;
    if (!Array.isArray(cards) || cards.length === 0 || cards.length > 100) {
      return c.json({ error: 'cards array (1-100) required' }, 400);
    }
    let registered = 0;
    for (const card of cards) {
      if (!card?.cardId || !card?.level) continue;
      const lvl = /-(N[345])-/.exec(card.cardId)?.[1] || card.level;
      await c.env.DB.prepare(
        `INSERT INTO weak_questions (id, user_id, question_id, level, attempts, times_wrong, total_attempts, mastered, repetitions, ease_factor, interval_days, card_key)
         VALUES (?, ?, ?, ?, 0, 0, 0, 0, 0, 2.5, 0, ?)
         ON CONFLICT(user_id, card_key) DO NOTHING`
      ).bind(crypto.randomUUID(), user.sub, cardIdHash(card.cardId), lvl, card.cardId).run();
      registered++;
    }
    return c.json({ success: true, registered });
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