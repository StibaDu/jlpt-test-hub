// SM-2 spaced repetition engine (Anki's scheduler)
// quality: 0-5 (5=perfect recall, <3=lapse)

export interface SM2State {
  repetitions: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewAt: number;
}

export function sm2(
  quality: number,
  prev: { repetitions: number; easeFactor: number; intervalDays: number }
): SM2State {
  const q = Math.max(0, Math.min(5, quality));
  let { repetitions, easeFactor, intervalDays } = prev;

  if (q < 3) {
    // Lapse: reset streak, short interval, ease shrinks
    repetitions = 0;
    intervalDays = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else {
    // Successful recall
    repetitions = repetitions === 0 ? 1 : repetitions + 1;
    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    // Standard SM-2 ease update
    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    easeFactor = Math.max(1.3, easeFactor);
  }

  return {
    repetitions,
    easeFactor: Math.round(easeFactor * 100) / 100,
    intervalDays,
    nextReviewAt: Date.now() + intervalDays * 24 * 60 * 60 * 1000,
  };
}

// Map a quiz answer to SM-2 quality.
// Correct → 5 (instant/certain), or 4 if slow (>60s on real-mode pace)
// Wrong → 1 (recognized partially) vs 0 (complete blackout) — we use 1 for wrong picks.
export function answerToQuality(isCorrect: boolean, isMasteredClick = false): number {
  if (isMasteredClick) return 5;
  return isCorrect ? 5 : 1;
}

// Anki-style rating → SM-2 quality mapping (simple mode: boolean correct/wrong)
export function qualityToSM2(quality: 1 | 2 | 3 | 4 | number): number {
  // 1=Again (blackout) → 1, 2=Hard → 3, 3=Good → 4, 4=Easy → 5
  switch (quality) {
    case 1: return 1;
    case 2: return 3;
    case 3: return 4;
    case 4: return 5;
    default: return 3;
  }
}