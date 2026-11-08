import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool, rows } from '../src/db.js';
import { slug } from '../src/utils.js';

const categories = [
  { name: 'Real Estate', description: 'Thoughtful property discovery and practical real estate support.', icon: 'building', services: [
    ['Property Discovery', 'Find spaces that fit the way you live or work.', 'Explore residential and commercial property options with a clear, guided approach. Tell us what you need, your preferred location, and your budget so our team can discuss suitable next steps.'],
    ['Property Advisory', 'Make your next property decision with more clarity.', 'Ask for support understanding property options, comparing locations, and planning the questions that matter before making a commitment.']
  ] },
  { name: 'Events & Experiences', description: 'Intentional occasions, memorable details, seamless coordination.', icon: 'calendar', services: [
    ['Event Planning', 'From the first idea to a considered experience.', 'Share the occasion, audience, location and vision. Our team can discuss coordination, planning needs and the next steps for your event.'],
    ['Corporate Experiences', 'Gather your people with purpose.', 'Explore tailored arrangements for professional gatherings, business experiences and private functions.']
  ] },
  { name: 'Travel & Tourism', description: 'Discover places, plan journeys, and create new perspectives.', icon: 'compass', services: [
    ['Travel Planning', 'Every great journey starts with a good plan.', 'Discuss your destination, dates, interests and travel priorities with our team to shape an itinerary worth considering.'],
    ['Local Experiences', 'Find a different way to explore.', 'Discover travel inspiration and ask about experiences designed around your preferred pace and interests.']
  ] },
  { name: 'Business Connections', description: 'Introductions, possibilities and ideas for what comes next.', icon: 'network', services: [
    ['Business Introductions', 'Meaningful connections for new opportunities.', 'Tell us about the sector, market, or kind of collaboration you are exploring. Our team can review your inquiry and discuss potential next steps.'],
    ['Business Support', 'Explore practical paths forward.', 'Ask about your business objectives and the type of support, information or local coordination you are seeking.']
  ] }
];

const sections = [
  ['hero', 'TRUVEXA SERVICES LTD', 'Beyond expectations. Into possibility.', 'A refined partner for property, experiences, travel and business connections.', 'Different ambitions call for different paths. We bring your ideas into focus with personal attention and a thoughtful approach.', 'Explore our services', '/services'],
  ['about', 'WHO WE ARE', 'One company. Many possibilities.', 'A connected approach to the things that move you forward.', 'TRUVEXA SERVICES LTD brings together diverse services under one clear purpose: helping people explore opportunities with confidence. We value clarity, care and considered execution.', 'Discover our story', '/about'],
  ['process', 'OUR APPROACH', 'A better experience starts with understanding.', 'Listen. Plan. Connect. Deliver.', 'Every inquiry begins with a conversation. We learn what matters to you, help identify the right direction and communicate clearly along the way.', 'Start a conversation', '/contact'],
  ['contact', 'LET’S CONNECT', 'Your next move starts here.', 'Have an idea, a question or an opportunity? We would love to hear from you.', 'Tell us what you are exploring, and our team will review your message.', 'Contact TRUVEXA', '/contact']
];

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12 || !email.includes('@')) throw new Error('Set ADMIN_EMAIL and a unique ADMIN_PASSWORD (at least 12 characters) in backend/.env first.');
  const existing = await rows('SELECT id FROM users WHERE email=?', [email]);
  if (!existing.length) {
    await rows("INSERT INTO users (full_name,email,password_hash,role) VALUES (?,?,?,'manager')", [process.env.ADMIN_NAME || 'TRUVEXA Manager', email, await bcrypt.hash(password, 12)]);
    console.log('Created manager account:', email);
  } else console.log('Manager email already exists; password left unchanged.');
  let order = 1;
  for (const group of categories) {
    const created = await rows('INSERT INTO service_categories (name,slug,description,icon,display_order) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)', [group.name, slug(group.name), group.description, group.icon, order++]);
    const categoryId = created.insertId;
    for (const [title, summary, description] of group.services) {
      await rows('INSERT IGNORE INTO services (category_id,title,slug,summary,description,is_featured,is_active,display_order) VALUES (?,?,?,?,?,1,1,?)', [categoryId, title, slug(title), summary, description, order++]);
    }
  }
  for (const [key, eyebrow, title, subtitle, body, ctaLabel, ctaHref] of sections) {
    await rows('INSERT IGNORE INTO page_sections (section_key,eyebrow,title,subtitle,body,cta_label,cta_href) VALUES (?,?,?,?,?,?,?)', [key, eyebrow, title, subtitle, body, ctaLabel, ctaHref]);
  }
  for (const key of ['company_email', 'company_phone', 'company_location', 'instagram_url', 'linkedin_url', 'facebook_url']) {
    await rows('INSERT IGNORE INTO site_settings (setting_key,setting_value) VALUES (?,?)', [key, '']);
  }
  console.log('Seed data ready. Update company contact details in the manager dashboard.');
}
try { await main(); } catch (error) { console.error(error); process.exitCode = 1; } finally { await pool.end(); }
