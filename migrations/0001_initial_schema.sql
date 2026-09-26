-- Initial schema for JLPT Test Hub
-- Run with: wrangler d1 execute jlpt-test-hub --file=./migrations/0001_initial_schema.sql

-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,                    -- UUID
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,            -- Argon2id hash
  name TEXT NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token TEXT,
  email_verification_expires INTEGER,
  password_reset_token TEXT,
  password_reset_expires INTEGER,
  created_at INTEGER NOT NULL,            -- Unix timestamp (seconds)
  updated_at INTEGER NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Subscriptions table
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL,                   -- 'active', 'cancelled', 'past_due', 'trialing', 'incomplete'
  plan TEXT NOT NULL,                     -- 'monthly', 'yearly'
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  current_period_start INTEGER,
  current_period_end INTEGER,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_sub_id ON subscriptions(stripe_subscription_id);

-- Test attempts / history
CREATE TABLE test_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level TEXT NOT NULL,                    -- 'N5', 'N4', 'N3'
  mode TEXT NOT NULL,                     -- 'real', 'learning'
  score INTEGER NOT NULL,                 -- percentage 0-100
  correct_count INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_spent_seconds INTEGER,
  completed_at INTEGER NOT NULL,
  answers_json TEXT NOT NULL              -- JSON of user answers
);

CREATE INDEX idx_test_attempts_user_id ON test_attempts(user_id);
CREATE INDEX idx_test_attempts_completed_at ON test_attempts(completed_at);

-- User progress / analytics
CREATE TABLE user_progress (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_tests_taken INTEGER DEFAULT 0,
  total_questions_answered INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  total_time_spent_seconds INTEGER DEFAULT 0,
  weak_categories_json TEXT,            -- JSON: {"grammar": 0.3, "vocab": 0.7, ...}
  strong_categories_json TEXT,
  last_studied_at INTEGER,
  updated_at INTEGER NOT NULL
);

-- Weak question tracking (for review mode)
CREATE TABLE weak_questions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,          -- references question bank
  level TEXT NOT NULL,
  attempts INTEGER DEFAULT 0,
  last_wrong_at INTEGER,
  mastered BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, question_id, level)
);

CREATE INDEX idx_weak_questions_user_id ON weak_questions(user_id);

-- Stripe/PayPal webhook events (for audit)
CREATE TABLE webhook_events (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,               -- 'stripe', 'paypal'
  event_type TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);

-- Sessions / Refresh tokens (stored in KV, but we track metadata here)
CREATE TABLE refresh_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,             -- SHA256 hash of refresh token
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  revoked BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);