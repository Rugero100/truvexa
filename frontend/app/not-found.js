import Link from 'next/link';
export default function NotFound() { return <div style={{padding:'15vh 8%',textAlign:'center'}}><h1 style={{font:'normal 64px Georgia'}}>Page not found.</h1><p>We couldn't find the page you were looking for.</p><Link className="btn btn-primary" href="/">Return home</Link></div>; }
