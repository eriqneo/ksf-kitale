import PocketBase from 'pocketbase';

import { PB_URL, ADMIN_EMAIL, ADMIN_PASS } from './lib/env.mjs';

const pb = new PocketBase(PB_URL);

async function run() {
  try {
    console.log("Authenticating...");
    await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
    console.log("Authenticated!");

    console.log("Fetching collection...");
    const collection = await pb.collections.getOne("ksf_footer");
    console.log("Full Collection Object:", JSON.stringify(collection, null, 2));

    const records = await pb.collection("ksf_footer").getFullList();
    console.log(`Found ${records.length} records in ksf_footer:`);
    records.forEach((r, i) => {
      console.log(`Record ${i + 1}:`, JSON.stringify(r, null, 2));
    });
  } catch (err) {
    console.error("Error checking records:", err);
  }
}

run();
