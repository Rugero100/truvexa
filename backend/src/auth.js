import jwt from 'jsonwebtoken';
import { rows } from './db.js';
import { httpError } from './utils.js';
export const COOKIE_NAME = 'truvexa_session';
export function createToken(user) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 characters.');
  return jwt.sign({ sub: String(user.id) }, process.env.JWT_SECRET, { expiresIn: '8h', issuer: 'truvexa-api', audience: 'truvexa-dashboard' });
}
export function cookieOptions() {
  return { httpOnly: true, secure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 8 * 60 * 60 * 1000 };
}
export async function requireAuth(req, _res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) throw httpError(401, 'Please sign in.');
    const payload = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'truvexa-api', audience: 'truvexa-dashboard' });
    const users = await rows('SELECT id, full_name, email, role, is_active FROM users WHERE id = ?', [Number(payload.sub)]);
    if (!users[0] || !users[0].is_active) throw httpError(401, 'Your account is unavailable.');
    req.user = users[0]; next();
  } catch (err) { next(err.status ? err : httpError(401, 'Your session expired. Please sign in again.')); }
}
export const managerOnly = (req, _res, next) => req.user.role === 'manager' ? next() : next(httpError(403, 'Manager access required.'));
export async function canAccessCategory(user, categoryId) {
  if (user.role === 'manager') return true;
  const found = await rows('SELECT 1 FROM user_categories WHERE user_id = ? AND category_id = ?', [user.id, categoryId]);
  return found.length > 0;
}
