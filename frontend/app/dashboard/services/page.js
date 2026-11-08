'use client';
import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { request } from '../../../lib/client';
import { useCurrentUser } from '../layout';
const blank = { category_id: '', title: '', summary: '', description: '', image_url: '', is_featured: false, is_active: true, display_order: 0 };
export default function ServicesAdmin() {
  const user = useCurrentUser(), [services, setServices] = useState([]), [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null), [form, setForm] = useState(blank), [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState(''), [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  const load = useCallback(async () => {
    try { const [s, c] = await Promise.all([request('/admin/services'), request('/admin/categories')]); setServices(s.services); setCategories(c.categories); }
    catch (err) { setMessage(err.message); }
  }, []);
  useEffect(() => { load(); }, [load]);
  function create() { setSelected(null); setForm({ ...blank, category_id: categories[0]?.id || '' }); setOpen(true); setMessage(''); }
  function edit(s) { setSelected(s.id); setForm({ ...s, is_active: Boolean(s.is_active), is_featured: Boolean(s.is_featured), image_url: s.image_url || '' }); setOpen(true); setMessage(''); }
  async function save(event) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      await request(selected ? `/admin/services/${selected}` : '/admin/services', { method: selected ? 'PATCH' : 'POST', body: JSON.stringify({ ...form, category_id: Number(form.category_id), display_order: Number(form.display_order) }) });
      setOpen(false); setMessage('Service saved.'); await load();
    } catch (err) { setMessage(err.message); } finally { setBusy(false); }
  }
  async function remove(id) {
    if (!window.confirm('Delete this service permanently?')) return;
    try { await request(`/admin/services/${id}`, { method: 'DELETE' }); setMessage('Service deleted.'); await load(); }
    catch (err) { setMessage(err.message); }
  }
  async function addCategory(event) {
    event.preventDefault();
    try { await request('/admin/categories', { method: 'POST', body: JSON.stringify({ name: categoryName }) }); setCategoryName(''); setMessage('Category added.'); await load(); }
    catch (err) { setMessage(err.message); }
  }
  return <><div className="admin-top"><div><span className="kicker">CONTENT MANAGEMENT</span><h1>Services & categories</h1><p>{user?.role === 'manager' ? 'Create, update and organize every offering.' : 'Manage your assigned service areas.'}</p></div><button className="small-btn" onClick={create}><Plus size={15}/> New service</button></div>
    {message && <div className={`status-msg ${/error|denied|not|failed|invalid|exists|cannot/i.test(message) ? 'error' : ''}`} role="status">{message}</div>}
    <div className="admin-panel"><h2>Services ({services.length})</h2><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Service</th><th>Category</th><th>Visibility</th><th>Actions</th></tr></thead><tbody>{services.map(s => <tr key={s.id}><td><strong>{s.title}</strong><div className="admin-muted">{s.summary}</div></td><td>{s.category_name}</td><td><span className="tag">{s.is_active ? 'Published' : 'Hidden'}{s.is_featured ? ' · Featured' : ''}</span></td><td><div className="admin-actions"><button className="small-btn light" onClick={() => edit(s)} aria-label={`Edit ${s.title}`}><Pencil size={14}/></button>{user?.role === 'manager' && <button className="small-btn danger" onClick={() => remove(s.id)} aria-label={`Delete ${s.title}`}><Trash2 size={14}/></button>}</div></td></tr>)}</tbody></table>{!services.length && <p>No services yet. Create one to get started.</p>}</div></div>
    {open && <form className="admin-editor" onSubmit={save}><div className="admin-top"><h3>{selected ? 'Edit service' : 'New service'}</h3><button type="button" className="small-btn light" onClick={() => setOpen(false)}><X size={15}/></button></div>
      <div className="admin-form"><label className="form-field">Title<input required maxLength={150} value={form.title} onChange={e => setForm({...form,title:e.target.value})}/></label><label className="form-field">Category<select required value={form.category_id} onChange={e => setForm({...form,category_id:e.target.value})}><option value="">Choose category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <label className="form-field full">Short summary<input required maxLength={400} value={form.summary} onChange={e => setForm({...form,summary:e.target.value})}/></label>
        <label className="form-field full">Detailed description<textarea required maxLength={20000} value={form.description} onChange={e => setForm({...form,description:e.target.value})} rows={5}/></label>
        <label className="form-field">Image URL (optional)<input type="url" placeholder="https://..." value={form.image_url} onChange={e => setForm({...form,image_url:e.target.value})}/></label>
        <label className="form-field">Display order<input type="number" value={form.display_order} onChange={e => setForm({...form,display_order:e.target.value})}/></label>
        <div className="admin-checkboxes full"><label><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form,is_active:e.target.checked})}/> Published</label><label><input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form,is_featured:e.target.checked})}/> Feature on homepage</label></div>
      </div><div className="form-actions"><button className="small-btn" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save service'}</button></div>
    </form>}
    {user?.role === 'manager' && <form className="admin-panel" onSubmit={addCategory}><h2>Add a service category</h2><p>Create another area of business. The category becomes available to services and staff assignments.</p><div className="admin-actions"><input className="field-input" style={{maxWidth:350}} placeholder="Category name" required maxLength={100} value={categoryName} onChange={e => setCategoryName(e.target.value)}/><button className="small-btn" type="submit">Add category</button></div></form>}
  </>;
}
