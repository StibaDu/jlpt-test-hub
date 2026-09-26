import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const subscriptionRoutes = new Hono();

// GET /api/subscription/status
const subscriptionRoutes = new Hono()
  .get('/status', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;

    const sub = await c.env.DB.prepare(
      `SELECT * FROM subscriptions WHERE user_id = ? AND status IN ('active', 'trialing', 'past_due') ORDER BY created_at DESC LIMIT 1`
    ).bind(c.get('user').sub).first();

    if (!sub) {
      return c.json({ subscribed: false, plan: null, status: null });
    }

    return c.json({
      subscribed: sub.status === 'active',
      plan: sub.plan,
      status: sub.status,
      currentPeriodEnd: sub.current_period_end,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    });
  })

  // POST /subscription/create-checkout
  .post('/create-checkout', zValidator('json', z.object({
    plan: z.enum(['monthly', 'yearly']),
  }), async (c) => {
    const { plan } = c.req.valid('json');
    const user = c.get('user');

    // Check if already has active subscription
    const existing = await c.env.DB.prepare(
      `SELECT * FROM subscriptions WHERE user_id = ? AND status IN ('active', 'trialing')`
    ).bind(c.get('user').sub).first();

    if (existing) {
      return c.json({ error: 'Already have an active subscription' }, 400);
    }

    // Create Stripe Checkout Session
    // In production, use Stripe SDK
    const priceId = plan === 'monthly' 
      ? process.env.STRIPE_MONTHLY_PRICE_ID 
      : process.env.STRIPE_YEARLY_PRICE_ID;

    if (!priceId) {
      return c.json({ error: 'Stripe not configured' }, 500);
    }

    // Mock response - replace with actual Stripe call
    // const session = await stripe.checkout.sessions.create({
    //   customer_email: user.email,
    //   line_items: [{ price: priceId, quantity: 1 }],
    //   mode: 'subscription',
    //   success_url: `${env.APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${env.APP_URL}/upgrade`,
    // });

    // For now, return mock session
    return c.json({
      sessionId: 'cs_test_' + crypto.randomUUID(),
      url: `https://checkout.stripe.com/pay/cs_test_${crypto.randomUUID()}`,
    });
  })

  // POST /subscription/confirm
  .post('/confirm', zValidator('json', z.object({
    sessionId: z.string(),
  }), async (c) => {
    const { sessionId } = c.req.valid('json');
    const user = c.get('user');

    // Verify session with Stripe
    // const session = await stripe.checkout.sessions.retrieve(sessionId);
    // if (session.payment_status !== 'paid') throw error;

    // Create subscription record
    // await db.prepare(...).run(...)

    return c.json({ success: true });
  })

  // POST /subscription/cancel
  .post('/cancel', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;

    const sub = await c.env.DB.prepare(
      `SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active'`
    ).bind(c.get('user').sub).first();

    if (!sub) {
      return c.json({ error: 'No active subscription' }, 400);
    }

    // Cancel at period end
    await c.env.DB.prepare(
      `UPDATE subscriptions SET cancel_at_period_end = TRUE, updated_at = ? WHERE id = ?`
    ).bind(Date.now(), sub.id).run();

    // Also cancel in Stripe
    // await stripe.subscriptions.update(sub.stripe_subscription_id, { cancel_at_period_end: true });

    return c.json({ message: 'Subscription will be cancelled at end of billing period' });
  })

  // POST /subscription/resume
  .post('/resume', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;

    const sub = await c.env.DB.prepare(
      `SELECT * FROM subscriptions WHERE user_id = ? AND cancel_at_period_end = TRUE`
    ).bind(c.get('user').sub).first();

    if (!sub) {
      return c.json({ error: 'No subscription to resume' }, 400);
    }

    await c.env.DB.prepare(
      `UPDATE subscriptions SET cancel_at_period_end = FALSE, updated_at = ? WHERE id = ?`
    ).bind(Date.now(), sub.id).run();

    // Also resume in Stripe
    // await stripe.subscriptions.update(sub.stripe_subscription_id, { cancel_at_period_end: false });

    return c.json({ message: 'Subscription resumed' });
  })

  // POST /subscription/billing-portal
  .post('/billing-portal', async (c) => {
    const user = c.get('user');

    // Create Stripe Billing Portal session
    // const session = await stripe.billingPortal.sessions.create({
    //   customer: user.stripe_customer_id,
    //   return_url: `${env.APP_URL}/dashboard`,
    // });

    return c.json({ url: `https://billing.stripe.com/p/session/${crypto.randomUUID()}` });
  });

export { subscriptionRoutes };