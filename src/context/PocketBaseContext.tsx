import React, { createContext, useContext, useState, useEffect } from 'react';
import PocketBase from 'pocketbase';

const PB_URL = 'https://ksfkitale.pockethost.io';
export const pb = new PocketBase(PB_URL);

// --- STATIC FALLBACK DATA ---
const DEFAULT_SITE_SETTINGS = {
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

const DEFAULT_PAGES: Record<string, any> = {
  'home': {
    slug: 'home',
    title: 'Home',
    hero_subtitle: 'JOIN US THIS WEEKEND',
    hero_heading: 'Sundays @',
    hero_description: 'Experience a community where lives are transformed. Making Disciples. Multiplying Churches.',
    hero_image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&q=80'
  },
  'im-new': {
    slug: 'im-new',
    title: "I'm New",
    hero_subtitle: 'YOU ARE WELCOME',
    hero_heading: "We're Glad You're Here.",
    hero_description: "Welcome to Kingdom Seekers Fellowship. Whether you're a lifelong believer or just exploring faith, there's a place for you here.",
    hero_image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=80'
  },
  'about-story': {
    slug: 'about-story',
    title: 'Our Story',
    hero_subtitle: 'CRAFTING A LEGACY',
    hero_heading: 'Our Story',
    hero_description: "The journey of faith at Kingdom Seekers Fellowship. Discover where we've been and where God is leading us next.",
    hero_image_url: 'https://images.unsplash.com/photo-1437603565678-c6f6ba998f64?w=1920&q=80'
  },
  'sermons': {
    slug: 'sermons',
    title: 'Sermons',
    hero_subtitle: 'THE WORD OF GOD',
    hero_heading: 'Sermons & Messages',
    hero_description: 'Faith comes by hearing, and hearing by the word of God. Be fed by the Word of God through our collection of life-transforming messages.',
    hero_image_url: 'https://images.unsplash.com/photo-1505663912202-ac22d4cb3707?w=1920&q=80'
  },
  'prayer-points': {
    slug: 'prayer-points',
    title: 'Prayer Points',
    hero_subtitle: 'MATTHEW 18:19 · UNIFIED INTERCESSION',
    hero_heading: 'Prayer Points & Declarations',
    hero_description: '"If two of you agree on earth about anything they ask, it will be done for them by my Father in heaven." Explore our interactive, scriptural prayer declarations below.',
    hero_image_url: 'https://images.unsplash.com/photo-1504052434139-443c4085b2c9?w=1920&q=80'
  },
  'gallery': {
    slug: 'gallery',
    title: 'Gallery',
    hero_subtitle: 'THROUGH THE LENS',
    hero_heading: 'Our Moments & Messages',
    hero_description: "A visual journey through the life of Kingdom Seekers Fellowship. Catch a glimpse of God's glory in our community.",
    hero_image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&q=80'
  },
  'give': {
    slug: 'give',
    title: 'Give',
    hero_subtitle: 'GENEROSITY',
    hero_heading: 'Support KSF Ministries',
    hero_description: '"Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver." — 2 Corinthians 9:7',
    hero_image_url: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=1920&q=80'
  },
  'ministries-kids': {
    slug: 'ministries-kids',
    title: 'KSF Kids',
    hero_subtitle: 'MINISTRIES',
    hero_heading: 'KSF Kids',
    hero_description: 'Where faith is fun and every child is a Kingdom Seeker. We celebrate Jesus through stories, songs, and small groups made just for kids.',
    hero_image_url: 'https://images.unsplash.com/photo-1484069560501-87d72b0c3669?w=1920&q=80'
  },
  'ministries-youth': {
    slug: 'ministries-youth',
    title: 'Youth Ministry',
    hero_subtitle: 'MINISTRIES',
    hero_heading: 'KSF Youth',
    hero_description: 'No longer a generation of the future, but a generation of the NOW. We empower teenagers to find their identity, purpose, and power in Jesus Christ.',
    hero_image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80'
  },
  'ministries-women': {
    slug: 'ministries-women',
    title: "Women's Fellowship",
    hero_subtitle: 'MINISTRIES',
    hero_heading: "Women's Fellowship",
    hero_description: 'Empowering women to walk boldly in their God-given identity, strength, and grace. A sisterhood committed to prayer, growth, and transformation.',
    hero_image_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&q=80'
  },
  'ministries-men': {
    slug: 'ministries-men',
    title: "Men's Brotherhood",
    hero_subtitle: 'MINISTRIES',
    hero_heading: "Men's Brotherhood",
    hero_description: 'Iron sharpens iron. We are building a brotherhood of men who are committed to spiritual excellence, integrity in leadership, and strength in character.',
    hero_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80'
  },
  'ministries-home-fellowship': {
    slug: 'ministries-home-fellowship',
    title: 'Home Fellowship',
    hero_subtitle: 'MINISTRIES',
    hero_heading: 'Home Fellowship',
    hero_description: 'Real community happens in circles, not just rows. Join a Home Fellowship in your region to experience life-changing relationships and spiritual growth.',
    hero_image_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1920&q=80'
  }
};

interface PocketBaseContextType {
  siteSettings: typeof DEFAULT_SITE_SETTINGS;
  pages: Record<string, any>;
  isLoadingSettings: boolean;
  getImageUrl: (record: any, fieldName: string, fallback: string) => string;
}

const PocketBaseContext = createContext<PocketBaseContextType | null>(null);

export const PocketBaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState<any>(DEFAULT_SITE_SETTINGS);
  const [pages, setPages] = useState<Record<string, any>>(DEFAULT_PAGES);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  useEffect(() => {
    async function fetchGlobalData() {
      try {
        // Fetch site settings (single record)
        const settingsRes = await pb.collection('site_settings').getFullList({
          requestKey: 'global_settings'
        });
        if (settingsRes.length > 0) {
          setSiteSettings(settingsRes[0]);
        }
        
        // Fetch all pages meta and structure them as key-value page maps
        const pagesRes = await pb.collection('pages').getFullList({
          sort: 'sort_order',
          requestKey: 'global_pages'
        });
        
        if (pagesRes.length > 0) {
          const pagesMap: Record<string, any> = {};
          pagesRes.forEach((pageRecord: any) => {
            pagesMap[pageRecord.slug] = pageRecord;
          });
          setPages(prev => ({ ...prev, ...pagesMap }));
        }
      } catch (err) {
        console.error("Failed to load global PocketBase data, using fallbacks:", err);
      } finally {
        setIsLoadingSettings(false);
      }
    }
    fetchGlobalData();
  }, []);

  const getImageUrl = (record: any, fieldName: string, fallback: string) => {
    if (record && record[fieldName]) {
      return pb.files.getURL(record, record[fieldName]);
    }
    return fallback;
  };

  return (
    <PocketBaseContext.Provider value={{ siteSettings, pages, isLoadingSettings, getImageUrl }}>
      {children}
    </PocketBaseContext.Provider>
  );
};

export const usePocketBase = () => {
  const context = useContext(PocketBaseContext);
  if (!context) {
    throw new Error('usePocketBase must be used within a PocketBaseProvider');
  }
  return context;
};
