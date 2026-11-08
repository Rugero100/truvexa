import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getSite } from '../../lib/api';
export default async function SiteLayout({ children }) {
  const site = await getSite();
  return <><Header /><main>{children}</main><Footer settings={site.settings}/></>;
}
