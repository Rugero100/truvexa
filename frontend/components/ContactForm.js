'use client';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { request } from '../lib/client';
export default function ContactForm({ categories, service = '' }) {
  const [status, setStatus] = useState({ type: '', text: '' }), [sending, setSending] = useState(false);
  async function submit(event) {
    event.preventDefault(); setSending(true); setStatus({ type: '', text: '' });
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const result = await request('/inquiries', { method: 'POST', body: JSON.stringify({ ...data, category_id: data.category_id ? Number(data.category_id) : null }) });
      setStatus({ type: 'ok', text: result.message }); form.reset();
    } catch (error) { setStatus({ type: 'error', text: error.message }); }
    finally { setSending(false); }
  }
  return <form className="form-panel" onSubmit={submit}><h3>Tell us what you have in mind.</h3><div className="form-grid">
    <label className="form-field">Full name *<input name="full_name" required maxLength={120} placeholder="Your name"/></label>
    <label className="form-field">Email address *<input name="email" type="email" required maxLength={190} placeholder="you@example.com"/></label>
    <label className="form-field">Phone (optional)<input name="phone" type="tel" maxLength={35} placeholder="+250 ..."/></label>
    <label className="form-field">Service area<select name="category_id" defaultValue=""><option value="">General inquiry</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
    <label className="form-field full">Subject *<input name="subject" required maxLength={160} defaultValue={service ? `Inquiry about ${service}` : ''} placeholder="What can we help with?"/></label>
    <label className="form-field full">Your message *<textarea name="message" required minLength={10} maxLength={5000} rows={6} placeholder="Tell us about your plans, ideas or questions..."/></label>
    <label className="honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off"/></label>
  </div><p className="form-note">We'll use your details only to respond to your inquiry. Please don't include confidential information.</p>
    {status.text && <div role="status" className={`status-msg ${status.type === 'error' ? 'error' : ''}`}>{status.text}</div>}
    <div className="form-actions"><button className="btn btn-primary" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send inquiry'}<ArrowUpRight size={18}/></button></div>
  </form>;
}
