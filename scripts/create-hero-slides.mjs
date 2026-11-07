// Creates the `hero_slides` collection that powers the home page hero carousel, and seeds it
// with three slides built from content that is already on the site (the current home hero and
// the Home Fellowship / Youth ministry banners). Safe to re-run: it never duplicates the
// collection or re-seeds a collection that already has slides.
//
//   node scripts/create-hero-slides.mjs
import PocketBase from 'pocketbase';
import { PB_URL, ADMIN_EMAIL, ADMIN_PASS } from './lib/env.mjs';

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

const STAFF = "@request.auth.collectionName = 'users' && @request.auth.active = true";

const FIELDS = [
  { name: 'image', type: 'file', required: true, maxSelect: 1, maxSize: 5242880,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] },
  { name: 'subtitle', type: 'text', max: 80 },
  { name: 'heading', type: 'text', required: true, max: 80 },
  { name: 'highlight', type: 'text', max: 80 },
  { name: 'description', type: 'text', max: 400 },
  { name: 'button_text', type: 'text', max: 40 },
  { name: 'button_link', type: 'text', max: 300 },
  { name: 'active', type: 'bool' },
  { name: 'sort_order', type: 'number' },
  { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
  { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
];

async function fileFrom(url, name) {
  const res = await fetch(url, { headers: { 'User-Agent': 'ksf-cms-setup' } });
  if (!res.ok) throw new Error(`Could not download ${url}: ${res.status}`);
  const type = res.headers.get('content-type') || 'image/jpeg';
  const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
  return new File([await res.arrayBuffer()], `${name}.${ext}`, { type });
}

const recordImage = (record, field, fallback) =>
  record?.[field] ? `${PB_URL}/api/files/${record.collectionId}/${record.id}/${record[field]}` : fallback;

async function main() {
  await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
  const collections = await pb.collections.getFullList();

  // Staff edit rules only work once scripts/setup-cms-users.mjs --apply has added `active` to users.
  const users = collections.find(c => c.name === 'users');
  const staffReady = users?.fields.some(f => f.name === 'active');
  const editRule = staffReady ? STAFF : null; // null = superusers only (setup-cms-users opens it later)

  let collection = collections.find(c => c.name === 'hero_slides');
  if (collection) {
    console.log('✓ hero_slides already exists');
  } else {
    collection = await pb.collections.create({
      name: 'hero_slides',
      type: 'base',
      fields: FIELDS,
      listRule: '',
      viewRule: '',
      createRule: editRule,
      updateRule: editRule,
      deleteRule: editRule,
    });
    console.log(`✓ created hero_slides (staff can edit: ${staffReady ? 'yes' : 'after setup-cms-users --apply'})`);
  }

  const existing = await pb.collection('hero_slides').getList(1, 1);
  if (existing.totalItems > 0) {
    console.log(`✓ already has ${existing.totalItems} slide(s), not seeding`);
    return;
  }

  // Seed from content that is already live on the site.
  const home = (await pb.collection('pages').getList(1, 1, { filter: 'slug = "home"' })).items[0];
  const ministry = async slug => (await pb.collection('ministries').getList(1, 1, { filter: `slug = "${slug}"` })).items[0];
  const fellowship = await ministry('home-fellowship');
  const youth = await ministry('youth');

  const seeds = [
    {
      subtitle: home?.hero_subtitle || 'JOIN US THIS WEEKEND',
      heading: home?.hero_heading || 'Sundays @',
      highlight: '8:00 / 9:45 / 11:30',
      description: home?.hero_description || 'Experience a community where lives are transformed. Making Disciples. Multiplying Churches.',
      image: recordImage(home, 'hero_image', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&q=80'),
    },
    {
      subtitle: 'MINISTRIES',
      heading: fellowship?.hero_heading || fellowship?.title || 'Home Fellowship',
      description: fellowship?.hero_description || 'Real community happens in circles, not just rows. Join a Home Fellowship in your region to experience life-changing relationships and spiritual growth.',
      button_text: 'Find a Fellowship',
      button_link: '/ministries/home-fellowship',
      image: recordImage(fellowship, 'hero_image', 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1920&q=80'),
    },
    {
      subtitle: 'MINISTRIES',
      heading: youth?.hero_heading || youth?.title || 'KSF Youth',
      description: youth?.hero_description || 'No longer a generation of the future, but a generation of the NOW. We empower teenagers to find their identity, purpose, and power in Jesus Christ.',
      button_text: 'Meet KSF Youth',
      button_link: '/ministries/youth',
      image: recordImage(youth, 'hero_image', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80'),
    },
  ];

  for (const [i, { image, ...data }] of seeds.entries()) {
    const file = await fileFrom(image, `hero-${i + 1}`);
    await pb.collection('hero_slides').create({ ...data, image: file, active: true, sort_order: i + 1 });
    console.log(`✓ seeded slide ${i + 1}: ${data.heading}`);
  }
}

main().catch(err => {
  console.error('Failed:', err?.response?.message || err.message, err?.url ?? '', err?.status ?? '', err?.originalError?.message ?? '');
  if (err?.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
  process.exit(1);
});
