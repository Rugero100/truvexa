import { Mail, MapPin, Phone } from 'lucide-react';
import { getSite } from '../../../lib/api';
import ContactForm from '../../../components/ContactForm';
export const metadata = { title: 'Contact us' };
export default async function ContactPage({ searchParams }) {
  const params = await searchParams, site = await getSite(), section = site.sections.contact;
  return <>
    <section className="page-hero"><div className="container"><span className="kicker">{section.eyebrow || 'CONTACT'}</span><h1>{section.title}</h1><p>{section.subtitle}</p></div></section>
    <div className="container contact-grid"><aside className="contact-aside"><span className="kicker">START THE CONVERSATION</span><h2>Good things begin with hello.</h2><p>{section.body}</p><div className="contact-info">
      {site.settings.company_email && <div><Mail size={18}/><a href={`mailto:${site.settings.company_email}`}>{site.settings.company_email}</a></div>}
      {site.settings.company_phone && <div><Phone size={18}/><a href={`tel:${site.settings.company_phone}`}>{site.settings.company_phone}</a></div>}
      {site.settings.company_location && <div><MapPin size={18}/>{site.settings.company_location}</div>}
      {!site.settings.company_email && !site.settings.company_phone && <p>Use the form to send your inquiry directly to our team.</p>}
    </div></aside><ContactForm categories={site.categories} service={typeof params.service === 'string' ? params.service : ''}/></div>
  </>;
}
