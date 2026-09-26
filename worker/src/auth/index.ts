import { Hono } from 'hono';
import { z } from 'zod';
import { hash, verify } from 'argon2';
import { sign, verify as jwtVerify } from 'hono/jwt';
import { zValidator } from '@hono/zod-validator';

const authRoutes = new Hono();

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
  name: z.string().min(2).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
});

const verifyEmailSchema = z.object({
  token: z.string(),
});

// Helper functions
async function hashPassword(password: string): Promise<string> {
  return hash(password, {
    type: argon2id,
    memoryCost: 65536,  // 64 MB
    timeCost: 3,
    parallelism: 4,
  });
}

async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await verify(hash, password);
  } catch {
    return false;
  }
}

async function createAccessToken(userId: string, email: string, role: string, secret: string): Promise<string> {
  const payload = {
    sub: userId,
    email,
    role,
    exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes
    iat: Math.floor(Date.now() / 1000),
  };
  return sign(import.meta.env.JWT_SECRET || '', payload, 'HS256');
}

async function createRefreshToken(userId: string, secret: string): Promise<string> {
  const payload = {
    sub: userId,
    type: 'refresh',
    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
    iat: Math.floor(Date.now() / 1000),
  };
  return sign(import.meta.env.JWT_SECRET || '', payload, 'HS256');
}

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sendEmail(env: any, to: string, subject: string, html: string): Promise<void> {
  // Use Cloudflare Email Workers or external service
  // For now, we'll log and you can integrate with SendGrid/Resend/Cloudflare Email Workers
  console.log(`[EMAIL] To: ${to}, Subject: ${subject}`);
  console.log(html);
  
  // TODO: Implement actual email sending
  // Example with Cloudflare Email Workers:
  // await env.EMAIL.send({
  //   from: env.EMAIL_FROM,
  //   to,
  //   subject,
  //   html,
  // });
}

