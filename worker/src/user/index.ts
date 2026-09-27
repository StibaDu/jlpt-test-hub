import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

export const userRoutes = new Hono()
  .get('/profile', async (c) => {
    const user = c.get('user');
    const profile = await c.env.DB.prepare(
      'SELECT id, email, name, email_verified, created_at FROM users WHERE id = ?'
    ).bind(user.sub).first();

    if (!profile) return c.json({ error: 'User not found' }, 404);

    const sub = await c.env.DB.prepare(
      "SELECT status, plan, current_period_end, cancel_at_period_end FROM subscriptions WHERE user_id = ? AND status IN ('active', 'trialing')"
    ).bind(profile.id).first();

    return c.json({ user: profile, subscription: sub || null });
  })
  .put('/profile', zValidator('json', z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
  })), async (c) => {
    const user = c.get('user');
    const { name, email } = c.req.valid('json');

    const updates: string[] = [];
    const params: any[] = [];

    if (name) { updates.push('name = ?'); params.push(name); }
    if (email) {
      const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ? AND id != ?')
        .bind(email.toLowerCase(), user.sub).first();
      if (existing) return c.json({ error: 'Email already in use' }, 400);
      updates.push('email = ?'); params.push(email.toLowerCase());
    }

    if (updates.length === 0) return c.json({ error: 'No changes provided' }, 400);

    params.push(Date.now(), user.sub);
    await c.env.DB.prepare(`UPDATE users SET ${updates.join(', ')}, updated_at = ? WHERE id = ?`).bind(...params).run();

    return c.json({ message: 'Profile updated successfully' });
  })
  .delete('/account', async (c) => {
    const user = c.get('user');
    await c.env.DB.prepare('UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = ?').bind(user.sub).run();
    await c.env.DB.prepare("UPDATE subscriptions SET status = 'cancelled', cancelled_at = ? WHERE user_id = ? AND status = 'active'")
      .bind(Date.now(), user.sub).run();
    c.header('Set-Cookie', 'refresh_token=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0');
    return c.json({ message: 'Account deleted successfully' });
  });