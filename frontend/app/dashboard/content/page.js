'use client';
import { useEffect, useState } from 'react';
import { request } from '../../../lib/client';
import { useCurrentUser } from '../layout';
const sectionLabels = { hero:'Homepage hero', about:'About section', process:'Our approach', contact:'Contact call-to-action' };
const settingLabels = { company_email:'Public email', company_phone:'Public phone', company_location:'Location / address', instagram_url:'Instagram link', linkedin_url:'LinkedIn link', facebook_url:'Facebook link' };
export default function ContentAdmin() {
  const user = useCurrentUser(), [sections, setSections] = useState([]), [settings, setSettings] = useState({});
  const [message, setMessage] = useState(''), [busy, setBusy] = useState(false);
  useEffect(() => {
    if (user?.role !== 'manager') return;
    Promise.all([request('/admin/sections'), request('/admin/settings')]).then(([a,b]) => {
      setSections(a.sections); setSettings(Object.fromEntries(b.settings.map(s => [s.setting_key, s.setting_value])));
    }).catch(err => setMessage(err.message));
  }, [user?.role]);
  if (user?.role !== 'manager') return <p>Only managers can edit site-wide content.</p>;
  function change(key, field, value) { setSections(previous => previous.map(s => s.section_key === key ? { ...s, [field]: value } : s)); }
  async function saveSection(section) {
    setBusy(true); setMessage('');
    try {
      await request(`/admin/sections/${section.section_key}`, { method:'PUT', body:JSON.stringify({
        eyebrow: section.eyebrow, title: section.title, subtitle: section.subtitle, body: section.body, cta_label: section.cta_label, cta_href: section.cta_href
      }) }); setMessage(`${sectionLabels[section.section_key] || 'Section'} saved.`);
    } catch (err) { setMessage(err.message); } finally { setBusy(false); }
  }
  async function saveSettings(event) {
    event.preventDefault(); setBusy(true); setMessage('');
    try { await request('/admin/settings', { method:'PUT',body:JSON.stringify(settings) }); setMessage('Contact information saved.'); }
    catch (err) { setMessage(err.message); } finally { setBusy(false); }
  }
  return <><div className="admin-top"><div><span className="kicker">WEBSITE EDITOR</span><h1>Site content</h1><p>Update the words and contact information displayed on the website.</p></div></div>
    {message && <div className="status-msg" role="status">{message}</div>}
    <div className="admin-notice">Your changes appear on the public site after saving and refreshing. For real visitors, replace all sample copy and add verified company contact details.</div>
    {sections.map(section => <form key={section.section_key} className="admin-panel" onSubmit={e => {e.preventDefault();saveSection(section);}}>
      <h2>{sectionLabels[section.section_key] || section.section_key}</h2><div className="admin-form">
        {['eyebrow','title','subtitle','body','cta_label','cta_href'].map(field => <label key={field} className={`form-field ${['body','subtitle'].includes(field) ? 'full' : ''}`}>{field.replace(/_/g,' ').toUpperCase()}
          {field === 'body' ? <textarea rows={4} maxLength={20000} value={section[field] || ''} onChange={e => change(section.section_key,field,e.target.value)}/> : <input required={field === 'title'} maxLength={field === 'title' ? 240 : field === 'subtitle' ? 400 : field === 'cta_href' ? 180 : 100} value={section[field] || ''} onChange={e => change(section.section_key,field,e.target.value)}/>}
        </label>)}
      </div><div className="form-actions"><button className="small-btn" type="submit" disabled={busy}>Save section</button></div>
    </form>)}
    <form className="admin-panel" onSubmit={saveSettings}><h2>Contact & social links</h2><p>These details appear in the public footer and contact page. Leave blank to hide a field.</p><div className="admin-form">{Object.entries(settingLabels).map(([key,label]) => <label className="form-field" key={key}>{label}<input type={key.endsWith('_url') ? 'url' : 'text'} maxLength={800} value={settings[key] || ''} onChange={e => setSettings({...settings,[key]:e.target.value})} placeholder={key.endsWith('_url') ? 'https://...' : ''}/></label>)}</div><div className="form-actions"><button className="small-btn" type="submit" disabled={busy}>Save contact information</button></div></form>
  </>;
}
