import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import Stripe from 'stripe';

export const subscriptionRoutes = new Hono()
  .get('/status', async (c) => {
    const user = c.get('user');
    const sub = await c.env.DB.prepare(
      "SELECT * FROM subscriptions WHERE user_id = ? AND status IN ('active', 'trialing', 'past_due') ORDER BY created_at DESC LIMIT 1"
    ).bind(user.sub).first();

    if (!sub) return c.json({ subscribed: false, plan: null, status: null });

    return c.json({
      subscribed: sub.status === 'active',
      plan: sub.plan,
      status: sub.status,
      currentPeriodEnd: sub.current_period_end,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    });
  })
  .post('/create-checkout', zValidator('json', z.object({
    plan: z.enum(['monthly', 'yearly']),
  })), async (c) => {
    const { plan } = c.req.valid('json');
    const user = c.get('user');

    // Check existing subscription
    const existing = await c.env.DB.prepare(
      "SELECT * FROM subscriptions WHERE user_id = ? AND status IN ('active', 'trialing')"
    ).bind(user.sub).first();

    if (existing) return c.json({ error: 'Already have an active subscription' }, 400);

    // Get user email
    const userRow = await c.env.DB.prepare('SELECT email FROM users WHERE id = ?').bind(user.sub).first();
    if (!userRow) return c.json({ error: 'User not found' }, 404);

    // Stripe price IDs — replace with your actual price IDs after creating products
    const PRICE_IDS: Record<string, string> = {
      monthly: c.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly_placeholder',
      yearly: c.env.STRIPE_YEARLY_PRICE_ID || 'price_yearly_placeholder',
    };

    const priceId = PRICE_IDS[plan];
    if (!priceId || priceId.includes('placeholder')) {
      return c.json({ error: 'Stripe not configured yet. Please set up products in Stripe dashboard.' }, 500);
    }

    // Create Stripe Checkout Session
    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        customer_email: userRow.email,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${c.env.APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${c.env.APP_URL}/upgrade`,
        metadata: { user_id: user.sub, plan },
      });
    } catch (err: any) {
      const code = err?.code || err?.raw?.code || '';
      const msg = err?.message || err?.raw?.message || 'Unknown error';
      console.error('Stripe checkout failed:', code, msg);
      // Config problems (expired/invalid key, bad price) must NOT surface as 500 "network error"
      if (code === 'api_key_expired' || msg.includes('Expired API Key')) {
        return c.json({ error: 'Payment system temporarily unavailable — configuration error. Please try again later.' }, 503);
      }
      if (code === 'resource_missing' || msg.includes('No such price')) {
        return c.json({ error: 'Payment system misconfigured (price). Please contact support.' }, 503);
      }
      if (msg.includes('Invalid API Key')) {
        return c.json({ error: 'Payment system temporarily unavailable — configuration error. Please try again later.' }, 503);
      }
      return c.json({ error: 'Could not start checkout. Please try again.' }, 502);
    }

    return c.json({ sessionId: session.id, url: session.url });
  })
  .post('/confirm', zValidator('json', z.object({
    sessionId: z.string(),
  })), async (c) => {
    const { sessionId } = c.req.valid('json');
    const user = c.get('user');

    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid' && session.mode === 'subscription') {
      // For subscriptions, check if subscription exists
      if (!session.subscription) {
        return c.json({ error: 'Payment not completed' }, 400);
      }
    }

    // Get subscription details
    const subscription = session.subscription as Stripe.Subscription;
    const subId = crypto.randomUUID();

    // Newer Stripe API: periods live on the subscription item
    const subItem = subscription.items?.data?.[0] as any;
    const periodStart = ((subscription as any).current_period_start ?? subItem?.current_period_start ?? Math.floor(Date.now() / 1000)) * 1000;
    const periodEnd = ((subscription as any).current_period_end ?? subItem?.current_period_end ?? Math.floor(Date.now() / 1000) + 30 * 86400) * 1000;

    // Idempotent: one row per Stripe subscription
    await c.env.DB.prepare(
      `INSERT INTO subscriptions (id, user_id, status, plan, stripe_subscription_id, stripe_customer_id, current_period_start, current_period_end, cancel_at_period_end, created_at, updated_at)
       VALUES (?, ?, 'active', ?, ?, ?, ?, ?, 0, ?, ?)
       ON CONFLICT(stripe_subscription_id) DO UPDATE SET
         status = 'active',
         current_period_start = excluded.current_period_start,
         current_period_end = excluded.current_period_end,
         updated_at = excluded.updated_at`
    ).bind(
      subId, user.sub,
      session.metadata?.plan || 'monthly',
      subscription.id,
      session.customer as string,
      periodStart, periodEnd,
      Date.now(), Date.now()
    ).run();

    return c.json({ success: true, plan: session.metadata?.plan || 'monthly', periodEnd });
  })
  .post('/cancel', async (c) => {
    const user = c.get('user');
    const sub = await c.env.DB.prepare(
      "SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active'"
    ).bind(user.sub).first();

    if (!sub) return c.json({ error: 'No active subscription' }, 400);

    // Cancel in Stripe
    if (sub.stripe_subscription_id) {
      const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);
      await stripe.subscriptions.update(sub.stripe_subscription_id, { cancel_at_period_end: true });
    }

    await c.env.DB.prepare(
      'UPDATE subscriptions SET cancel_at_period_end = TRUE, updated_at = ? WHERE id = ?'
    ).bind(Date.now(), sub.id).run();

    return c.json({ message: 'Subscription will be cancelled at end of billing period' });
  })
  .post('/resume', async (c) => {
    const user = c.get('user');
    const sub = await c.env.DB.prepare(
      'SELECT * FROM subscriptions WHERE user_id = ? AND cancel_at_period_end = TRUE'
    ).bind(user.sub).first();

    if (!sub) return c.json({ error: 'No subscription to resume' }, 400);

    if (sub.stripe_subscription_id) {
      const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);
      await stripe.subscriptions.update(sub.stripe_subscription_id, { cancel_at_period_end: false });
    }

    await c.env.DB.prepare(
      'UPDATE subscriptions SET cancel_at_period_end = FALSE, updated_at = ? WHERE id = ?'
    ).bind(Date.now(), sub.id).run();

    return c.json({ message: 'Subscription resumed' });
  })
  .post('/billing-portal', async (c) => {
    const user = c.get('user');
    const sub = await c.env.DB.prepare(
      "SELECT stripe_customer_id FROM subscriptions WHERE user_id = ? AND status = 'active'"
    ).bind(user.sub).first();

    if (!sub || !sub.stripe_customer_id) {
      return c.json({ error: 'No active subscription' }, 400);
    }

    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${c.env.APP_URL}/dashboard`,
    });

    return c.json({ url: session.url });
  });