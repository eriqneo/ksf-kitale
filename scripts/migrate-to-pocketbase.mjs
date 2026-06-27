import PocketBase from 'pocketbase';

const PB_URL = 'https://ksfkitale.pockethost.io';
const ADMIN_EMAIL = 'aturaerick@gmail.com';
const ADMIN_PASS = 'dGY@SrzA86PQc5n';

const pb = new PocketBase(PB_URL);

// Helper function to download external image URLs and convert them to File objects for PocketBase uploads
async function downloadAsFile(url, defaultFileName, retryCount = 3) {
  if (!url || !url.startsWith('http')) return null;

  // Stagger requests slightly to avoid triggering rate limits
  await new Promise(resolve => setTimeout(resolve, 200));

  let targetUrl = url;
  if (url.includes('images.unsplash.com')) {
    targetUrl = url.replace(/w=\d+/, 'w=1000').replace(/q=\d+/, 'q=80');
    if (!targetUrl.includes('w=')) {
      targetUrl += targetUrl.includes('?') ? '&w=1000&q=80' : '?w=1000&q=80';
    }
  }

  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      console.log(`[Seeder] Downloading image for '${defaultFileName}' (Attempt ${attempt}/${retryCount}) from: ${targetUrl.substring(0, 60)}...`);
      const res = await fetch(targetUrl);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const blob = await res.blob();
      let ext = 'jpg';
      const contentType = res.headers.get('content-type');
      if (contentType) {
        if (contentType.includes('png')) ext = 'png';
        else if (contentType.includes('webp')) ext = 'webp';
        else if (contentType.includes('gif')) ext = 'gif';
      }
      const filename = `${defaultFileName}.${ext}`;
      return new File([blob], filename, { type: blob.type });
    } catch (err) {
      console.warn(`[Seeder] Warning: Attempt ${attempt} failed for ${url}. Error: ${err.message}`);
      if (attempt < retryCount) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  // Fallback: Use a 1x1 transparent PNG file to avoid breaking required field validations
  console.error(`[Seeder] Error: All retries failed for ${url}. Using 1x1 transparent PNG fallback.`);
  const fallbackPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    'base64'
  );
  const fallbackBlob = new Blob([fallbackPng], { type: 'image/png' });
  return new File([fallbackBlob], `${defaultFileName}_fallback.png`, { type: 'image/png' });
}

// Helper to retry asynchronous operations (like PocketBase requests) with exponential backoff
async function retryRequest(fn, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      console.warn(`[Seeder] Warning: PocketBase request failed (Attempt ${attempt}/${maxRetries}): ${err.message}`);
      if (attempt === maxRetries) throw err;
      // Wait longer on each retry attempt
      await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
    }
  }
}

// --- SEED DATA DEFINITIONS ---

const siteSettingsData = {
  church_name: "Kingdom Seekers Fellowship",
  tagline: "Seek Ye First the Kingdom of God",
  scripture_ref: "Matthew 6:33",
  location: "Kitale, Kenya",
  email: "info@ksfchurch.org",
  phone: "+254 700 000 000",
  youtube_url: "https://www.youtube.com/@KsfKitale/streams",
  facebook_url: "",
  instagram_url: "",
  whatsapp_url: "",
  google_maps_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.1823110878245!2d35.02584957301872!3d1.0230539989670981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1782275785543923%3A0xe7d5b05deeb5e499!2sKINGDOM%20SEEKERS%20FELLOWSHIP%20(KITALE)!5e0!3m2!1sen!2ske!4v1782503100856!5m2!1sen!2ske",
  google_maps_directions_url: "https://www.google.com/maps/dir/?api=1&destination=KINGDOM+SEEKERS+FELLOWSHIP+(KITALE)",
  mpesa_paybill: "222111",
  bank_name: "Co-operative Bank of Kenya",
  bank_branch: "Kitale Branch",
  bank_account_name: "Kingdom Seekers Fellowship",
  bank_account_number: "01129334582900"
};

