import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool, rows } from '../db.js';
import { requireAuth, managerOnly, canAccessCategory } from '../auth.js';
import { nonempty, positiveId, slug, idParam, httpError } from '../utils.js';

export const adminRouter = Router();
adminRouter.use(requireAuth);
const categoryScope = (user) => user.role === 'manager' ? '' : ' AND category_id IN (SELECT category_id FROM user_categories WHERE user_id = ?)';
const scopeParams = (user) => user.role === 'manager' ? [] : [user.id];
const publicUser = (u) => ({ id: u.id, full_name: u.full_name, email: u.email, role: u.role, is_active: Boolean(u.is_active) });

adminRouter.get('/overview', async (req, res) => {
  const [services, inquiries, unread, categories] = await Promise.all([
    rows('SELECT COUNT(*) AS total FROM services WHERE 1=1' + categoryScope(req.user), scopeParams(req.user)),
    rows('SELECT COUNT(*) AS total FROM inquiries WHERE 1=1' + categoryScope(req.user), scopeParams(req.user)),
    rows("SELECT COUNT(*) AS total FROM inquiries WHERE status = 'new'" + categoryScope(req.user), scopeParams(req.user)),
    rows('SELECT COUNT(*) AS total FROM service_categories' + (req.user.role === 'manager' ? '' : ' WHERE id IN (SELECT category_id FROM user_categories WHERE user_id = ?)'), scopeParams(req.user))
  ]);
  res.json({ stats: { services: services[0].total, inquiries: inquiries[0].total, new_inquiries: unread[0].total, categories: categories[0].total } });
});

adminRouter.get('/categories', async (req, res) => {
  const categories = await rows('SELECT id, name, slug, description, icon, display_order FROM service_categories WHERE 1=1' + (req.user.role === 'manager' ? '' : ' AND id IN (SELECT category_id FROM user_categories WHERE user_id = ?)') + ' ORDER BY display_order, id', scopeParams(req.user));
  res.json({ categories });
});

const categorySchema = z.object({ name: nonempty(100), description: z.string().trim().max(400).default(''), icon: z.string().trim().max(40).default('briefcase'), display_order: z.coerce.number().int().default(0) });
adminRouter.post('/categories', managerOnly, async (req, res) => {
  const data = categorySchema.parse(req.body);
  const code = slug(data.name);
  if (!code) throw httpError(400, 'Category name must contain letters or numbers.');
  const created = await rows('INSERT INTO service_categories (name, slug, description, icon, display_order) VALUES (?, ?, ?, ?, ?)', [data.name, code, data.description, data.icon, data.display_order]);
  res.status(201).json({ id: created.insertId });
});
adminRouter.patch('/categories/:id', managerOnly, async (req, res) => {
  const id = idParam(req), data = categorySchema.parse(req.body), code = slug(data.name);
  if (!code) throw httpError(400, 'Invalid category name.');
  const result = await rows('UPDATE service_categories SET name=?, slug=?, description=?, icon=?, display_order=? WHERE id=?', [data.name, code, data.description, data.icon, data.display_order, id]);
  if (!result.affectedRows) throw httpError(404, 'Category not found.');
  res.json({ message: 'Category saved.' });
});

