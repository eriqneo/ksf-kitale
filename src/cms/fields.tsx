import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Braces, ImagePlus, List, Plus, Trash2, Undo2, X } from 'lucide-react';
import type { Field, Rec } from './pb';
import { fileUrl } from './pb';
import { humanize, type FieldConfig } from './config';

export const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-blue focus:ring-2 focus:ring-sky-blue/20 disabled:bg-slate-50 disabled:text-slate-500';

/** Pending file changes for a file field. */
export type FileChange = { added: File[]; removed: string[] };

type FieldProps = {
  field: Field;
  cfg: FieldConfig & { label: string };
  value: any;
  onChange: (value: any) => void;
  record: Rec | null;
  fileChange?: FileChange;
  onFileChange?: (change: FileChange) => void;
  onValidity?: (valid: boolean) => void;
};

export function FieldRow(props: FieldProps) {
  const { field, cfg } = props;
  const id = `f-${field.name}`;
  return (
    <div className="space-y-1.5">
      {field.type !== 'bool' && (
        <label htmlFor={id} className="block text-sm font-semibold text-slate-800">
          {cfg.label}
          {field.required && <span className="ml-0.5 text-bold-red" aria-hidden>*</span>}
        </label>
      )}
      <FieldInput {...props} id={id} />
      {cfg.help && <p className="text-xs text-slate-500">{cfg.help}</p>}
    </div>
  );
}

function FieldInput(props: FieldProps & { id: string }) {
  const { field, cfg, value, onChange, id } = props;
  switch (field.type) {
    case 'bool':
      return <Toggle id={id} label={cfg.label} checked={!!value} onChange={onChange} />;
    case 'number':
      return (
        <input id={id} type="number" step="any" className={`${inputCls} max-w-xs`} value={value ?? ''}
          required={field.required}
          onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))} />
      );
    case 'date':
      return (
        <input id={id} type="date" className={`${inputCls} max-w-xs`} required={field.required}
          value={typeof value === 'string' ? value.slice(0, 10) : ''}
          onChange={e => onChange(e.target.value ? `${e.target.value} 00:00:00.000Z` : '')} />
      );
    case 'select':
      return <SelectInput {...props} />;
    case 'file':
      return <FileInput {...props} />;
    case 'json':
      return <JsonInput {...props} />;
    case 'email':
    case 'url':
      return (
        <input id={id} type={field.type} className={inputCls} value={value ?? ''} required={field.required}
          placeholder={field.type === 'url' ? 'https://' : 'name@example.com'}
          onChange={e => onChange(e.target.value)} />
      );
    case 'relation':
      return (
        <input id={id} className={inputCls} value={Array.isArray(value) ? value.join(', ') : value ?? ''}
          onChange={e => onChange(field.maxSelect === 1 ? e.target.value.trim() : e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
      );
    default:
      return cfg.multiline ? (
        <AutoTextarea id={id} value={value ?? ''} required={field.required} onChange={onChange} />
      ) : (
        <input id={id} className={inputCls} value={value ?? ''} required={field.required}
          onChange={e => onChange(e.target.value)} />
      );
  }
}

export function Toggle({ id, label, checked, onChange }: { id?: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className="inline-flex cursor-pointer select-none items-center gap-3">
      <span className="relative inline-flex">
        <input id={id} type="checkbox" className="peer sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-primary-blue peer-focus-visible:ring-2 peer-focus-visible:ring-sky-blue/40" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
      <span className="text-sm font-semibold text-slate-800">{label}</span>
    </label>
  );
}

export function AutoTextarea({ id, value, onChange, required, rows = 3, className = '' }: {
  id?: string; value: string; onChange: (v: string) => void; required?: boolean; rows?: number; className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [value]);
  return (
    <textarea ref={ref} id={id} rows={rows} required={required} className={`${inputCls} resize-y ${className}`}
      value={value} onChange={e => onChange(e.target.value)} />
  );
}

