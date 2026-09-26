import { Hono } from 'hono';

export const adminRoutes = new Hono()
  .get('/stats', async (c) => {
    const [users, subs, tests] = await Promise.all([
      c.env.DB.prepare('SELECT COUNT(*) as count FROM users').first(),
      c.env.DB.prepare("SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'").first(),
      c.env.DB.prepare('SELECT COUNT(*) as count FROM test_attempts').first(),
    ]);

    return c.json({
      totalUsers: users?.count || 0,
      activeSubscriptions: subs?.count || 0,
      totalTestsTaken: tests?.count || 0,
    });
  })
  .get('/users', async (c) => {
    const page = parseInt(c.req.query('page') || '1');
    const limit = Math.min(parseInt(c.req.query('limit') || '50'), 100);
    const offset = (page - 1) * limit;

    const users = await c.env.DB.prepare(
      'SELECT id, email, name, email_verified, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).bind(limit, offset).all();

    const total = await c.env.DB.prepare('SELECT COUNT(*) as count FROM users').first();

    return c.json({
      users: users.results,
      pagination: { page, limit, total: total?.count || 0 },
    });
  });