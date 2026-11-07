import {
  BookOpen, Building2, CalendarDays, GalleryHorizontal, ClipboardList, Clock, Flag, Footprints, HandHeart, Heart,
  Image, Inbox, LayoutTemplate, Layers, Mic, Settings, Users, type LucideIcon,
} from 'lucide-react';
import type { Collection, Field } from './pb';

export type FieldConfig = {
  label?: string;
  help?: string;
  multiline?: boolean;
  /** For JSON fields holding a list of objects: the keys each item has. */
  itemShape?: string[];
  hidden?: boolean;
};

export type CollectionConfig = {
  label: string;
  singular: string;
  description: string;
  icon: LucideIcon;
  group: string;
  titleField?: string;
  subtitleFields?: string[];
  /** Only one record should exist (e.g. site settings) — open the editor directly. */
  singleton?: boolean;
  /** Messages sent by visitors: no "New" button, opening one marks it read. */
  inbox?: boolean;
  sort?: string;
  /** Public page where this content shows up. */
  sitePath?: string;
  fields?: Record<string, FieldConfig>;
};

export const GROUPS = ['Website', 'Church Life', 'About Us', 'Media', 'Inbox & Records', 'Other'];

const link = (label = 'Label', href = 'Link') => ({ itemShape: ['label', 'href'], label, help: `Each item needs a ${label.toLowerCase()} and a ${href.toLowerCase()} (e.g. /sermons).` });

export const COLLECTIONS: Record<string, CollectionConfig> = {
  hero_slides: {
    label: 'Home Hero Slides', singular: 'Hero slide', icon: GalleryHorizontal, group: 'Website', sitePath: '/',
    description: 'The rotating slideshow at the top of the home page. Slides change every few seconds, in the order shown here.',
    titleField: 'heading', subtitleFields: ['subtitle'],
    fields: {
      image: { label: 'Background photo', help: 'Wide landscape photo, at least 1920px wide, under 5 MB. Text sits over the bottom-left, so avoid faces there.' },
      subtitle: { label: 'Small text above heading', help: 'e.g. JOIN US THIS WEEKEND' },
      heading: { label: 'Heading', help: 'Keep it short: 1–4 words read best.' },
      highlight: { label: 'Large highlight line (optional)', help: 'Separate items with "/", e.g. 8:00 / 9:45 / 11:30' },
      description: { multiline: true },
      button_text: { label: 'Button text (optional)', help: 'Leave blank to show "Watch Us Live".' },
      button_link: { label: 'Button link', help: 'A page on this site like /give, or a full https:// link.' },
      active: { label: 'Show this slide', help: 'Turn off to hide a slide without deleting it.' },
    },
  },
  pages: {
    label: 'Page Banners', singular: 'Page banner', icon: LayoutTemplate, group: 'Website',
    description: 'The large banner (hero) at the top of each page: heading, text and background image.',
    titleField: 'title', subtitleFields: ['slug', 'hero_heading'],
    fields: {
      slug: { help: 'Identifies the page in code. Do not change for existing pages.' },
      hero_subtitle: { label: 'Small text above heading' },
      hero_heading: { label: 'Heading' },
      hero_description: { label: 'Description', multiline: true },
      hero_image: { label: 'Background image', help: 'Wide landscape photo, at least 1920px wide.' },
    },
  },
  page_sections: {
    label: 'Page Sections', singular: 'Page section', icon: Layers, group: 'Website',
    description: 'Text, images and lists inside individual pages (e.g. "What to expect" on I\'m New).',
    titleField: 'title', subtitleFields: ['page_slug', 'section_slug'],
    fields: {
      page_slug: { label: 'Page', help: 'Which page this belongs to. Do not change for existing sections.' },
      section_slug: { label: 'Section key', help: 'Identifies the section in code. Do not change for existing sections.' },
      description: { multiline: true },
      content_json: { label: 'Section items', help: 'The list of cards / steps / points shown in this section.' },
    },
  },
  site_settings: {
    label: 'Church Details', singular: 'Church details', icon: Settings, group: 'Website', singleton: true,
    description: 'Name, contact info, social links, map, and giving details (M-Pesa & bank) used across the site.',
    fields: {
      mpesa_paybill: { label: 'M-Pesa paybill' },
      google_maps_embed_url: { label: 'Google Maps embed URL', help: 'From Google Maps → Share → Embed a map → copy the src="…" link.' },
      google_maps_directions_url: { label: 'Google Maps directions URL' },
    },
  },
  ksf_footer: {
    label: 'Footer', singular: 'Footer', icon: Footprints, group: 'Website', singleton: true, sitePath: '/',
    description: 'Links, service times and copyright shown at the bottom of every page.',
    fields: {
      quick_links: link(),
      ministry_links: link(),
      service_times: { itemShape: ['name', 'time'], help: 'e.g. First Service — 8:00 AM' },
    },
  },
  events: {
    label: 'Events', singular: 'Event', icon: CalendarDays, group: 'Church Life', sitePath: '/#events',
    description: 'Upcoming events listed on the home page.',
    titleField: 'title', subtitleFields: ['date_display', 'tag'],
    fields: {
      date_display: { label: 'Date (as shown)', help: 'e.g. "Every Sunday" or "12 – 14 Dec 2026"' },
      day_short: { label: 'Day (calendar badge)', help: 'e.g. 12' },
      month_short: { label: 'Month (calendar badge)', help: 'e.g. DEC' },
      description: { multiline: true },
    },
  },
  services: {
    label: 'Services & Gatherings', singular: 'Service', icon: Clock, group: 'Church Life', sitePath: '/',
    description: 'Weekly services and gatherings shown on the home page.',
    titleField: 'title', subtitleFields: ['time'],
    fields: {
      icon: { help: 'Icon name from lucide.dev/icons, e.g. Church, Users, Heart.' },
      description: { multiline: true },
    },
  },
  sermons: {
    label: 'Sermons', singular: 'Sermon', icon: Mic, group: 'Church Life', sitePath: '/sermons',
    description: 'Sermon videos on the Sermons page. Mark one as featured to highlight it.',
    titleField: 'title', subtitleFields: ['speaker', 'date'],
    fields: {
      video_url: { label: 'YouTube link', help: 'Paste any YouTube link (watch, share, or live).' },
      is_featured: { label: 'Featured sermon' },
      date: { help: 'As shown, e.g. 2 Nov 2026' },
    },
  },
  ministries: {
    label: 'Ministries', singular: 'Ministry', icon: HandHeart, group: 'Church Life',
    description: 'Ministry cards on the home page and the ministry page banners.',
    titleField: 'title', subtitleFields: ['slug'],
    fields: {
      slug: { help: 'Identifies the ministry in code. Do not change for existing ministries.' },
      icon: { help: 'Icon name from lucide.dev/icons.' },
      description: { multiline: true },
      hero_description: { multiline: true },
      regions: { label: 'Regions / groups', help: 'Used by Home Fellowship for the list of regions.' },
    },
  },
  prayer_categories: {
    label: 'Prayer Points', singular: 'Prayer category', icon: Heart, group: 'Church Life', sitePath: '/prayer-points',
    description: 'Prayer categories and declarations on the Prayer Points page.',
    titleField: 'title', subtitleFields: ['key_reference'],
    fields: {
      icon: { help: 'Icon name from lucide.dev/icons.' },
      color: { help: 'Accent color, e.g. #CC1B1B' },
      key_verse: { multiline: true },
      prayers: { label: 'Prayer points' },
    },
  },
  leadership_team: {
    label: 'Leadership Team', singular: 'Leader', icon: Users, group: 'About Us', sitePath: '/about/story',
    description: 'Pastors and leaders shown on the Our Story page.',
    titleField: 'name', subtitleFields: ['role'],
    fields: { bio: { multiline: true }, image: { label: 'Photo', help: 'Portrait photo, roughly square.' } },
  },
  core_values: {
    label: 'Core Values', singular: 'Core value', icon: Flag, group: 'About Us', sitePath: '/about/story',
    description: 'The church\'s core values on the Our Story page.',
    titleField: 'title', subtitleFields: ['slogan'],
    fields: { content: { multiline: true } },
  },
  milestones: {
    label: 'Milestones', singular: 'Milestone', icon: BookOpen, group: 'About Us', sitePath: '/about/story',
    description: 'The church history timeline on the Our Story page.',
    titleField: 'title', subtitleFields: ['year', 'era'],
    fields: { description: { multiline: true } },
  },
  gallery_images: {
    label: 'Gallery', singular: 'Photo', icon: Image, group: 'Media', sitePath: '/gallery',
    description: 'Photos on the Gallery page.',
    titleField: 'title', subtitleFields: ['category'],
  },
  contact_messages: {
    label: 'Messages', singular: 'Message', icon: Inbox, group: 'Inbox & Records', inbox: true,
    description: 'Messages sent through the contact form on the home page.',
    titleField: 'full_name', subtitleFields: ['email', 'phone'],
    fields: { message: { multiline: true }, is_read: { label: 'Marked as read' } },
  },
  attendance_records: {
    label: 'Attendance', singular: 'Attendance record', icon: ClipboardList, group: 'Inbox & Records',
    sitePath: '/church-analytics', sort: '-event_date',
    description: 'Service headcounts. The Church Analytics dashboard shows charts of these.',
    titleField: 'event_type', subtitleFields: ['event_date', 'session'],
    fields: { notes: { multiline: true } },
  },
};

