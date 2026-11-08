'use client';
import { useCallback, useEffect, useState } from 'react';
import { request } from '../../../lib/client';
import { useCurrentUser } from '../layout';
const statusLabels = { new: 'New', in_progress: 'In progress', resolved: 'Resolved' };
export default function InquiriesAdmin() {
  const user = useCurrentUser(), [inquiries, setInquiries] = useState([]), [staff, setStaff] = useState([]);
  const [selected, setSelected] = useState(''), [message, setMessage] = useState(''), [filter, setFilter] = useState('all');
  const load = useCallback(async () => {
    try {
      const [data, team] = await Promise.all([request('/admin/inquiries'), user?.role === 'manager' ? request('/admin/staff') : Promise.resolve({staff:[]})]);
      setInquiries(data.inquiries); setStaff(team.staff);
    } catch (err) { setMessage(err.message); }
  }, [user?.role]);
  useEffect(() => { load(); }, [load]);
  async function update(inquiry, patch) {
    try {
      await request(`/admin/inquiries/${inquiry.id}`, { method: 'PATCH', body: JSON.stringify({ status: inquiry.status, ...patch }) });
      setMessage('Inquiry updated.'); await load();
    } catch (err) { setMessage(err.message); }
  }
  const visible = inquiries.filter(i => filter === 'all' || i.status === filter);
  const detail = inquiries.find(i => i.id === Number(selected));
  return <><div className="admin-top"><div><span className="kicker">CUSTOMER RELATIONSHIPS</span><h1>Inquiries</h1><p>Read, assign and track incoming conversations.</p></div><span className="admin-badge">{inquiries.length} messages</span></div>
    {message && <div className="status-msg" role="status">{message}</div>}
    <div className="filters">{['all','new','in_progress','resolved'].map(s => <button key={s} className={`filter-pill ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s === 'all' ? 'All' : statusLabels[s]}</button>)}</div>
    <div className="admin-panel admin-table-wrap"><table className="admin-table"><thead><tr><th>Received</th><th>From</th><th>Subject</th><th>Area</th><th>Status</th><th></th></tr></thead><tbody>{visible.map(i => <tr key={i.id}><td>{new Date(i.created_at).toLocaleDateString()}</td><td><strong>{i.full_name}</strong><br/>{i.email}</td><td>{i.subject}</td><td>{i.category_name || 'General'}</td><td><span className={`tag ${i.status}`}>{statusLabels[i.status]}</span></td><td><button className="small-btn light" onClick={() => setSelected(selected === String(i.id) ? '' : String(i.id))}>View</button></td></tr>)}</tbody></table>{!visible.length && <p>No inquiries in this view.</p>}</div>
    {detail && <div className="admin-editor"><h3>{detail.subject}</h3><p><strong>{detail.full_name}</strong> · <a href={`mailto:${detail.email}`}>{detail.email}</a> {detail.phone && `· ${detail.phone}`}</p><p className="admin-muted">Received {new Date(detail.created_at).toLocaleString()} · {detail.category_name || 'General inquiry'}</p><div style={{whiteSpace:'pre-wrap',lineHeight:1.8,padding:'20px 0'}}>{detail.message}</div>
      <div className="admin-form"><label className="form-field">Status<select value={detail.status} onChange={e => update(detail,{status:e.target.value})}>{Object.entries(statusLabels).map(([v,label]) => <option key={v} value={v}>{label}</option>)}</select></label>
        {user?.role === 'manager' && <label className="form-field">Assigned staff<select value={detail.assigned_to || ''} onChange={e => update(detail,{assigned_to:e.target.value ? Number(e.target.value) : null})}><option value="">Unassigned</option>{staff.filter(s => s.is_active && (!detail.category_id || s.category_ids.includes(detail.category_id))).map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}</select></label>}
      </div><div className="form-actions"><button className="small-btn light" onClick={() => setSelected('')}>Close details</button></div>
    </div>}
  </>;
}
