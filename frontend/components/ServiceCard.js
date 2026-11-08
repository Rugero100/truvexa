import Link from 'next/link';
import { ArrowUpRight, Building2, CalendarDays, Compass, Network } from 'lucide-react';
const icons = { 'Real Estate': Building2, 'Events & Experiences': CalendarDays, 'Travel & Tourism': Compass, 'Business Connections': Network };
export function CategoryIcon({ name, size = 26 }) { const Icon = icons[name] || Compass; return <Icon size={size} strokeWidth={1.5} />; }
export default function ServiceCard({ service, number }) {
  return <Link href={`/services/${service.slug}`} className="service-card">
    <div className="service-art">
      {service.image_url ? <img src={service.image_url} alt="" loading="lazy" /> : <div className="service-art-pattern"><span></span><span></span><span></span></div>}
      <span className="service-category"><CategoryIcon name={service.category_name} size={15}/>{service.category_name}</span>
    </div>
    <div className="service-card-body"><span className="card-count">0{number || service.id}</span><ArrowUpRight size={21} className="card-arrow"/><h3>{service.title}</h3><p>{service.summary}</p></div>
  </Link>;
}