const MULTILINE_NAMES = /(^|_)(description|bio|content|message|notes|verse|text|body)$/;

export function humanize(name: string) {
  const s = name.replace(/_/g, ' ').replace(/\burl\b/gi, 'URL').trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getConfig(c: Collection): CollectionConfig {
  const known = COLLECTIONS[c.name];
  if (known) return known;
  const name = humanize(c.name);
  return { label: name, singular: name, description: '', icon: Building2, group: 'Other' };
}

export function fieldConfig(cfg: CollectionConfig, f: Field): Required<Pick<FieldConfig, 'label'>> & FieldConfig {
  const own = cfg.fields?.[f.name] ?? {};
  return {
    ...own,
    label: own.label ?? humanize(f.name),
    multiline: own.multiline ?? (f.type === 'editor' || (f.type === 'text' && MULTILINE_NAMES.test(f.name))),
  };
}

/** Fields the editor should show, in schema order. */
export function editableFields(c: Collection) {
  return c.fields.filter(f => !f.system && !f.hidden && f.type !== 'autodate' && f.type !== 'password' && f.name !== 'id');
}

export function sortFor(c: Collection, cfg: CollectionConfig) {
  if (cfg.sort) return cfg.sort;
  const names = new Set(c.fields.map(f => f.name));
  if (names.has('sort_order')) return 'sort_order';
  if (names.has('created')) return '-created';
  return '';
}

export function titleOf(record: Record<string, any>, c: Collection, cfg: CollectionConfig) {
  const key = cfg.titleField ?? c.fields.find(f => f.type === 'text' && !f.system)?.name;
  const v = key ? record[key] : '';
  return (typeof v === 'string' && v.trim()) || `Untitled ${cfg.singular.toLowerCase()}`;
}
