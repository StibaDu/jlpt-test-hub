import { useState, useEffect, useCallback, useRef } from 'react';
import { enqueueResult, newClientTestId, queueSize, flushQueue } from './resultQueue';

const API_BASE = 'https://jlpt-test-hub-api.kapioka-fam.workers.dev/api';

interface User {
  id: string;
  email: string;
  name: string;
  email_verified: boolean;
  role?: string;
  created_at?: number;
}

interface Subscription {
  subscribed: boolean;
  plan: string | null;
  status: string | null;
  currentPeriodEnd: number | null;
  cancelAtPeriodEnd: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const getAccessToken = () => {
    try { return localStorage.getItem('jlpt_access_token'); } catch { return null; }
  };

  const setAccessToken = (token: string) => {
    try { localStorage.setItem('jlpt_access_token', token); } catch {}
  };

  const clearAuth = () => {
    try { localStorage.removeItem('jlpt_access_token'); } catch {}
    setUser(null);
    setSubscription(null);
  };

  const fetchProfile = useCallback(async () => {
    const token = getAccessToken();
    if (!token) { setLoading(false); return; }

    try {
      const res = await apiFetch('/user/profile');

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        // /user/profile returns {status, plan, current_period_end, cancel_at_period_end}
        // Normalize to include 'subscribed' flag
        const sub = data.subscription;
        setSubscription(sub ? {
          subscribed: sub.status === 'active',
          plan: sub.plan || null,
          status: sub.status || null,
          currentPeriodEnd: sub.current_period_end ?? null,
          cancelAtPeriodEnd: sub.cancel_at_period_end === true || sub.cancel_at_period_end === 1,
        } : null);
      } else if (res.status === 401) {
        // Try refresh
        const refreshed = await tryRefresh();
        if (refreshed) {
          await fetchProfile();
        } else {
          clearAuth();
        }
      } else {
        clearAuth();
      }
    } catch {
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, []);

  const tryRefresh = async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.accessToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Central fetch wrapper: retries once after refreshing an expired access token.
  // Prevents silent data loss when the 15-minute token expires mid-session.
  const apiFetch = async (path: string, options: RequestInit = {}, retried = false): Promise<Response> => {
    const token = getAccessToken();
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    if (res.status === 401 && !retried && token) {
      const refreshed = await tryRefresh();
      if (refreshed) {
        return apiFetch(path, options, true);
      }
      // Refresh failed — session is genuinely dead
      clearAuth();
    }
    return res;
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error || 'Login failed' };
      }

