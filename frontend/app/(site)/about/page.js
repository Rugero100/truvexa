import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getSite } from '../../../lib/api';
export const metadata = { title: 'About us' };
export default async function AboutPage() {
  const site = await getSite(), section = site.sections.about;
  return <>
    <section className="page-hero"><div className="container"><span className="kicker">{section.eyebrow || 'ABOUT TRUVEXA'}</span><h1>{section.title}</h1><p>{section.subtitle}</p></div></section>
    <section className="page-content"><div className="container"><div className="prose-block"><span className="kicker">OUR PERSPECTIVE</span><h2 style={{font:'normal 40px Georgia'}}>A thoughtful way forward.</h2><p>{section.body}</p><p>Our service areas span property, events, travel and business connections. Whether you are discovering an opportunity or planning your next step, the process begins by understanding what matters to you.</p></div>
      <div className="value-grid"><div className="value-card"><span className="kicker">01</span><h3>Clarity</h3><p>Simple, transparent communication and a clear sense of the next step.</p></div><div className="value-card"><span className="kicker">02</span><h3>Care</h3><p>Attention to the people and priorities behind every inquiry.</p></div><div className="value-card"><span className="kicker">03</span><h3>Possibility</h3><p>An open mind about connections, experiences and opportunities.</p></div></div>
      <div style={{marginTop:55}}><Link href="/contact" className="btn btn-primary">Begin a conversation <ArrowUpRight size={18}/></Link></div>
    </div></section>
  </>;
}