const pagesData = [
  {
    slug: 'home',
    title: 'Home',
    hero_subtitle: 'JOIN US THIS WEEKEND',
    hero_heading: 'Sundays @',
    hero_description: 'Experience a community where lives are transformed. Making Disciples. Multiplying Churches.',
    hero_image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&q=80',
    sort_order: 1
  },
  {
    slug: 'im-new',
    title: "I'm New",
    hero_subtitle: 'YOU ARE WELCOME',
    hero_heading: "We're Glad You're Here.",
    hero_description: "Welcome to Kingdom Seekers Fellowship. Whether you're a lifelong believer or just exploring faith, there's a place for you here.",
    hero_image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=80',
    sort_order: 2
  },
  {
    slug: 'about-story',
    title: 'Our Story',
    hero_subtitle: 'CRAFTING A LEGACY',
    hero_heading: 'Our Story',
    hero_description: "The journey of faith at Kingdom Seekers Fellowship. Discover where we've been and where God is leading us next.",
    hero_image_url: 'https://images.unsplash.com/photo-1437603565678-c6f6ba998f64?w=1920&q=80',
    sort_order: 3
  },
  {
    slug: 'sermons',
    title: 'Sermons',
    hero_subtitle: 'THE WORD OF GOD',
    hero_heading: 'Sermons & Messages',
    hero_description: 'Faith comes by hearing, and hearing by the word of God. Be fed by the Word of God through our collection of life-transforming messages.',
    hero_image_url: 'https://images.unsplash.com/photo-1505663912202-ac22d4cb3707?w=1920&q=80',
    sort_order: 4
  },
  {
    slug: 'prayer-points',
    title: 'Prayer Points',
    hero_subtitle: 'MATTHEW 18:19 · UNIFIED INTERCESSION',
    hero_heading: 'Prayer Points & Declarations',
    hero_description: '"If two of you agree on earth about anything they ask, it will be done for them by my Father in heaven." Explore our interactive, scriptural prayer declarations below.',
    hero_image_url: 'https://images.unsplash.com/photo-1504052434139-443c4085b2c9?w=1920&q=80',
    sort_order: 5
  },
  {
    slug: 'gallery',
    title: 'Gallery',
    hero_subtitle: 'THROUGH THE LENS',
    hero_heading: 'Our Moments & Messages',
    hero_description: "A visual journey through the life of Kingdom Seekers Fellowship. Catch a glimpse of God's glory in our community.",
    hero_image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&q=80',
    sort_order: 6
  },
  {
    slug: 'give',
    title: 'Give',
    hero_subtitle: 'GENEROSITY',
    hero_heading: 'Support KSF Ministries',
    hero_description: '"Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver." — 2 Corinthians 9:7',
    hero_image_url: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=1920&q=80',
    sort_order: 7
  },
  {
    slug: 'ministries-kids',
    title: 'KSF Kids',
    hero_subtitle: 'MINISTRIES',
    hero_heading: 'KSF Kids',
    hero_description: 'Where faith is fun and every child is a Kingdom Seeker. We celebrate Jesus through stories, songs, and small groups made just for kids.',
    hero_image_url: 'https://images.unsplash.com/photo-1484069560501-87d72b0c3669?w=1920&q=80',
    sort_order: 8
  },
  {
    slug: 'ministries-youth',
    title: 'Youth Ministry',
    hero_subtitle: 'MINISTRIES',
    hero_heading: 'KSF Youth',
    hero_description: 'No longer a generation of the future, but a generation of the NOW. We empower teenagers to find their identity, purpose, and power in Jesus Christ.',
    hero_image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80',
    sort_order: 9
  },
  {
    slug: 'ministries-women',
    title: "Women's Fellowship",
    hero_subtitle: 'MINISTRIES',
    hero_heading: "Women's Fellowship",
    hero_description: 'Empowering women to walk boldly in their God-given identity, strength, and grace. A sisterhood committed to prayer, growth, and transformation.',
    hero_image_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&q=80',
    sort_order: 10
  },
  {
    slug: 'ministries-men',
    title: "Men's Brotherhood",
    hero_subtitle: 'MINISTRIES',
    hero_heading: "Men's Brotherhood",
    hero_description: 'Iron sharpens iron. We are building a brotherhood of men who are committed to spiritual excellence, integrity in leadership, and strength in character.',
    hero_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80',
    sort_order: 11
  },
  {
    slug: 'ministries-home-fellowship',
    title: 'Home Fellowship',
    hero_subtitle: 'MINISTRIES',
    hero_heading: 'Home Fellowship',
    hero_description: 'Real community happens in circles, not just rows. Join a Home Fellowship in your region to experience life-changing relationships and spiritual growth.',
    hero_image_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1920&q=80',
    sort_order: 12
  }
];

const eventsData = [
  {
    title: 'Sunday Worship Service',
    tag: 'Weekly',
    date_display: 'EVERY SUNDAY',
    day_short: 'SUN',
    month_short: 'WKLY',
    time: '8:00 AM & 10:30 AM',
    location: 'Main Sanctuary, Kitale',
    description: 'Join us for corporate prayer, powerful worship, and inspired teaching from God’s word.',
    image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
    capacity: 500,
    sort_order: 1
  },
  {
    title: 'KSF Youth Conference 2025',
    tag: 'Conference',
    date_display: 'JULY 19–21, 2025',
    day_short: '19',
    month_short: 'JUL',
    time: 'ALL DAY ENCOUNTER',
    location: 'KSF Arena, Kitale',
    description: 'An intensive three-day gathering equipping the next generation to lead with prayer and power.',
    image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    capacity: 300,
    sort_order: 2
  },
  {
    title: "Women's Prayer Breakfast",
    tag: 'Special Event',
    date_display: 'JUNE 7, 2025',
    day_short: '07',
    month_short: 'JUN',
    time: '7:00 AM – 10:00 AM',
    location: 'Hilltop Gardens, Kitale',
    description: 'A sacred morning of covenant fellowship, focused prayer, and divine table sharing.',
    image_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80',
    capacity: 150,
    sort_order: 3
  },
  {
    title: 'Global Missions Sunday',
    tag: 'Missions',
    date_display: 'AUGUST 3, 2025',
    day_short: '03',
    month_short: 'AUG',
    time: 'SPECIAL SERVICE',
    location: 'All KSF Fellowships',
    description: 'Celebrating our global outreach initiatives with powerful guest testimonies and cross-cultural prayers.',
    image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    capacity: 250,
    sort_order: 4
  },
  {
    title: 'Community Clean-up Day',
    tag: 'Outreach',
    date_display: 'MAY 24, 2025',
    day_short: '24',
    month_short: 'MAY',
    time: '9:00 AM – 12:00 PM',
    location: 'Kitale Town Square',
    description: 'Being the hands and feet of Jesus, cleaning and restoring our local community spaces together.',
    image_url: 'https://images.unsplash.com/photo-1516880711640-ef7db81be3e1?w=800&q=80',
    capacity: 100,
    sort_order: 5
  },
  {
    title: 'Foundations Class',
    tag: 'Discipleship',
    date_display: 'EVERY WEDNESDAY',
    day_short: 'WED',
    month_short: 'WKLY',
    time: '6:30 PM – 8:00 PM',
    location: 'KSF Prayer Pavilion',
    description: 'Deep diving into the foundational doctrines of Christ to ground and build up your personal walk with God.',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
    capacity: 120,
    sort_order: 6
  }
];

const servicesData = [
  {
    title: "Sunday Services",
    time: "Main Celebration",
    description: "Join us for our main Sunday gathering of worship and the Word.",
    icon: "☀️",
    image_url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
    link: "/sermons",
    sort_order: 1
  },
  {
    title: "Morning Glory",
    time: "5:00 AM - 6:30 AM",
    description: "Morning services every Monday through Friday to start your day with God.",
    icon: "🌅",
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
    link: "#",
    sort_order: 2
  },
  {
    title: "Monday Evening",
    time: "4:00 PM - 6:00 PM",
    description: "Evening fellowship and prayers to sharpen your start to the week.",
    icon: "🌙",
    image_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    link: "#",
    sort_order: 3
  },
  {
    title: "Wednesday Service",
    time: "4:00 PM - 6:00 PM",
    description: "A midweek spiritual boost through worship and deep teaching.",
    icon: "📖",
    image_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    link: "#",
    sort_order: 4
  },
  {
    title: "Friday Night Vigil",
    time: "9:30 PM - 3:00 AM",
    description: "Powerful night of prayer and spiritual atmosphere to end the week.",
    icon: "🕯️",
    image_url: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80",
    link: "#",
    sort_order: 5
  },
  {
    title: "Home Fellowship",
    time: "Various Times",
    description: "Connect in smaller groups within your neighborhood for deep roots.",
    icon: "🏠",
    image_url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80",
    link: "/ministries/home-fellowship",
    sort_order: 6
  }
];

