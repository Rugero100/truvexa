'use client';
import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, X } from 'lucide-react';
import { request } from '../../../lib/client';
import { useCurrentUser } from '../layout';
const blank = { full_name:'', email:'', password:'', category_ids:[], is_active:true };
export default function TeamAdmin() {
  const user = useCurrentUser(), [staff,setStaff] = useState([]), [categories,setCategories] = useState([]);
  const [form,setForm] = useState(blank), [editId,setEditId] = useState(null), [open,setOpen] = useState(false), [busy,setBusy] = useState(false), [message,setMessage] = useState('');
  const load = useCallback(async () => {
    try { const [s,c] = await Promise.all([request('/admin/staff'),request('/admin/categories')]); setStaff(s.staff);setCategories(c.categories); }
    catch(err) { setMessage(err.message); }
  },[]);
  useEffect(() => { if (user?.role === 'manager') load(); },[load,user?.role]);
  if(user?.role !== 'manager') return <p>Only managers can manage staff.</p>;
  function create(){setForm(blank);setEditId(null);setOpen(true);setMessage('');}
  function edit(s){setForm({full_name:s.full_name,email:s.email,password:'',category_ids:s.category_ids,is_active:s.is_active});setEditId(s.id);setOpen(true);setMessage('');}
  function toggle(id){setForm(f => ({...f,category_ids:f.category_ids.includes(id)?f.category_ids.filter(v=>v!==id):[...f.category_ids,id]}));}
  async function save(e){
    e.preventDefault();setBusy(true);setMessage('');
    try {await request(editId?`/admin/staff/${editId}`:'/admin/staff',{method:editId?'PATCH':'POST',body:JSON.stringify(form)});setOpen(false);setMessage('Staff account saved.');await load();}
    catch(err){setMessage(err.message);}finally{setBusy(false);}
  }
  return <><div className="admin-top"><div><span className="kicker">PEOPLE & PERMISSIONS</span><h1>Team & access</h1><p>Create staff accounts and assign exactly the categories they can manage.</p></div><button className="small-btn" onClick={create}><Plus size={15}/> Add staff</button></div>
    <div className="admin-notice">New passwords are set here, not emailed. Share credentials with staff through a secure channel and change them if exposed.</div>
    {message && <div className="status-msg" role="status">{message}</div>}
    <div className="admin-panel admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Categories</th><th>Status</th><th></th></tr></thead><tbody>{staff.map(s=><tr key={s.id}><td><strong>{s.full_name}</strong></td><td>{s.email}</td><td>{s.category_ids.map(id=>categories.find(c=>c.id===id)?.name).filter(Boolean).join(', ')||'None assigned'}</td><td><span className="tag">{s.is_active?'Active':'Disabled'}</span></td><td><button className="small-btn light" onClick={()=>edit(s)}><Pencil size={14}/> Edit</button></td></tr>)}</tbody></table>{!staff.length&&<p>No staff accounts created yet.</p>}</div>
    {open&&<form className="admin-editor" onSubmit={save}><div className="admin-top"><h3>{editId?'Edit staff member':'New staff member'}</h3><button className="small-btn light" type="button" onClick={()=>setOpen(false)}><X size={15}/></button></div>
      <div className="admin-form"><label className="form-field">Full name<input required maxLength={120} value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})}/></label>
        <label className="form-field">Email<input type="email" required disabled={Boolean(editId)} maxLength={190} value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
        <label className="form-field full">{editId?'New password (leave blank to keep current)':'Temporary password (12+ characters)'}<input type="password" minLength={12} maxLength={128} required={!editId} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} autoComplete="new-password"/></label>
        <div className="full"><strong style={{fontSize:13}}>Assigned service areas</strong><div className="admin-checkboxes" style={{marginTop:15}}>{categories.map(c=><label key={c.id}><input type="checkbox" checked={form.category_ids.includes(c.id)} onChange={()=>toggle(c.id)}/>{c.name}</label>)}</div></div>
        {editId&&<div className="admin-checkboxes full"><label><input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form,is_active:e.target.checked})}/> Account active</label></div>}
      </div><div className="form-actions"><button className="small-btn" disabled={busy}>{busy?'Saving…':'Save staff account'}</button></div>
    </form>}
  </>;
}
