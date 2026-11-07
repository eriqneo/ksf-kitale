// Sets up staff accounts for the CMS (/cms-admin) on PocketBase.
//
//   node scripts/setup-cms-users.mjs           → show what would change (no writes)
//   node scripts/setup-cms-users.mjs --apply   → apply the changes
//
// What it does:
//   1. `users` collection: adds `role` (admin | editor) and `active` fields, closes public
//      sign-up, and only lets admins manage other users. Users can edit their own name/avatar
//      but cannot change their own role or active flag. Inactive users cannot sign in, and
//      lose access immediately (rules check `active` on every request).
//   2. Content collections: any rule that is currently "superusers only" (null) is opened to
//      active staff. Rules that are already public ('') or custom are left exactly as they are,
//      so the public site, the contact form and the analytics page keep working.
// Safe to run more than once.
import PocketBase from 'pocketbase';
import { PB_URL, ADMIN_EMAIL, ADMIN_PASS } from './lib/env.mjs';

const APPLY = process.argv.includes('--apply');

const STAFF = "@request.auth.collectionName = 'users' && @request.auth.active = true";
const ADMIN = `${STAFF} && @request.auth.role = 'admin'`;

const USERS_RULES = {
  listRule: `${STAFF} && (id = @request.auth.id || @request.auth.role = 'admin')`,
  viewRule: `${STAFF} && (id = @request.auth.id || @request.auth.role = 'admin')`,
  createRule: ADMIN,
  updateRule: `${STAFF} && (@request.auth.role = 'admin' || (id = @request.auth.id && @request.body.role:isset = false && @request.body.active:isset = false && @request.body.verified:isset = false))`,
  deleteRule: `${ADMIN} && id != @request.auth.id`,
  manageRule: ADMIN,
  authRule: 'active = true',
};

const NEW_USER_FIELDS = [
  { name: 'role', type: 'select', values: ['admin', 'editor'], maxSelect: 1, required: true },
  { name: 'active', type: 'bool' },
];

const RULE_KEYS = ['listRule', 'viewRule', 'createRule', 'updateRule', 'deleteRule'];
const show = v => (v === null ? 'null (superusers only)' : v === '' ? "'' (public)" : v);

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

async function main() {
  console.log(`PocketBase: ${PB_URL}`);
  console.log(APPLY ? 'Mode: APPLY\n' : 'Mode: dry run (pass --apply to make these changes)\n');
  await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

  const collections = await pb.collections.getFullList();
  const users = collections.find(c => c.name === 'users');
  if (!users) throw new Error('No `users` collection found.');

  // ---- 1. users collection ----
  const userChanges = {};
  const existingNames = new Set(users.fields.map(f => f.name));
  const missingFields = NEW_USER_FIELDS.filter(f => !existingNames.has(f.name));
  if (missingFields.length) userChanges.fields = [...users.fields, ...missingFields];
  for (const [key, value] of Object.entries(USERS_RULES)) {
    if (users[key] !== value) userChanges[key] = value;
  }

  console.log('== users');
  if (!Object.keys(userChanges).length) console.log('   already set up');
  for (const f of missingFields) console.log(`   + field ${f.name} (${f.type}${f.values ? `: ${f.values.join(' | ')}` : ''})`);
  for (const key of Object.keys(USERS_RULES)) {
    if (key in userChanges) console.log(`   ${key}:\n     was: ${show(users[key])}\n     now: ${userChanges[key]}`);
  }

  // ---- 2. content collections ----
  const contentPlans = [];
  for (const c of collections) {
    if (c.system || c.type !== 'base' || c.name.startsWith('_')) continue;
    const changes = {};
    for (const key of RULE_KEYS) if (c[key] === null) changes[key] = STAFF;
    const kept = RULE_KEYS.filter(k => c[k] !== null).map(k => `${k.replace('Rule', '')}=${c[k] === '' ? 'public' : 'custom'}`);
    contentPlans.push({ c, changes });
    console.log(`\n== ${c.name}`);
    console.log(Object.keys(changes).length ? `   staff can now: ${Object.keys(changes).map(k => k.replace('Rule', '')).join(', ')}` : '   no change');
    if (kept.length) console.log(`   unchanged: ${kept.join(', ')}`);
  }

  if (!APPLY) {
    console.log('\nDry run only — nothing was changed.');
    return;
  }

  if (Object.keys(userChanges).length) {
    await pb.collections.update(users.id, userChanges);
    console.log('\n✓ users updated');
  }
  for (const { c, changes } of contentPlans) {
    if (!Object.keys(changes).length) continue;
    await pb.collections.update(c.id, changes);
    console.log(`✓ ${c.name} updated`);
  }
  console.log('\nDone. Sign in to /cms-admin as a superuser and add staff under "Team & Access".');
}

main().catch(err => {
  console.error('\nFailed:', err?.response?.message || err.message);
  if (err?.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
  process.exit(1);
});
