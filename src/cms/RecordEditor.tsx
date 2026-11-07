import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Loader2, Save, Trash2 } from 'lucide-react';
import { cmsPb, errorMessage, type Field, type Rec } from './pb';
import { editableFields, fieldConfig, getConfig, titleOf } from './config';
import { BASE, useCms } from './CmsApp';
import { FieldRow, type FileChange } from './fields';
import { Button, Card, PageHeader, useToast } from './ui';

function emptyValue(f: Field) {
  switch (f.type) {
    case 'bool': return false;
    case 'number': return null;
    case 'json': return null;
    case 'file': return (f.maxSelect ?? 1) > 1 ? [] : '';
    case 'select': return (f.maxSelect ?? 1) > 1 ? [] : '';
    case 'relation': return (f.maxSelect ?? 1) > 1 ? [] : '';
    default: return '';
  }
}

export default function RecordEditor({ singleton = false }: { singleton?: boolean }) {
  const { collection: name = '', id } = useParams();
  const { getCollection } = useCms();
  const collection = getCollection(name);
  if (!collection) return <Navigate to={BASE} replace />;
  return <Editor key={`${name}/${id ?? 'new'}`} singleton={singleton} />;
}

function Editor({ singleton }: { singleton: boolean }) {
  const { collection: name = '', id } = useParams();
  const { getCollection, refreshUnread } = useCms();
  const collection = getCollection(name)!;
  const cfg = getConfig(collection);
  const fields = useMemo(() => editableFields(collection).filter(f => !fieldConfig(cfg, f).hidden), [collection, cfg]);
  const navigate = useNavigate();
  const toast = useToast();

  const [record, setRecord] = useState<Rec | null>(null);
  const [initial, setInitial] = useState<Record<string, any> | null>(null);
  const [values, setValues] = useState<Record<string, any>>({});
  const [fileChanges, setFileChanges] = useState<Record<string, FileChange>>({});
  const [invalid, setInvalid] = useState<Set<string>>(new Set());
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const isNew = !record;
  const listPath = singleton ? BASE : `${BASE}/c/${name}`;

  const applyRecord = (r: Rec | null, defaults: Record<string, any> = {}) => {
    const v = Object.fromEntries(fields.map(f => [f.name, r ? r[f.name] ?? emptyValue(f) : defaults[f.name] ?? emptyValue(f)]));
    setRecord(r);
    setValues(v);
    setInitial(v);
    setFileChanges({});
    setInvalid(new Set());
    setFormKey(k => k + 1);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (singleton) {
          const list = await cmsPb.collection(name).getList<Rec>(1, 1);
          if (alive) applyRecord(list.items[0] ?? null);
        } else if (id) {
          const r = await cmsPb.collection(name).getOne<Rec>(id);
          if (!alive) return;
          applyRecord(r);
          if (cfg.inbox && r.is_read === false) {
            cmsPb.collection(name).update(r.id, { is_read: true }).then(updated => {
              if (!alive) return;
              setRecord(updated as Rec);
              setValues(v => ({ ...v, is_read: true }));
              setInitial(v => (v ? { ...v, is_read: true } : v));
              refreshUnread();
            }).catch(() => {});
          }
        } else {
          const defaults: Record<string, any> = {};
          // New items should be visible on the site unless someone turns them off.
          if (collection.fields.some(f => f.name === 'active' && f.type === 'bool')) defaults.active = true;
          if (collection.fields.some(f => f.name === 'sort_order')) {
            const last = await cmsPb.collection(name).getList<Rec>(1, 1, { sort: '-sort_order', fields: 'sort_order' });
            defaults.sort_order = (last.items[0]?.sort_order ?? 0) + 1;
          }
          if (alive) applyRecord(null, defaults);
        }
      } catch (err) {
        if (alive) setLoadError(errorMessage(err));
      }
    })();
    return () => { alive = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const dirty = !!initial && (
    JSON.stringify(values) !== JSON.stringify(initial) ||
    Object.values(fileChanges).some((c: FileChange) => c.added.length || c.removed.length)
  );

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const leave = (e: React.MouseEvent) => {
    if (dirty && !window.confirm('You have unsaved changes. Leave without saving?')) e.preventDefault();
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (invalid.size) {
      toast('error', 'Fix the highlighted JSON before saving.');
      return;
    }
    const payload: Record<string, any> = {};
    for (const f of fields) {
      if (f.type !== 'file') {
        payload[f.name] = values[f.name];
        continue;
      }
      const change = fileChanges[f.name];
      if (!change) continue;
      if ((f.maxSelect ?? 1) > 1) {
        if (change.added.length) payload[`${f.name}+`] = change.added;
        if (change.removed.length) payload[`${f.name}-`] = change.removed;
      } else if (change.added.length) {
        payload[f.name] = change.added[0];
      } else if (change.removed.length) {
        payload[f.name] = null;
      }
    }

    setSaving(true);
    try {
      const saved = record
        ? await cmsPb.collection(name).update<Rec>(record.id, payload)
        : await cmsPb.collection(name).create<Rec>(payload);
      applyRecord(saved);
      toast('success', record ? 'Changes saved.' : `${cfg.singular} created.`);
      if (!record && !singleton) navigate(`${BASE}/c/${name}/${saved.id}`, { replace: true });
      if (cfg.inbox) refreshUnread();
    } catch (err) {
      toast('error', `Could not save: ${errorMessage(err)}`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!record) return;
    if (!window.confirm(`Delete "${titleOf(record, collection, cfg)}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await cmsPb.collection(name).delete(record.id);
      toast('success', `${cfg.singular} deleted.`);
      if (cfg.inbox) refreshUnread();
      navigate(listPath, { replace: true });
    } catch (err) {
      toast('error', `Could not delete: ${errorMessage(err)}`);
      setDeleting(false);
    }
  };

  if (loadError) {
    return (
      <Card className="p-8 text-center text-sm text-slate-600">
        <p className="mb-4">{loadError}</p>
        <Link to={listPath}><Button variant="secondary">Go back</Button></Link>
      </Card>
    );
  }
  if (!initial) {
    return <div className="flex items-center justify-center gap-2 p-16 text-sm text-slate-500"><Loader2 size={18} className="animate-spin" /> Loading…</div>;
  }

  const title = singleton ? cfg.label : isNew ? `New ${cfg.singular.toLowerCase()}` : titleOf(record!, collection, cfg);
  const fmt = (d?: string) => (d ? new Date(d.replace(' ', 'T')).toLocaleString() : '');

  return (
    <form key={formKey} onSubmit={save} className="pb-24">
      <PageHeader
        back={!singleton && (
          <Link to={listPath} onClick={leave} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary-blue">
            <ArrowLeft size={15} /> {cfg.label}
          </Link>
        )}
        title={title}
        description={singleton ? cfg.description : record && (record.updated || record.created) && (
          <>Last updated {fmt(record.updated || record.created)}</>
        )}
        actions={cfg.sitePath && (
          <a href={cfg.sitePath} target="_blank" rel="noreferrer">
            <Button type="button" variant="secondary"><ExternalLink size={15} /> View on site</Button>
          </a>
        )}
      />

      <Card className="space-y-6 p-5 sm:p-7">
        {fields.map(f => (
          <FieldRow key={f.name} field={f} cfg={fieldConfig(cfg, f)} record={record}
            value={values[f.name]}
            onChange={v => setValues(prev => ({ ...prev, [f.name]: v }))}
            fileChange={fileChanges[f.name]}
            onFileChange={c => setFileChanges(prev => ({ ...prev, [f.name]: c }))}
            onValidity={ok => setInvalid(prev => {
              const next = new Set(prev);
              if (ok) next.delete(f.name); else next.add(f.name);
              return next;
            })} />
        ))}
        {fields.length === 0 && <p className="text-sm text-slate-500">This collection has no editable fields.</p>}
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {record && !singleton && (
            <Button type="button" variant="danger" onClick={remove} loading={deleting}><Trash2 size={15} /> Delete</Button>
          )}
          <span className="ml-auto text-xs text-slate-500">{dirty ? 'Unsaved changes' : record ? 'All changes saved' : ''}</span>
          <Button type="submit" loading={saving} disabled={!dirty && !!record}>
            <Save size={15} /> {isNew ? `Create ${cfg.singular.toLowerCase()}` : 'Save changes'}
          </Button>
        </div>
      </div>
    </form>
  );
}
