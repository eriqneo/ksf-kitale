import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { ExternalLink, LayoutDashboard, Loader2, LogOut, Menu, ShieldCheck, UserCircle, X } from 'lucide-react';
import { canManageTeam, cmsPb, displayName, errorMessage, sessionRole, type Collection, type Role } from './pb';
import { GROUPS, getConfig } from './config';
import Login from './Login';
import Dashboard from './Dashboard';
import RecordList from './RecordList';
import RecordEditor from './RecordEditor';
import { TeamList, TeamMemberEditor } from './Team';
import Account from './Account';
import schemaSnapshot from './schema.json';
import { ToastProvider } from './ui';

export const BASE = '/cms-admin';

type CmsContextType = {
  role: Role;
  collections: Collection[];
  /** The live `users` collection (owners only) — used to check the team setup has been applied. */
  usersCollection?: Collection;
  getCollection: (name: string) => Collection | undefined;
  unread: number;
  refreshUnread: () => void;
};

const CmsContext = createContext<CmsContextType | null>(null);
export const useCms = () => {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error('useCms must be used inside the CMS');
  return ctx;
};

function useAuth() {
  const [role, setRole] = useState<Role | null>(sessionRole);
  const [checking, setChecking] = useState(role !== null);

  useEffect(() => cmsPb.authStore.onChange(() => setRole(sessionRole())), []);

  // Any 401 from the API means the session expired or was revoked: sign out.
  useEffect(() => {
    cmsPb.afterSend = (response, data) => {
      if (response.status === 401 && cmsPb.authStore.token) cmsPb.authStore.clear();
      return data;
    };
  }, []);

  // Validate a remembered session once on load.
  useEffect(() => {
    if (!checking) return;
    // Refreshing also re-checks the account is still active (authRule) and picks up role changes.
    const collection = cmsPb.authStore.record?.collectionName ?? '_superusers';
    cmsPb.collection(collection).authRefresh()
      .then(() => { if (!sessionRole()) cmsPb.authStore.clear(); })
      .catch(() => cmsPb.authStore.clear())
      .finally(() => setChecking(false));
  }, [checking]);

  return { role, checking };
}

export default function CmsApp() {
  const { role, checking } = useAuth();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'KSF CMS';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => { document.title = prevTitle; robots.remove(); };
  }, []);

  if (checking) return <FullScreenSpinner />;
  return (
    <ToastProvider>
      {role ? <AuthedCms key={`${role}:${cmsPb.authStore.record?.id}`} role={role} /> : <Login />}
    </ToastProvider>
  );
}

function FullScreenSpinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center gap-3 bg-slate-100 font-body text-slate-500">
      <Loader2 className="animate-spin" size={20} /> {label}
    </div>
  );
}

