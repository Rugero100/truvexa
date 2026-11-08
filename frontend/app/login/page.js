'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Brand from '../../components/Brand';
import { request } from '../../lib/client';
export default function LoginPage() {
  const router = useRouter(), [loading, setLoading] = useState(false), [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault(); setLoading(true); setError('');
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    try { await request('/auth/login', { method: 'POST', body: JSON.stringify(data) }); router.replace('/dashboard'); }
    catch (err) { setError(err.message); setLoading(false); }
  }
  return <div className="auth-page"><div className="auth-promo"><Brand inverse/><div><span className="kicker kicker-light">PRIVATE TEAM PORTAL</span><h1>Manage what matters, beautifully.</h1><p>A focused workspace for services, content, customer conversations and your team.</p></div><small>TRUVEXA SERVICES LTD · INTERNAL ACCESS</small></div>
    <div className="auth-form-wrap"><form className="auth-form" onSubmit={submit}><span className="kicker">WELCOME BACK</span><h2>Sign in to TRUVEXA.</h2><p className="admin-muted">Use the manager or staff account created by your administrator.</p>
      <label className="form-field">Email<input required type="email" name="email" placeholder="your.name@company.com" autoComplete="username"/></label>
      <label className="form-field">Password<input required type="password" name="password" placeholder="Your password" autoComplete="current-password"/></label>
      {error && <div className="status-msg error" role="alert">{error}</div>}
      <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}<ArrowRight size={18}/></button>
      <Link className="back-link" href="/"><ArrowLeft size={16}/> Back to website</Link>
    </form></div></div>;
}
