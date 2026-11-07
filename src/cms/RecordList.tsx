import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowDown, ArrowUp, ExternalLink, ImageOff, Loader2, Plus, Search } from 'lucide-react';
import { cmsPb, errorMessage, fileUrl, type Rec } from './pb';
import { getConfig, sortFor, titleOf } from './config';
import { BASE, useCms } from './CmsApp';
import { inputCls } from './fields';
import { Button, Card, PageHeader, useToast } from './ui';
import RecordEditor from './RecordEditor';

export default function RecordList() {
  const { collection: name = '' } = useParams();
  const { getCollection } = useCms();
  const collection = getCollection(name);
  if (!collection) return <Navigate to={BASE} replace />;
  const cfg = getConfig(collection);
  // Single-record collections (settings, footer) open straight into the editor.
  if (cfg.singleton) return <RecordEditor singleton />;
  return <ListView key={name} />;
}

function ListView() {
  const { collection: name = '' } = useParams();
  const { getCollection, refreshUnread } = useCms();
  const collection = getCollection(name)!;
  const cfg = getConfig(collection);
  const toast = useToast();

  const [records, setRecords] = useState<Rec[] | null>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [reordering, setReordering] = useState(false);

  const sort = sortFor(collection, cfg);
  const hasSortOrder = collection.fields.some(f => f.name === 'sort_order');
  const imageField = collection.fields.find(f => f.type === 'file');
  const textFields = collection.fields.filter(f => ['text', 'email', 'url', 'editor', 'select'].includes(f.type)).map(f => f.name);

  const load = () => {
    setError('');
    cmsPb.collection(name).getFullList<Rec>({ sort: sort || undefined })
      .then(setRecords)
      .catch(err => setError(errorMessage(err)));
  };
  useEffect(load, [name]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    if (!records) return [];
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter(r => textFields.some(f => String(r[f] ?? '').toLowerCase().includes(q)));
  }, [records, query]); // eslint-disable-line react-hooks/exhaustive-deps

  const moveRecord = async (from: number, to: number) => {
    if (!records) return;
    const next = [...records];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setRecords(next);
    setReordering(true);
    try {
      // Renumber everything 1..n so ties and gaps in old data are fixed too.
      await Promise.all(next.map((r, i) => r.sort_order === i + 1
        ? null
        : cmsPb.collection(name).update(r.id, { sort_order: i + 1 })));
      setRecords(next.map((r, i) => ({ ...r, sort_order: i + 1 })));
    } catch (err) {
      toast('error', `Could not save the new order: ${errorMessage(err)}`);
      load();
    } finally {
      setReordering(false);
    }
  };

  const toggleRead = async (r: Rec) => {
    try {
      await cmsPb.collection(name).update(r.id, { is_read: !r.is_read });
      setRecords(rs => rs?.map(x => (x.id === r.id ? { ...x, is_read: !r.is_read } : x)) ?? null);
      refreshUnread();
    } catch (err) {
      toast('error', errorMessage(err));
    }
  };

  const canReorder = hasSortOrder && !query && sort === 'sort_order';
  const subtitleOf = (r: Rec) => (cfg.subtitleFields ?? [])
    .map(f => {
      const v = r[f];
      if (!v) return '';
      return collection.fields.find(x => x.name === f)?.type === 'date' ? String(v).slice(0, 10) : String(v);
    })
    .filter(Boolean).join(' · ');

  return (
    <>
      <PageHeader
        title={cfg.label}
        description={cfg.description}
        actions={<>
          {cfg.sitePath && (
            <a href={cfg.sitePath} target="_blank" rel="noreferrer">
              <Button variant="secondary"><ExternalLink size={15} /> View on site</Button>
            </a>
          )}
          {!cfg.inbox && (
            <Link to={`${BASE}/c/${name}/new`}><Button><Plus size={16} /> New {cfg.singular.toLowerCase()}</Button></Link>
          )}
        </>}
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-3 sm:p-4">
          <div className="relative min-w-0 flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className={`${inputCls} pl-9`} placeholder={`Search ${cfg.label.toLowerCase()}…`}
              value={query} onChange={e => setQuery(e.target.value)} aria-label="Search" />
          </div>
          {reordering && <span className="flex items-center gap-1.5 text-xs text-slate-500"><Loader2 size={14} className="animate-spin" /> Saving order…</span>}
          {canReorder && <span className="hidden text-xs text-slate-400 sm:inline">Use the arrows to change the order on the site.</span>}
        </div>

        {error ? (
          <div className="p-8 text-center text-sm text-slate-600">
            <p className="mb-3">{error}</p>
            <Button variant="secondary" onClick={load}>Try again</Button>
          </div>
        ) : !records ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm text-slate-500"><Loader2 size={18} className="animate-spin" /> Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            {query ? 'Nothing matches your search.' : cfg.inbox ? 'No messages yet.' : `No ${cfg.label.toLowerCase()} yet.`}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((r, i) => {
              const img = imageField ? (Array.isArray(r[imageField.name]) ? r[imageField.name][0] : r[imageField.name]) : '';
              const unread = cfg.inbox && !r.is_read;
              return (
                <li key={r.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 sm:px-4">
                  {imageField && (
                    <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {img ? <img src={fileUrl(r, img)} alt="" loading="lazy" className="h-full w-full object-cover" />
                        : <div className="flex h-full items-center justify-center text-slate-300"><ImageOff size={16} /></div>}
                    </div>
                  )}
                  <Link to={`${BASE}/c/${name}/${r.id}`} className="min-w-0 flex-1 py-1">
                    <div className={`flex items-center gap-2 truncate text-sm ${unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>
                      {unread && <span className="h-2 w-2 shrink-0 rounded-full bg-bold-red" aria-label="Unread" />}
                      <span className="truncate">{titleOf(r, collection, cfg)}</span>
                      {r.is_featured && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-800">Featured</span>}
                    </div>
                    <div className="truncate text-xs text-slate-500">
                      {cfg.inbox ? String(r.message ?? '').slice(0, 120) : subtitleOf(r)}
                    </div>
                  </Link>
                  {cfg.inbox && (
                    <button onClick={() => toggleRead(r)} className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-sky-blue hover:bg-sky-blue/10">
                      {r.is_read ? 'Mark unread' : 'Mark read'}
                    </button>
                  )}
                  {canReorder && (
                    <div className="flex shrink-0">
                      <button disabled={i === 0 || reordering} onClick={() => moveRecord(i, i - 1)} aria-label="Move up"
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-800 disabled:opacity-25"><ArrowUp size={16} /></button>
                      <button disabled={i === filtered.length - 1 || reordering} onClick={() => moveRecord(i, i + 1)} aria-label="Move down"
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-800 disabled:opacity-25"><ArrowDown size={16} /></button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