function AuthedCms({ role }: { role: Role }) {
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [usersCollection, setUsersCollection] = useState<Collection | undefined>();
  const [loadError, setLoadError] = useState('');
  const [unread, setUnread] = useState(0);

  const load = useCallback(() => {
    setLoadError('');
    if (role !== 'owner') {
      // Staff can't read the live schema; use the snapshot from scripts/export-cms-schema.mjs.
      setCollections(schemaSnapshot as unknown as Collection[]);
      return;
    }
    cmsPb.collections.getFullList({ sort: 'name' })
      .then(list => {
        setUsersCollection(list.find(c => c.name === 'users') as Collection | undefined);
        setCollections(list.filter(c => !c.system && !c.name.startsWith('_') && c.type === 'base') as Collection[]);
      })
      .catch(err => setLoadError(errorMessage(err)));
  }, [role]);
  useEffect(load, [load]);

  const refreshUnread = useCallback(() => {
    cmsPb.collection('contact_messages').getList(1, 1, { filter: 'is_read = false', fields: 'id' })
      .then(r => setUnread(r.totalItems))
      .catch(() => setUnread(0));
  }, []);
  useEffect(refreshUnread, [refreshUnread]);

  const value = useMemo<CmsContextType | null>(() => collections && ({
    role,
    collections,
    usersCollection,
    getCollection: name => collections.find(c => c.name === name),
    unread,
    refreshUnread,
  }), [role, collections, usersCollection, unread, refreshUnread]);

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 p-6 text-center font-body">
        <p className="max-w-md text-slate-700">Could not load the content structure: {loadError}</p>
        <button onClick={load} className="rounded-lg bg-primary-blue px-4 py-2 text-sm font-semibold text-white">Try again</button>
      </div>
    );
  }
  if (!value) return <FullScreenSpinner label="Loading content…" />;

  return (
    <CmsContext.Provider value={value}>
      <Shell>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="c/:collection" element={<RecordList />} />
          <Route path="c/:collection/new" element={<RecordEditor />} />
          <Route path="c/:collection/:id" element={<RecordEditor />} />
          {canManageTeam(role) && <Route path="team" element={<TeamList />} />}
          {canManageTeam(role) && <Route path="team/new" element={<TeamMemberEditor />} />}
          {canManageTeam(role) && <Route path="team/:id" element={<TeamMemberEditor />} />}
          {role !== 'owner' && <Route path="account" element={<Account />} />}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Shell>
    </CmsContext.Provider>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const { collections, unread, role } = useCms();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);

  const me = cmsPb.authStore.record;
  const roleLabel = { owner: 'Owner', admin: 'Admin', editor: 'Editor' }[role];
  const grouped = GROUPS.map(g => ({
    group: g,
    items: collections.map(c => ({ c, cfg: getConfig(c) })).filter(x => x.cfg.group === g),
  })).filter(g => g.items.length);

  const navCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-white/10 text-white' : 'text-white/65 hover:bg-white/5 hover:text-white'}`;

  const sidebar = (
    <nav className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <img src="/KSF LOGO.jpg" alt="" className="h-9 w-9 rounded-lg object-cover" />
        <div className="leading-tight">
          <div className="font-headlines text-base font-bold text-white">KSF Kitale</div>
          <div className="font-accent text-[10px] font-bold uppercase tracking-[3px] text-sky-300">Content Manager</div>
        </div>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        <NavLink to={BASE} end className={navCls}><LayoutDashboard size={17} /> Overview</NavLink>
        {grouped.map(({ group, items }) => (
          <div key={group}>
            <div className="px-3 pb-2 font-accent text-[10px] font-bold uppercase tracking-[2.5px] text-white/35">{group}</div>
            <div className="space-y-0.5">
              {items.map(({ c, cfg }) => {
                const Icon = cfg.icon;
                return (
                  <NavLink key={c.name} to={`${BASE}/c/${c.name}`} className={navCls}>
                    <Icon size={17} />
                    <span className="flex-1 truncate">{cfg.label}</span>
                    {cfg.inbox && unread > 0 && (
                      <span className="rounded-full bg-bold-red px-2 py-0.5 text-[11px] font-bold text-white">{unread}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
        {canManageTeam(role) && (
          <div>
            <div className="px-3 pb-2 font-accent text-[10px] font-bold uppercase tracking-[2.5px] text-white/35">Administration</div>
            <NavLink to={`${BASE}/team`} className={navCls}><ShieldCheck size={17} /> Team &amp; Access</NavLink>
          </div>
        )}
      </div>
      <div className="border-t border-white/10 p-3">
        <a href="/" target="_blank" rel="noreferrer" className={navCls({ isActive: false })}>
          <ExternalLink size={17} /> View website
        </a>
        {role !== 'owner' && (
          <NavLink to={`${BASE}/account`} className={navCls}><UserCircle size={17} /> My account</NavLink>
        )}
        <div className="mt-2 flex items-center gap-2 px-3 py-2">
          <div className="min-w-0 flex-1 leading-tight" title={me?.email}>
            <div className="truncate text-xs font-semibold text-white/80">{displayName(me)}</div>
            <div className="text-[11px] text-white/45">{roleLabel}</div>
          </div>
          <button onClick={() => cmsPb.authStore.clear()} title="Sign out" aria-label="Sign out"
            className="rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white"><LogOut size={16} /></button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-100 font-body text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-deep-navy lg:block">{sidebar}</aside>

      {/* Mobile top bar + drawer */}
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-md p-1.5 text-slate-700 hover:bg-slate-100"><Menu size={22} /></button>
        <span className="font-headlines font-bold text-primary-blue">KSF Content Manager</span>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-72 max-w-[85vw] bg-deep-navy">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-3 top-5 rounded-md p-1 text-white/70 hover:text-white"><X size={20} /></button>
            {sidebar}
          </aside>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
