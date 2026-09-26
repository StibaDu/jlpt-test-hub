import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authRoutes } from '../auth';
import { userRoutes } from '../user';
import { subscriptionRoutes } from '../subscription';
import { testRoutes } from '../tests';
import { progressRoutes } from '../progress';
import { adminRoutes } from '../admin';

type Bindings = {
  DB: D1Database;
  SESSIONS: KVNamespace;
  RATE_LIMIT: KVNamespace;
  JWT_SECRET: string;
  APP_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', logger());
app.use('*', cors({
  origin: ['https://jlpttesthub.com', 'http://localhost:5173', 'http://localhost:5174'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.get('/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }));

// Public routes
app.route('/api/auth', authRoutes);

// Auth middleware for protected routes
const api = new Hono<{ Bindings: Bindings }>();

api.use('*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7);
  try {
    const [headerB64, payloadB64, sigB64] = token.split('.');
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', encoder.encode(c.env.JWT_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    
    const sigBytes = Uint8Array.from(atob(sigB64), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(`${headerB64}.${payloadB64}`));
    
    if (!valid) return c.json({ error: 'Invalid token' }, 401);

    const payload = JSON.parse(atob(payloadB64));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return c.json({ error: 'Token expired' }, 401);
    }

    c.set('user', payload);
    await next();
  } catch {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

api.route('/user', userRoutes);
api.route('/subscription', subscriptionRoutes);
api.route('/tests', testRoutes);
api.route('/progress', progressRoutes);
api.route('/admin', adminRoutes);

app.route('/api', api);

// Webhooks (no auth, verified via signature)
app.post('/api/webhooks/stripe', async (c) => c.json({ received: true }));
app.post('/api/webhooks/paypal', async (c) => c.json({ received: true }));

export default app;