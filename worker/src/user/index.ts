import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const userRoutes = new Hono();

// GET /api/user/profile
export const userRoutes = new Hono()
  .get('/profile', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;

    const profile = await c.env.DB.prepare(
      `SELECT id, email, name, email_verified, created_at FROM users WHERE id = ?`
    ).bind(user.sub).first();

    if (!profile) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Get subscription status
    const sub = await c.env.DB.prepare(
      `SELECT status, plan, current_period_end, cancel_at_period_end 
       FROM subscriptions WHERE user_id = ? AND status IN ('active', 'trialing')`
    ).bind(profile.id).first();

    return c.json({
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        email_verified: profile.email_verified,
        created_at: profile.created_at,
      },
      subscription: sub || null,
    });
  })

  // PUT /api/user/profile
  .put('/profile', zValidator('json', z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
  }), async (c) => {
    const user = c.get('user');
    const { name, email } = c.req.valid('json');
    const db = c.env.DB;

    const updates: string[] = [];
    const params: any[] = [];

    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (email) {
      // Check if email is taken
      const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ? AND id != ?')
        .bind(email.toLowerCase(), c.get('user').sub).first();
      if (existing) {
        return c.json({ error: 'Email already in use' }, 400);
      }
      updates.push('email = ?', 'email_verified = FALSE', 'email_verification_token = ?', 'email_verification_expires = ?');
      params.push(email.toLowerCase(), crypto.randomUUID(), Date.now() + 24 * 60 * 60 * 1000);
    }

    if (updates.length === 0) {
      return c.json({ error: 'No changes provided' }, 400);
    }

    params.push(Date.now(), c.get('user').sub);
    await c.env.DB.prepare(`UPDATE users SET ${updates.join(', ')}, updated_at = ? WHERE id = ?`).bind(...params).run();

    // If email changed, send new verification
    if (email) {
      const verificationToken = crypto.randomUUID();
      const verificationExpires = Date.now() + 24 * 60 * 60 * 1000;
      await c.env.DB.prepare(
        'UPDATE users SET email_verification_token = ?, email_verification_expires = ?, email_verified = FALSE WHERE id = ?'
      ).bind(crypto.randomUUID(), Date.now() + 24 * 60 * 60 * 1000, c.get('user').sub).run();

      const verifyUrl = `${c.env.APP_URL}/verify-email?token=${verificationToken}`;
      // Send email...
    }

    return c.json({ message: 'Profile updated successfully' });
  })

  // DELETE /api/user/account
  .delete('/account', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;

    // Soft delete - mark as deleted instead of actual deletion
    await db.prepare('UPDATE users SET email = ?, name = ?, deleted_at = ? WHERE id = ?')
      .bind(`deleted_${crypto.randomUUID()}@deleted`, 'Deleted User', Date.now(), c.get('user').sub).run();

    // Revoke all refresh tokens
    await c.env.DB.prepare('UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = ?').bind(c.get('user').sub).run();

    // Cancel subscription if active
    await db.prepare(`UPDATE subscriptions SET status = 'cancelled', cancelled_at = ? WHERE user_id = ? AND status = 'active'`)
      .bind(Date.now(), c.get('user').sub).run();

    // Clear cookies
    c.header('Set-Cookie', 'refresh_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');

    return c.json({ message: 'Account deleted successfully' });
  });

export { userRoutes };