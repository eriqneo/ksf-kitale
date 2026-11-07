import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { cmsPb, errorMessage, sessionRole } from './pb';
import { inputCls } from './fields';
import { Button } from './ui';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const identity = email.trim();
    try {
      // Staff accounts first, then PocketBase superusers (site owners).
      try {
        await cmsPb.collection('users').authWithPassword(identity, password);
        if (!sessionRole()) {
          // Signed in, but not an active staff member (e.g. no role assigned yet).
          cmsPb.authStore.clear();
          setError('This account does not have CMS access. Ask a CMS admin to activate it.');
          return;
        }
      } catch (staffErr: any) {
        if (staffErr?.status !== 400) throw staffErr;
        await cmsPb.collection('_superusers').authWithPassword(identity, password);
      }
    } catch (err: any) {
      setError(err?.status === 400
        ? 'Incorrect email or password, or this account has been deactivated.'
        : errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-deep-navy p-4 font-body">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <img src="/KSF LOGO.jpg" alt="KSF Kitale" className="mx-auto mb-4 h-16 w-16 rounded-2xl object-cover shadow" />
          <h1 className="font-headlines text-2xl font-bold text-ksf-dark-text">Content Manager</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to manage the KSF Kitale website.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="cms-email" className="block text-sm font-semibold text-slate-800">Email</label>
            <input id="cms-email" type="email" autoComplete="username" required autoFocus className={inputCls}
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="cms-password" className="block text-sm font-semibold text-slate-800">Password</label>
            <input id="cms-password" type="password" autoComplete="current-password" required className={inputCls}
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-bold-red">{error}</p>}
          <Button type="submit" loading={loading} className="w-full py-2.5"><Lock size={15} /> Sign in</Button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-400">
          Forgot your password? Ask a CMS admin to reset it. <a href="/" className="text-sky-blue hover:underline">Back to website</a>
        </p>
      </div>
    </div>
  );
}
