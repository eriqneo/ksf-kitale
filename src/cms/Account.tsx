import React, { useState } from 'react';
import { KeyRound, Save } from 'lucide-react';
import { cmsPb, errorMessage } from './pb';
import { inputCls } from './fields';
import { Button, Card, PageHeader, useToast } from './ui';

const MIN_PASSWORD = 8;

/** Lets a staff member update their own name and password. */
export default function Account() {
  const me = cmsPb.authStore.record!;
  const toast = useToast();
  const [name, setName] = useState<string>(me.name ?? '');
  const [savingName, setSavingName] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const saveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingName(true);
    try {
      await cmsPb.collection('users').update(me.id, { name: name.trim() });
      await cmsPb.collection('users').authRefresh();
      toast('success', 'Name updated.');
    } catch (err) {
      toast('error', errorMessage(err));
    } finally {
      setSavingName(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < MIN_PASSWORD) return toast('error', `New password must be at least ${MIN_PASSWORD} characters.`);
    if (password !== passwordConfirm) return toast('error', 'The two new passwords do not match.');
    setSavingPassword(true);
    try {
      await cmsPb.collection('users').update(me.id, { oldPassword, password, passwordConfirm });
      // Changing the password ends existing sessions; sign straight back in with the new one.
      await cmsPb.collection('users').authWithPassword(me.email, password);
      setOldPassword(''); setPassword(''); setPasswordConfirm('');
      toast('success', 'Password changed.');
    } catch (err: any) {
      toast('error', err?.response?.data?.oldPassword ? 'Your current password is incorrect.' : errorMessage(err));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      <PageHeader title="My account" description={`Signed in as ${me.email} · ${me.role === 'admin' ? 'Admin' : 'Editor'}`} />
      <div className="space-y-6">
        <Card className="p-5 sm:p-7">
          <form onSubmit={saveName} className="flex flex-wrap items-end gap-3">
            <div className="min-w-0 flex-1 space-y-1.5">
              <label htmlFor="acc-name" className="block text-sm font-semibold text-slate-800">Your name</label>
              <input id="acc-name" className={inputCls} value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <Button type="submit" loading={savingName} disabled={name.trim() === (me.name ?? '')}><Save size={15} /> Save</Button>
          </form>
        </Card>

        <Card className="p-5 sm:p-7">
          <form onSubmit={savePassword} className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><KeyRound size={16} /> Change password</div>
            <input type="password" aria-label="Current password" placeholder="Current password" className={inputCls}
              value={oldPassword} onChange={e => setOldPassword(e.target.value)} required autoComplete="current-password" />
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="password" aria-label="New password" placeholder={`New password (${MIN_PASSWORD}+ characters)`} className={inputCls}
                value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" />
              <input type="password" aria-label="Confirm new password" placeholder="New password again" className={inputCls}
                value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required autoComplete="new-password" />
            </div>
            <Button type="submit" loading={savingPassword}>Change password</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
