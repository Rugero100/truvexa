'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BriefcaseBusiness, Inbox, PanelsTopLeft, Users, LogOut, ExternalLink } from 'lucide-react';
import Brand from '../../components/Brand';
import { request } from '../../lib/client';
const UserContext = createContext(null);
export function useCurrentUser() { return useContext(UserContext); }
const nav = [
  { label: 'Overview', href: '/dashboard', Icon: LayoutDashboard },
  { label: 'Services', href: '/dashboard/services', Icon: BriefcaseBusiness },
  { label: 'Inquiries', href: '/dashboard/inquiries', Icon: Inbox },
  { label: 'Site content', href: '/dashboard/content', Icon: PanelsTopLeft, manager: true },
  { label: 'Team & access', href: '/dashboard/staff', Icon: Users, manager: true }
];
export default function DashboardLayout({ children }) {
  const router = useRouter(), pathname = usePathname();
  const [user, setUser] = useState(null), [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    request('/auth/me').then(data => { if (alive) { setUser(data.user); setLoading(false); } })
      .catch(() => { if (alive) router.replace('/login'); });
    return () => { alive = false; };
  }, [router]);
  async function logout() { try { await request('/auth/logout', { method: 'POST' }); } finally { router.replace('/login'); } }
  if (loading) return <div style={{padding:60}}>Loading your TRUVEXA workspace…</div>;
  return <UserContext.Provider value={user}><div className="admin-shell"><aside className="admin-sidebar"><Brand inverse/><nav className="admin-nav" aria-label="Dashboard">
    {nav.filter(link => !link.manager || user.role === 'manager').map(({label, href, Icon}) => <Link key={href} href={href} className={pathname === href ? 'active' : ''}><Icon size={17}/>{label}</Link>)}
    <Link href="/" target="_blank"><ExternalLink size={17}/>View website</Link>
  </nav><div className="admin-user"><strong>{user.full_name}</strong><span>{user.role === 'manager' ? 'Manager' : 'Staff'} · {user.email}</span><button onClick={logout}><LogOut size={16}/> Sign out</button></div></aside><main className="admin-main">{children}</main></div></UserContext.Provider>;
}
