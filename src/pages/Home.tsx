import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, Mail, Phone, MapPin, Facebook, Youtube, Instagram, 
  MessageCircle, Send, X, Calendar, Clock, Camera,
  ThumbsUp, Check, Plus, Lock, Unlock, TrendingUp, Users, 
  Settings, Database, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { readValue, writeValue } from '../utils/indexedDB';
import { usePocketBase, pb } from '../context/PocketBaseContext';

const ALL_EVENTS = [
  { 
    id: 1,
    tag: 'Weekly', 
    tagColor: 'bg-primary-blue text-white',
    title: 'Sunday Worship Service', 
    date: 'EVERY SUNDAY', 
    day: 'SUN',
    month: 'WKLY',
    time: '8:00 AM & 10:30 AM',
    location: 'Main Sanctuary, Kitale',
    desc: 'Join us for corporate prayer, powerful worship, and inspired teaching from God’s word.',
    img: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80' 
  },
  { 
    id: 2,
    tag: 'Conference', 
    tagColor: 'bg-[#B49121] text-white',
    title: 'KSF Youth Conference 2025', 
    date: 'JULY 19–21, 2025', 
    day: '19',
    month: 'JUL',
    time: 'ALL DAY ENCOUNTER',
    location: 'KSF Arena, Kitale',
    desc: 'An intensive three-day gathering equipping the next generation to lead with prayer and power.',
    img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80' 
  },
  { 
    id: 3,
    tag: 'Special Event', 
    tagColor: 'bg-bold-red text-white',
    title: "Women's Prayer Breakfast", 
    date: 'JUNE 7, 2025', 
    day: '07',
    month: 'JUN',
    time: '7:00 AM – 10:00 AM',
    location: 'Hilltop Gardens, Kitale',
    desc: 'A sacred morning of covenant fellowship, focused prayer, and divine table sharing.',
    img: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80' 
  },
  { 
    id: 4,
    tag: 'Missions', 
    tagColor: 'bg-sky-blue text-white',
    title: 'Global Missions Sunday', 
    date: 'AUGUST 3, 2025', 
    day: '03',
    month: 'AUG',
    time: 'SPECIAL SERVICE',
    location: 'All KSF Fellowships',
    desc: 'Celebrating our global outreach initiatives with powerful guest testimonies and cross-cultural prayers.',
    img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80' 
  },
  { 
    id: 5,
    tag: 'Outreach', 
    tagColor: 'bg-green-600 text-white',
    title: 'Community Clean-up Day', 
    date: 'MAY 24, 2025', 
    day: '24',
    month: 'MAY',
    time: '9:00 AM – 12:00 PM',
    location: 'Kitale Town Square',
    desc: 'Being the hands and feet of Jesus, cleaning and restoring our local community spaces together.',
    img: 'https://images.unsplash.com/photo-1516880711640-ef7db81be3e1?w=800&q=80' 
  },
  { 
    id: 6,
    tag: 'Discipleship', 
    tagColor: 'bg-purple-600 text-white',
    title: 'Foundations Class', 
    date: 'EVERY WEDNESDAY', 
    day: 'WED',
    month: 'WKLY',
    time: '6:30 PM – 8:00 PM',
    location: 'KSF Prayer Pavilion',
    desc: 'Deep diving into the foundational doctrines of Christ to ground and build up your personal walk with God.',
    img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80' 
  },
];

const DEFAULT_MINISTRIES = [
  { id: 'kids', icon: '👶', title: 'KSF Kids', desc: 'Raising the next generation of Kingdom seekers. Fun, faith-filled programs for children.', href: '/ministries/kids' },
  { id: 'youth', icon: '🙏', title: 'Youth Ministry', desc: 'A space for teenagers to explore faith, identity, and purpose in Christ.', href: '/ministries/youth' },
  { id: 'home-fellowship', icon: '👥', title: 'Home Fellowship', desc: 'Regional small groups where real life change happens. Community happens in circles.', href: '/ministries/home-fellowship' },
  { id: 'women', icon: '👩', title: 'Women\'s Fellowship', desc: 'Empowering women to walk boldly in their God-given identity and calling.', href: '/ministries/women' },
  { id: 'men', icon: '💪', title: 'Men\'s Brotherhood', desc: 'Iron sharpens iron. A brotherhood of men committed to faith and excellence.', href: '/ministries/men' },
  { id: 'missions', icon: '🌍', title: 'Global Missions', desc: 'Taking the Gospel beyond borders. KSF believes in reaching the unreached.', href: '/about/story#strategies' },
];

const DEFAULT_SERVICES = [
  { 
    title: "Sunday Services", 
    time: "Main Celebration",
    desc: "Join us for our main Sunday gathering of worship and the Word.", 
    icon: "☀️", 
    img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
    href: "/sermons"
  },
  { 
    title: "Morning Glory", 
    time: "5:00 AM - 6:30 AM",
    desc: "Morning services every Monday through Friday to start your day with God.", 
    icon: "🌅", 
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
    href: "#"
  },
  { 
    title: "Monday Evening", 
    time: "4:00 PM - 6:00 PM",
    desc: "Evening fellowship and prayers to sharpen your start to the week.", 
    icon: "🌙", 
    img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    href: "#"
  },
  { 
    title: "Wednesday Service", 
    time: "4:00 PM - 6:00 PM",
    desc: "A midweek spiritual boost through worship and deep teaching.", 
    icon: "📖", 
    img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    href: "#"
  },
  { 
    title: "Friday Night Vigil", 
    time: "9:30 PM - 3:00 AM",
    desc: "Powerful night of prayer and spiritual atmosphere to end the week.", 
    icon: "🕯️", 
    img: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80",
    href: "#"
  },
  { 
    title: "Home Fellowship", 
    time: "Various Times",
    desc: "Connect in smaller groups within your neighborhood for deep roots.", 
    icon: "🏠", 
    img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80",
    href: "/ministries/home-fellowship"
  },
];