const ministriesData = [
  {
    slug: 'kids',
    title: 'KSF Kids',
    icon: '👶',
    description: 'Raising the next generation of Kingdom seekers. Fun, faith-filled programs for children.',
    link: '/ministries/kids',
    hero_image_url: 'https://images.unsplash.com/photo-1484069560501-87d72b0c3669?w=1920&q=80',
    hero_heading: 'KSF Kids',
    hero_subtitle: 'MINISTRIES',
    hero_description: 'Where faith is fun and every child is a Kingdom Seeker. We celebrate Jesus through stories, songs, and small groups made just for kids.',
    regions: [],
    sort_order: 1
  },
  {
    slug: 'youth',
    title: 'Youth Ministry',
    icon: '🙏',
    description: 'A space for teenagers to explore faith, identity, and purpose in Christ.',
    link: '/ministries/youth',
    hero_image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80',
    hero_heading: 'KSF Youth',
    hero_subtitle: 'MINISTRIES',
    hero_description: 'No longer a generation of the future, but a generation of the NOW. We empower teenagers to find their identity, purpose, and power in Jesus Christ.',
    regions: [],
    sort_order: 2
  },
  {
    slug: 'home-fellowship',
    title: 'Home Fellowship',
    icon: '👥',
    description: 'Regional small groups where real life change happens. Community happens in circles.',
    link: '/ministries/home-fellowship',
    hero_image_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1920&q=80',
    hero_heading: 'Home Fellowship',
    hero_subtitle: 'MINISTRIES',
    hero_description: 'Real community happens in circles, not just rows. Join a Home Fellowship in your region to experience life-changing relationships and spiritual growth.',
    regions: [
      {
        id: 'judea',
        name: 'Judea Region',
        location: 'Central Districts',
        desc: 'The heartbeat of our fellowship, focused on deepening spiritual roots and urban outreach.',
        img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
      },
      {
        id: 'bethlehem',
        name: 'Bethlehem Region',
        location: 'North Suburbs',
        desc: 'A family-centric region where generations connect and grow together in intimacy with God.',
        img: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
      },
      {
        id: 'antioch',
        name: 'Antioch Region',
        location: 'West Corridor',
        desc: 'Our hub for missions and training, empowering believers to take the Gospel to their workplaces.',
        img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
      },
      {
        id: 'galilee',
        name: 'Galilee Region',
        location: 'South Side',
        desc: 'Known for its vibrant community and focus on prayer, healing, and restored relationships.',
        img: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
      }
    ],
    sort_order: 3
  },
  {
    slug: 'women',
    title: "Women's Fellowship",
    icon: '👩',
    description: 'Empowering women to walk boldly in their God-given identity and calling.',
    link: '/ministries/women',
    hero_image_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&q=80',
    hero_heading: "Women's Fellowship",
    hero_subtitle: 'MINISTRIES',
    hero_description: 'Empowering women to walk boldly in their God-given identity, strength, and grace. A sisterhood committed to prayer, growth, and transformation.',
    regions: [],
    sort_order: 4
  },
  {
    slug: 'men',
    title: "Men's Brotherhood",
    icon: '💪',
    description: 'Iron sharpens iron. A brotherhood of men committed to faith and excellence.',
    link: '/ministries/men',
    hero_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80',
    hero_heading: "Men's Brotherhood",
    hero_subtitle: 'MINISTRIES',
    hero_description: 'Iron sharpens iron. We are building a brotherhood of men who are committed to spiritual excellence, integrity in leadership, and strength in character.',
    regions: [],
    sort_order: 5
  },
  {
    slug: 'missions',
    title: 'Global Missions',
    icon: '🌍',
    description: 'Taking the Gospel beyond borders. KSF believes in reaching the unreached.',
    link: '/about/story#strategies',
    hero_image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    hero_heading: 'Global Missions',
    hero_subtitle: 'MINISTRIES',
    hero_description: 'Taking the Gospel beyond borders. KSF believes in reaching the unreached.',
    regions: [],
    sort_order: 6
  }
];