// POST /api/auth/signup
export const authRoutes = new Hono()
  .post('/signup', zValidator('json', signupSchema), async (c) => {
    const { email, password, name } = c.req.valid('json');
    const db = c.env.DB;

    // Check if email already exists
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email.toLowerCase()).first();
    if (existing) {
      return c.json({ error: 'Email already registered' }, 400);
    }

    const passwordHash = await hashPassword(password);
    const userId = crypto.randomUUID();
    const verificationToken = crypto.randomUUID();
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    const now = Date.now();

    await db.prepare(`
      INSERT INTO users (id, email, password_hash, name, email_verification_token, email_verification_expires, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(crypto.randomUUID(), email.toLowerCase(), passwordHash, name, verificationToken, verificationExpires, Date.now(), Date.now()).run();

    // Send verification email
    const verifyUrl = `${c.env.APP_URL}/verify-email?token=${verificationToken}`;
    await sendEmail(c.env, email, 'Verify your JLPT Test Hub account', `
      <h2>Welcome to JLPT Test Hub!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <p><a href="${verifyUrl}">Verify Email</a></p>
      <p>This link expires in 24 hours.</p>
      <p>If you didn't create this account, please ignore this email.</p>
    `);

    return c.json({ message: 'Account created. Please check your email to verify.' }, 201);
  })

  // POST /auth/login
  .post('/login', zValidator('json', loginSchema), async (c) => {
    const { email, password } = c.req.valid('json');
    const db = c.env.DB;

    const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email.toLowerCase()).first();
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const valid = await verifyPassword(user.password_hash, password);
    if (!valid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    if (!user.email_verified) {
      return c.json({ error: 'Please verify your email first', code: 'EMAIL_NOT_VERIFIED' }, 403);
    }

    const accessToken = await createAccessToken(user.id, user.email, 'user', c.env.JWT_SECRET);
    const refreshToken = await createRefreshToken(user.id, c.env.JWT_SECRET);
    const refreshTokenHash = await hashToken(refreshToken);
    const refreshExpires = Date.now() + 30 * 24 * 60 * 60 * 1000;

    // Store refresh token hash
    await c.env.DB.prepare(
      'INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), user.id, await hashToken(refreshToken), Date.now() + 30 * 24 * 60 * 60 * 1000, Date.now()).run();

    // Update last login
    await c.env.DB.prepare('UPDATE users SET updated_at = ? WHERE id = ?').bind(Date.now(), user.id).run();

    // Set refresh token as HttpOnly cookie
    c.header('Set-Cookie', `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${30 * 24 * 60 * 60}`);

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        email_verified: user.email_verified,
      },
      accessToken: accessToken,
    });
  })

  // POST /auth/logout
  .post('/logout', async (c) => {
    const refreshToken = c.req.header('Cookie')?.split('refresh_token=')[1]?.split(';')[0];
    if (refreshToken) {
      const tokenHash = await hashToken(refreshToken);
      await c.env.DB.prepare('UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = ?').bind(await hashToken(refreshToken)).run();
    }

    c.header('Set-Cookie', 'refresh_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');
    return c.json({ message: 'Logged out successfully' });
  })

  // POST /auth/refresh
  .post('/refresh', async (c) => {
    const refreshToken = c.req.header('Cookie')?.split('refresh_token=')[1]?.split(';')[0];
    if (!refreshToken) {
      return c.json({ error: 'No refresh token' }, 401);
    }

    const tokenHash = await hashToken(refreshToken);
    const stored = await c.env.DB.prepare('SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked = FALSE AND expires_at > ?')
      .bind(await hashToken(refreshToken), Date.now()).first();

    if (!stored) {
      return c.json({ error: 'Invalid or expired refresh token' }, 401);
    }

    // Verify JWT
    let payload;
    try {
      payload = await verify(refreshToken, c.env.JWT_SECRET);
    } catch {
      return c.json({ error: 'Invalid refresh token' }, 401);
    }

    if (payload.type !== 'refresh') {
      return c.json({ error: 'Invalid token type' }, 401);
    }

    // Rotate refresh token
    const newRefreshToken = await createRefreshToken(payload.sub, c.env.JWT_SECRET);
    const newRefreshTokenHash = await hashToken(newRefreshToken);

    // Revoke old token
    await c.env.DB.prepare('UPDATE refresh_tokens SET revoked = TRUE WHERE id = ?').bind(stored.id).run();

    // Store new refresh token
    await c.env.DB.prepare(
      'INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), payload.sub, await hashToken(await createRefreshToken(payload.sub, c.env.JWT_SECRET)), Date.now() + 30 * 24 * 60 * 60 * 1000, Date.now()).run();

    const accessToken = await createAccessToken(payload.sub, '', 'user', c.env.JWT_SECRET);

    c.header('Set-Cookie', `refresh_token=${newRefreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${30 * 24 * 60 * 60}`);

    return c.json({ accessToken });
  })

  // GET /auth/verify-email
  .get('/verify-email', zValidator('query', verifyEmailSchema), async (c) => {
    const { token } = c.req.valid('query');
    const db = c.env.DB;

    const user = await db.prepare('SELECT * FROM users WHERE email_verification_token = ? AND email_verification_expires > ?')
      .bind(token, Date.now()).first();

    if (!user) {
      return c.json({ error: 'Invalid or expired verification token' }, 400);
    }

    await db.prepare('UPDATE users SET email_verified = TRUE, email_verification_token = NULL, email_verification_expires = NULL, updated_at = ? WHERE id = ?')
      .bind(Date.now(), user.id).run();

    return c.json({ message: 'Email verified successfully. You can now log in.' });
  })

  // POST /auth/forgot-password
  .post('/forgot-password', zValidator('json', forgotPasswordSchema), async (c) => {
    const { email } = c.req.valid('json');
    const db = c.env.DB;

    const user = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email.toLowerCase()).first();
    // Always return success to prevent email enumeration
    if (!user) {
      return c.json({ message: 'If the email exists, a reset link has been sent' });
    }

    const resetToken = crypto.randomUUID();
    const resetExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    await db.prepare('UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?')
      .bind(resetToken, resetExpires, user.id).run();

    const resetUrl = `${c.env.APP_URL}/reset-password?token=${resetToken}`;
    await sendEmail(c.env, email, 'Reset your JLPT Test Hub password', `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `);

    return c.json({ message: 'If the email exists, a reset link has been sent' });
  })

  // POST /auth/reset-password
  .post('/reset-password', zValidator('json', resetPasswordSchema), async (c) => {
    const { token, password } = c.req.valid('json');
    const db = c.env.DB;

    const user = await db.prepare('SELECT * FROM users WHERE password_reset_token = ? AND password_reset_expires > ?')
      .bind(token, Date.now()).first();

    if (!user) {
      return c.json({ error: 'Invalid or expired reset token' }, 400);
    }

    const passwordHash = await hashPassword(password);

    await db.prepare('UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL, updated_at = ? WHERE id = ?')
      .bind(await hashPassword(password), Date.now(), user.id).run();

    // Invalidate all refresh tokens
    await db.prepare('UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = ?').bind(user.id).run();

    return c.json({ message: 'Password reset successful. You can now log in.' });
  })

  // POST /auth/verify-email (resend)
  .post('/verify-email/resend', zValidator('json', z.object({ email: z.string().email() })), async (c) => {
    const { email } = c.req.valid('json');
    const db = c.env.DB;

    const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email.toLowerCase()).first();
    if (!user || user.email_verified) {
      return c.json({ message: 'If the email exists and is not verified, a new link has been sent' });
    }

    const verificationToken = crypto.randomUUID();
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    await db.prepare('UPDATE users SET email_verification_token = ?, email_verification_expires = ? WHERE id = ?')
      .bind(verificationToken, verificationExpires, user.id).run();

    const verifyUrl = `${c.env.APP_URL}/verify-email?token=${verificationToken}`;
    await sendEmail(c.env, email, 'Verify your JLPT Test Hub account', `
      <h2>Verify your email</h2>
      <p><a href="${verifyUrl}">Verify Email</a></p>
      <p>This link expires in 24 hours.</p>
    `);

    return c.json({ message: 'Verification email sent' });
  });