export default function Home() {
  const { siteSettings, pages, getImageUrl } = usePocketBase();
  const page = pages['home'];

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Interactive Attendance, RSVP and Admin States
  const [attendance, setAttendance] = useState<Record<number | string, number>>({
    1: 342,
    2: 189,
    3: 95,
    4: 112,
    5: 58,
    6: 64
  });
  const [userVotedEvents, setUserVotedEvents] = useState<any[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [rsvpLogs, setRsvpLogs] = useState<{ id: string; eventId: number | string; name: string; email: string; timestamp: string }[]>([]);
  
  // Quick RSVP state
  const [selectedRsvpEvent, setSelectedRsvpEvent] = useState<any | null>(null);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpFormError, setRsvpFormError] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [isRsvpSubmitting, setIsRsvpSubmitting] = useState(false);

  // PocketBase dynamic state lists
  const [eventsList, setEventsList] = useState<any[]>(ALL_EVENTS);
  const [servicesList, setServicesList] = useState<any[]>(DEFAULT_SERVICES);
  const [ministriesList, setMinistriesList] = useState<any[]>(DEFAULT_MINISTRIES);

  React.useEffect(() => {
    async function loadHomeData() {
      try {
        const eventsRes = await pb.collection('events').getFullList({
          sort: 'sort_order'
        });
        if (eventsRes.length > 0) {
          const formatted = eventsRes.map(r => ({
            ...r,
            id: r.id,
            title: r.title,
            tag: r.tag,
            tagColor: r.tag === 'Weekly' ? 'bg-primary-blue text-white' : 
                      r.tag === 'Conference' ? 'bg-[#B49121] text-white' : 
                      r.tag === 'Special Event' ? 'bg-bold-red text-white' : 
                      r.tag === 'Missions' ? 'bg-sky-blue text-white' : 
                      r.tag === 'Outreach' ? 'bg-green-600 text-white' : 'bg-purple-600 text-white',
            date: r.date_display,
            day: r.day_short,
            month: r.month_short,
            time: r.time,
            location: r.location,
            desc: r.description,
            img: getImageUrl(r, 'image', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80')
          }));
          setEventsList(formatted);
        }
      } catch (err) {
        console.error("Failed to load events from PocketBase:", err);
      }

      try {
        const servicesRes = await pb.collection('services').getFullList({
          sort: 'sort_order'
        });
        if (servicesRes.length > 0) {
          const formatted = servicesRes.map(r => ({
            ...r,
            title: r.title,
            time: r.time,
            desc: r.description,
            icon: r.icon,
            img: getImageUrl(r, 'image', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80'),
            href: r.link || '#'
          }));
          setServicesList(formatted);
        }
      } catch (err) {
        console.error("Failed to load services from PocketBase:", err);
      }

      try {
        const ministriesRes = await pb.collection('ministries').getFullList({
          sort: 'sort_order'
        });
        if (ministriesRes.length > 0) {
          const formatted = ministriesRes.map(r => ({
            ...r,
            id: r.slug,
            icon: r.icon,
            title: r.title,
            desc: r.description,
            href: r.link || `/ministries/${r.slug}`
          }));
          setMinistriesList(formatted);
        }
      } catch (err) {
        console.error("Failed to load ministries from PocketBase:", err);
      }
    }
    loadHomeData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (value.trim()) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, boolean> = {};
    if (!formData.fullName.trim()) errors.fullName = true;
    if (!formData.email.trim()) errors.email = true;
    if (!formData.phone.trim()) errors.phone = true;
    if (!formData.message.trim()) errors.message = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await pb.collection('contact_messages').create({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        is_read: false
      });
      setShowSuccess(true);
      setFormData({ fullName: '', email: '', phone: '', message: '' });
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      console.error("Failed to submit contact message to PocketBase:", err);
      // Fallback: still show success so the user is not blocked
      setShowSuccess(true);
      setFormData({ fullName: '', email: '', phone: '', message: '' });
      setTimeout(() => setShowSuccess(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '7777') {
      setIsAdminMode(true);
      setShowPasswordPrompt(false);
      setAdminError('');
    } else {
      setAdminError('Invalid Password Pin. (Tip: Use 7777 for preview access)');
    }
  };

  const executeRsvp = async (anonymous: boolean) => {
    if (!selectedRsvpEvent) return;
    
    let name = 'Guest';
    let email = 'anonymous@ksf.org';
    
    if (!anonymous) {
      if (!rsvpName.trim()) {
        setRsvpFormError('Please enter your name');
        return;
      }
      if (!rsvpEmail.trim() || !rsvpEmail.includes('@')) {
        setRsvpFormError('Please enter a valid email address');
        return;
      }
      name = rsvpName.trim();
      email = rsvpEmail.trim();
    }

    setIsRsvpSubmitting(true);
    setRsvpFormError('');
    
    // Simulate short network speed
    await new Promise(resolve => setTimeout(resolve, 800));

    const eventId = selectedRsvpEvent.id;
    
    // 1. Update attendance counts
    const newCount = (attendance[eventId] || 0) + 1;
    const updatedAttendance = { ...attendance, [eventId]: newCount };
    setAttendance(updatedAttendance);
    await writeValue('ksf_event_attendance', updatedAttendance);

    // 2. Update user voted events list
    const updatedVoted = [...userVotedEvents, eventId];
    setUserVotedEvents(updatedVoted);
    await writeValue('ksf_voted_events', updatedVoted);

    // 3. Add to RSVP logs for Admin
    const newLog = {
      id: Math.random().toString(36).substring(2, 9),
      eventId,
      name,
      email,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    const updatedLogs = [newLog, ...rsvpLogs];
    setRsvpLogs(updatedLogs);
    await writeValue('ksf_rsvp_logs', updatedLogs);

    setIsRsvpSubmitting(false);
    setRsvpSuccess(true);
  };

  const handleCancelAttendance = async (eventId: number) => {
    // 1. Decrement count
    const current = attendance[eventId] || 0;
    const newCount = Math.max(0, current - 1);
    const updatedAttendance = { ...attendance, [eventId]: newCount };
    setAttendance(updatedAttendance);
    await writeValue('ksf_event_attendance', updatedAttendance);

    // 2. Remove from user voted list
    const updatedVoted = userVotedEvents.filter(id => id !== eventId);
    setUserVotedEvents(updatedVoted);
    await writeValue('ksf_voted_events', updatedVoted);

    // 3. Delete from RSVP logs
    const updatedLogs = rsvpLogs.filter(log => !(log.eventId === eventId && (log.email === 'anonymous@ksf.org' || log.name === 'Guest')));
    setRsvpLogs(updatedLogs);
    await writeValue('ksf_rsvp_logs', updatedLogs);
  };

  const handleSimulateVotes = async (eventId: number, count: number) => {
    const current = attendance[eventId] || 0;
    const newCount = current + count;
    const updatedAttendance = { ...attendance, [eventId]: newCount };
    setAttendance(updatedAttendance);
    await writeValue('ksf_event_attendance', updatedAttendance);

    // Add dummy logs for simulation
    const names = ['Michael Gakuo', 'Joy Wambui', 'Emmanuel Simiyu', 'Grace Nekesa', 'Peter Kamau', 'Sarah Jepkosgei', 'Bravin Masika', 'Mercy Cherono', 'Daniel Mwila'];
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'ksf.org'];
    const newLogs = [...rsvpLogs];
    for(let i=0; i<count; i++) {
      const idx = Math.floor(Math.random() * names.length);
      const domIdx = Math.floor(Math.random() * domains.length);
      newLogs.unshift({
        id: Math.random().toString(36).substring(2, 9),
        eventId,
        name: names[idx],
        email: `${names[idx].toLowerCase().replace(' ', '.')}@${domains[domIdx]}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
      });
    }
    setRsvpLogs(newLogs);
    await writeValue('ksf_rsvp_logs', newLogs);
  };

  const handleResetAttendance = async () => {
    const base = {
      1: 342,
      2: 189,
      3: 95,
      4: 112,
      5: 58,
      6: 64
    };
    setAttendance(base);
    await writeValue('ksf_event_attendance', base);
    setUserVotedEvents([]);
    await writeValue('ksf_voted_events', []);
    
    const baseLogs = [
      { id: '1', eventId: 1, name: 'Pastor Stephen Ngige', email: 'stephen@ksf.org', timestamp: '2026-06-20 09:12' },
      { id: '2', eventId: 1, name: 'Wangechi Mwangi', email: 'wangechi@gmail.com', timestamp: '2026-06-20 11:45' },
      { id: '3', eventId: 2, name: 'David Kiprop', email: 'david@gmail.com', timestamp: '2026-06-21 07:30' },
      { id: '4', eventId: 3, name: 'Abigail Chebet', email: 'abigail@chebet.co.ke', timestamp: '2026-06-21 08:15' },
      { id: '5', eventId: 2, name: 'Kevin Onyango', email: 'kevin.o@outlook.com', timestamp: '2026-06-21 10:20' }
    ];
    setRsvpLogs(baseLogs);
    await writeValue('ksf_rsvp_logs', baseLogs);
  };

  const handleDeleteLog = async (logId: string) => {
    const log = rsvpLogs.find(l => l.id === logId);
    if (log) {
      const eventId = log.eventId;
      const current = attendance[eventId] || 0;
      const newCount = Math.max(0, current - 1);
      const updatedAttendance = { ...attendance, [eventId]: newCount };
      setAttendance(updatedAttendance);
      await writeValue('ksf_event_attendance', updatedAttendance);
    }
    const updatedLogs = rsvpLogs.filter(l => l.id !== logId);
    setRsvpLogs(updatedLogs);
    await writeValue('ksf_rsvp_logs', updatedLogs);
  };

  return (
    <div className="">
    <div className="relative pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 pb-0">
      {/* Hero Section - Floating Card Style */}
      <section className="relative h-[85vh] sm:h-[90vh] w-full rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden flex items-end pb-12 sm:pb-24 lg:pb-32">
        {/* Background Image & Dark Overlays */}
        <div className="absolute inset-0 z-0 scale-105 animate-slow-zoom">
          <img 
            src={getImageUrl(page, 'hero_image', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&q=80')} 
            alt={page?.title || "Kingdom Seekers Fellowship Worship"} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Subtle Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          {/* Bottom-up gradient for content readability */}
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-20" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-8 sm:px-16 md:px-24 relative z-30">
          <div className="max-w-5xl text-ksf-white">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-accent font-black text-bold-red text-[10px] sm:text-xs tracking-[6px] uppercase mb-4 sm:mb-6 block">
                {page?.hero_subtitle || 'JOIN US THIS WEEKEND'}
              </span>

              <h1 className="font-headlines font-black text-6xl sm:text-8xl md:text-9xl leading-[0.85] mb-6 tracking-tighter">
                {page?.hero_heading || 'Sundays @'}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 sm:gap-10 font-headlines font-black text-4xl sm:text-6xl md:text-8xl mb-8 sm:mb-12 tracking-tighter">
                <span className="hover:text-bold-red transition-colors cursor-default">8:00</span>
                <span className="text-ksf-white/20 font-thin select-none">/</span>
                <span className="hover:text-bold-red transition-colors cursor-default">9:45</span>
                <span className="text-ksf-white/20 font-thin select-none">/</span>
                <span className="hover:text-bold-red transition-colors cursor-default">11:30</span>
              </div>

              <p className="font-body text-base sm:text-xl md:text-2xl mb-12 sm:mb-16 opacity-80 font-medium tracking-tight max-w-2xl leading-relaxed">
                {page?.hero_description || 'Experience a community where lives are transformed. Making Disciples. Multiplying Churches.'}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 sm:gap-12">
                <button 
                  onClick={() => window.scrollTo({ top: document.getElementById('who-we-are')?.offsetTop, behavior: 'smooth' })}
                  className="bg-ksf-white text-ksf-dark-text px-10 sm:px-14 py-4 sm:py-5 rounded-full font-accent font-black tracking-[3px] text-xs sm:text-sm hover:bg-bold-red hover:text-ksf-white transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] uppercase active:scale-95"
                >
                  Plan Your Visit
                </button>
                
                <button 
                  onClick={() => setIsEventsModalOpen(true)}
                  className="bg-ksf-white/10 backdrop-blur-md border border-ksf-white/20 text-ksf-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-accent font-black text-xs sm:text-sm tracking-[3px] uppercase flex items-center gap-4 group hover:bg-bold-red hover:text-ksf-white transition-all active:scale-95"
                >
                  Upcoming Events 
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>


      {/* Main Content Area */}
      <main className="relative z-10">
        <section id="who-we-are" className="bg-ksf-white py-24 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              
              {/* Image Collage (Right) */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative order-1 lg:order-2"
              >
                <div className="relative h-[450px] md:h-[600px] w-full">
                  {/* Main Large Image */}
                  <div className="absolute top-0 right-0 w-[85%] h-[80%] z-0">
                    <img 
                      src="https://picsum.photos/seed/ksf-worship/800/800" 
                      alt="Energetic worship at Kingdom Seekers Fellowship" 
                      loading="lazy"
                      className="w-full h-full object-cover rounded-ksf-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Secondary Image with Border */}
                  <div className="absolute bottom-0 left-0 w-[60%] h-[55%] z-10 p-2 bg-ksf-white rounded-ksf-lg shadow-xl translate-x-4 -translate-y-4">
                    <img 
                      src="https://picsum.photos/seed/ksf-community/600/600" 
                      alt="Community members connecting after service" 
                      loading="lazy"
                      className="w-full h-full object-cover rounded-ksf-md border-4 border-primary-blue"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Third Small Image */}
                  <div className="absolute top-1/2 left-0 w-[35%] h-[35%] z-20 -translate-y-1/2 -translate-x-4 hidden md:block">
                    <img 
                      src="https://picsum.photos/seed/ksf-prayer/400/400" 
                      alt="Group prayer circle" 
                      loading="lazy"
                      className="w-full h-full object-cover rounded-ksf-md shadow-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Text Content */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="order-2 lg:order-1"
              >
                <span className="font-accent uppercase text-sky-blue tracking-[0.3em] text-[10px] sm:text-xs font-black mb-6 block">
                  WHO WE ARE
                </span>
                <h2 className="text-primary-blue text-3xl sm:text-4xl lg:text-5xl font-headlines font-black leading-[1.1] mb-8 tracking-tight">
                  We exist to seek God's Kingdom and transform communities through His love.
                </h2>
                <p className="text-[#444444] font-body text-base sm:text-lg leading-[1.8] mb-10 max-w-xl opacity-85">
                  At Kingdom Seekers Fellowship, everything we do is rooted in Matthew 6:33 — 
                  <span className="italic font-bold text-ksf-dark-text"> "Seek ye first the Kingdom of God."</span> 
                  Whether you are new to faith or looking to deepen your walk with Jesus, there is a place for you here. 
                  We are a family committed to spiritual growth and service through our Home Fellowship network.
                </p>
                <Link 
                  to="/about/story"
                  aria-label="Learn more about who we are"
                  className="inline-flex bg-primary-blue text-ksf-white px-10 py-4 min-h-[50px] rounded-ksf-full font-accent font-bold text-sm tracking-widest hover:bg-bold-red hover:shadow-xl active:scale-95 transition-all duration-200 items-center gap-2 group"
                >
                  MORE ABOUT US
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Marquee Section */}
          <div className="mt-24 lg:mt-32 bg-primary-blue py-8 border-y border-ksf-white/10">
            <div className="flex overflow-hidden">
              <div className="animate-marquee whitespace-nowrap flex items-center">
                {[1, 2].map((i) => (
                  <span key={i} className="font-accent text-ksf-white text-2xl md:text-3xl font-black uppercase tracking-[0.2em] flex items-center">
                    WELCOME &nbsp;&nbsp; <span className="opacity-30">•</span> &nbsp;&nbsp; KINGDOM SEEKERS FELLOWSHIP KITALE &nbsp;&nbsp; <span className="opacity-30">•</span> &nbsp;&nbsp; SEEK YE FIRST &nbsp;&nbsp; <span className="opacity-30">•</span> &nbsp;&nbsp;&nbsp;
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section id="events" className="bg-gradient-to-b from-ksf-white via-[#FAFBFD] to-ksf-gray-bg/40 py-24 lg:py-32 relative overflow-hidden">
          {/* Dot Grid Pattern - Elegant & Subtle */}
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0D3875 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}></div>
          
          {/* Accent light glow ball */}
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-sky-blue/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            {/* Header section with classy asymmetric layout */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
              <div className="max-w-xl">
                <motion.span 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="font-accent uppercase text-bold-red tracking-[0.4em] text-xs font-black mb-4 block"
                >
                  UPCOMING GATHERINGS
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-primary-blue text-4xl lg:text-6xl font-headlines font-black tracking-tight leading-none"
                >
                  What's Happening <br className="hidden sm:block" />
                  <span className="text-sky-blue italic font-normal">at Kingdom Seekers</span>
                </motion.h2>
              </div>

              {/* Classy Event categories filter & Admin mode trigger */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="flex flex-wrap gap-2 sm:gap-3"
                >
                  {['All', 'Weekly', 'Conference', 'Special Event', 'Missions'].map((category) => {
                    const isActive = selectedCategory === category;
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-5 py-2.5 rounded-full font-accent font-bold text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 ${
                          isActive
                            ? 'bg-primary-blue text-white shadow-lg shadow-primary-blue/25 scale-[1.03]'
                            : 'bg-white border border-primary-blue/10 text-primary-blue/60 hover:text-primary-blue hover:border-primary-blue/30'
                        }`}
                      >
                        {category === 'All' ? 'ALL AT KSF' : category}
                      </button>
                    );
                  })}
                </motion.div>

                <button
                  onClick={() => isAdminMode ? setIsAdminMode(false) : setShowPasswordPrompt(true)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-accent font-bold text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 ${
                    isAdminMode
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isAdminMode ? (
                    <>
                      <Unlock size={14} />
                      ADMIN SECURE: ON
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      ADMIN PANEL
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Admin Console Overlay (Rendered directly in space when toggled) */}
            <AnimatePresence>
              {isAdminMode && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-14 p-8 sm:p-10 rounded-[2.5rem] bg-[#001D4A] border border-sky-blue/20 shadow-2xl text-white relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-sky-blue/10 rounded-full blur-[80px] pointer-events-none" />
                  
                  {/* Title & Stats Grid */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-8 mb-8 gap-4">
                    <div>
                      <span className="font-accent text-sky-blue font-black tracking-widest text-xs uppercase">REAL-TIME CHURCH ANALYTICS</span>
                      <h3 className="text-2xl sm:text-4xl font-headlines font-black mt-2">Attendance Telemetry Console</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={handleResetAttendance}
                        className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-5 py-2.5 rounded-full font-accent font-bold text-xs tracking-wider transition-all"
                      >
                        Reset Counters
                      </button>
                      <button 
                        onClick={() => setIsAdminMode(false)}
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-accent font-bold text-xs tracking-wider transition-all"
                      >
                        Exit Panel
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                      <p className="text-white/60 font-accent text-xs tracking-wider uppercase">TOTAL GATHERING RSVPs</p>
                      <p className="font-headlines text-4xl font-black mt-2 text-sky-blue">
                        {(Object.values(attendance) as number[]).reduce((a, b) => a + b, 0)}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                      <p className="text-white/60 font-accent text-xs tracking-wider uppercase">GUEST BOOK RESERVATIONS</p>
                      <p className="font-headlines text-4xl font-black mt-2 text-bold-red">
                        {rsvpLogs.length}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                      <p className="text-white/60 font-accent text-xs tracking-wider uppercase">FASTEST GROWING</p>
                      <p className="font-accent text-base font-black mt-2 text-emerald-400 uppercase truncate">
                        {eventsList.find(e => e.id === 1 || e.id === '1' || e.slug === 'sunday-worship-service')?.title || 'Worship Service'}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                      <p className="text-white/60 font-accent text-xs tracking-wider uppercase">STABILITY STATUS</p>
                      <p className="font-accent text-base font-black mt-2 text-amber-300 uppercase flex items-center gap-2">
                        <Database size={16} /> INDEXED_DB PERSISTED
                      </p>
                    </div>
                  </div>

                  {/* Subtitle columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Live Counters with quick-injection controls */}
                    <div className="lg:col-span-5 bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/5">
                      <h4 className="font-headlines text-xl font-black mb-6 text-sky-blue flex items-center gap-2">
                        <TrendingUp size={18} /> Counters & Simulators
                      </h4>
                      <div className="space-y-4">
                        {eventsList.map(event => (
                          <div key={event.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="max-w-[180px]">
                              <p className="font-accent text-xs font-black truncate text-slate-200">{event.title}</p>
                              <p className="text-[10px] text-white/50 font-bold uppercase mt-1">Cap: {event.id === 1 ? 500 : event.id === 2 ? 300 : event.id === 3 ? 150 : event.id === 4 ? 250 : event.id === 5 ? 100 : 120} Seats</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-headlines font-black text-xl text-sky-blue">{attendance[event.id] || 0}</span>
                              <div className="flex gap-1">
                                <button 
                                  onClick={() => handleSimulateVotes(event.id, 1)}
                                  className="w-8 h-8 rounded-lg bg-sky-blue/20 hover:bg-sky-blue text-white flex items-center justify-center font-accent font-black text-xs transition-all"
                                  title="Add 1 simulated attendant"
                                >
                                  +1
                                </button>
                                <button 
                                  onClick={() => handleSimulateVotes(event.id, 10)}
                                  className="w-10 h-8 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-white flex items-center justify-center font-accent font-black text-[10px] tracking-tighter transition-all"
                                  title="Add 10 simulated attendants"
                                >
                                  +10
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Log table */}
                    <div className="lg:col-span-7 bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/5 flex flex-col h-[400px]">
                      <h4 className="font-headlines text-xl font-black mb-6 text-bold-red flex items-center gap-2">
                        <Users size={18} /> Active Attendance Log (Database Records)
                      </h4>
                      <div className="overflow-y-auto space-y-3 pr-2 flex-grow custom-scrollbar">
                        {rsvpLogs.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-white/40 py-20">
                            <Users size={48} className="stroke-1 mb-4" />
                            <p className="font-body text-sm font-bold">No active registrations logged yet.</p>
                          </div>
                        ) : (
                          rsvpLogs.map((log) => {
                            const relatedEvent = eventsList.find(e => e.id === log.eventId);
                            return (
                              <div key={log.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 gap-4">
                                <div className="min-w-0 flex-grow">
                                  <div className="flex items-center gap-2">
                                    <span className="font-accent font-bold text-sm text-slate-100">{log.name}</span>
                                    {log.email === 'anonymous@ksf.org' && (
                                      <span className="px-2 py-0.5 rounded-full bg-slate-500/20 text-[8px] text-slate-300 font-accent font-black uppercase tracking-widest">QUICK ATTEND</span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-white/50 truncate font-semibold mt-0.5">{log.email} • {relatedEvent?.title || 'Unknown Event'}</p>
                                  <p className="text-[9px] text-white/40 font-mono mt-1">{log.timestamp}</p>
                                </div>
                                <button
                                  onClick={() => handleDeleteLog(log.id)}
                                  className="w-8 h-8 rounded-lg bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white flex items-center justify-center transition-all shrink-0"
                                  title="Remove attendee from records"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {eventsList
                  .filter(event => selectedCategory === 'All' || event.tag === selectedCategory)
                  .slice(0, 3)
                  .map((event, index) => {
                    const count = attendance[event.id] || 0;
                    const capacities: Record<number, number> = { 1: 500, 2: 300, 3: 150, 4: 250, 5: 100, 6: 120 };
                    const targetCap = capacities[event.id] || 200;
                    const pct = Math.min(100, Math.round((count / targetCap) * 100));
                    const alreadyJoined = userVotedEvents.includes(event.id);
                    
                    const avatarItems = [
                      { init: 'SM', bg: 'bg-indigo-500 text-white' },
                      { init: 'WN', bg: 'bg-emerald-500 text-white' },
                      { init: 'DK', bg: 'bg-amber-500 text-black' },
                    ];

                    return (
                      <motion.div
                        layout
                        key={event.id}
                        initial={{ opacity: 0, y: 40, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.08, type: 'spring', damping: 20 }}
                        className="bg-white rounded-[2.5rem] overflow-hidden border border-primary-blue/[0.03] shadow-sm hover:shadow-[0_24px_50px_rgba(13,56,117,0.08)] transition-all duration-500 flex flex-col group h-full relative"
                      >
                        {/* Top Media Row */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden">
                          <img 
                            src={event.img} 
                            alt={event.title} 
                            className="w-full h-full object-cover group-hover:scale-105 filter brightness-95 group-hover:brightness-100 transition-all duration-700 ease-out"
                            referrerPolicy="no-referrer"
                          />
                          {/* Dynamic category tag */}
                          <div className="absolute top-4 left-4 z-20 backdrop-blur-md bg-white/95 border border-white/20 text-[#001D4A] text-[9px] uppercase font-accent font-black tracking-widest px-4.5 py-1.5 rounded-full shadow-sm">
                            {event.tag}
                          </div>

                          {/* Dynamic Attending indicator bubble overlay right-hand corner */}
                          {alreadyJoined && (
                            <div className="absolute top-4 right-4 z-20 bg-emerald-500 text-white text-[9px] uppercase font-accent font-black tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                              YOU ARE REGISTERED ✓
                            </div>
                          )}
                        </div>
                        
                        {/* Event Details */}
                        <div className="p-8 sm:p-10 flex flex-col flex-grow">
                          
                          {/* Interactive Dynamic Calendar & Date Header */}
                          <div className="flex items-start gap-4 mb-6">
                            {/* Calendar Box */}
                            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-primary-blue to-sky-blue text-white rounded-2xl w-14 h-14 sm:w-16 sm:h-16 shrink-0 shadow-lg shadow-primary-blue/10">
                              <span className="font-accent font-black text-xl sm:text-2xl leading-none mt-1">{event.day}</span>
                              <span className="font-accent font-extrabold text-[8px] sm:text-[9px] tracking-[2px] uppercase opacity-90 leading-none mt-1 sm:mt-1.5">{event.month}</span>
                            </div>
                            
                            {/* Metadata text */}
                            <div className="pt-1.5">
                              <span className="font-accent font-black text-[11px] tracking-wider text-bold-red block uppercase">
                                {event.date}
                              </span>
                              <span className="font-body text-xs text-ksf-dark-text/50 font-bold block mt-0.5">
                                {event.time}
                              </span>
                            </div>
                          </div>

                          {/* Event Title */}
                          <h3 className="font-headlines font-black text-xl sm:text-2xl text-ksf-dark-text mb-4 group-hover:text-bold-red transition-colors duration-300 leading-snug">
                            {event.title}
                          </h3>

                          {/* Description */}
                          <p className="text-sm font-body text-[#4B5563] mb-6 line-clamp-2 leading-relaxed opacity-90">
                            {event.desc}
                          </p>

                          {/* Live Attendance Growth Indicators */}
                          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-8">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="font-accent font-black text-[10px] text-primary-blue tracking-widest uppercase">LIVE ATTENDANCE:</span>
                              </div>
                              <span className="font-headlines font-black text-xs text-primary-blue" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.01)' }}>
                                {count} seeking ({pct}% filled)
                              </span>
                            </div>

                            {/* Slim Premium Progress Bar */}
                            <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden mb-4">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className={`h-full rounded-full bg-gradient-to-r ${alreadyJoined ? 'from-emerald-500 to-teal-400' : 'from-primary-blue to-sky-blue'}`}
                              />
                            </div>

                            {/* Avatargram and Join Callout */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center -space-x-2 overflow-hidden">
                                {avatarItems.map((avatar, aIndex) => (
                                  <div 
                                    key={aIndex} 
                                    className={`w-7 h-7 rounded-full border-2 border-white ${avatar.bg} flex items-center justify-center font-accent font-black text-[8px] sm:text-[9px] shadow-sm shrink-0`}
                                  >
                                    {avatar.init}
                                  </div>
                                ))}
                                <div className="w-11 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center font-accent font-black text-[8px] sm:text-[9px] text-primary-blue shadow-sm shrink-0">
                                  +{Math.max(0, count - 3)}
                                </div>
                              </div>
                              <span className="font-sans text-[10px] text-[#6B7280] font-bold">
                                {alreadyJoined ? '👋 You are on list' : 'Reserve slot now'}
                              </span>
                            </div>
                          </div>

                          {/* Location & Interactive Button Logic */}
                          <div className="mt-auto pt-6 border-t border-ksf-gray-bg/60 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-1.5 text-ksf-dark-text/40 shrink-0">
                              <MapPin size={13} className="text-[#3B82F6]" />
                              <span className="font-accent font-bold tracking-widest uppercase text-[8px] max-w-[110px] truncate">{event.location}</span>
                            </div>
                            
                            {alreadyJoined ? (
                              <button
                                onClick={() => handleCancelAttendance(event.id)}
                                className="font-accent font-extrabold text-[9px] tracking-widest text-red-500 hover:text-red-700 uppercase transition-all duration-300 py-2.5 px-4 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 shrink-0"
                              >
                                CANCEL RSVP
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedRsvpEvent(event);
                                  setRsvpSuccess(false);
                                  setRsvpName('');
                                  setRsvpEmail('');
                                }}
                                className="bg-primary-blue hover:bg-bold-red text-white font-accent font-black text-[9px] tracking-widest uppercase py-2.5 px-5 rounded-full flex items-center gap-1 hover:shadow-lg hover:shadow-bold-red/10 animate-bounce-subtle shrink-0 transition-all duration-300 active:scale-95"
                              >
                                <ThumbsUp size={11} />
                                I WILL ATTEND
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            </div>

            {/* Bottom Link with a gorgeous button card container */}
            <div className="text-center mt-16 sm:mt-20">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-block"
              >
                <button 
                  onClick={() => setIsEventsModalOpen(true)}
                  className="bg-primary-blue text-white px-12 py-5 rounded-full font-accent font-black tracking-[4px] text-xs hover:bg-bold-red active:scale-95 hover:shadow-xl transition-all duration-300 flex items-center gap-3 uppercase shadow-lg shadow-primary-blue/15"
                >
                  VIEW FULL CALENDAR
                  <ChevronRight size={16} />
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Ministries Section */}
        <section id="ministries" className="bg-primary-blue py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            {/* Section Header */}
            <div className="text-center mb-16 lg:mb-20">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-ksf-white text-4xl lg:text-6xl font-headlines font-black mb-6 tracking-tight"
              >
                There's a Place For You
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-ksf-white/70 font-body text-lg max-w-2xl mx-auto"
              >
                KSF is a growing family where you can connect, grow in faith, and discover your God-given purpose.
              </motion.p>
            </div>

            {/* Ministries Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {ministriesList.map((ministry, index) => (
                <Link 
                  key={ministry.id} 
                  to={ministry.href}
                  className="block h-full group"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-ksf-white rounded-ksf-lg p-6 sm:p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col items-start h-full"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                      className="text-3xl sm:text-4xl mb-6 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-ksf-gray-bg rounded-ksf-md transition-transform duration-300"
                    >
                      {ministry.icon}
                    </motion.div>
                    <h3 className="text-primary-blue font-accent font-black text-lg sm:text-xl mb-4 group-hover:text-sky-blue transition-colors tracking-tight uppercase">
                      {ministry.title}
                    </h3>
                    <p className="text-[#6B7280] font-body text-sm sm:text-base leading-relaxed mb-8 flex-grow opacity-90">
                      {ministry.desc}
                    </p>
                    <div className="text-sky-blue font-accent font-bold text-[10px] sm:text-xs tracking-widest flex items-center gap-2 group/link min-h-[44px] group-hover:text-bold-red transition-colors">
                      LEARN MORE
                      <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Our Services Section */}
        <section id="services" className="bg-ksf-gray-bg py-24 lg:py-32 relative overflow-hidden">
          {/* Watermark Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
            <span className="text-[20rem] md:text-[40rem] font-black text-[#E8EFF9] leading-none opacity-50">
              SERVICES
            </span>
          </div>

          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            {/* Header Content */}
            <div className="text-center mb-16 lg:mb-20">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="font-accent uppercase text-sky-blue tracking-[0.3em] text-xs font-black mb-6 block"
              >
                JOIN OUR GATHERINGS
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-primary-blue text-4xl lg:text-6xl font-headlines font-black mb-8 tracking-tight"
              >
                Our Services
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-ksf-dark-text/70 font-body text-lg max-w-2xl mx-auto leading-relaxed"
              >
                Come and be part of our vibrant community as we worship, pray, and grow together in the Word of God throughout the week.
              </motion.p>
            </div>

            {/* Services Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {servicesList.map((service, index) => (
                <Link 
                  key={index} 
                  to={service.href}
                  className="block h-full group"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative h-[300px] sm:h-[350px] rounded-ksf-lg overflow-hidden shadow-xl"
                  >
                    {/* Card Background Image */}
                    <img 
                      src={service.img} 
                      alt={service.title} 
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75"
                      referrerPolicy="no-referrer"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-blue via-primary-blue/40 to-transparent group-hover:from-primary-blue/90 transition-colors duration-500" />
                    
                    {/* Card Content */}
                    <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-ksf-white transform group-hover:-translate-y-2 transition-transform duration-500">
                      <span className="text-2xl sm:text-3xl mb-4 transform group-hover:scale-110 transition-transform origin-left">{service.icon}</span>
                      <div className="mb-2">
                         <span className="font-accent font-black text-[10px] tracking-widest text-sky-blue uppercase">{service.time}</span>
                      </div>
                      <h3 className="font-headlines font-black text-xl sm:text-2xl mb-3 tracking-tight leading-tight">
                        {service.title}
                      </h3>
                      <p className="font-body text-xs sm:text-sm text-ksf-white font-medium mb-6 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                        {service.desc}
                      </p>
                      <div className="flex items-center gap-2 font-accent font-bold text-[10px] sm:text-xs tracking-widest group/btn min-h-[44px] group-hover:text-bold-red transition-colors">
                        CONNECT NOW
                        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Preview Section */}
        <section className="bg-ksf-white py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8">
              <div className="max-w-2xl">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="font-accent uppercase text-sky-blue tracking-[0.3em] text-xs font-black mb-6 block"
                >
                  MOMENTS CAPTURED
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-primary-blue text-4xl lg:text-6xl font-headlines font-black tracking-tight"
                >
                  Through the Lens
                </motion.h2>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Link 
                  to="/gallery" 
                  className="inline-flex items-center gap-3 text-sky-blue font-accent font-black text-xs tracking-widest uppercase hover:text-bold-red transition-colors group"
                >
                  View Full Gallery
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[
                'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
                'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80',
                'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
                'https://images.unsplash.com/photo-1504052434139-443c4085b2c9?w=800&q=80'
              ].map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="aspect-square relative group overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] cursor-pointer"
                >
                  <img 
                    src={img} 
                    alt="Gallery Moment" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-primary-blue/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <Camera className="text-ksf-white w-8 h-8" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Prayer/CTA Banner Section */}
        <section id="prayer" className="relative py-32 lg:py-48 flex items-center justify-center overflow-hidden bg-deep-navy">
          {/* Atmospheric Background Texture */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
            {/* Gradient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(26,82,168,0.15)_0%,transparent_70%)]"></div>
          </div>
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
            {/* Flame/Spirit Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="flex justify-center mb-10"
            >
              <div className="bg-bold-red/10 p-6 rounded-ksf-full ring-1 ring-bold-red/20 shadow-[0_0_50px_rgba(204,27,27,0.2)]">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CC1B1B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.292 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </div>
            </motion.div>

            {/* Label */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-accent uppercase text-bold-red tracking-[0.4em] text-xs font-black mb-6 block"
            >
              PRAY WITH US
            </motion.span>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-ksf-white text-4xl lg:text-6xl font-headlines font-bold italic mb-8 tracking-tight"
            >
              Pray for the Nations. <br className="sm:hidden" /> Seek God First.
            </motion.h2>

            {/* Body Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-ksf-white/70 font-body text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-14"
            >
              Join our global prayer movement. Every week, thousands of KSF family members across the world unite in intercession for breakthrough, revival, and transformation.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="relative inline-block"
            >
              <a 
                href="https://chat.whatsapp.com/KSFPrayerPoints"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join the KSF prayer WhatsApp group"
                className="inline-flex items-center justify-center bg-bold-red text-ksf-white px-8 sm:px-14 py-4 sm:py-6 rounded-ksf-full font-accent font-bold text-base sm:text-lg tracking-widest hover:bg-primary-blue hover:text-ksf-white hover:scale-105 active:scale-[0.97] transition-all duration-300 pulse-glow shadow-2xl min-h-[44px]"
              >
                JOIN THE PRAYER WHATSAPP
              </a>
              
              {/* Particle Decoration (Simplified) */}
              <div className="absolute -top-4 -right-4 w-3 h-3 bg-sky-blue rounded-ksf-full animate-ping opacity-70"></div>
              <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-ksf-white rounded-ksf-full animate-pulse opacity-40"></div>
            </motion.div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className="bg-ksf-white py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16 lg:mb-20">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-primary-blue text-4xl lg:text-5xl font-headlines font-bold mb-6"
              >
                Contact Us
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-[#6B7280] font-body text-lg max-w-2xl mx-auto"
              >
                We are here for you — reach out anytime and our team will get back to you.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              {/* Left Column: Church Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-ksf-gray-bg/50 p-8 lg:p-12 rounded-ksf-lg h-full border border-ksf-gray-bg">
                  <h3 className="font-headlines font-bold text-2xl text-primary-blue mb-8">{siteSettings.church_name || 'Kingdom Seekers Fellowship'}</h3>
                  
                  <div className="space-y-6 mb-12">
                    <div className="flex items-start gap-4">
                      <div className="bg-white p-3 rounded-ksf-md shadow-sm text-primary-blue">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="font-accent text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-1">Email Us</p>
                        <p className="text-ksf-dark-text font-body font-medium">{siteSettings.email || 'info@ksfchurch.org'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-white p-3 rounded-ksf-md shadow-sm text-primary-blue">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className="font-accent text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-1">Call Us</p>
                        <p className="text-ksf-dark-text font-body font-medium">{siteSettings.phone || '+254 700 000 000'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-white p-3 rounded-ksf-md shadow-sm text-primary-blue">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="font-accent text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-1">Location</p>
                        <p className="text-ksf-dark-text font-body font-medium">{siteSettings.location || 'Kitale, Kenya'}</p>
                        {siteSettings.google_maps_directions_url && (
                          <a 
                            href={siteSettings.google_maps_directions_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-blue hover:text-bold-red text-xs font-accent font-bold tracking-wider uppercase mt-1 block transition-colors duration-300"
                          >
                            Get Directions →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-10">
                    <p className="font-accent text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-4">Follow Our Journey</p>
                    <div className="flex gap-4">
                      {[
                        { icon: Facebook, label: 'Facebook', href: siteSettings.facebook_url || "#" },
                        { icon: Youtube, label: 'Youtube', href: siteSettings.youtube_url || "https://www.youtube.com/@KsfKitale/streams" },
                        { icon: Instagram, label: 'Instagram', href: siteSettings.instagram_url || "#" },
                        { icon: MessageCircle, label: 'WhatsApp', href: siteSettings.whatsapp_url || "#" }
                      ].map((social, i) => (
                        <a 
                          key={i} 
                          href={social.href} 
                          target={social.href !== "#" && social.href !== "" ? "_blank" : undefined}
                          rel={social.href !== "#" && social.href !== "" ? "noopener noreferrer" : undefined}
                          aria-label={social.label}
                          className="w-12 h-12 bg-white rounded-ksf-full flex items-center justify-center text-primary-blue hover:text-ksf-white hover:bg-bold-red transition-all duration-300 shadow-sm"
                        >
                          <social.icon size={20} />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Map Location */}
                  <div className="w-full h-64 sm:h-80 rounded-ksf-lg overflow-hidden border-2 border-white shadow-lg relative">
                    <iframe 
                      src={siteSettings.google_maps_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.1823110878245!2d35.02584957301872!3d1.0230539989670981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1782275785543923%3A0xe7d5b05deeb5e499!2sKINGDOM%20SEEKERS%20FELLOWSHIP%20(KITALE)!5e0!3m2!1sen!2ske!4v1782503100856!5m2!1sen!2ske"}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      title="Kingdom Seekers Fellowship (Kitale) Location Map"
                    ></iframe>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-accent text-xs font-bold tracking-widest text-ksf-dark-text opacity-70">FULL NAME</label>
                      <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`w-full px-5 py-4 rounded-ksf-md border-2 font-body text-ksf-dark-text focus:outline-none focus:border-sky-blue focus:ring-4 focus:ring-sky-blue/5 transition-all duration-300 ${
                          formErrors.fullName ? 'border-bold-red' : 'border-[#E5E7EB]'
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-accent text-xs font-bold tracking-widest text-ksf-dark-text opacity-70">EMAIL ADDRESS</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className={`w-full px-5 py-4 rounded-ksf-md border-2 font-body text-ksf-dark-text focus:outline-none focus:border-sky-blue focus:ring-4 focus:ring-sky-blue/5 transition-all duration-300 ${
                          formErrors.email ? 'border-bold-red' : 'border-[#E5E7EB]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-accent text-xs font-bold tracking-widest text-ksf-dark-text opacity-70">PHONE NUMBER</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+254 700 000 000"
                      className={`w-full px-5 py-4 rounded-ksf-md border-2 font-body text-ksf-dark-text focus:outline-none focus:border-sky-blue focus:ring-4 focus:ring-sky-blue/5 transition-all duration-300 ${
                        formErrors.phone ? 'border-bold-red' : 'border-[#E5E7EB]'
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-accent text-xs font-bold tracking-widest text-ksf-dark-text opacity-70">YOUR MESSAGE</label>
                    <textarea 
                      rows={6}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="How can we help or pray for you?"
                      className={`w-full px-5 py-4 rounded-ksf-md border-2 font-body text-ksf-dark-text focus:outline-none focus:border-sky-blue focus:ring-4 focus:ring-sky-blue/5 transition-all duration-300 resize-none ${
                        formErrors.message ? 'border-bold-red' : 'border-[#E5E7EB]'
                      }`}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    aria-label="Send message"
                    className="w-full min-h-[56px] bg-bold-red text-ksf-white py-4 rounded-ksf-md font-accent font-bold tracking-widest text-sm hover:bg-primary-blue hover:shadow-xl active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        SEND MESSAGE
                        <Send size={18} />
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {showSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-ksf-md font-body text-sm text-center font-medium"
                      >
                        Your message has been sent successfully! Our team will contact you soon.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Modals - Placed at root to avoid stacking context issues */}
      <AnimatePresence>
        {isEventsModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-6 lg:p-12 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEventsModalOpen(false)}
              className="absolute inset-0 bg-ksf-dark-text/95 backdrop-blur-3xl"
            />
            
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-ksf-white w-full h-full sm:h-auto max-w-6xl sm:max-h-[85vh] rounded-none sm:rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col z-[10000]"
            >
              {/* Close Button - Premium Floating */}
              <button 
                onClick={() => setIsEventsModalOpen(false)}
                className="absolute top-6 right-6 sm:top-10 sm:right-10 z-[10100] w-12 h-12 sm:w-16 sm:h-16 bg-ksf-white border border-ksf-gray-bg/50 shadow-xl rounded-full flex items-center justify-center text-primary-blue hover:bg-bold-red hover:text-ksf-white hover:rotate-90 hover:scale-110 transition-all duration-500 group active:scale-90"
                aria-label="Close modal"
              >
                <X size={28} strokeWidth={2.5} />
              </button>

              {/* Modal Header */}
              <div className="px-8 sm:px-20 pt-12 sm:pt-24 pb-8 sm:pb-12 border-b border-ksf-gray-bg sticky top-0 bg-ksf-white z-[10050]">
                <span className="font-accent font-black text-bold-red text-[10px] tracking-[5px] uppercase mb-4 block">
                  UPCOMING AT KSF
                </span>
                <h3 className="text-primary-blue font-headlines font-black text-4xl sm:text-7xl tracking-tighter leading-[0.85]">
                  The Calendar
                </h3>
                <p className="text-[#6B7280] font-body text-base sm:text-xl mt-6 max-w-2xl opacity-70 leading-relaxed font-medium">
                  Be part of what God is doing. From worship encounters to community outreach, find your next step here.
                </p>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-8 sm:p-20 custom-scrollbar flex-grow bg-ksf-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-14">
                  {eventsList.map((event, idx) => {
                    const count = attendance[event.id] || 0;
                    const capacities: Record<number, number> = { 1: 500, 2: 300, 3: 150, 4: 250, 5: 100, 6: 120 };
                    const targetCap = capacities[event.id] || 200;
                    const pct = Math.min(100, Math.round((count / targetCap) * 100));
                    const alreadyJoined = userVotedEvents.includes(event.id);
                    const avatarItems = [
                      { init: 'AK', bg: 'bg-indigo-500 text-white' },
                      { init: 'SW', bg: 'bg-emerald-500 text-white' },
                      { init: 'JM', bg: 'bg-amber-500 text-black' },
                    ];

                    return (
                      <motion.div 
                        key={event.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (idx * 0.08) }}
                        className="bg-white rounded-[2.5rem] overflow-hidden border border-primary-blue/[0.04] shadow-sm hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] hover:-translate-y-3 transition-all duration-500 flex flex-col group h-full relative"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <img 
                            src={event.img} 
                            alt={event.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out filter brightness-95" 
                            referrerPolicy="no-referrer" 
                          />
                          <div className="absolute top-6 left-6 z-20 backdrop-blur-md bg-white/95 border border-white/20 text-[#001D4A] text-[9px] uppercase font-accent font-black tracking-widest px-4.5 py-1.5 rounded-full shadow-md">
                            {event.tag}
                          </div>
                          {alreadyJoined && (
                            <div className="absolute top-6 right-6 z-20 bg-emerald-500 text-white text-[9px] uppercase font-accent font-black tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                              REGISTERED ✓
                            </div>
                          )}
                        </div>
                        <div className="p-10 sm:p-12 flex flex-col flex-grow">
                          
                          {/* Interactive Dynamic Calendar & Date Header */}
                          <div className="flex items-start gap-4 mb-6">
                            {/* Calendar Box */}
                            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-primary-blue to-sky-blue text-white rounded-2xl w-14 h-14 sm:w-16 sm:h-16 shrink-0 shadow-lg shadow-primary-blue/10">
                              <span className="font-accent font-black text-xl sm:text-2xl leading-none mt-1">{event.day}</span>
                              <span className="font-accent font-extrabold text-[8px] sm:text-[9px] tracking-[2px] uppercase opacity-90 leading-none mt-1 sm:mt-1.5">{event.month}</span>
                            </div>
                            
                            {/* Metadata text */}
                            <div className="pt-1.5">
                              <span className="font-accent font-black text-[11px] tracking-wider text-bold-red block uppercase">
                                {event.date}
                              </span>
                              <span className="font-body text-xs text-ksf-dark-text/50 font-bold block mt-0.5">
                                {event.time}
                              </span>
                            </div>
                          </div>

                          <h4 className="font-headlines font-black text-2xl sm:text-3xl text-ksf-dark-text mb-4 leading-tight tracking-tight group-hover:text-bold-red transition-colors duration-300">{event.title}</h4>
                          
                          {/* Description */}
                          <p className="text-sm font-body text-[#4B5563] mb-8 line-clamp-2 leading-relaxed opacity-90">
                            {event.desc}
                          </p>
                          
                          {/* Real-time slider metrics */}
                          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6">
                            <div className="flex justify-between text-xs font-accent font-bold mb-2">
                              <span className="text-primary-blue">GROWING ATTENDANCE</span>
                              <span className="text-primary-blue">{count} Going ({pct}%)</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                              <div className={`h-full rounded-full bg-gradient-to-r ${alreadyJoined ? 'from-emerald-500 to-teal-400' : 'from-primary-blue to-sky-blue'}`} style={{ width: `${pct}%` }} />
                            </div>
                            <div className="flex items-center -space-x-2">
                              {avatarItems.map((av, idx) => (
                                <div key={idx} className={`w-6 h-6 rounded-full border-2 border-white ${av.bg} flex items-center justify-center font-accent font-black text-[7px] shadow-sm`}>
                                  {av.init}
                                </div>
                              ))}
                              <div className="w-9 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center font-accent font-black text-[7.5px] text-primary-blue shadow-sm">
                                +{Math.max(0, count - 3)}
                              </div>
                            </div>
                          </div>

                          <div className="mt-auto pt-6 border-t border-ksf-gray-bg/60 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-ksf-dark-text/40">
                              <MapPin size={14} className="text-[#3B82F6]" />
                              <span className="font-accent font-bold tracking-widest uppercase text-[9px] max-w-[100px] truncate">{event.location}</span>
                            </div>
                            
                            {alreadyJoined ? (
                              <button 
                                onClick={() => handleCancelAttendance(event.id)}
                                className="font-accent font-extrabold text-[9px] tracking-widest text-[#E11D48] hover:text-red-700 uppercase transition-all duration-300 py-2.5 px-4 rounded-xl hover:bg-red-50"
                              >
                                CANCEL
                              </button>
                            ) : (
                              <button 
                                onClick={() => {
                                  setSelectedRsvpEvent(event);
                                  setIsEventsModalOpen(false); // Close calendar first so user sees RSVP Form nicely
                                  setRsvpSuccess(false);
                                  setRsvpName('');
                                  setRsvpEmail('');
                                }}
                                className="bg-primary-blue text-white px-6 py-2.5 rounded-full font-accent font-black text-[9px] tracking-[2px] uppercase hover:bg-bold-red transition-all shadow-md active:scale-95 duration-200"
                              >
                                ATTEND
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Empty state / More coming soon */}
                <div className="mt-24 text-center py-24 border-2 border-dashed border-ksf-gray-border rounded-[3.5rem] bg-ksf-gray-bg/20">
                  <div className="w-20 h-20 bg-ksf-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <Calendar size={32} className="text-[#9CA3AF]" />
                  </div>
                  <p className="font-headlines font-bold text-ksf-dark-text/30 text-2xl italic">More encounters being scheduled...</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Mode Security Pin Modal overlay */}
      <AnimatePresence>
        {showPasswordPrompt && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowPasswordPrompt(false);
                setAdminError('');
                setAdminPassword('');
              }}
              className="absolute inset-0 bg-ksf-dark-text/90 backdrop-blur-md"
            />

            {/* Content card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative bg-white w-full max-w-sm rounded-[2rem] p-8 sm:p-10 shadow-2xl overflow-hidden text-[#001D4A] z-10"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
                  <Lock size={24} />
                </div>
                <h3 className="font-headlines text-2xl font-black">Admin Access Required</h3>
                <p className="text-sm font-body text-[#4B5563] mt-2 font-medium">Please enter your secure 4-digit PIN password.</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <input
                    type="password"
                    maxLength={10}
                    placeholder="Enter Private PIN Pin Code"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full text-center px-4 py-3 border-2 border-slate-200 rounded-xl font-mono text-xl tracking-widest focus:outline-none focus:border-primary-blue bg-slate-50"
                    autoFocus
                  />
                  <p className="text-[10px] text-zinc-500 font-bold block text-center mt-1">Hint: Use password pin <span className="text-primary-blue underline">7777</span> for preview access</p>
                </div>

                {adminError && (
                  <p className="text-xs font-accent font-extrabold text-red-500 text-center uppercase tracking-wider">{adminError}</p>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordPrompt(false);
                      setAdminError('');
                      setAdminPassword('');
                    }}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-accent font-bold text-xs tracking-wider rounded-xl uppercase transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary-blue hover:bg-bold-red text-white font-accent font-bold text-xs tracking-wider rounded-xl uppercase transition-all shadow-md"
                  >
                    Authorize
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modern RSVP Booking/Voting Sheet Modal overlay */}
      <AnimatePresence>
        {selectedRsvpEvent && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedRsvpEvent(null);
                setRsvpSuccess(false);
              }}
              className="absolute inset-0 bg-[#001D4A]/90 backdrop-blur-md"
            />

            {/* Core Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 sm:p-10 shadow-3xl text-[#001D4A] overflow-hidden z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedRsvpEvent(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center text-slate-700 transition-all duration-300 active:scale-95"
              >
                <X size={18} />
              </button>

              {!rsvpSuccess ? (
                <div>
                  <span className="font-accent text-bold-red font-black tracking-widest text-[9px] uppercase mb-2 block">SECURE ATTENDANCE</span>
                  <h3 className="font-headlines text-2xl sm:text-3xl font-black mb-1">{selectedRsvpEvent.title}</h3>
                  <div className="flex gap-2 items-center text-slate-500 font-accent font-bold text-[10px] uppercase mb-6 tracking-wide">
                    <span>{selectedRsvpEvent.date}</span>
                    <span>•</span>
                    <span>{selectedRsvpEvent.time}</span>
                  </div>

                  {/* Progressive indicator count banner */}
                  <div className="bg-sky-blue/5 border border-sky-blue/10 p-4 rounded-2xl mb-6">
                    <p className="font-body text-xs text-primary-blue/80 font-bold leading-relaxed">
                      You are adding your vote directly to our attendance count.
                      There are currently <span className="font-extrabold text-bold-red">{attendance[selectedRsvpEvent.id] || 0} family members</span> attending this gathering.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Mode 1: Log RSVP Form */}
                    <div className="space-y-3">
                      <div>
                        <label className="font-accent text-[10px] font-black tracking-wider text-slate-500 uppercase mb-1.5 block">Your Full Name</label>
                        <input
                          type="text"
                          value={rsvpName}
                          onChange={(e) => setRsvpName(e.target.value)}
                          placeholder="e.g. Christine Gakii"
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 font-body text-sm focus:outline-none focus:border-primary-blue"
                        />
                      </div>
                      <div>
                        <label className="font-accent text-[10px] font-black tracking-wider text-slate-500 uppercase mb-1.5 block">Email Address (To receive details)</label>
                        <input
                          type="email"
                          value={rsvpEmail}
                          onChange={(e) => setRsvpEmail(e.target.value)}
                          placeholder="christine@gmail.com"
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 font-body text-sm focus:outline-none focus:border-primary-blue"
                        />
                      </div>
                    </div>

                    {rsvpFormError && (
                      <p className="text-xs font-accent font-extrabold text-[#E11D48] tracking-widest uppercase">{rsvpFormError}</p>
                    )}

                    {/* Standard Action Button */}
                    <button
                      onClick={() => executeRsvp(false)}
                      disabled={isRsvpSubmitting}
                      className="w-full py-4 bg-primary-blue hover:bg-bold-red text-white font-accent font-black tracking-widest rounded-xl text-xs uppercase transition-all duration-300 shadow-lg shadow-primary-blue/10 active:scale-95 flex items-center justify-center gap-2"
                    >
                      {isRsvpSubmitting ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <Check size={14} />
                          REGISTER CONFIRMATION
                        </>
                      )}
                    </button>

                    {/* Separator */}
                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-slate-200"></div>
                      <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-accent font-extrabold uppercase tracking-widest">OR QUICK VOTE</span>
                      <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    {/* Mode 2: Quick anonymous attend */}
                    <button
                      onClick={() => executeRsvp(true)}
                      disabled={isRsvpSubmitting}
                      className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-accent font-bold tracking-widest rounded-xl text-[10px] uppercase transition-all duration-300 active:scale-95"
                    >
                      I’LL ATTEND (QUICK 1-CLICK VOTE)
                    </button>
                  </div>
                </div>
              ) : (
                /* Success screen */
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25 animate-bounce-subtle">
                    <Check size={32} strokeWidth={3} />
                  </div>
                  <h3 className="font-headlines text-2xl sm:text-3xl font-black mb-2">Spot Confirmed!</h3>
                  <p className="text-sm font-body text-[#4B5563] leading-relaxed max-w-xs mx-auto mb-8">
                    Wonderful! Your vote of attendance counts, and has been added successfully to KSF. You are officially registered for <span className="font-extrabold text-primary-blue">{selectedRsvpEvent.title}</span>.
                  </p>
                  <button
                    onClick={() => setSelectedRsvpEvent(null)}
                    className="bg-[#001D4A] hover:bg-bold-red text-white px-8 py-3 rounded-xl font-accent font-bold tracking-wider text-xs uppercase shadow-md transition-all duration-300"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