const sermonsData = [
  {
    title: "The Kingdom Perspective: Living Beyond the Visible",
    speaker: "Pastor David Maina",
    date: "May 2, 2024",
    duration: "45 mins",
    series: "Kingdom Perspective",
    thumbnail_url: "https://images.unsplash.com/photo-1505663912202-ac22d4cb3707?w=800&q=80",
    video_url: "https://www.youtube.com/embed/uEnVhRdDUBk?si=VQtnbJifKdptOzU6",
    is_featured: true,
    sort_order: 1
  },
  {
    title: "Walking in Divine Purpose",
    speaker: "Pastor David Maina",
    date: "April 27, 2024",
    duration: "45 mins",
    series: "Kingdom Life",
    thumbnail_url: "https://picsum.photos/seed/sermon1/800/450",
    video_url: "https://www.youtube.com/embed/uEnVhRdDUBk?si=VQtnbJifKdptOzU6",
    is_featured: false,
    sort_order: 2
  },
  {
    title: "The Power of Persistance",
    speaker: "Pastor Jane Doe",
    date: "April 20, 2024",
    duration: "38 mins",
    series: "Breakthrough",
    thumbnail_url: "https://picsum.photos/seed/sermon2/800/450",
    video_url: "https://www.youtube.com/embed/uEnVhRdDUBk?si=VQtnbJifKdptOzU6",
    is_featured: false,
    sort_order: 3
  },
  {
    title: "Restoring the Foundation",
    speaker: "Bishop Samuel G.",
    date: "April 13, 2024",
    duration: "52 mins",
    series: "Foundations",
    thumbnail_url: "https://picsum.photos/seed/sermon3/800/450",
    video_url: "https://www.youtube.com/embed/uEnVhRdDUBk?si=VQtnbJifKdptOzU6",
    is_featured: false,
    sort_order: 4
  },
  {
    title: "Grace for the Journey",
    speaker: "Pastor David Maina",
    date: "April 6, 2024",
    duration: "41 mins",
    series: "Grace Unbound",
    thumbnail_url: "https://picsum.photos/seed/sermon4/800/450",
    video_url: "https://www.youtube.com/embed/uEnVhRdDUBk?si=VQtnbJifKdptOzU6",
    is_featured: false,
    sort_order: 5
  },
  {
    title: "Faith in the Fire",
    speaker: "Pastor Sarah Kim",
    date: "March 30, 2024",
    duration: "47 mins",
    series: "Steadfast",
    thumbnail_url: "https://picsum.photos/seed/sermon5/800/450",
    video_url: "https://www.youtube.com/embed/uEnVhRdDUBk?si=VQtnbJifKdptOzU6",
    is_featured: false,
    sort_order: 6
  },
  {
    title: "New Beginnings",
    speaker: "Pastor David Maina",
    date: "March 23, 2024",
    duration: "45 mins",
    series: "Restoration",
    thumbnail_url: "https://picsum.photos/seed/sermon6/800/450",
    video_url: "https://www.youtube.com/embed/uEnVhRdDUBk?si=VQtnbJifKdptOzU6",
    is_featured: false,
    sort_order: 7
  }
];

const galleryImagesData = [
  {
    title: 'Sunday Morning Worship',
    category: 'Worship',
    image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&q=80',
    sort_order: 1
  },
  {
    title: 'Youth Night Fellowship',
    category: 'Youth',
    image_url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&q=80',
    sort_order: 2
  },
  {
    title: 'Community Outreach Program',
    category: 'Outreach',
    image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
    sort_order: 3
  },
  {
    title: 'Heart of Worship',
    category: 'Worship',
    image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80',
    sort_order: 4
  },
  {
    title: 'Small Groups Breakfast',
    category: 'Community',
    image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&q=80',
    sort_order: 5
  },
  {
    title: 'Youth Prayer Summit',
    category: 'Youth',
    image_url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1200&q=80',
    sort_order: 6
  },
  {
    title: 'Grace Circle Gathering',
    category: 'Community',
    image_url: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=1200&q=80',
    sort_order: 7
  },
  {
    title: 'Missions in the City',
    category: 'Outreach',
    image_url: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200&q=80',
    sort_order: 8
  },
  {
    title: 'Festival of Faith',
    category: 'Worship',
    image_url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80',
    sort_order: 9
  }
];

const leadershipTeamData = [
  {
    name: "Pastor Herman Walucho",
    role: "Lead Pastor",
    bio: "Devoted to preaching the Gospel, local discipleship, and guiding the spiritual vision of KSF.",
    image_url: "https://picsum.photos/seed/herman/300/300",
    facebook_url: "",
    linkedin_url: "",
    sort_order: 1
  },
  {
    name: "Pastor Faith Walucho",
    role: "Lead Pastor",
    bio: "Passionate about building healthy families, shepherd leadership, and nurturing our connect group networks.",
    image_url: "https://picsum.photos/seed/faith/300/300",
    facebook_url: "",
    linkedin_url: "",
    sort_order: 2
  },
  {
    name: "Pastor Stella Opicho",
    role: "Associate Pastor",
    bio: "Overseeing connect groups, local missions, and dedicated pastoral counseling.",
    image_url: "https://picsum.photos/seed/stella/300/300",
    facebook_url: "",
    linkedin_url: "",
    sort_order: 3
  },
  {
    name: "Pastor Erickson Wabuke",
    role: "Associate Pastor",
    bio: "Empowering youth ministries, community outreach, and discipleship pathways.",
    image_url: "https://picsum.photos/seed/erickson/300/300",
    facebook_url: "",
    linkedin_url: "",
    sort_order: 4
  },
  {
    name: "Pastor Martin Simiyu",
    role: "Associate Pastor",
    bio: "Leading prayer ministries, family enrichment programs, and worship fellowship integrations.",
    image_url: "https://picsum.photos/seed/martin/300/300",
    facebook_url: "",
    linkedin_url: "",
    sort_order: 5
  },
  {
    name: "Pastor Jane Juma",
    role: "Associate Pastor",
    bio: "Dedicated to women's fellowship, children ministries, and caring pastoral care services.",
    image_url: "https://picsum.photos/seed/jane/300/300",
    facebook_url: "",
    linkedin_url: "",
    sort_order: 6
  }
];

const coreValuesData = [
  {
    title: "Humility",
    slogan: "Walking in lowliness of mind, esteeming others better than ourselves.",
    content: "We pattern our lives after Jesus Christ, who took the form of a servant. True power and spiritual authority are birthed from a humble heart that seeks God's glory rather than human recognition. We serve with joy, without pretense, and count it a privilege to lift up others.",
    sort_order: 1
  },
  {
    title: "Integrity",
    slogan: "Living transparently, matching our private devotion with our public witness.",
    content: "We value honesty, accountability, and ethical purity. At KSF, integrity means being the same person in the secret place as we are in the spotlight. We guard our character above our reputation, ensuring our words, actions, and finances are aligned with Scripture.",
    sort_order: 2
  },
  {
    title: "Stewardship",
    slogan: "Managing God's resources, time, and talents for His eternal purpose.",
    content: "Everything we have belongs to God. We are faithful managers of the time, talents, spiritual gifts, and material resources He has entrusted to us. We give generously, manage wisely, and invest diligently in the local community to multiply God's Kingdom on earth.",
    sort_order: 3
  },
  {
    title: "Prayer",
    slogan: "Our lifeline, breath, and the engine of every breakthrough.",
    content: "We do not merely pray to start our meetings; we pray to sustain our lives. Prayer is our direct connection to the Father, where we seek His face, receive His strategies, and petition for breakthroughs. KSF is a house of prayer, intercession, and spiritual warfare.",
    sort_order: 4
  },
  {
    title: "Holiness",
    slogan: "Set apart for God's glory, pursuing purity in a compromising world.",
    content: "God is holy, and He calls us to be holy in all our conduct. Holiness is not legalism, but a loving response to His grace. We actively pursue purity of heart, mind, and action, setting ourselves apart from worldly compromises to be vessels fit for the Master's use.",
    sort_order: 5
  },
  {
    title: "Excellence",
    slogan: "Doing our best, with the best attitude, for the Greatest Master.",
    content: "We believe that God deserves our absolute best. In worship, media, teaching, and hospitality, we pursue the highest standards. Excellence is a reflection of God's character and our ultimate love for Him. We do everything heartily, as unto the Lord.",
    sort_order: 6
  }
];

