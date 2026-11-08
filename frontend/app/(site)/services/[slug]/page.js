import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getService } from '../../../../lib/api';
import { CategoryIcon } from '../../../../components/ServiceCard';
export async function generateMetadata({ params }) {
  const { slug } = await params, service = await getService(slug);
  return { title: service?.title || 'Service', description: service?.summary || '' };
}
export default async function ServiceDetail({ params }) {
  const { slug } = await params, service = await getService(slug);
  if (!service) notFound();
  return <>
    <section className="page-hero"><div className="container"><Link className="text-link" href="/services"><ArrowLeft size={17}/> All services</Link><div style={{marginTop:40}} className="kicker">{service.category_name}</div><h1>{service.title}</h1><p>{service.summary}</p></div></section>
    <section className="page-content"><div className="container detail-grid"><div><span className="kicker">THE SERVICE</span><h2>Let's make it happen.</h2><p>{service.description}</p><p>Tell us more about your specific needs, and our team will review how we can help.</p><Link className="btn btn-primary" href={`/contact?service=${encodeURIComponent(service.title)}`}>Inquire about this service <ArrowUpRight size={18}/></Link></div><div className="detail-visual">{service.image_url ? <img src={service.image_url} alt="" /> : <CategoryIcon name={service.category_name} size={160}/>}</div></div></section>
  </>;
}
