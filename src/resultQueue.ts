// Offline-safe queue for test results that couldn't reach the server.
// Persisted in localStorage; flushed automatically on app load and after login.

const QUEUE_KEY = 'jlpt_result_queue';
const MAX_QUEUE = 50;

export interface QueuedTestResult {
  clientTestId: string;
  savedAt: number;
  payload: {
    level: string;
    mode: string;
    score: number;
    correctCount: number;
    totalQuestions: number;
    timeSpent: number;
    answers: Record<number, number>;
    questionResults: Array<{ questionId: number; correct: boolean; category: string; selectedOption?: number }>;
  };
}

const read = (): QueuedTestResult[] => {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const write = (items: QueuedTestResult[]) => {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(items.slice(-MAX_QUEUE))); } catch {}
};

export const newClientTestId = (): string => {
  try {
    return crypto.randomUUID();
  } catch {
    return `t-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
};

export const enqueueResult = (payload: QueuedTestResult['payload'], clientTestId: string) => {
  const items = read();
  if (items.some(i => i.clientTestId === clientTestId)) return;
  items.push({ clientTestId, savedAt: Date.now(), payload });
  write(items);
};

export const queueSize = (): number => read().length;

// Attempts to flush the queue. submit is the auth'd save function (handles refresh/retry).
// Removes items the server accepted; keeps anything that failed transiently.
export const flushQueue = async (
  submit: (payload: QueuedTestResult['payload'], clientTestId: string) => Promise<{ saved: boolean; queued: boolean }>
): Promise<number> => {
  const items = read();
  if (!items.length) return 0;
  const remaining: QueuedTestResult[] = [];
  let flushed = 0;
  for (const item of items) {
    try {
      const outcome = await submit(item.payload, item.clientTestId);
      if (outcome.saved) {
        flushed++;
        continue;
      }
      if (outcome.queued) {
        // submit() itself re-queued via enqueueResult — remove the old copy and keep it (deduped by ID)
        continue;
      }
      remaining.push(item);
    } catch {
      remaining.push(item);
    }
  }
  write(remaining);
  return flushed;
};