const milestonesData = [
  {
    year: "2016",
    era: "genesis",
    title: "Founding & House Fellowships",
    description: "Kingdom Seekers Fellowship begins as a small prayer gathering of faithful believers seeking God's face in home rooms, dedicated to a simple vision: seek God first.",
    sort_order: 1
  },
  {
    year: "2017",
    era: "genesis",
    title: "The First Public Sanctuary",
    description: "Formally launching public Sunday services in Kitale, setting the foundational mission 'Seek Ye First' and establishing our core values of humility and excellence.",
    sort_order: 2
  },
  {
    year: "2018",
    era: "genesis",
    title: "Youth and Kids Ministries",
    description: "Dedicating structured programs, custom teaching tools, and safe environments to ground the next generation of KSF children and teens in biblical truth.",
    sort_order: 3
  },
  {
    year: "2019",
    era: "genesis",
    title: "Connect Groups Multiply",
    description: "Midweek home fellowships multiply across distinct Kitale neighborhoods to foster deep, authentic discipleship, care networks, and mutual support.",
    sort_order: 4
  },
  {
    year: "2020",
    era: "roots",
    title: "The Digital Shift",
    description: "Pivoting swiftly to state-of-the-art online live broadcasts and media, connecting thousands of KSF family members globally during challenging global seasons.",
    sort_order: 5
  },
  {
    year: "2021",
    era: "roots",
    title: "New Sanctuary & Worship Expansion",
    description: "Moving into a larger, dedicated sanctuary space with high-quality media facilities to accommodate our rapidly growing community and worship team.",
    sort_order: 6
  },
  {
    year: "2022",
    era: "roots",
    title: "Regional Zone Formatting",
    description: "Organizing home fellowships into four primary spiritual and care zones: Judea (Central), Bethlehem (North), Antioch (West), and Galilee (South) for decentralized care.",
    sort_order: 7
  },
  {
    year: "2023",
    era: "roots",
    title: "Leadership Academy Launch",
    description: "Initiating a comprehensive leadership training school to equip, mentor, and commission believers for practical service and marketplace ministry.",
    sort_order: 8
  },
  {
    year: "2024",
    era: "impact",
    title: "Global Prayer Network",
    description: "Unveiling the 24/7 global intercessory prayer lines and digital prayer chains, connecting intercessors across nations for continuous spiritual warfare.",
    sort_order: 9
  },
  {
    year: "2025",
    era: "impact",
    title: "Missions & Mercy Outreaches",
    description: "Expanding active charity works, regional missions, medical camps, and community-empowering help initiatives to demonstrate God's love practically.",
    sort_order: 10
  },
  {
    year: "2026",
    era: "impact",
    title: "The Future & Beyond",
    description: "Walking in total obedience to the Holy Spirit's guidance, multiplying our reach, launching new campuses, and serving the body of Christ with absolute excellence.",
    sort_order: 11
  }
];

