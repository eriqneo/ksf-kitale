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
  console.log("=== UPDATING ATTENDANCE RECORDS COLLECTION SCHEMA ===");
  try {
    console.log("Authenticating...");
    await retryRequest(() => pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS));
    console.log("Authenticated successfully!");

    // Fetch existing collection details
    console.log("Fetching attendance_records collection config...");
    const collection = await pb.collections.getOne("attendance_records");

    // Modify fields to make demographics optional and add preteens_count
    console.log("Updating fields array...");
    const updatedFields = collection.fields.map(field => {
      // Make existing demographic fields optional
      if (
        field.name === 'children_count' ||
        field.name === 'youth_count' ||
        field.name === 'adults_count'
      ) {
        return { ...field, required: false };
      }
      return field;
    });

    // Check if preteens_count is already present
    const hasPreteensField = updatedFields.some(f => f.name === 'preteens_count');
    if (!hasPreteensField) {
      updatedFields.push({
        name: "preteens_count",
        type: "number",
        required: false
      });
      console.log("Added preteens_count to config.");
    }

    // Update collection schema
    await pb.collections.update(collection.id, {
      fields: updatedFields
    });
    console.log("Collection 'attendance_records' updated successfully!");

    console.log("=== FINISHED SUCCESS ===");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

run();
