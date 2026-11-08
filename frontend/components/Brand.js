import Link from 'next/link';
export default function Brand({ inverse = false }) {
  return <Link href="/" aria-label="TRUVEXA home" className={`brand ${inverse ? 'brand-inverse' : ''}`}>
    <span className="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
    <span className="brand-word">TRUVEXA<small>SERVICES LTD</small></span>
  </Link>;
}
