import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';

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

// Download helper to attach images to payload
async function downloadAsFile(url, filename) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Create a temporary file
    const tmpPath = path.join(process.cwd(), `tmp_${filename}.jpg`);
    fs.writeFileSync(tmpPath, buffer);
    
    // Read as Blob/File equivalent for PocketBase (Node.js FormData needs standard files or blobs)
    // Actually, PocketBase JS SDK in Node can take a Blob or a simple object with { name, type, ... } 
    // or we can use fetch polyfills. Let's just create a JS Blob since PB v0.20+ supports it globally.
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    return new File([blob], `${filename}.jpg`, { type: 'image/jpeg' });
  } catch (err) {
    console.error(`Error downloading image ${url}:`, err);
    return null;
  }
}

const pageSectionsData = [
  {
    page_slug: 'ministries-kids',
    section_slug: 'why-ksf-kids',
    title: "Your Child's Favorite Part of the Week",
    subtitle: "",
    description: "At KSF Kids, we don't just babysit; we make disciples. Our mission is to partner with parents to help children discover Jesus and build their lives on His Word. We believe that if you train up a child in the way they should go, they will not depart from it.",
    image_url_1: 'https://images.unsplash.com/photo-1544333346-64e4fe18204e?w=800&q=80',
    content_json: [
      { "icon": "Heart", "title": "Gospel-Centered", "desc": "Every lesson points back to the grace and truth of Jesus Christ." },
      { "icon": "ShieldCheck", "title": "Secure & Safe", "desc": "Our check-in system and background-checked volunteers ensure peace of mind." },
      { "icon": "Star", "title": "Fun & Engaging", "desc": "We use games, drama, and worship music that kids actually love." }
    ],
    sort_order: 1
  },
  {
    page_slug: 'ministries-kids',
    section_slug: 'age-groups',
    title: "Tailored Experiences for Every Age",
    subtitle: "ENVIRONMENTS",
    description: "",
    content_json: [
      { 
        "age": "Ages 0 - 3",
        "name": "The Nursery", 
        "desc": "A peaceful environment focused on basic Bible truths through songs and gentle play.",
        "img": "https://picsum.photos/seed/nursery/600/400"
      },
      { 
        "age": "Ages 4 - 7",
        "name": "Explorers", 
        "desc": "Interactive storytelling and creative crafts that bring the Bible to life.",
        "img": "https://picsum.photos/seed/explorers/600/400"
      },
      { 
        "age": "Ages 8 - 12",
        "name": "Champions", 
        "desc": "Deep-dive teaching and small group discussions for growing faith and friendship.",
        "img": "https://picsum.photos/seed/champions/600/400"
      }
    ],
    sort_order: 2
  }
];

async function run() {
  console.log("=== SEEDING KSF KIDS PAGE SECTIONS ===");
  try {
    console.log("Authenticating...");
    await retryRequest(() => pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS));
    console.log("Authenticated successfully!");

    // Optional: First check and delete existing ones so we don't duplicate
    try {
      console.log("Checking for existing KSF Kids sections...");
      const existing = await pb.collection('page_sections').getFullList({
        filter: 'page_slug="ministries-kids"'
      });
      if (existing.length > 0) {
        console.log(`Found ${existing.length} existing records, deleting them to avoid duplicates...`);
        for (const record of existing) {
          await pb.collection('page_sections').delete(record.id);
        }
      }
    } catch (e) {
      console.log("No existing records to delete, continuing...");
    }

    console.log("Creating new sections...");
    for (const section of pageSectionsData) {
      console.log(` - Creating section: ${section.section_slug}`);
      const payload = { ...section };
      
      if (section.image_url_1) {
        payload.image_1 = await downloadAsFile(section.image_url_1, `${section.page_slug}_${section.section_slug}_img1`);
        delete payload.image_url_1;
      }
      
      await retryRequest(() => pb.collection('page_sections').create(payload));
    }

    console.log("=== FINISHED SEEDING SUCCESSFULLY ===");
  } catch (error) {
    console.error("Script failed:", error);
  }
}

run();
