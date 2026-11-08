import Link from 'next/link';
import { ArrowUpRight, Instagram, Linkedin, Facebook } from 'lucide-react';
import Brand from './Brand';
export default function Footer({ settings = {} }) {
  const social = [['instagram_url', Instagram, 'Instagram'], ['linkedin_url', Linkedin, 'LinkedIn'], ['facebook_url', Facebook, 'Facebook']];
  return <footer className="site-footer">
    <div className="container footer-main">
      <div><Brand inverse /><p>Considered connections.<br />Extraordinary possibilities.</p></div>
      <div className="footer-col"><span>Explore</span><Link href="/about">Our company</Link><Link href="/services">What we do</Link><Link href="/contact">Get in touch</Link></div>
      <div className="footer-col"><span>Connect</span>{settings.company_email && <a href={`mailto:${settings.company_email}`}>{settings.company_email}</a>}{settings.company_phone && <a href={`tel:${settings.company_phone}`}>{settings.company_phone}</a>}{settings.company_location && <p>{settings.company_location}</p>}<Link href="/contact">Send an inquiry <ArrowUpRight size={14} /></Link></div>
      <div className="footer-col"><span>Follow</span><div className="social-links">{social.filter(([key]) => settings[key]).map(([key, Icon, label]) => <a href={settings[key]} key={key} aria-label={label} target="_blank" rel="noreferrer"><Icon size={18}/></a>)}</div></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} TRUVEXA SERVICES LTD. All rights reserved.</span><Link href="/login">Team portal</Link></div>
  </footer>;
}