adminRouter.get('/services', async (req, res) => {
  const services = await rows('SELECT s.*, c.name AS category_name FROM services s JOIN service_categories c ON c.id = s.category_id WHERE 1=1' + (req.user.role === 'manager' ? '' : ' AND s.category_id IN (SELECT category_id FROM user_categories WHERE user_id = ?)') + ' ORDER BY s.display_order, s.id DESC', scopeParams(req.user));
  res.json({ services });
});
const serviceSchema = z.object({
  category_id: positiveId, title: nonempty(150), summary: nonempty(400), description: nonempty(20000),
  image_url: z.union([z.url().max(800).refine(value => value.startsWith('https://'), 'Image URL must use HTTPS'), z.literal(''), z.null()]).optional().default(''),
  is_featured: z.boolean().default(false), is_active: z.boolean().default(true),
  display_order: z.coerce.number().int().default(0)
});
async function checkCategory(user, categoryId) {
  if (!(await canAccessCategory(user, categoryId))) throw httpError(403, 'You are not assigned to this category.');
  const found = await rows('SELECT id FROM service_categories WHERE id=?', [categoryId]);
  if (!found.length) throw httpError(400, 'Category not found.');
}
adminRouter.post('/services', async (req, res) => {
  const data = serviceSchema.parse(req.body);
  await checkCategory(req.user, data.category_id);
  const code = slug(data.title);
  if (!code) throw httpError(400, 'Invalid service title.');
  const created = await rows('INSERT INTO services (category_id, title, slug, summary, description, image_url, is_featured, is_active, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [data.category_id, data.title, code, data.summary, data.description, data.image_url || null, data.is_featured, data.is_active, data.display_order]);
  res.status(201).json({ id: created.insertId });
});
adminRouter.patch('/services/:id', async (req, res) => {
  const id = idParam(req), data = serviceSchema.parse(req.body);
  const existing = await rows('SELECT category_id FROM services WHERE id=?', [id]);
  if (!existing.length) throw httpError(404, 'Service not found.');
  await checkCategory(req.user, existing[0].category_id);
  await checkCategory(req.user, data.category_id);
  const code = slug(data.title);
  if (!code) throw httpError(400, 'Invalid service title.');
  await rows('UPDATE services SET category_id=?, title=?, slug=?, summary=?, description=?, image_url=?, is_featured=?, is_active=?, display_order=? WHERE id=?',
    [data.category_id, data.title, code, data.summary, data.description, data.image_url || null, data.is_featured, data.is_active, data.display_order, id]);
  res.json({ message: 'Service saved.' });
});
adminRouter.delete('/services/:id', managerOnly, async (req, res) => {
  const result = await rows('DELETE FROM services WHERE id=?', [idParam(req)]);
  if (!result.affectedRows) throw httpError(404, 'Service not found.');
  res.json({ message: 'Service deleted.' });
});

adminRouter.get('/inquiries', async (req, res) => {
  const inquiries = await rows('SELECT i.*, c.name AS category_name, u.full_name AS assigned_name FROM inquiries i LEFT JOIN service_categories c ON c.id = i.category_id LEFT JOIN users u ON u.id = i.assigned_to WHERE 1=1' + (req.user.role === 'manager' ? '' : ' AND i.category_id IN (SELECT category_id FROM user_categories WHERE user_id = ?)') + ' ORDER BY i.created_at DESC LIMIT 500', scopeParams(req.user));
  res.json({ inquiries });
});
adminRouter.patch('/inquiries/:id', async (req, res) => {
  const id = idParam(req);
  const data = z.object({ status: z.enum(['new', 'in_progress', 'resolved']), assigned_to: z.union([positiveId, z.null()]).optional() }).parse(req.body);
  const found = await rows('SELECT category_id, assigned_to FROM inquiries WHERE id=?', [id]);
  if (!found.length) throw httpError(404, 'Inquiry not found.');
  if (req.user.role !== 'manager' && (!found[0].category_id || !(await canAccessCategory(req.user, found[0].category_id)))) throw httpError(403, 'Inquiry access denied.');
  if (req.user.role !== 'manager' && data.assigned_to !== undefined) throw httpError(403, 'Only managers can assign inquiries.');
  const assignee = data.assigned_to === undefined ? found[0].assigned_to : data.assigned_to;
  if (assignee !== null) {
    const users = await rows("SELECT id FROM users WHERE id=? AND role='staff' AND is_active=1", [assignee]);
    if (!users.length) throw httpError(400, 'Choose an active staff member.');
    if (found[0].category_id) {
      const assignment = await rows('SELECT 1 FROM user_categories WHERE user_id=? AND category_id=?', [assignee, found[0].category_id]);
      if (!assignment.length) throw httpError(400, 'Staff member is not assigned to this category.');
    }
  }
  await rows('UPDATE inquiries SET status=?, assigned_to=? WHERE id=?', [data.status, assignee, id]);
  res.json({ message: 'Inquiry updated.' });
});

adminRouter.get('/sections', managerOnly, async (_req, res) => res.json({ sections: await rows('SELECT * FROM page_sections ORDER BY id') }));
const sectionSchema = z.object({
  eyebrow: z.string().trim().max(100), title: nonempty(240), subtitle: z.string().trim().max(400),
  body: z.string().trim().max(20000), cta_label: z.string().trim().max(70),
  cta_href: z.string().trim().max(180).refine(x => !x || (x.startsWith('/') && !x.startsWith('//')), 'Use a path beginning with /')
});
adminRouter.put('/sections/:key', managerOnly, async (req, res) => {
  const data = sectionSchema.parse(req.body);
  const result = await rows('UPDATE page_sections SET eyebrow=?, title=?, subtitle=?, body=?, cta_label=?, cta_href=?, updated_by=? WHERE section_key=?',
    [data.eyebrow, data.title, data.subtitle, data.body, data.cta_label, data.cta_href, req.user.id, req.params.key]);
  if (!result.affectedRows) throw httpError(404, 'Section not found.');
  res.json({ message: 'Section saved.' });
});
const allowedSettings = ['company_email', 'company_phone', 'company_location', 'instagram_url', 'linkedin_url', 'facebook_url'];
adminRouter.get('/settings', managerOnly, async (_req, res) => res.json({ settings: await rows('SELECT * FROM site_settings') }));
adminRouter.put('/settings', managerOnly, async (req, res) => {
  const values = z.record(z.string(), z.string().trim().max(800)).parse(req.body);
  if (Object.keys(values).some(key => !allowedSettings.includes(key))) throw httpError(400, 'Unknown setting.');
  for (const [key, value] of Object.entries(values)) {
    if (key.endsWith('_url') && value && !/^https:\/\//i.test(value)) throw httpError(400, 'Social links must use https://');
    await rows('INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)', [key, value]);
  }
  res.json({ message: 'Contact settings saved.' });
});

adminRouter.get('/staff', managerOnly, async (_req, res) => {
  const [users, assignments] = await Promise.all([
    rows("SELECT id, full_name, email, role, is_active, created_at FROM users WHERE role='staff' ORDER BY created_at DESC"),
    rows('SELECT user_id, category_id FROM user_categories')
  ]);
  res.json({ staff: users.map(u => ({ ...publicUser(u), category_ids: assignments.filter(a => a.user_id === u.id).map(a => a.category_id) })) });
});
const staffSchema = z.object({ full_name: nonempty(120), email: z.email().max(190), password: z.string().min(12).max(128), category_ids: z.array(positiveId).max(50).default([]) });
async function validateCategoryIds(ids) {
  if (!ids.length) return;
  const found = await rows('SELECT id FROM service_categories WHERE id IN (' + ids.map(() => '?').join(',') + ')', ids);
  if (found.length !== new Set(ids).size) throw httpError(400, 'Some category assignments are invalid.');
}
adminRouter.post('/staff', managerOnly, async (req, res) => {
  const data = staffSchema.parse(req.body), categoryIds = [...new Set(data.category_ids)];
  await validateCategoryIds(categoryIds);
  const hash = await bcrypt.hash(data.password, 12);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [created] = await conn.execute("INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'staff')", [data.full_name, data.email.toLowerCase(), hash]);
    for (const categoryId of categoryIds) await conn.execute('INSERT INTO user_categories (user_id, category_id) VALUES (?, ?)', [created.insertId, categoryId]);
    await conn.commit();
    res.status(201).json({ id: created.insertId });
  } catch (err) { await conn.rollback(); throw err; } finally { conn.release(); }
});
const staffUpdateSchema = z.object({
  full_name: nonempty(120), is_active: z.boolean(), password: z.union([z.string().min(12).max(128), z.literal('')]).optional(),
  category_ids: z.array(positiveId).max(50)
});
adminRouter.patch('/staff/:id', managerOnly, async (req, res) => {
  const id = idParam(req), data = staffUpdateSchema.parse(req.body), categoryIds = [...new Set(data.category_ids)];
  const found = await rows("SELECT id FROM users WHERE id=? AND role='staff'", [id]);
  if (!found.length) throw httpError(404, 'Staff account not found.');
  await validateCategoryIds(categoryIds);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute('UPDATE users SET full_name=?, is_active=? WHERE id=?', [data.full_name, data.is_active, id]);
    if (data.password) await conn.execute('UPDATE users SET password_hash=? WHERE id=?', [await bcrypt.hash(data.password, 12), id]);
    await conn.execute('DELETE FROM user_categories WHERE user_id=?', [id]);
    for (const categoryId of categoryIds) await conn.execute('INSERT INTO user_categories (user_id, category_id) VALUES (?, ?)', [id, categoryId]);
    await conn.commit(); res.json({ message: 'Staff member saved.' });
  } catch (err) { await conn.rollback(); throw err; } finally { conn.release(); }
});
