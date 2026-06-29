import PocketBase from 'pocketbase';

const PB_URL = 'https://ksfkitale.pockethost.io';
const ADMIN_EMAIL = 'aturaerick@gmail.com';
const ADMIN_PASS = 'dGY@SrzA86PQc5n';

const pb = new PocketBase(PB_URL);

// Helper function to retry requests to deal with PocketHost wake-up delays
async function retryRequest(fn, retries = 8, delay = 3500) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`Request failed (cold start / timeout), retrying in ${delay}ms... (${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function run() {
  console.log("=== CREATING FOOTER COLLECTION WITH POCKETBASE v0.22+ FIELDS ARRAY ===");
  try {
    console.log("Authenticating...");
    await retryRequest(() => pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS));
    console.log("Authenticated successfully!");

    // Delete the empty/faulty collection if it exists to recreate it cleanly
    try {
      console.log("Deleting existing faulty ksf_footer collection...");
      await pb.collections.delete("ksf_footer");
      console.log("Deleted old ksf_footer collection.");
    } catch (err) {
      console.log("Old ksf_footer collection not found or could not be deleted, proceeding...");
    }

    console.log("Creating new ksf_footer collection with proper fields...");
    const collection = await pb.collections.create({
      name: "ksf_footer",
      type: "base",
      fields: [
        {
          name: "quick_links",
          type: "json",
          required: false
        },
        {
          name: "ministry_links",
          type: "json",
          required: false
        },
        {
          name: "service_times",
          type: "json",
          required: false
        },
        {
          name: "copyright",
          type: "text",
          required: false
        }
      ],
      listRule: "",
      viewRule: "",
      createRule: null,
      updateRule: null,
      deleteRule: null
    });
    console.log("Collection created successfully with fields!");

    // Seed default record
    console.log("Seeding default footer record...");
    
    const quickLinks = [
      { label: 'Home', href: '/' },
      { label: 'Who We Are', href: '/#who-we-are' },
      { label: 'Events', href: '/#events' },
      { label: 'Sermons', href: '/sermons' },
      { label: 'Prayer Points', href: '/prayer-points' },
      { label: 'Give', href: '/give' },
      { label: 'Prayer Requests', href: '/#prayer' }
    ];

    const ministryLinks = [
      { label: 'KSF Kids', href: '/ministries/kids' },
      { label: 'Youth', href: '/ministries/youth' },
      { label: 'Women\'s Fellowship', href: '/ministries/women' },
      { label: 'Men\'s Brotherhood', href: '/ministries/men' },
      { label: 'Home Fellowship', href: '/ministries/home-fellowship' },
      { label: 'Global Missions', href: '/about/story#strategies' }
    ];

    const serviceTimes = [
      { name: 'First Service', time: '8:00 AM' },
      { name: 'Second Service', time: '10:30 AM' },
      { name: 'Evening Service', time: '5:00 PM' }
    ];

    await pb.collection("ksf_footer").create({
      quick_links: quickLinks,
      ministry_links: ministryLinks,
      service_times: serviceTimes,
      copyright: "© {year} Kingdom Seekers Fellowship Kitale. All rights reserved."
    });
    console.log("Footer record seeded successfully with fields!");

    console.log("=== FINISHED SUCCESS ===");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

run();
