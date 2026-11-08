'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import Brand from './Brand';
const links = [['About', '/about'], ['Services', '/services'], ['Contact', '/contact']];
export default function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="container nav-inner">
      <Brand />
      <button className="mobile-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? <X size={24} /> : <Menu size={24} />}</button>
      <nav className={`nav-links ${open ? 'nav-open' : ''}`} aria-label="Main navigation">
        {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
        <Link href="/contact" className="nav-cta" onClick={() => setOpen(false)}>Let's talk <ArrowUpRight size={16} /></Link>
      </nav>
    </div>
  </header>;
}
