import Link from 'next/link';
import { getServices, getSite } from '../../../lib/api';
import ServiceCard from '../../../components/ServiceCard';
export const metadata = { title: 'Our services' };
export default async function ServicesPage({ searchParams }) {
  const params = await searchParams, selected = typeof params.category === 'string' ? params.category : '';
  const [services, site] = await Promise.all([getServices(selected), getSite()]);
  return <>
    <section className="page-hero"><div className="container"><span className="kicker">WHAT WE OFFER</span><h1>Services for every<br/>kind of possibility.</h1><p>Discover the ways we can start a conversation about what matters to you.</p></div></section>
    <section className="page-content"><div className="container"><div className="filters"><Link className={`filter-pill ${!selected ? 'active' : ''}`} href="/services">All services</Link>{site.categories.map(c => <Link key={c.slug} className={`filter-pill ${selected === c.slug ? 'active' : ''}`} href={`/services?category=${c.slug}`}>{c.name}</Link>)}</div>
      {services.length ? <div className="service-grid services-page-grid">{services.map((s, i) => <ServiceCard key={s.slug} service={s} number={i + 1}/>)}</div> : <p>No services in this category yet. Please explore another category.</p>}
    </div></section>
  </>;
}
