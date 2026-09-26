import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';
import { logger } from 'hono/logger';

import { authRoutes } from './auth';
import { userRoutes } from './user';
import { subscriptionRoutes } from './subscription';
import { testRoutes } from './tests';
import { progressRoutes } from './progress';
import { adminRoutes } from './admin';

type Bindings = {
  DB: D1Database;
  SESSIONS: KVNamespace;
  RATE_LIMIT: KVNamespace;
  JWT_SECRET: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
  PAYPAL_WEBHOOK_ID: string;
  EMAIL_FROM: string;
  APP_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', logger());
app.use('*', cors({
  origin: ['https://jlpttesthub.com', 'http://localhost:5173', 'http://localhost:5173'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }));

// Public routes (no auth required)
app.route('/api/auth', authRoutes);

// Protected routes (require authentication)
const protectedRoutes = new Hono<{ Bindings: Bindings }>();

// Auth middleware
protectedRoutes.use('*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7);
  try {
    const payload = await verifyToken(token, c.env.JWT_SECRET);
    c.set('user', payload);
    await next();
  } catch {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
});

// Protected routes
protectedRoutes.route('/api/user', userRoutes);
protectedRoutes.route('/api/subscription', subscriptionRoutes);
protectedRoutes.route('/api/tests', testRoutes);
protectedRoutes.route('/api/progress', progressRoutes);

// Admin routes (require admin role)
const adminRoutesProtected = new Hono<{ Bindings: Bindings }>();
adminRoutesProtected.use('*', async (c, next) => {
  const user = c.get('user');
  if (user.role !== 'admin') {
    return c.json({ error: 'Forbidden' }, 403);
  }
  await next();
});
adminRoutesProtected.route('/api/admin', adminRoutes);

app.route('/', protectedRoutes);
app.route('/', adminRoutesProtected);

// Stripe/PayPal webhooks (no auth, but verified via signature)
app.post('/api/webhooks/stripe', async (c) => {
  const signature = c.req.header('stripe-signature');
  const body = await c.req.text();
  // TODO: Verify signature and process event
  return c.json({ received: true });
});

app.post('/api/webhooks/paypal', async (c) => {
  const body = await c.req.text();
  // TODO: Verify PayPal webhook signature
  return c.json({ received: true });
});

export default app;

// JWT verification helper
async function verifyToken(token: string, secret: string) {
  const [header, payload, signature] = token.split('.');
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const isValid = await crypto.subtle.verify(
    'HMAC',
    key,
    new Uint8Array(signature.split('').map(c => c.charCodeAt(0))),
    encoder.encode(`${header}.${payload}`)
  );
  if (!isValid) throw new Error('Invalid signature');
  return JSON.parse(atob(payload));
}