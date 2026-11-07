import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, KeyRound, Loader2, Save, Trash2, UserPlus } from 'lucide-react';
import { cmsPb, displayName, errorMessage, fileUrl, type Rec } from './pb';
import { BASE, useCms } from './CmsApp';
import { inputCls, Toggle } from './fields';
import { Button, Card, PageHeader, useToast } from './ui';

const ROLES = [
  { value: 'editor', label: 'Editor', help: 'Can edit all website content and read messages.' },
  { value: 'admin', label: 'Admin', help: 'Everything an editor can do, plus add and remove team members.' },
] as const;

const MIN_PASSWORD = 8;

/** Owners see a warning until scripts/setup-cms-users.mjs --apply has been run. */
function SetupNotice() {
  const { role, usersCollection } = useCms();
  if (role !== 'owner' || usersCollection?.fields.some(f => f.name === 'role')) return null;
  return (
    <div className="mb-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      <div>
        <p className="font-semibold">Team accounts aren't set up on the database yet.</p>
        <p className="mt-1">Run <code className="rounded bg-amber-100 px-1.5 py-0.5">node scripts/setup-cms-users.mjs --apply</code> once,
          then reload this page. Until then, staff accounts can't sign in or edit content.</p>
      </div>
    </div>
  );
}

function Avatar({ user, size = 40 }: { user: Rec; size?: number }) {
  const initials = displayName(user).split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return user.avatar ? (
    <img src={fileUrl(user, user.avatar)} alt="" style={{ width: size, height: size }} className="shrink-0 rounded-full object-cover" />
  ) : (
    <span style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-primary-blue/10 text-sm font-bold text-primary-blue">{initials || '?'}</span>
  );
}

