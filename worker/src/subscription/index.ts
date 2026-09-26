import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

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

    const existing = await c.env.DB.prepare(
      "SELECT * FROM subscriptions WHERE user_id = ? AND status IN ('active', 'trialing')"
    ).bind(user.sub).first();

    if (existing) return c.json({ error: 'Already have an active subscription' }, 400);

    return c.json({
      sessionId: 'cs_test_' + crypto.randomUUID(),
      url: `https://checkout.stripe.com/pay/cs_test_${crypto.randomUUID()}`,
    });
  })
  .post('/cancel', async (c) => {
    const user = c.get('user');
    const sub = await c.env.DB.prepare(
      "SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active'"
    ).bind(user.sub).first();

    if (!sub) return c.json({ error: 'No active subscription' }, 400);

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

    await c.env.DB.prepare(
      'UPDATE subscriptions SET cancel_at_period_end = FALSE, updated_at = ? WHERE id = ?'
    ).bind(Date.now(), sub.id).run();

    return c.json({ message: 'Subscription resumed' });
  });