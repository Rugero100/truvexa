import { demoSite, demoServices } from './content';
const base = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
export async function getSite() {
  try {
    const response = await fetch(`${base}/site`, { cache: 'no-store', signal: AbortSignal.timeout(2500) });
    if (!response.ok) throw new Error('API unavailable');
    return await response.json();
  } catch { return demoSite; }
}
export async function getServices(category = '') {
  try {
    const response = await fetch(`${base}/services${category ? `?category=${encodeURIComponent(category)}` : ''}`, { cache: 'no-store', signal: AbortSignal.timeout(2500) });
    if (!response.ok) throw new Error('API unavailable');
    return (await response.json()).services;
  } catch { return demoServices.filter(s => !category || s.category_slug === category); }
}
export async function getService(slug) {
  const services = await getServices();
  return services.find(service => service.slug === slug);
}
