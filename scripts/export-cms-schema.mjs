// Saves the content collections' field definitions to src/cms/schema.json.
// The CMS uses this snapshot for staff (non-superuser) accounts, which aren't allowed to read
// the live schema. Re-run after adding or changing fields in PocketBase:
//   node scripts/export-cms-schema.mjs
import fs from 'node:fs';
import PocketBase from 'pocketbase';
import { PB_URL, ADMIN_EMAIL, ADMIN_PASS } from './lib/env.mjs';

const KEEP = ['name', 'type', 'required', 'hidden', 'system', 'values', 'maxSelect'];

const pb = new PocketBase(PB_URL);
await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
const collections = await pb.collections.getFullList({ sort: 'name' });

const snapshot = collections
  .filter(c => c.type === 'base' && !c.system && !c.name.startsWith('_'))
  .map(c => ({
    id: c.id,
    name: c.name,
    type: c.type,
    system: false,
    fields: c.fields.map(f => Object.fromEntries(KEEP.filter(k => f[k] !== undefined && f[k] !== null && f[k] !== '').map(k => [k, f[k]]))),
  }));

const out = new URL('../src/cms/schema.json', import.meta.url);
fs.writeFileSync(out, JSON.stringify(snapshot, null, 2) + '\n');
console.log(`Wrote ${snapshot.length} collections to src/cms/schema.json`);
