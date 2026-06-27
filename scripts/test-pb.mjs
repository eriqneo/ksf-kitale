import PocketBase from 'pocketbase';

async function test() {
  const pb = new PocketBase('https://ksfkitale.pockethost.io');
  try {
    console.log("Attempting authentication...");
    const authData = await pb.admins.authWithPassword('aturaerick@gmail.com', 'dGY@SrzA86PQc5n');
    console.log("Auth success!");
    console.log("Token:", pb.authStore.token ? "Exists" : "None");
    console.log("Record/Admin ID:", authData.record.id);

    console.log("Testing collection creation with file field...");
    try {
      const fileColl = await pb.collections.create({
        name: 'test_pages_upload',
        type: 'base',
        fields: [
          { name: 'slug', type: 'text', required: true },
          { name: 'title', type: 'text', required: true },
          {
            name: 'hero_image',
            type: 'file',
            maxSelect: 1,
            maxSize: 5242880
          }
        ],
        listRule: '',
        viewRule: ''
      });
      console.log("Created successfully! Config:", JSON.stringify(fileColl, null, 2));

      console.log("Fetching a successful image...");
      const imgUrl = 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=100&q=80';
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const file = new File([blob], 'test_image.jpg', { type: blob.type });

      console.log("Testing creation with a valid File...");
      const rec1 = await pb.collection('test_pages_upload').create({
        slug: 'home',
        title: 'Home Page',
        hero_image: file
      });
      console.log("Created rec1 successfully:", JSON.stringify(rec1, null, 2));

      console.log("Testing creation with null hero_image...");
      const rec2 = await pb.collection('test_pages_upload').create({
        slug: 'about',
        title: 'About Page',
        hero_image: null
      });
      console.log("Created rec2 successfully:", JSON.stringify(rec2, null, 2));

      console.log("Deleting collection...");
      await pb.collections.delete('test_pages_upload');
      console.log("Deleted!");
    } catch (createErr) {
      console.error("Test failed!");
      console.error("Status:", createErr.status);
      console.error("Data:", JSON.stringify(createErr.data, null, 2));
      console.error("Raw Error:", createErr);
    }
  } catch (err) {
    console.error("Setup failed:", err);
  }
}

test();
