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
  console.log("=== CREATING AND SEEDING ATTENDANCE RECORDS COLLECTION ===");
  try {
    console.log("Authenticating...");
    await retryRequest(() => pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS));
    console.log("Authenticated successfully!");

    // Delete existing collection if it exists to cleanly recreate schema
    try {
      console.log("Checking for existing attendance_records collection...");
      await pb.collections.delete("attendance_records");
      console.log("Deleted old attendance_records collection.");
    } catch (err) {
      console.log("Old attendance_records collection not found, proceeding to create...");
    }

    console.log("Creating new attendance_records collection with proper fields...");
    const collection = await pb.collections.create({
      name: "attendance_records",
      type: "base",
      fields: [
        {
          name: "event_date",
          type: "date",
          required: true
        },
        {
          name: "event_type",
          type: "text",
          required: true
        },
        {
          name: "event_name",
          type: "text",
          required: false
        },
        {
          name: "session",
          type: "text",
          required: true
        },
        {
          name: "members_count",
          type: "number",
          required: true
        },
        {
          name: "visitors_count",
          type: "number",
          required: true
        },
        {
          name: "first_timers",
          type: "number",
          required: true
        },
        {
          name: "children_count",
          type: "number",
          required: true
        },
        {
          name: "youth_count",
          type: "number",
          required: true
        },
        {
          name: "adults_count",
          type: "number",
          required: true
        },
        {
          name: "salvations",
          type: "number",
          required: true
        },
        {
          name: "recorded_by",
          type: "text",
          required: true
        },
        {
          name: "notes",
          type: "text",
          required: false
        }
      ],
      listRule: "", // Allow public read (so direct URL + PIN check is done client-side or public reading works)
      viewRule: "",
      createRule: "", // Allow public create so ushers can submit records without full PocketBase auth
      updateRule: "", // Allow updates
      deleteRule: null
    });
    console.log("Collection 'attendance_records' created successfully!");

    // Seed mock attendance data for previous Sundays
    console.log("Seeding mock attendance data...");

    const mockData = [
      {
        event_date: "2026-06-07 08:00:00.000Z",
        event_type: "Sunday Service",
        event_name: "Sunday Morning Service",
        session: "Morning",
        members_count: 380,
        visitors_count: 42,
        first_timers: 10,
        children_count: 75,
        youth_count: 55,
        adults_count: 292,
        salvations: 4,
        recorded_by: "Elder Kamau",
        notes: "Power-packed first Sunday of June. Smooth flow of service."
      },
      {
        event_date: "2026-06-14 08:00:00.000Z",
        event_type: "Sunday Service",
        event_name: "Sunday Morning Service",
        session: "Morning",
        members_count: 410,
        visitors_count: 48,
        first_timers: 15,
        children_count: 85,
        youth_count: 60,
        adults_count: 313,
        salvations: 8,
        recorded_by: "Sister Jane",
        notes: "High visitor turnout today. Excellent youth presentation."
      },
      {
        event_date: "2026-06-21 08:00:00.000Z",
        event_type: "Sunday Service",
        event_name: "Father's Day Special",
        session: "Morning",
        members_count: 450,
        visitors_count: 65,
        first_timers: 22,
        children_count: 95,
        youth_count: 70,
        adults_count: 350,
        salvations: 12,
        recorded_by: "Elder Kamau",
        notes: "Father's Day special service. Men's choir was outstanding."
      },
      {
        event_date: "2026-06-28 08:00:00.000Z",
        event_type: "Sunday Service",
        event_name: "Sunday Morning Service",
        session: "Morning",
        members_count: 430,
        visitors_count: 50,
        first_timers: 12,
        children_count: 80,
        youth_count: 65,
        adults_count: 335,
        salvations: 6,
        recorded_by: "Brother John",
        notes: "Slightly low attendance due to heavy rain in the morning."
      },
      {
        event_date: "2026-07-01 17:00:00.000Z",
        event_type: "Wednesday Bible Study",
        event_name: "Midweek Bible Study",
        session: "Evening",
        members_count: 150,
        visitors_count: 10,
        first_timers: 2,
        children_count: 20,
        youth_count: 30,
        adults_count: 110,
        salvations: 1,
        recorded_by: "Sister Jane",
        notes: "Study on the book of Nehemiah."
      }
    ];

    for (const record of mockData) {
      await pb.collection("attendance_records").create(record);
      console.log(`Seeded record for ${record.event_type} on ${record.event_date.split(' ')[0]}`);
    }

    console.log("=== FINISHED SUCCESS ===");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

run();
