import { useState, useEffect, useCallback } from 'react';

const API_BASE = 'https://jlpt-test-hub-api.kapioka-fam.workers.dev/api';

interface User {
  id: string;
  email: string;
  name: string;
  email_verified: boolean;
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
      const res = await fetch(`${API_BASE}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setSubscription(data.subscription);
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
      const res = await fetch(`${API_BASE}/subscription/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
        credentials: 'include',
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

  const saveTestResult = async (result: {
    level: string;
    mode: string;
    score: number;
    correctCount: number;
    totalQuestions: number;
    timeSpent: number;
    answers: Record<number, number>;
  }): Promise<void> => {
    const token = getAccessToken();
    if (!token || !user) return;

    try {
      await fetch(`${API_BASE}/tests/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(result),
        credentials: 'include',
      });
    } catch {}
  };

  const cancelSubscription = async (): Promise<{ success: boolean; error?: string }> => {
    const token = getAccessToken();
    if (!token) return { success: false, error: 'Not logged in' };

    try {
      const res = await fetch(`${API_BASE}/subscription/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
      if (res.ok) {
        await fetchProfile();
        return { success: true };
      }
      return { success: false, error: 'Failed to cancel' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  return {
    user,
    subscription,
    loading,
    isLoggedIn: !!user,
    isPro: subscription?.subscribed === true,
    login,
    signup,
    logout,
    forgotPassword,
    upgrade,
    saveTestResult,
    cancelSubscription,
    refreshProfile: fetchProfile,
  };
}