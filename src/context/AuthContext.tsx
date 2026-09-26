import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  email_verified: boolean;
}

interface Subscription {
  status: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'incomplete' | null;
  plan: 'monthly' | 'yearly' | null;
  currentPeriodEnd: number | null;
  cancelAtPeriodEnd: boolean;
}

interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  upgrade: (plan: 'monthly' | 'yearly') => Promise<void>;
  cancelSubscription: () => Promise<void>;
  resumeSubscription: () => Promise<void>;
  openBillingPortal: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem('access_token');
  
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
    credentials: 'include',
  });

  if (response.status === 401) {
    // Try to refresh token
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry with new token
      const newAccessToken = localStorage.getItem('access_token');
      return fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newAccessToken}`,
          ...options.headers,
        },
        credentials: 'include',
      });
    } else {
      // Redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
      throw new Error('Session expired');
    }
  }

  return response;
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await fetchWithAuth('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setSubscription(data.subscription);
      } else {
        setUser(null);
        setSubscription(null);
      }
    } catch {
      setUser(null);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const response = await fetchWithAuth('/api/subscription/status');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch {
      setSubscription(null);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      fetchUser();
      fetchSubscription();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.accessToken);
    setUser(data.user);
  };

  const signup = async (email: string, password: string, name: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    // Don't set user yet - they need to verify email first
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore errors
    }
    localStorage.removeItem('access_token');
    setUser(null);
    setSubscription(null);
  };

  const refreshAccessToken = async () => {
    await refreshAccessToken();
  };

  const verifyEmail = async (token: string) => {
    const response = await fetch(`/api/auth/verify-email?token=${token}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Verification failed');
    }
    
    // Refresh user after verification
    await fetchUser();
  };

  const forgotPassword = async (email: string) => {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send reset email');
    }
  };

  const resetPassword = async (token: string, password: string) => {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Reset failed');
    }
  };

  const upgrade = async (plan: 'monthly' | 'yearly') => {
    const response = await fetchWithAuth('/api/subscription/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    const data = await response.json();
    window.location.href = data.url;
  };

  const cancelSubscription = async () => {
    const response = await fetchWithAuth('/api/subscription/cancel', {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Cancellation failed');
    }

    // Refresh subscription status
    const subResponse = await fetchWithAuth('/api/subscription/status');
    if (subResponse.ok) {
      const data = await subResponse.json();
      setSubscription(data);
    }
  };

  const resumeSubscription = async () => {
    const response = await fetchWithAuth('/api/subscription/resume', {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to resume subscription');
    }

    const subResponse = await fetchWithAuth('/api/subscription/status');
    if (subResponse.ok) {
      const data = await subResponse.json();
      setSubscription(data);
    }
  };

  const openBillingPortal = async () => {
    const response = await fetchWithAuth('/api/subscription/billing-portal', {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to open billing portal');
    }

    const data = await response.json();
    window.location.href = data.url;
  };

  const value = {
    user,
    subscription,
    loading,
    login,
    signup,
    logout,
    refreshAccessToken,
    verifyEmail,
    forgotPassword,
    resetPassword,
    upgrade,
    cancelSubscription,
    resumeSubscription,
    openBillingPortal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};