const prayerCategoriesData = [
  {
    title: 'Prayer for Children & Next Gen',
    icon: 'Heart',
    color: 'text-bold-red',
    key_verse: 'All your children shall be taught by the Lord, and great shall be the peace of your children.',
    key_reference: 'Isaiah 54:13',
    prayers: [
      {
        id: 'child-1',
        focus: 'Early Salvation & Spiritual Foundation',
        scripture: '2 Timothy 3:15 & Deuteronomy 6:5-7',
        verseText: 'And that from childhood you have known the Holy Scriptures, which are able to make you wise for salvation through faith which is in Christ Jesus.',
        prayerDeclaration: 'Heavenly Father, we declare that our children are soft soil to Your Word. We pray that they will choose to seek and surrender to Jesus at an early age. Let Your Spirit capture their hearts and establish a firm foundation of faith that cannot be shaken by peer pressure or cultural winds.'
      },
      {
        id: 'child-2',
        focus: 'Divine Safety & Emotional Protection',
        scripture: 'Psalm 91:11-12 & Luke 2:52',
        verseText: 'For He shall give His angels charge over you, to keep you in all your ways.',
        prayerDeclaration: 'Lord, we erect a hedge of fire around our children. Protect them from spiritual predators, physical harm, accidents, and toxic emotional environments. Build emotional resilience in them, guarding their minds with Your perfect peace and shielding them from anxiety, depression, and low self-worth.'
      },
      {
        id: 'child-3',
        focus: 'Intellectual Excellence & Divine Wisdom',
        scripture: 'Daniel 1:17 & James 1:5',
        verseText: 'As for these four young men, God gave them knowledge and skill in all literature and wisdom; and Daniel had understanding in all visions and dreams.',
        prayerDeclaration: 'Father, bless our children with exceptional wisdom, focus, and creativity. We decree that they are the head and not the tail. Equip them to excel in school, to grasp complex subjects with ease, and to discover their God-given purposes so they can make an impact in the marketplace for Your Glory.'
      },
      {
        id: 'child-4',
        focus: 'Godly Friendships & Associations',
        scripture: 'Proverbs 13:20 & 1 Corinthians 15:33',
        verseText: 'He who walks with wise men will be wise, but the companion of fools will be destroyed.',
        prayerDeclaration: 'Holy Spirit, guide our children in selecting their friends. Weed out any negative influences or associations that might compromise their character. Direct them to godly peers and mentors who will encourage them to love Christ, run with righteousness, and grow in destiny.'
      }
    ],
    sort_order: 1
  },
  {
    title: 'Prayer for Families & Marriages',
    icon: 'Shield',
    color: 'text-primary-blue',
    key_verse: 'As for me and my house, we will serve the Lord.',
    key_reference: 'Joshua 24:15',
    prayers: [
      {
        id: 'fam-1',
        focus: 'Unity, Forgiveness & Peace',
        scripture: 'Colossians 3:13-14',
        verseText: 'Bearing with one another, and forgiving one another... But above all these things put on love, which is the bond of perfection.',
        prayerDeclaration: 'Lord, we decree that KSF marriages and families are bound together in perfect harmony. Root out all strife, resentment, pride, and communication barriers. Let Your supernatural peace reign in every home, making them safe havens of healing, laughter, and prayer.'
      },
      {
        id: 'fam-2',
        focus: 'Marital Restoration & Faithfulness',
        scripture: 'Malachi 2:16 & Genesis 2:24',
        verseText: 'Therefore a man shall leave his father and mother and be joined to his wife, and they shall become one flesh.',
        prayerDeclaration: 'Father, strengthen every marital union under KSF. We pray against separation, divorce, and infidelity. Reignite first-love passion, restore trust where it has been fractured, and supply supernatural grace to husbands and wives to love and honor each other unconditionally.'
      }
    ],
    sort_order: 2
  },
  {
    title: 'Prayer for Healing & Restoration',
    icon: 'Sparkles',
    color: 'text-emerald-600',
    key_verse: 'For I will restore health to you and heal you of your wounds, says the Lord.',
    key_reference: 'Jeremiah 30:17',
    prayers: [
      {
        id: 'heal-1',
        focus: 'Physical Healing & Deliverance',
        scripture: 'Isaiah 53:5 & 1 Peter 2:24',
        verseText: 'But He was wounded for our transgressions, He was bruised for our iniquities; the chastisement for our peace was upon Him, and by His stripes we are healed.',
        prayerDeclaration: 'Jehovah Rapha, we stand on the finished work of the cross and command every sickness, terminal disease, pain, and physical infirmity to leave the bodies of Your saints now! We declare fresh strength, functioning organs, and supernatural restoration from the crown of their heads to the soles of their feet.'
      },
      {
        id: 'heal-2',
        focus: 'Mental & Emotional Wellness',
        scripture: '2 Timothy 1:7 & Isaiah 26:3',
        verseText: 'For God has not given us a spirit of fear, but of power and of love and of a sound mind.',
        prayerDeclaration: 'Lord, deliver Your people from trauma, anxiety, panic attacks, and depression. Restructure broken neural pathways and mend shattered hearts. We take captive every dark, obsessive, or suicidal thought and declare that Your perfect love casts out all fear, gifting us a clear, sound, and disciplined mind.'
      }
    ],
    sort_order: 3
  },
  {
    title: 'Prayer for Financial Breakthrough & Provision',
    icon: 'Coins',
    color: 'text-amber-600',
    key_verse: 'And my God shall supply all your need according to His riches in glory by Christ Jesus.',
    key_reference: 'Philippians 4:19',
    prayers: [
      {
        id: 'fin-1',
        focus: 'Debt Deliverance & Open Doors',
        scripture: 'Deuteronomy 28:12 & Proverbs 10:22',
        verseText: 'The Lord will open to you His good treasure, the heavens, to give the rain to your land in its season and to bless all the work of your hand.',
        prayerDeclaration: 'Father, break the back of systemic poverty, lack, and debt in our lives. We speak financial freedom over every KSF member. Open fresh channels of income, supernatural employment opportunities, and business ideas that command wealth. Grant us the wisdom to manage, save, and invest for kingdom expansion.'
      },
      {
        id: 'fin-2',
        focus: 'Generosity & Tithing Blessings',
        scripture: 'Malachi 3:10 & 2 Corinthians 9:8',
        verseText: 'And God is able to make all grace abound toward you, that you, always having all sufficiency in all things, may have an abundance for every good work.',
        prayerDeclaration: 'We pray for a heart of radical generosity. Make us cheerful givers and faithful stewards of tithes and offerings. As we sow into Your Kingdom, let the windows of heaven be thrown open wide, bringing forth blessings, favor, and security that no devourer can touch.'
      }
    ],
    sort_order: 4
  },
  {
    title: 'Spiritual Growth & Church Revival',
    icon: 'Flame',
    color: 'text-orange-600',
    key_verse: 'Will You not revive us again, that Your people may rejoice in You?',
    key_reference: 'Psalm 85:6',
    prayers: [
      {
        id: 'rev-1',
        focus: 'Hunger for God & Prayer Revival',
        scripture: 'Ephesians 1:17-18 & Matthew 5:6',
        verseText: 'Blessed are those who hunger and thirst for righteousness, for they shall be filled.',
        prayerDeclaration: 'Holy Spirit, rekindle a burning, unquenchable passion for prayer and study of the Word in KSF. Do not let us grow lukewarm or comfortable. Open the eyes of our understanding to see Christ in His full beauty, prompting daily surrender and intercession that shakes our homes and our city.'
      },
      {
        id: 'rev-2',
        focus: 'Supernatural Manifestations & Salvation of Souls',
        scripture: 'Acts 4:30 & Mark 16:20',
        verseText: 'By stretching out Your hand to heal, and that signs and wonders may be done through the name of Your holy Servant Jesus.',
        prayerDeclaration: 'Heavenly Father, accompany Your Word at Kingdom Seekers Fellowship with raw demonstrations of power—miracles, signs, wonders, and instant healings. Draw the lost, the broken, and the skeptical into Your gates, and let thousands find salvation, transformation, and water baptism in Jesus\' name.'
      }
    ],
    sort_order: 5
  },
  {
    title: 'Prayer for our Nation & Leadership',
    icon: 'Globe',
    color: 'text-purple-600',
    key_verse: 'If My people who are called by My name will humble themselves, and pray and seek My face... then I will hear from heaven, and will forgive their sin and heal their land.',
    key_reference: '2 Chronicles 7:14',
    prayers: [
      {
        id: 'nat-1',
        focus: 'Peace, Economic Justice & Integrity',
        scripture: '1 Timothy 2:1-2 & Proverbs 29:2',
        verseText: 'When the righteous are in authority, the people rejoice; but when a wicked man rules, the people groan.',
        prayerDeclaration: 'Lord, we lift the nation of Kenya and its leadership. Grant our President, governors, lawmakers, and judges judicial integrity, pure motives, and divine wisdom. We bind tribal division, corruption, corruption networks, and social injustice. Let equity, economic prosperity, and national cohesion saturate our land.'
      }
    ],
    sort_order: 6
  }
];

