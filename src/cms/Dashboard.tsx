import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info, Inbox } from 'lucide-react';
import { cmsPb, displayName } from './pb';
import { GROUPS, getConfig } from './config';
import { BASE, useCms } from './CmsApp';
import { Card, PageHeader } from './ui';

export default function Dashboard() {
  const { collections, unread } = useCms();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let alive = true;
    Promise.all(collections.map(c =>
      cmsPb.collection(c.name).getList(1, 1, { fields: 'id' })
        .then(r => [c.name, r.totalItems] as const)
        .catch(() => [c.name, -1] as const),
    )).then(entries => alive && setCounts(Object.fromEntries(entries)));
    return () => { alive = false; };
  }, [collections]);

  const name = displayName(cmsPb.authStore.record);

  return (
    <>
      <PageHeader title={`Welcome${name ? `, ${name}` : ''}`}
        description="Choose what you'd like to update. Changes are live as soon as you save — visitors see them the next time they load a page." />

      {unread > 0 && (
        <Link to={`${BASE}/c/contact_messages`}
          className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 hover:bg-amber-100">
          <Inbox size={20} />
          <span className="flex-1 text-sm font-semibold">You have {unread} unread message{unread === 1 ? '' : 's'} from the contact form.</span>
          <ArrowRight size={18} />
        </Link>
      )}

      <div className="space-y-8">
        {GROUPS.map(group => {
          const items = collections.map(c => ({ c, cfg: getConfig(c) })).filter(x => x.cfg.group === group);
          if (!items.length) return null;
          return (
            <section key={group}>
              <h2 className="mb-3 font-accent text-xs font-bold uppercase tracking-[2.5px] text-slate-500">{group}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map(({ c, cfg }) => {
                  const Icon = cfg.icon;
                  const n = counts[c.name];
                  return (
                    <Link key={c.name} to={`${BASE}/c/${c.name}`} className="group">
                      <Card className="h-full p-5 transition group-hover:border-sky-blue/40 group-hover:shadow-md">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="rounded-xl bg-primary-blue/8 p-2.5 text-primary-blue"><Icon size={20} /></span>
                          {!cfg.singleton && n !== undefined && n >= 0 && (
                            <span className="text-xs font-semibold text-slate-400">{n} item{n === 1 ? '' : 's'}</span>
                          )}
                        </div>
                        <div className="font-semibold text-slate-900 group-hover:text-primary-blue">{cfg.label}</div>
                        {cfg.description && <p className="mt-1 text-sm leading-snug text-slate-500">{cfg.description}</p>}
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-10 flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <Info size={18} className="mt-0.5 shrink-0 text-sky-blue" />
        <p>
          Some text on the site is built into the page design and isn't editable here yet. If you can't find
          something you want to change, ask the web team.
        </p>
      </div>
    </>
  );
}
