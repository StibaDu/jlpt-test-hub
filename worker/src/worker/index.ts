import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import Stripe from 'stripe';
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
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_MONTHLY_PRICE_ID: string;
  STRIPE_YEARLY_PRICE_ID: string;
  APP_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', logger());
app.use('*', cors({
  origin: ['https://jlpttesthub.com', 'https://www.jlpttesthub.com', 'https://jlpt-test-hub.pages.dev', 'http://localhost:5173', 'http://localhost:5174'],
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
// Admin routes — require role=admin
const admin = new Hono<{ Bindings: Bindings }>();
admin.use('*', async (c, next) => {
  const u = c.get('user');
  if (u.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);
  await next();
});
admin.route('/', adminRoutes);
api.route('/admin', admin);

app.post('/api/webhooks/stripe', async (c) => {
  const signature = c.req.header('stripe-signature');
  if (!signature) return c.json({ error: 'Missing signature' }, 400);

  const body = await c.req.text();
  const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, c.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return c.json({ error: `Webhook signature verification failed: ${err.message}` }, 400);
  }

  // Log event
  await c.env.DB.prepare(
    'INSERT INTO webhook_events (id, provider, event_type, payload_json, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(crypto.randomUUID(), 'stripe', event.type, JSON.stringify(event), Date.now()).run();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan || 'monthly';
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

      // Newer Stripe API: periods live on the subscription item, not the subscription root
      const subItem = subscription.items?.data?.[0] as any;
      const periodStart = (subscription as any).current_period_start ?? subItem?.current_period_start ?? Math.floor(Date.now() / 1000);
      const periodEnd = (subscription as any).current_period_end ?? subItem?.current_period_end ?? Math.floor(Date.now() / 1000);

      if (userId) {
        // Idempotent: if the subscription row already exists, refresh it instead of duplicating
        await c.env.DB.prepare(
          `INSERT INTO subscriptions (id, user_id, status, plan, stripe_subscription_id, stripe_customer_id, current_period_start, current_period_end, cancel_at_period_end, created_at, updated_at)
           VALUES (?, ?, 'active', ?, ?, ?, ?, ?, 0, ?, ?)
           ON CONFLICT(stripe_subscription_id) DO UPDATE SET
             status = 'active',
             current_period_start = excluded.current_period_start,
             current_period_end = excluded.current_period_end,
             updated_at = excluded.updated_at`
        ).bind(
          crypto.randomUUID(), userId, plan,
          subscription.id, session.customer as string,
          periodStart * 1000, periodEnd * 1000,
          Date.now(), Date.now()
        ).run();
      }
      break;
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const status = sub.cancel_at_period_end ? 'active' : (sub.status === 'canceled' ? 'cancelled' : sub.status);
      // Newer Stripe API: period end lives on the subscription item
      const subItemUpd = sub.items?.data?.[0] as any;
      const periodEndUpd = (sub as any).current_period_end ?? subItemUpd?.current_period_end;
      await c.env.DB.prepare(
        'UPDATE subscriptions SET status = ?, current_period_end = ?, cancel_at_period_end = ?, updated_at = ? WHERE stripe_subscription_id = ?'
      ).bind(status, periodEndUpd ? periodEndUpd * 1000 : null, sub.cancel_at_period_end, Date.now(), sub.id).run();
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await c.env.DB.prepare(
        "UPDATE subscriptions SET status = 'cancelled', cancelled_at = ?, updated_at = ? WHERE stripe_subscription_id = ?"
      ).bind(Date.now(), Date.now(), sub.id).run();
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        await c.env.DB.prepare(
          "UPDATE subscriptions SET status = 'past_due', updated_at = ? WHERE stripe_subscription_id = ?"
        ).bind(Date.now(), invoice.subscription as string).run();
      }
      break;
    }
  }

  return c.json({ received: true });
});

app.route('/api', api);

// Stripe webhook (no auth, verified via signature)
app.post('/api/webhooks/paypal', async (c) => c.json({ received: true }));

export default app;