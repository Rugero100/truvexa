import { z } from 'zod';
export const nonempty = (max) => z.string().trim().min(1).max(max);
export const positiveId = z.coerce.number().int().positive();
export const slug = (value) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 150);
export function httpError(status, message) { const error = new Error(message); error.status = status; return error; }
export function idParam(req) {
  const result = positiveId.safeParse(req.params.id);
  if (!result.success) throw httpError(400, 'Invalid ID');
  return result.data;
}
export function errorHandler(err, _req, res, _next) {
  if (err instanceof z.ZodError) return res.status(400).json({ error: 'Invalid input', details: err.issues.map(i => ({ path: i.path.join('.'), message: i.message })) });
  if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'An item with that name, slug, or email already exists.' });
  if (err.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ error: 'This item is currently in use.' });
  const status = err.status || 500;
  if (status >= 500) console.error('[API]', err);
  res.status(status).json({ error: status >= 500 ? 'An unexpected server error occurred.' : err.message });
}
