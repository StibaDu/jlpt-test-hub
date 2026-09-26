import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

// Password hashing using Web Crypto API (PBKDF2 — works on Workers)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const hashArray = Array.from(new Uint8Array(derivedBits));
  const saltArray = Array.from(salt);
  return `${saltArray.join(',')}.${hashArray.join(',')}`;
}

async function verifyPassword(stored: string, password: string): Promise<boolean> {
  const [saltStr, hashStr] = stored.split('.');
  const salt = new Uint8Array(saltStr.split(',').map(Number));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const hashArray = Array.from(new Uint8Array(derivedBits)).join(',');
  return hashArray === hashStr;
}

// JWT helpers using Web Crypto
async function createJWT(payload: any, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '');
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '');
  const data = `${headerB64}.${payloadB64}`;
  
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '');
  return `${data}.${sigB64}`;
}

export const authRoutes = new Hono()
  .post('/signup', zValidator('json', z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2).max(100),
  })), async (c) => {
    const { email, password, name } = c.req.valid('json');
    const db = c.env.DB;

    const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email.toLowerCase()).first();
    if (existing) return c.json({ error: 'Email already registered' }, 400);

    const passwordHash = await hashPassword(password);
    const userId = crypto.randomUUID();
    const verificationToken = crypto.randomUUID();
    const now = Date.now();

    await db.prepare(
      'INSERT INTO users (id, email, password_hash, name, email_verification_token, email_verification_expires, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(userId, email.toLowerCase(), passwordHash, name, verificationToken, now + 86400000, now, now).run();

    // TODO: Send verification email
    console.log(`Verify URL: ${c.env.APP_URL}/verify-email?token=${verificationToken}`);

    return c.json({ message: 'Account created. Please check your email to verify.' }, 201);
  })
  .post('/login', zValidator('json', z.object({
    email: z.string().email(),
    password: z.string().min(1),
  })), async (c) => {
    const { email, password } = c.req.valid('json');
    const db = c.env.DB;

    const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email.toLowerCase()).first();
    if (!user) return c.json({ error: 'Invalid credentials' }, 401);

    const valid = await verifyPassword(user.password_hash, password);
    if (!valid) return c.json({ error: 'Invalid credentials' }, 401);

    if (!user.email_verified) return c.json({ error: 'Please verify your email first', code: 'EMAIL_NOT_VERIFIED' }, 403);

    const accessToken = await createJWT(
      { sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 900 },
      c.env.JWT_SECRET
    );
    const refreshToken = await createJWT(
      { sub: user.id, type: 'refresh', exp: Math.floor(Date.now() / 1000) + 2592000 },
      c.env.JWT_SECRET
    );

    // Store refresh token
    const encoder = new TextEncoder();
    const tokenHash = await crypto.subtle.digest('SHA-256', encoder.encode(refreshToken));
    const hashHex = Array.from(new Uint8Array(tokenHash)).map(b => b.toString(16).padStart(2, '0')).join('');

    await db.prepare(
      'INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), user.id, hashHex, Date.now() + 2592000000, Date.now()).run();

    c.header('Set-Cookie', `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000`);

    return c.json({
      user: { id: user.id, email: user.email, name: user.name, email_verified: user.email_verified },
      accessToken,
    });
  })
  .post('/logout', async (c) => {
    c.header('Set-Cookie', 'refresh_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');
    return c.json({ message: 'Logged out' });
  })
  .get('/verify-email', async (c) => {
    const token = c.req.query('token');
    if (!token) return c.json({ error: 'Missing token' }, 400);

    const user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE email_verification_token = ? AND email_verification_expires > ?'
    ).bind(token, Date.now()).first();

    if (!user) return c.json({ error: 'Invalid or expired token' }, 400);

    await c.env.DB.prepare(
      'UPDATE users SET email_verified = TRUE, email_verification_token = NULL, email_verification_expires = NULL, updated_at = ? WHERE id = ?'
    ).bind(Date.now(), user.id).run();

    return c.json({ message: 'Email verified successfully' });
  })
  .post('/forgot-password', zValidator('json', z.object({ email: z.string().email() })), async (c) => {
    const { email } = c.req.valid('json');
    const user = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email.toLowerCase()).first();

    if (user) {
      const resetToken = crypto.randomUUID();
      await c.env.DB.prepare(
        'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?'
      ).bind(resetToken, Date.now() + 3600000, user.id).run();
      // TODO: Send reset email
      console.log(`Reset URL: ${c.env.APP_URL}/reset-password?token=${resetToken}`);
    }

    return c.json({ message: 'If the email exists, a reset link has been sent' });
  })
  .post('/reset-password', zValidator('json', z.object({
    token: z.string(),
    password: z.string().min(8),
  })), async (c) => {
    const { token, password } = c.req.valid('json');
    const user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE password_reset_token = ? AND password_reset_expires > ?'
    ).bind(token, Date.now()).first();

    if (!user) return c.json({ error: 'Invalid or expired reset token' }, 400);

    const passwordHash = await hashPassword(password);
    await c.env.DB.prepare(
      'UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL, updated_at = ? WHERE id = ?'
    ).bind(passwordHash, Date.now(), user.id).run();

    await c.env.DB.prepare('UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = ?').bind(user.id).run();

    return c.json({ message: 'Password reset successful' });
  });