// --- COLLECTION SCHEMAS CONFIGURATIONS ---

const collections = [
  {
    name: 'site_settings',
    type: 'base',
    fields: [
      { name: 'church_name', type: 'text', required: true },
      { name: 'tagline', type: 'text' },
      { name: 'scripture_ref', type: 'text' },
      { name: 'location', type: 'text' },
      { name: 'email', type: 'email' },
      { name: 'phone', type: 'text' },
      { name: 'youtube_url', type: 'url' },
      { name: 'facebook_url', type: 'url' },
      { name: 'instagram_url', type: 'url' },
      { name: 'whatsapp_url', type: 'url' },
      { name: 'google_maps_embed_url', type: 'url' },
      { name: 'google_maps_directions_url', type: 'url' },
      { name: 'mpesa_paybill', type: 'text' },
      { name: 'bank_name', type: 'text' },
      { name: 'bank_branch', type: 'text' },
      { name: 'bank_account_name', type: 'text' },
      { name: 'bank_account_number', type: 'text' }
    ],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null
  },
  {
    name: 'pages',
    type: 'base',
    fields: [
      { name: 'slug', type: 'text', required: true },
      { name: 'title', type: 'text', required: true },
      { name: 'hero_subtitle', type: 'text' },
      { name: 'hero_heading', type: 'text' },
      { name: 'hero_description', type: 'text' },
      { name: 'hero_image', type: 'file', maxSelect: 1, maxSize: 5242880 },
      { name: 'sort_order', type: 'number' }
    ],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null
  },
  {
    name: 'events',
    type: 'base',
    fields: [
      { name: 'title', type: 'text', required: true },
      {
        name: 'tag',
        type: 'select',
        required: true,
        values: ['Weekly', 'Conference', 'Special Event', 'Missions', 'Outreach', 'Discipleship'],
        maxSelect: 1
      },
      { name: 'date_display', type: 'text' },
      { name: 'day_short', type: 'text' },
      { name: 'month_short', type: 'text' },
      { name: 'time', type: 'text' },
      { name: 'location', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'image', type: 'file', maxSelect: 1, maxSize: 5242880 },
      { name: 'capacity', type: 'number' },
      { name: 'sort_order', type: 'number' }
    ],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null
  },
  {
    name: 'services',
    type: 'base',
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'time', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'icon', type: 'text' },
      { name: 'image', type: 'file', maxSelect: 1, maxSize: 5242880 },
      { name: 'link', type: 'text' },
      { name: 'sort_order', type: 'number' }
    ],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null
  },
  {
    name: 'ministries',
    type: 'base',
    fields: [
      { name: 'slug', type: 'text', required: true },
      { name: 'title', type: 'text', required: true },
      { name: 'icon', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'link', type: 'text' },
      { name: 'hero_image', type: 'file', maxSelect: 1, maxSize: 5242880 },
      { name: 'hero_heading', type: 'text' },
      { name: 'hero_subtitle', type: 'text' },
      { name: 'hero_description', type: 'text' },
      { name: 'regions', type: 'json' },
      { name: 'sort_order', type: 'number' }
    ],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null
  },
  {
    name: 'sermons',
    type: 'base',
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'speaker', type: 'text' },
      { name: 'date', type: 'text' },
      { name: 'duration', type: 'text' },
      { name: 'series', type: 'text' },
      { name: 'thumbnail', type: 'file', maxSelect: 1, maxSize: 5242880 },
      { name: 'video_url', type: 'url' },
      { name: 'is_featured', type: 'bool' },
      { name: 'sort_order', type: 'number' }
    ],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null
  },
  {
    name: 'gallery_images',
    type: 'base',
    fields: [
      { name: 'title', type: 'text', required: true },
      {
        name: 'category',
        type: 'select',
        required: true,
        values: ['Worship', 'Community', 'Outreach', 'Youth'],
        maxSelect: 1
      },
      { name: 'image', type: 'file', required: true, maxSelect: 1, maxSize: 5242880 },
      { name: 'sort_order', type: 'number' }
    ],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null
  },
  {
    name: 'leadership_team',
    type: 'base',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'role', type: 'text' },
      { name: 'bio', type: 'text' },
      { name: 'image', type: 'file', maxSelect: 1, maxSize: 5242880 },
      { name: 'facebook_url', type: 'url' },
      { name: 'linkedin_url', type: 'url' },
      { name: 'sort_order', type: 'number' }
    ],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null
  },
  {
    name: 'core_values',
    type: 'base',
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'slogan', type: 'text' },
      { name: 'content', type: 'text' },
      { name: 'sort_order', type: 'number' }
    ],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null
  },
  {
    name: 'milestones',
    type: 'base',
    fields: [
      { name: 'year', type: 'text', required: true },
      {
        name: 'era',
        type: 'select',
        required: true,
        values: ['genesis', 'roots', 'impact'],
        maxSelect: 1
      },
      { name: 'title', type: 'text', required: true },
      { name: 'description', type: 'text' },
      { name: 'sort_order', type: 'number' }
    ],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null
  },
  {
    name: 'prayer_categories',
    type: 'base',
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'icon', type: 'text' },
      { name: 'color', type: 'text' },
      { name: 'key_verse', type: 'text' },
      { name: 'key_reference', type: 'text' },
      { name: 'prayers', type: 'json' },
      { name: 'sort_order', type: 'number' }
    ],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null
  },
  {
    name: 'contact_messages',
    type: 'base',
    fields: [
      { name: 'full_name', type: 'text', required: true },
      { name: 'email', type: 'email', required: true },
      { name: 'phone', type: 'text' },
      { name: 'message', type: 'text', required: true },
      { name: 'is_read', type: 'bool' }
    ],
    listRule: null, // secure, admin only
    viewRule: null, // secure, admin only
    createRule: '', // anyone can submit contact form
    updateRule: null,
    deleteRule: null
  }
];

