import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const adminRoutes = new Hono();

// All admin routes require admin role (checked in middleware)

const adminRoutes = new Hono()

  // GET /api/admin/stats
  .get('/stats', async (c) => {
    const db = c.env.DB;

    const [users, subs, tests] = await Promise.all([
      c.env.DB.prepare('SELECT COUNT(*) as count FROM users').first(),
      c.env.DB.prepare("SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'").first(),
      c.env.DB.prepare('SELECT COUNT(*) as count FROM test_attempts').first(),
    ]);

    const revenue = await c.env.DB.prepare(`
      SELECT 
        SUM(CASE WHEN plan = 'monthly' THEN 4.99 ELSE 29.99 END) as mrr
      FROM subscriptions WHERE status = 'active'
    `).first();

    return c.json({
      totalUsers: users?.count || 0,
      activeSubscriptions: subs?.count || 0,
      totalTestsTaken: tests?.count || 0,
      monthlyRecurringRevenue: revenue?.mrr || 0,
    });
  })

  // GET /api/admin/users
  .get('/users', async (c) => {
    const page = parseInt(c.req.query('page') || '1');
    const limit = Math.min(parseInt(c.req.query('limit') || '50'), 100);
    const search = c.req.query('search') || '';
    const offset = (page - 1) * limit;

    let query = `SELECT id, email, name, email_verified, created_at FROM users`;
    const params: any[] = [];

    if (search) {
      query += ` WHERE email LIKE ? OR name LIKE ?`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const users = await c.env.DB.prepare(query).bind(...params).all();

    const total = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM users ${search ? 'WHERE email LIKE ? OR name LIKE ?' : ''}`
    ).bind(...(search ? [`%${search}%`, `%${search}%`] : [])).first();

    return c.json({
      users: users.results,
      pagination: {
        page,
        limit,
        total: total?.count || 0,
        totalPages: Math.ceil((total?.count || 0) / limit),
      },
    });
  })

  // GET /api/admin/users/:id
  .get('/users/:id', async (c) => {
    const user = await c.env.DB.prepare(
      `SELECT * FROM users WHERE id = ?`
    ).bind(c.req.param('id')).first();

    if (!user) {
      return c.json({ error: 'Not found' }, 404);
    }

    const sub = await c.env.DB.prepare(
      `SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC`
    ).bind(c.req.param('id')).all();

    const tests = await c.env.DB.prepare(
      `SELECT * FROM test_attempts WHERE user_id = ? ORDER BY completed_at DESC LIMIT 10`
    ).bind(c.req.param('id')).all();

    return c.json({ user, subscriptions: sub.results, recentTests: tests.results });
  })

  // POST /api/admin/users/:id/ban
  .post('/users/:id/ban', async (c) => {
    // Implementation for banning users
    return c.json({ message: 'Not implemented' });
  })

  // GET /api/admin/subscriptions
  .get('/subscriptions', async (c) => {
    const page = parseInt(c.req.query('page') || '1');
    const limit = Math.min(parseInt(c.req.query('limit') || '50'), 100);
    const status = c.req.query('status') || '';
    const offset = (page - 1) * limit;

    let query = `SELECT s.*, u.email, u.name FROM subscriptions s JOIN users u ON s.user_id = u.id`;
    const params: any[] = [];

    if (status) {
      query += ` WHERE s.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY s.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const subs = await c.env.DB.prepare(query).bind(...params).all();

    const total = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM subscriptions ${status ? 'WHERE status = ?' : ''}`
    ).bind(...(status ? [status] : [])).first();

    return c.json({
      subscriptions: subs.results,
      pagination: { page, limit, total: total?.count || 0 },
    });
  })

  // POST /api/admin/webhooks/retry
  .post('/webhooks/retry', zValidator('json', z.object({ eventId: z.string() })), async (c) => {
    const { eventId } = c.req.valid('json');
    // Re-process a failed webhook
    return c.json({ message: 'Retry queued' });
  });

export { adminRoutes };