function SelectInput({ field, value, onChange, id }: FieldProps & { id: string }) {
  const options = field.values ?? [];
  if ((field.maxSelect ?? 1) <= 1) {
    return (
      <select id={id} className={`${inputCls} max-w-xs`} value={value ?? ''} required={field.required}
        onChange={e => onChange(e.target.value)}>
        <option value="">— Choose —</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  const selected: string[] = Array.isArray(value) ? value : [];
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const on = selected.includes(o);
        return (
          <button type="button" key={o} aria-pressed={on}
            onClick={() => onChange(on ? selected.filter(s => s !== o) : [...selected, o])}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition ${on ? 'border-primary-blue bg-primary-blue text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'}`}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

function FileInput({ field, value, record, fileChange, onFileChange, id }: FieldProps & { id: string }) {
  const change = fileChange ?? { added: [], removed: [] };
  const multi = (field.maxSelect ?? 1) > 1;
  const existing: string[] = (Array.isArray(value) ? value : value ? [value] : []);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = change.added.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [change.added]);

  const [optimizing, setOptimizing] = useState(false);
  const pick = async (files: FileList | null) => {
    if (!files?.length) return;
    setOptimizing(true);
    const list = await Promise.all(Array.from(files).map(optimizeImage));
    setOptimizing(false);
    if (multi) onFileChange?.({ ...change, added: [...change.added, ...list] });
    else onFileChange?.({ added: [list[0]], removed: existing });
  };

  const keptExisting = existing.filter(n => !change.removed.includes(n));
  const showPicker = multi || (keptExisting.length === 0 && change.added.length === 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {existing.map(name => {
          const removed = change.removed.includes(name);
          if (removed && !multi && change.added.length) return null;
          return (
            <Thumb key={name} src={record ? fileUrl(record, name) : ''} name={name} dimmed={removed}
              action={removed
                ? { label: 'Undo remove', icon: Undo2, onClick: () => onFileChange?.({ ...change, removed: change.removed.filter(n => n !== name) }) }
                : { label: 'Remove', icon: Trash2, onClick: () => onFileChange?.({ ...change, removed: [...change.removed, name] }) }} />
          );
        })}
        {change.added.map((file, i) => (
          <Thumb key={`${file.name}-${i}`} src={previews[i]} name={file.name} isNew
            action={{
              label: 'Remove', icon: X, onClick: () => onFileChange?.({
                added: change.added.filter((_, j) => j !== i),
                removed: multi ? change.removed : [],
              }),
            }} />
        ))}
      </div>
      {optimizing && <p className="text-xs font-medium text-slate-500">Optimizing image…</p>}
      {showPicker ? (
        <label htmlFor={id}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm font-medium text-slate-600 transition hover:border-sky-blue hover:bg-sky-blue/5 hover:text-sky-blue"
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); pick(e.dataTransfer.files); }}>
          <ImagePlus size={18} /> {multi ? 'Add images' : 'Upload an image'} <span className="font-normal text-slate-400">or drop here</span>
          <input id={id} type="file" accept="image/*" multiple={multi} className="sr-only"
            onChange={e => { pick(e.target.files); e.target.value = ''; }} />
        </label>
      ) : (
        <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-sky-blue hover:underline">
          <ImagePlus size={16} /> Replace image
          <input id={id} type="file" accept="image/*" className="sr-only" onChange={e => { pick(e.target.files); e.target.value = ''; }} />
        </label>
      )}
    </div>
  );
}

const MAX_IMAGE_WIDTH = 2560;
const MAX_IMAGE_BYTES = 1024 * 1024;

/**
 * Large photos (e.g. straight from a phone or a PNG export) are resized and re-encoded as JPEG
 * in the browser before upload, so pages stay fast on mobile data. Small files and non-photo
 * formats (SVG, GIF) are uploaded untouched.
 */
async function optimizeImage(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const tooWide = bitmap.width > MAX_IMAGE_WIDTH;
    if (!tooWide && file.size <= MAX_IMAGE_BYTES) { bitmap.close(); return file; }
    const scale = tooWide ? MAX_IMAGE_WIDTH / bitmap.width : 1;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff'; // JPEG has no transparency
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch {
    return file; // unreadable in this browser — let the server validate it
  }
}

function Thumb({ src, name, dimmed, isNew, action }: {
  src: string; name: string; dimmed?: boolean; isNew?: boolean;
  action: { label: string; icon: React.ComponentType<{ size?: number }>; onClick: () => void };
}) {
  const Icon = action.icon;
  return (
    <figure className={`relative w-40 overflow-hidden rounded-xl border bg-slate-100 ${dimmed ? 'border-red-300 opacity-50' : 'border-slate-200'}`}>
      {src ? <img src={src} alt="" className="h-28 w-full object-cover" /> : <div className="h-28" />}
      <figcaption className="truncate px-2 py-1 text-[11px] text-slate-600" title={name}>
        {isNew && <span className="mr-1 font-bold text-emerald-600">NEW</span>}
        {dimmed && <span className="mr-1 font-bold text-bold-red">REMOVED</span>}
        {name}
      </figcaption>
      <button type="button" onClick={action.onClick} title={action.label} aria-label={`${action.label} ${name}`}
        className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1.5 text-slate-700 shadow hover:bg-white hover:text-bold-red">
        <Icon size={14} />
      </button>
    </figure>
  );
}

/* ---------- JSON fields: friendly list editors with a raw-JSON escape hatch ---------- */

const isPrimitive = (v: unknown) => v === null || ['string', 'number', 'boolean'].includes(typeof v);
const isFlatObject = (v: unknown) =>
  !!v && typeof v === 'object' && !Array.isArray(v) && Object.values(v as object).every(isPrimitive);

type JsonMode = 'strings' | 'objects' | 'raw';

function detectMode(value: unknown, shape?: string[]): JsonMode {
  const empty = value === null || value === undefined || value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && !Array.isArray(value) && Object.keys(value as object).length === 0);
  if (empty) return shape ? 'objects' : 'raw';
  if (Array.isArray(value)) {
    if (value.every(v => typeof v === 'string')) return 'strings';
    if (value.every(isFlatObject)) return 'objects';
  }
  return 'raw';
}

function JsonInput({ cfg, value, onChange, onValidity, id }: FieldProps & { id: string }) {
  // Decide the editor style once, so emptying a list doesn't flip it to raw JSON mid-edit.
  const [friendly] = useState(() => detectMode(value, cfg.itemShape));
  const [forceRaw, setForceRaw] = useState(false);
  const mode = forceRaw ? 'raw' : friendly;

  return (
    <div className="space-y-2">
      {mode === 'strings' && <StringList value={value as string[]} onChange={onChange} />}
      {mode === 'objects' && <ObjectList value={Array.isArray(value) ? value : []} shape={cfg.itemShape} onChange={onChange} />}
      {mode === 'raw' && <RawJson id={id} value={value} onChange={onChange} onValidity={onValidity} />}
      {friendly !== 'raw' && (
        <button type="button" onClick={() => { setForceRaw(r => !r); onValidity?.(true); }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-blue">
          {forceRaw ? <><List size={13} /> Back to list editor</> : <><Braces size={13} /> Edit as JSON</>}
        </button>
      )}
    </div>
  );
}

function RawJson({ id, value, onChange, onValidity }: {
  id: string; value: unknown; onChange: (v: unknown) => void; onValidity?: (ok: boolean) => void;
}) {
  const [text, setText] = useState(() => value === undefined || value === null || value === '' ? '' : JSON.stringify(value, null, 2));
  const [error, setError] = useState('');
  return (
    <div>
      <AutoTextarea id={id} rows={6} className="font-mono text-xs" value={text} onChange={t => {
        setText(t);
        if (!t.trim()) { setError(''); onValidity?.(true); onChange(null); return; }
        try {
          const parsed = JSON.parse(t);
          setError(''); onValidity?.(true); onChange(parsed);
        } catch (e: any) {
          setError(e.message); onValidity?.(false);
        }
      }} />
      {error && <p className="mt-1 text-xs font-medium text-bold-red">Invalid JSON: {error}</p>}
    </div>
  );
}

function move<T>(list: T[], from: number, to: number) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function ItemControls({ index, count, onMove, onRemove }: {
  index: number; count: number; onMove: (to: number) => void; onRemove: () => void;
}) {
  const btn = 'rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent';
  return (
    <div className="flex shrink-0 items-center">
      <button type="button" className={btn} disabled={index === 0} onClick={() => onMove(index - 1)} aria-label="Move up"><ArrowUp size={15} /></button>
      <button type="button" className={btn} disabled={index === count - 1} onClick={() => onMove(index + 1)} aria-label="Move down"><ArrowDown size={15} /></button>
      <button type="button" className={`${btn} hover:!text-bold-red`} onClick={onRemove} aria-label="Remove item"><Trash2 size={15} /></button>
    </div>
  );
}

function StringList({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-2 w-5 shrink-0 text-right text-xs font-semibold text-slate-400">{i + 1}.</span>
          <AutoTextarea rows={1} value={item} onChange={v => onChange(value.map((x, j) => (j === i ? v : x)))} />
          <ItemControls index={i} count={value.length} onMove={to => onChange(move(value, i, to))}
            onRemove={() => onChange(value.filter((_, j) => j !== i))} />
        </div>
      ))}
      <AddButton onClick={() => onChange([...value, ''])} />
    </div>
  );
}

function ObjectList({ value, shape, onChange }: {
  value: Record<string, any>[]; shape?: string[]; onChange: (v: Record<string, any>[]) => void;
}) {
  const [initialKeys] = useState(() => [...(shape ?? []), ...value.flatMap(o => Object.keys(o))]);
  const keys = Array.from(new Set([...initialKeys, ...value.flatMap(o => Object.keys(o))]));
  const blank = () => Object.fromEntries(keys.map(k => {
    const sample = value.find(o => o[k] !== undefined)?.[k];
    return [k, typeof sample === 'number' ? 0 : typeof sample === 'boolean' ? false : ''];
  }));
  const update = (i: number, k: string, v: any) => onChange(value.map((o, j) => (j === i ? { ...o, [k]: v } : o)));

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Item {i + 1}</span>
            <ItemControls index={i} count={value.length} onMove={to => onChange(move(value, i, to))}
              onRemove={() => onChange(value.filter((_, j) => j !== i))} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {keys.map(k => {
              const v = item[k];
              const long = typeof v === 'string' && (v.length > 60 || /desc|text|content|body/i.test(k));
              return (
                <div key={k} className={long ? 'sm:col-span-2' : ''}>
                  <span className="mb-1 block text-xs font-semibold text-slate-600">{humanize(k)}</span>
                  {typeof v === 'boolean' ? (
                    <Toggle label={v ? 'Yes' : 'No'} checked={v} onChange={b => update(i, k, b)} />
                  ) : typeof v === 'number' ? (
                    <input type="number" step="any" className={inputCls} value={v}
                      onChange={e => update(i, k, e.target.value === '' ? 0 : Number(e.target.value))} />
                  ) : long ? (
                    <AutoTextarea rows={2} value={v ?? ''} onChange={t => update(i, k, t)} />
                  ) : (
                    <input className={inputCls} value={v ?? ''} onChange={e => update(i, k, e.target.value)} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <AddButton onClick={() => onChange([...value, blank()])} />
    </div>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:border-sky-blue hover:text-sky-blue">
      <Plus size={15} /> Add item
    </button>
  );
}
