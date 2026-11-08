import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Asterisk, MoveUpRight, CheckCircle2 } from 'lucide-react';
import { getSite } from '../../lib/api';
import ServiceCard, { CategoryIcon } from '../../components/ServiceCard';
import HeroArtwork from '../../components/HeroArtwork';
export default async function Home() {
  const site = await getSite(), { hero, about, process, contact } = site.sections;
  return <>
    {site.demo && <div className="demo-strip">Preview content is shown until your API and MySQL database are connected.</div>}
    <section className="hero-section"><div className="container hero-grid">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"></span>{hero.eyebrow}</div><h1>{hero.title}</h1><p className="hero-lede">{hero.subtitle}</p><p className="hero-body">{hero.body}</p>
        <div className="hero-actions"><Link className="btn btn-primary" href={hero.cta_href || '/services'}>{hero.cta_label || 'Explore services'}<ArrowUpRight size={18}/></Link><Link className="text-link" href="/about">Discover TRUVEXA <ArrowRight size={17}/></Link></div>
        <div className="hero-signature"><Asterisk size={24}/><span>Built around possibilities.<br/>Driven by people.</span></div>
      </div><HeroArtwork/>
    </div></section>
    <div className="ticker"><div className="container ticker-inner"><span>REAL ESTATE</span><i></i><span>EVENTS & EXPERIENCES</span><i></i><span>TRAVEL & TOURISM</span><i></i><span>BUSINESS CONNECTIONS</span></div></div>
    <section className="section space-lg"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">01 / WHAT WE DO</span><h2>Different needs.<br/><em>One trusted direction.</em></h2></div><div><p>From significant moves to unforgettable moments, explore the areas where TRUVEXA can help you begin.</p><Link className="text-link" href="/services">View all services <ArrowUpRight size={17}/></Link></div></div>
      <div className="category-grid">{site.categories.map((category, i) => <Link href={`/services?category=${category.slug}`} className="category-tile" key={category.slug}><span className="tile-top"><span>0{i+1}</span><ArrowUpRight size={20}/></span><span className="tile-icon"><CategoryIcon name={category.name} size={34}/></span><h3>{category.name}</h3><p>{category.description}</p></Link>)}</div>
    </div></section>
    <section className="section featured-section"><div className="container"><div className="section-heading split-heading"><div><span className="kicker">02 / EXPLORE MORE</span><h2>Where possibility<br/><em>takes shape.</em></h2></div><p>Explore the services behind every conversation, experience and opportunity.</p></div>
      <div className="service-grid">{site.featuredServices.slice(0, 4).map((service, i) => <ServiceCard key={service.slug} service={service} number={i+1}/>)}</div>
      <div className="center-action"><Link className="btn btn-outline" href="/services">All services <ArrowUpRight size={17}/></Link></div>
    </div></section>
    <section className="about-band"><div className="container about-band-grid"><div className="about-decoration"><span className="oversized-t">T.</span><span className="circle-label">TRUVEXA · SERVICES LTD ·</span></div><div className="about-band-copy"><span className="kicker kicker-light">{about.eyebrow}</span><h2>{about.title}</h2><h3>{about.subtitle}</h3><p>{about.body}</p><Link className="btn btn-light" href={about.cta_href || '/about'}>{about.cta_label || 'Our story'}<ArrowUpRight size={18}/></Link></div></div></section>
    <section className="section space-lg"><div className="container"><div className="section-heading"><span className="kicker">03 / THE WAY WE WORK</span><h2>{process.title}</h2><p>{process.body}</p></div><div className="process-grid">{[['01','Understand','We start by listening closely to what you want to achieve.'],['02','Explore','We consider the right service and possibilities for you.'],['03','Move forward','We agree on next steps and keep the conversation clear.']].map(([n,t,d]) => <div className="process-step" key={n}><span>{n}</span><MoveUpRight size={24}/><h3>{t}</h3><p>{d}</p></div>)}</div></div></section>
    <section className="cta-section"><div className="container cta-inner"><div><span className="kicker kicker-light">{contact.eyebrow}</span><h2>{contact.title}</h2><p>{contact.subtitle}</p></div><Link className="btn btn-cream" href={contact.cta_href || '/contact'}>{contact.cta_label || 'Contact us'}<ArrowUpRight size={19}/></Link></div></section>
  </>;
}
