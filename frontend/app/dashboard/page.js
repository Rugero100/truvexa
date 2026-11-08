'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Inbox, BriefcaseBusiness, UsersRound, Layers } from 'lucide-react';
import { request } from '../../lib/client';
import { useCurrentUser } from './layout';
export default function DashboardHome() {
  const user = useCurrentUser(), [stats, setStats] = useState(null), [error, setError] = useState('');
  useEffect(() => { request('/admin/overview').then(data => setStats(data.stats)).catch(err => setError(err.message)); }, []);
  const cards = [
    ['Services', stats?.services, BriefcaseBusiness], ['All inquiries', stats?.inquiries, Inbox],
    ['New inquiries', stats?.new_inquiries, UsersRound], ['Service areas', stats?.categories, Layers]
  ];
  return <><div className="admin-top"><div><span className="kicker">DASHBOARD</span><h1>Welcome, {user?.full_name?.split(' ')[0] || 'team'}.</h1><p>Here is your TRUVEXA workspace at a glance.</p></div><span className="admin-badge">{user?.role}</span></div>
    {error && <div className="status-msg error">{error}</div>}
    <div className="stat-grid">{cards.map(([label, value, Icon]) => <div className="stat-card" key={label}><Icon size={24} color="#b28b5d"/><strong>{value ?? '—'}</strong><span className="stat-label">{label}</span></div>)}</div>
    <div className="admin-grid-2"><div className="admin-panel"><h2>Customer conversations</h2><p>Review new messages, update their progress and keep inquiries moving.</p><Link className="small-btn" href="/dashboard/inquiries">Manage inquiries <ArrowUpRight size={13}/></Link></div><div className="admin-panel"><h2>Your services</h2><p>Keep the public offerings accurate and helpful. {user?.role === 'staff' ? 'You can edit services in your assigned categories.' : 'You can manage every service area.'}</p><Link className="small-btn" href="/dashboard/services">Manage services <ArrowUpRight size={13}/></Link></div></div>
    {user?.role === 'manager' && <div className="admin-notice">Manager tip: Start with <Link href="/dashboard/content"><u>Site content</u></Link> to enter your real contact details, then set up staff accounts and category access.</div>}
  </>;
}
