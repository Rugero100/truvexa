import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { rows } from '../db.js';
import { nonempty, positiveId, httpError } from '../utils.js';
export const publicRouter = Router();
publicRouter.get('/site', async (_req, res) => {
  const [sections, settings, categories, featuredServices] = await Promise.all([
    rows('SELECT section_key, eyebrow, title, subtitle, body, cta_label, cta_href FROM page_sections'),
    rows('SELECT setting_key, setting_value FROM site_settings'),
    rows('SELECT id, name, slug, description, icon FROM service_categories ORDER BY display_order, id'),
    rows('SELECT s.id, s.title, s.slug, s.summary, s.image_url, c.name AS category_name, c.slug AS category_slug FROM services s JOIN service_categories c ON c.id = s.category_id WHERE s.is_active = 1 AND s.is_featured = 1 ORDER BY s.display_order, s.id LIMIT 6')
  ]);
  res.json({ sections: Object.fromEntries(sections.map(s => [s.section_key, s])), settings: Object.fromEntries(settings.map(s => [s.setting_key, s.setting_value])), categories, featuredServices });
});
publicRouter.get('/services', async (req, res) => {
  const selected = typeof req.query.category === 'string' ? req.query.category : '';
  const services = await rows(`SELECT s.id, s.title, s.slug, s.summary, s.description, s.image_url, c.name AS category_name, c.slug AS category_slug FROM services s JOIN service_categories c ON c.id = s.category_id WHERE s.is_active = 1 AND (? = '' OR c.slug = ?) ORDER BY s.display_order, s.id`, [selected, selected]);
  res.json({ services });
});
publicRouter.get('/services/:slug', async (req, res) => {
  const found = await rows('SELECT s.id, s.title, s.slug, s.summary, s.description, s.image_url, c.name AS category_name, c.slug AS category_slug FROM services s JOIN service_categories c ON c.id = s.category_id WHERE s.is_active = 1 AND s.slug = ? LIMIT 1', [req.params.slug]);
  if (!found.length) throw httpError(404, 'Service not found.');
  res.json({ service: found[0] });
});
const inquirySchema = z.object({
  full_name: nonempty(120), email: z.email().max(190), phone: z.string().trim().max(35).default(''),
  category_id: z.union([positiveId, z.null()]).optional().default(null),
  subject: nonempty(160), message: z.string().trim().min(10).max(5000), website: z.string().optional()
});
const inquiryLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Too many inquiries. Please try again later.' } });
publicRouter.post('/inquiries', inquiryLimiter, async (req, res) => {
  const data = inquirySchema.parse(req.body);
  if (data.website) return res.status(202).json({ message: 'Thank you. Your inquiry has been received.' });
  if (data.category_id !== null) {
    const found = await rows('SELECT id FROM service_categories WHERE id = ?', [data.category_id]);
    if (!found.length) throw httpError(400, 'Choose a valid category.');
  }
  await rows('INSERT INTO inquiries (full_name, email, phone, category_id, subject, message) VALUES (?, ?, ?, ?, ?, ?)', [data.full_name, data.email.toLowerCase(), data.phone, data.category_id, data.subject, data.message]);
  res.status(201).json({ message: 'Thank you. Your inquiry has been received.' });
});
