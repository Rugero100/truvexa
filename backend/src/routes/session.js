import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { rateLimit } from 'express-rate-limit';
import { rows } from '../db.js';
import { requireAuth, createToken, COOKIE_NAME, cookieOptions } from '../auth.js';
import { httpError } from '../utils.js';
export const sessionRouter = Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 12, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Too many sign-in attempts. Try again later.' } });
sessionRouter.post('/login', loginLimiter, async (req, res) => {
  const input = z.object({ email: z.email(), password: z.string().min(1) }).parse(req.body);
  const found = await rows('SELECT * FROM users WHERE email = ?', [input.email.toLowerCase()]);
  const user = found[0];
  if (!user || !user.is_active || !(await bcrypt.compare(input.password, user.password_hash))) throw httpError(401, 'Invalid email or password.');
  res.cookie(COOKIE_NAME, createToken(user), cookieOptions());
  res.json({ user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } });
});
sessionRouter.post('/logout', (_req, res) => {
  const options = cookieOptions(); delete options.maxAge;
  res.clearCookie(COOKIE_NAME, options).json({ message: 'Signed out.' });
});
sessionRouter.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));