      const data = await res.json();
      setAccessToken(data.accessToken);
      setUser(data.user);
      await fetchProfile();
      return { success: true };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string; needsVerification?: boolean }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error || 'Signup failed' };
      }

      return { success: true, needsVerification: true };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    clearAuth();
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return { success: res.ok };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const upgrade = async (plan: 'monthly' | 'yearly'): Promise<{ success: boolean; url?: string; error?: string }> => {
    const token = getAccessToken();
    if (!token) return { success: false, error: 'Please sign in first' };

    try {
      const res = await apiFetch('/subscription/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error || 'Failed to create checkout' };
      }

      const data = await res.json();
      return { success: true, url: data.url };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const saveTestResultRef = useRef<(r: any) => Promise<{ saved: boolean; queued: boolean; clientTestId: string }>>(async () => ({ saved: false, queued: true, clientTestId: '' }));

  const saveTestResult = async (result: {
    level: string;
    mode: string;
    score: number;
    correctCount: number;
    totalQuestions: number;
    timeSpent: number;
    answers: Record<number, number>;
    questionResults: Array<{ questionId: number; correct: boolean; category: string; selectedOption?: number }>;
    clientTestId?: string;
  }): Promise<{ saved: boolean; queued: boolean; clientTestId: string }> => {
    // Every result gets a clientTestId — the server treats retries as duplicates,
    // so a queued result can never be double-counted.
    const clientTestId = result.clientTestId || newClientTestId();
    const payload = { ...result, clientTestId };

    if (!user) {
      // Guests: queue locally — flushed automatically right after signup/login
      enqueueResult(payload, clientTestId);
      return { saved: false, queued: true, clientTestId };
    }

    try {
      const res = await apiFetch('/tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) return { saved: true, queued: false, clientTestId };
      // Server refused (non-auth failure) — queue and report queued
      enqueueResult(payload, clientTestId);
      return { saved: false, queued: true, clientTestId };
    } catch {
      // Network failure — queue so it's retried on the next app load
      enqueueResult(payload, clientTestId);
      return { saved: false, queued: true, clientTestId };
    }
  };

  saveTestResultRef.current = saveTestResult;

  const flushQueuedResults = useCallback(async (): Promise<number> => {
    if (!user) return 0;
    // saveTestResult already carries clientTestId from queued items → idempotent server-side
    return flushQueue(async (payload, clientTestId) => saveTestResultRef.current({ ...payload, clientTestId }));
  }, [user]);

  const cancelSubscription = async (): Promise<{ success: boolean; error?: string }> => {
    if (!getAccessToken()) return { success: false, error: 'Not logged in' };

    try {
      const res = await apiFetch('/subscription/cancel', { method: 'POST' });
      if (res.ok) {
        await fetchProfile();
        return { success: true };
      }
      return { success: false, error: 'Failed to cancel' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const masterQuestion = useCallback(async (questionId: number, level: string): Promise<void> => {
    if (!getAccessToken()) return;
    try {
      await apiFetch(`/progress/weak-points/${questionId}/${level}/master`, { method: 'POST' });
    } catch {}
  }, []);

  const fetchWeaknessSummary = useCallback(async (): Promise<any> => {
    if (!getAccessToken()) return null;
    try {
      const res = await apiFetch('/progress/weakness-summary');
      return res.ok ? await res.json() : null;
    } catch {
      return null;
    }
  }, []);

  const fetchMistakeNotebook = useCallback(async (): Promise<any> => {
    if (!getAccessToken()) return null;
    try {
      const res = await apiFetch('/progress/mistake-notebook');
      return res.ok ? await res.json() : null;
    } catch {
      return null;
    }
  }, []);

  const fetchSrsDue = useCallback(async (): Promise<any> => {
    if (!getAccessToken()) return null;
    try {
      const res = await apiFetch('/progress/srs/due');
      return res.ok ? await res.json() : null;
    } catch {
      return null;
    }
  }, []);

  const submitSrsAnswer = useCallback(async (questionId: number, level: string, correct: boolean): Promise<void> => {
    if (!getAccessToken()) return;
    try {
      await apiFetch('/progress/srs/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, level, correct }),
      });
    } catch {}
  }, []);

  const fetchDrillQuestions = useCallback(async (level: string, category: string): Promise<{ answeredWrong: number[]; answeredCount: number } | null> => {
    if (!getAccessToken()) return null;
    try {
      const res = await apiFetch(`/progress/drill/${level}/${encodeURIComponent(category)}`);
      return res.ok ? await res.json() : null;
    } catch {
      return null;
    }
  }, []);

  const fetchProgress = useCallback(async (): Promise<{ stats: any; history: any[] } | null> => {
    if (!getAccessToken()) return null;
    try {
      const [statsRes, historyRes] = await Promise.all([
        apiFetch('/progress/stats'),
        apiFetch('/tests/history?limit=10'),
      ]);
      const stats = statsRes.ok ? await statsRes.json() : null;
      const history = historyRes.ok ? (await historyRes.json()).attempts || [] : [];
      return { stats, history };
    } catch {
      return null;
    }
  }, []);

  return {
    user,
    subscription,
    loading,
    isLoggedIn: !!user,
    isPro: subscription?.subscribed === true,
    fetchProgress,
    fetchWeaknessSummary,
    fetchMistakeNotebook,
    fetchSrsDue,
    submitSrsAnswer,
    fetchDrillQuestions,
    masterQuestion,
    login,
    signup,
    logout,
    forgotPassword,
    upgrade,
    saveTestResult,
    flushQueuedResults,
    queuedCount: queueSize,
    cancelSubscription,
    refreshProfile: fetchProfile,
  };
}