// --- MIGRATION RUNNER ---

async function runMigration() {
  console.log("=== KSF KITALE PORTING AND SEED SCRIPT ===");
  try {
    console.log(`[1/5] Authenticating to PocketBase at: ${PB_URL}...`);
    await retryRequest(() => pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS));
    console.log("Authentication successful!");

    console.log("\n[2/5] Initializing collection recreation (deleting if exists to refresh)...");
    for (const collConfig of collections) {
      const name = collConfig.name;
      try {
        await retryRequest(() => pb.collections.delete(name));
        console.log(` - Deleted existing collection: ${name}`);
      } catch (e) {
        // Doesn't exist, ignore
      }
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log("\n[3/5] Creating collections with configured schemas...");
    for (const collConfig of collections) {
      console.log(` - Creating collection: ${collConfig.name}...`);
      await retryRequest(() => pb.collections.create(collConfig));
      console.log(`   ✓ Collection ${collConfig.name} created.`);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log("\n[4/5] Seeding data into collections...");
    
    // Seed site_settings
    console.log(" - Seeding site_settings...");
    await retryRequest(() => pb.collection('site_settings').create(siteSettingsData));
    console.log("   ✓ Seeding site_settings complete.");

    // Seed pages
    console.log(" - Seeding pages...");
    for (const page of pagesData) {
      const payload = { ...page };
      if (page.hero_image_url) {
        payload.hero_image = await downloadAsFile(page.hero_image_url, `${page.slug}_hero`);
        delete payload.hero_image_url;
      }
      await retryRequest(() => pb.collection('pages').create(payload));
    }
    console.log(`   ✓ Seeded ${pagesData.length} records in pages.`);

    // Seed events
    console.log(" - Seeding events...");
    for (const event of eventsData) {
      const payload = { ...event };
      if (event.image_url) {
        const cleanTitle = event.title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        payload.image = await downloadAsFile(event.image_url, `event_${cleanTitle}`);
        delete payload.image_url;
      }
      await retryRequest(() => pb.collection('events').create(payload));
    }
    console.log(`   ✓ Seeded ${eventsData.length} records in events.`);

    // Seed services
    console.log(" - Seeding services...");
    for (const service of servicesData) {
      const payload = { ...service };
      if (service.image_url) {
        const cleanTitle = service.title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        payload.image = await downloadAsFile(service.image_url, `service_${cleanTitle}`);
        delete payload.image_url;
      }
      await retryRequest(() => pb.collection('services').create(payload));
    }
    console.log(`   ✓ Seeded ${servicesData.length} records in services.`);

    // Seed ministries
    console.log(" - Seeding ministries...");
    for (const ministry of ministriesData) {
      const payload = { ...ministry };
      if (ministry.hero_image_url) {
        payload.hero_image = await downloadAsFile(ministry.hero_image_url, `ministry_${ministry.slug}`);
        delete payload.hero_image_url;
      }
      await retryRequest(() => pb.collection('ministries').create(payload));
    }
    console.log(`   ✓ Seeded ${ministriesData.length} records in ministries.`);

    // Seed sermons
    console.log(" - Seeding sermons...");
    for (const sermon of sermonsData) {
      const payload = { ...sermon };
      if (sermon.thumbnail_url) {
        const cleanTitle = sermon.title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        payload.thumbnail = await downloadAsFile(sermon.thumbnail_url, `sermon_${cleanTitle}`);
        delete payload.thumbnail_url;
      }
      await retryRequest(() => pb.collection('sermons').create(payload));
    }
    console.log(`   ✓ Seeded ${sermonsData.length} records in sermons.`);

    // Seed gallery_images
    console.log(" - Seeding gallery_images...");
    for (const img of galleryImagesData) {
      const payload = { ...img };
      if (img.image_url) {
        const cleanTitle = img.title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        payload.image = await downloadAsFile(img.image_url, `gallery_${cleanTitle}`);
        delete payload.image_url;
      }
      await retryRequest(() => pb.collection('gallery_images').create(payload));
    }
    console.log(`   ✓ Seeded ${galleryImagesData.length} records in gallery_images.`);

    // Seed leadership_team
    console.log(" - Seeding leadership_team...");
    for (const leader of leadershipTeamData) {
      const payload = { ...leader };
      if (leader.image_url) {
        const cleanName = leader.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        payload.image = await downloadAsFile(leader.image_url, `leader_${cleanName}`);
        delete payload.image_url;
      }
      await retryRequest(() => pb.collection('leadership_team').create(payload));
    }
    console.log(`   ✓ Seeded ${leadershipTeamData.length} records in leadership_team.`);

    // Seed core_values
    console.log(" - Seeding core_values...");
    for (const value of coreValuesData) {
      await retryRequest(() => pb.collection('core_values').create(value));
    }
    console.log(`   ✓ Seeded ${coreValuesData.length} records in core_values.`);

    // Seed milestones
    console.log(" - Seeding milestones...");
    for (const milestone of milestonesData) {
      await retryRequest(() => pb.collection('milestones').create(milestone));
    }
    console.log(`   ✓ Seeded ${milestonesData.length} records in milestones.`);

    // Seed prayer_categories
    console.log(" - Seeding prayer_categories...");
    for (const cat of prayerCategoriesData) {
      await retryRequest(() => pb.collection('prayer_categories').create(cat));
    }
    console.log(`   ✓ Seeded ${prayerCategoriesData.length} records in prayer_categories.`);

    console.log("\n[5/5] Migration successfully completed!");
    console.log("=========================================");
  } catch (err) {
    console.error("\n❌ Migration failed!");
    console.error("Error Message:", err.message);
    console.error("Error Status:", err.status);
    console.error("Error Response Data:", err.data);
    console.error("Original Error:", err.originalError);
    if (err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

runMigration();