export function TeamList() {
  const [users, setUsers] = useState<Rec[] | null>(null);
  const [error, setError] = useState('');
  const meId = cmsPb.authStore.record?.id;

  const load = () => {
    setError('');
    cmsPb.collection('users').getFullList<Rec>({ sort: '-active,name,email' })
      .then(setUsers)
      .catch(err => setError(errorMessage(err)));
  };
  useEffect(load, []);

  return (
    <>
      <PageHeader title="Team & Access"
        description="People who can sign in to this content manager. Deactivate someone to remove their access immediately without deleting their account."
        actions={<Link to={`${BASE}/team/new`}><Button><UserPlus size={16} /> Add team member</Button></Link>} />
      <SetupNotice />
      <Card>
        {error ? (
          <div className="p-8 text-center text-sm text-slate-600">
            <p className="mb-3">{error}</p>
            <Button variant="secondary" onClick={load}>Try again</Button>
          </div>
        ) : !users ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm text-slate-500"><Loader2 size={18} className="animate-spin" /> Loading…</div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">No team members yet. Add the first one to give someone access.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {users.map(u => (
              <li key={u.id}>
                <Link to={`${BASE}/team/${u.id}`} className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 ${u.active ? '' : 'opacity-60'}`}>
                  <Avatar user={u} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {u.name || displayName(u)} {u.id === meId && <span className="font-normal text-slate-400">(you)</span>}
                    </div>
                    <div className="truncate text-xs text-slate-500">{u.email}</div>
                  </div>
                  {!u.active && <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[11px] font-bold uppercase text-slate-600">Inactive</span>}
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${u.role === 'admin' ? 'bg-primary-blue text-white' : 'bg-sky-blue/10 text-sky-blue'}`}>
                    {u.role || 'No role'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

export function TeamMemberEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const toast = useToast();
  const meId = cmsPb.authStore.record?.id;
  const isSelf = !!id && id === meId;

  const [user, setUser] = useState<Rec | null>(null);
  const [loadError, setLoadError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'editor' | 'admin'>('editor');
  const [active, setActive] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isNew) return;
    cmsPb.collection('users').getOne<Rec>(id!)
      .then(u => {
        setUser(u);
        setName(u.name ?? '');
        setEmail(u.email ?? '');
        setRole(u.role === 'admin' ? 'admin' : 'editor');
        setActive(!!u.active);
      })
      .catch(err => setLoadError(errorMessage(err)));
  }, [id, isNew]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((isNew || password) && password.length < MIN_PASSWORD) {
      toast('error', `Password must be at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (password !== passwordConfirm) {
      toast('error', 'The two passwords do not match.');
      return;
    }
    const data: Record<string, any> = { name: name.trim(), email: email.trim(), emailVisibility: true };
    if (!isSelf) { data.role = role; data.active = active; }
    if (isNew) data.verified = true; // created by an admin, so no email verification step
    if (password) { data.password = password; data.passwordConfirm = passwordConfirm; }
    if (avatar) data.avatar = avatar;

    setSaving(true);
    try {
      if (isNew) {
        await cmsPb.collection('users').create(data);
        toast('success', `${data.name || data.email} can now sign in at /cms-admin.`);
      } else {
        await cmsPb.collection('users').update(id!, data);
        toast('success', password ? 'Saved. Their password has been changed.' : 'Changes saved.');
        if (isSelf && password) {
          // Changing your own password ends the current session; sign straight back in.
          await cmsPb.collection('users').authWithPassword(data.email, password);
        }
      }
      navigate(`${BASE}/team`);
    } catch (err) {
      toast('error', `Could not save: ${errorMessage(err)}`);
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!user || !window.confirm(`Delete ${user.name || user.email}'s account? They will no longer be able to sign in. This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await cmsPb.collection('users').delete(user.id);
      toast('success', 'Team member removed.');
      navigate(`${BASE}/team`, { replace: true });
    } catch (err) {
      toast('error', `Could not delete: ${errorMessage(err)}`);
      setDeleting(false);
    }
  };

  if (loadError) {
    return (
      <Card className="p-8 text-center text-sm text-slate-600">
        <p className="mb-4">{loadError}</p>
        <Link to={`${BASE}/team`}><Button variant="secondary">Back to team</Button></Link>
      </Card>
    );
  }
  if (!isNew && !user) {
    return <div className="flex items-center justify-center gap-2 p-16 text-sm text-slate-500"><Loader2 size={18} className="animate-spin" /> Loading…</div>;
  }

  return (
    <form onSubmit={save} className="pb-24">
      <PageHeader
        back={<Link to={`${BASE}/team`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary-blue"><ArrowLeft size={15} /> Team &amp; Access</Link>}
        title={isNew ? 'Add team member' : (user!.name || user!.email)}
        description={isNew
          ? 'They sign in at /cms-admin with this email and password. Share the password with them privately (in person or by phone), and ask them to change it from "My account".'
          : isSelf ? 'This is your own account. Another admin has to change your role or deactivate you.' : undefined}
      />
      <SetupNotice />

      <Card className="space-y-6 p-5 sm:p-7">
        <div className="flex items-center gap-4">
          {user ? <Avatar user={user} size={56} /> : null}
          <label className="text-sm font-semibold text-sky-blue hover:underline cursor-pointer">
            {avatar ? `Photo selected: ${avatar.name}` : user?.avatar ? 'Change photo' : 'Add a photo (optional)'}
            <input type="file" accept="image/*" className="sr-only" onChange={e => setAvatar(e.target.files?.[0] ?? null)} />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="tm-name" className="block text-sm font-semibold text-slate-800">Full name</label>
            <input id="tm-name" className={inputCls} value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="tm-email" className="block text-sm font-semibold text-slate-800">Email</label>
            <input id="tm-email" type="email" className={inputCls} value={email} onChange={e => setEmail(e.target.value)} required autoComplete="off" />
          </div>
        </div>

        <fieldset disabled={isSelf} className="space-y-3 disabled:opacity-60">
          <legend className="mb-2 text-sm font-semibold text-slate-800">Role</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {ROLES.map(r => (
              <label key={r.value}
                className={`cursor-pointer rounded-xl border-2 p-4 transition ${role === r.value ? 'border-primary-blue bg-primary-blue/5' : 'border-slate-200 hover:border-slate-300'}`}>
                <input type="radio" name="role" value={r.value} checked={role === r.value} onChange={() => setRole(r.value)} className="sr-only" />
                <div className="font-semibold text-slate-900">{r.label}</div>
                <div className="mt-0.5 text-xs text-slate-500">{r.help}</div>
              </label>
            ))}
          </div>
          <div className="pt-2">
            <Toggle label={active ? 'Active: can sign in' : 'Inactive: cannot sign in'} checked={active} onChange={setActive} />
          </div>
        </fieldset>

        <div className="space-y-3 border-t border-slate-200 pt-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <KeyRound size={16} /> {isNew ? 'Password' : 'Set a new password'}
          </div>
          {!isNew && <p className="text-xs text-slate-500">Leave blank to keep their current password.</p>}
          <div className="grid gap-5 sm:grid-cols-2">
            <input type="password" aria-label="New password" placeholder={`At least ${MIN_PASSWORD} characters`} className={inputCls}
              value={password} onChange={e => setPassword(e.target.value)} required={isNew} autoComplete="new-password" />
            <input type="password" aria-label="Confirm new password" placeholder="Type it again" className={inputCls}
              value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required={isNew || !!password} autoComplete="new-password" />
          </div>
        </div>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {user && !isSelf && (
            <Button type="button" variant="danger" onClick={remove} loading={deleting}><Trash2 size={15} /> Delete</Button>
          )}
          <Button type="submit" loading={saving} className="ml-auto">
            {isNew ? <><UserPlus size={15} /> Add team member</> : <><Save size={15} /> Save changes</>}
          </Button>
        </div>
      </div>
    </form>
  );
}
