import PocketBase from 'pocketbase';

const PB_URL = 'https://ksfkitale.pockethost.io';
const ADMIN_EMAIL = 'aturaerick@gmail.com';
const ADMIN_PASS = 'dGY@SrzA86PQc5n';

const pb = new PocketBase(PB_URL);

async function retryRequest(fn, retries = 8, delay = 3500) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`Request failed, retrying... (${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

const leadershipSectionData = {
  page_slug: 'about-story',
  section_slug: 'leadership-team',
  title: "Led by the Spirit, Guided by the Word",
  subtitle: "MEET THE TEAM",
  description: "Our leadership team is committed to serving KSF with humility, integrity, and a deep love for God and people.",
  content_json: {},
  sort_order: 5
};

async function run() {
  console.log("=== SEEDING LEADERSHIP PAGE SECTION ===");
  try {
    console.log("Authenticating...");
    await retryRequest(() => pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS));
    console.log("Authenticated successfully!");

    try {
      console.log("Checking for existing leadership section...");
      const existing = await pb.collection('page_sections').getFullList({
        filter: 'page_slug="about-story" && section_slug="leadership-team"'
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

    console.log("Creating new leadership section...");
    await retryRequest(() => pb.collection('page_sections').create(leadershipSectionData));
    
    console.log("=== FINISHED SEEDING SUCCESSFULLY ===");
  } catch (error) {
    console.error("Script failed:", error);
  }
}

run();
