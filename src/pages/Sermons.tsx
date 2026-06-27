import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Headset, Calendar, User, Clock, ChevronRight } from 'lucide-react';
import { usePocketBase, pb } from '../context/PocketBaseContext';

const FALLBACK_SERMONS = [
  {
    id: 's1',
    title: "Walking in Divine Purpose",
    speaker: "Pastor David Maina",
    date: "April 27, 2024",
    duration: "45 mins",
    series: "Kingdom Life",
    thumbnail: "https://picsum.photos/seed/sermon1/800/450",
    video_url: "https://www.youtube.com/embed/uEnVhRdDUBk?si=VQtnbJifKdptOzU6"
  },
  {
    id: 's2',
    title: "The Power of Persistance",
    speaker: "Pastor Jane Doe",
    date: "April 20, 2024",
    duration: "38 mins",
    series: "Breakthrough",
    thumbnail: "https://picsum.photos/seed/sermon2/800/450",
    video_url: "https://www.youtube.com/embed/uEnVhRdDUBk?si=VQtnbJifKdptOzU6"
  },
  {
    id: 's3',
    title: "Restoring the Foundation",
    speaker: "Bishop Samuel G.",
    date: "April 13, 2024",
    duration: "52 mins",
    series: "Foundations",
    thumbnail: "https://picsum.photos/seed/sermon3/800/450",
    video_url: "https://www.youtube.com/embed/uEnVhRdDUBk?si=VQtnbJifKdptOzU6"
  },
  {
    id: 's4',
    title: "Grace for the Journey",
    speaker: "Pastor David Maina",
    date: "April 6, 2024",
    duration: "41 mins",
    series: "Grace Unbound",
    thumbnail: "https://picsum.photos/seed/sermon4/800/450",
    video_url: "https://www.youtube.com/embed/uEnVhRdDUBk?si=VQtnbJifKdptOzU6"
  },
  {
    id: 's5',
    title: "Faith in the Fire",
    speaker: "Pastor Sarah Kim",
    date: "March 30, 2024",
    duration: "47 mins",
    series: "Steadfast",
    thumbnail: "https://picsum.photos/seed/sermon5/800/450",
    video_url: "https://www.youtube.com/embed/uEnVhRdDUBk?si=VQtnbJifKdptOzU6"
  },
  {
    id: 's6',
    title: "New Beginnings",
    speaker: "Pastor David Maina",
    date: "March 23, 2024",
    duration: "45 mins",
    series: "Restoration",
    thumbnail: "https://picsum.photos/seed/sermon6/800/450",
    video_url: "https://www.youtube.com/embed/uEnVhRdDUBk?si=VQtnbJifKdptOzU6"
  }
];

export default function Sermons() {
  const { pages, getImageUrl } = usePocketBase();
  const page = pages['sermons'];

  const [sermonsList, setSermonsList] = useState<any[]>([]);
  const [featuredSermon, setFeaturedSermon] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    async function loadSermons() {
      try {
        const records = await pb.collection('sermons').getFullList({
          sort: 'sort_order',
          requestKey: null
        });
        if (records.length > 0) {
          setSermonsList(records);
          const featured = records.find(r => r.is_featured) || records[0];
          setFeaturedSermon(featured);
        } else {
          setSermonsList(FALLBACK_SERMONS);
          setFeaturedSermon(FALLBACK_SERMONS[0]);
        }
      } catch (err) {
        console.error("Failed to fetch sermons from PocketBase, using fallbacks:", err);
        setSermonsList(FALLBACK_SERMONS);
        setFeaturedSermon(FALLBACK_SERMONS[0]);
      }
    }
    loadSermons();
  }, []);

  // Helper to parse/convert watch URL or live URL to embed URL
  const getYoutubeEmbedUrl = (youtubeUrl: string) => {
    if (!youtubeUrl) return "https://www.youtube.com/embed/uEnVhRdDUBk?si=VQtnbJifKdptOzU6";
    if (youtubeUrl.includes('youtube.com/embed/')) return youtubeUrl;
    
    const watchMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
    
    const liveMatch = youtubeUrl.match(/youtube\.com\/live\/([^&\s?]+)/);
    if (liveMatch && liveMatch[1]) {
      return `https://www.youtube.com/embed/${liveMatch[1]}`;
    }

    return youtubeUrl;
  };

  const heroImage = getImageUrl(page, 'hero_image', 'https://images.unsplash.com/photo-1505663912202-ac22d4cb3707?w=1920&q=80');

  // Compute filters dynamically
  const uniqueSeries = Array.from(new Set(sermonsList.map(s => s.series).filter(Boolean)));
  const FILTERS = ['All', ...uniqueSeries];

  const handleSelectSermon = (sermon: any) => {
    setFeaturedSermon(sermon);
    const featuredSection = document.getElementById('featured-sermon-section');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-ksf-white">
      <div className="relative pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 pb-0">
        {/* Hero Section - Floating Card Style */}
        <section className="relative h-[60vh] sm:h-[70vh] w-full rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden flex items-end pb-12 sm:pb-20 lg:pb-24">
          {/* Background Image & Dark Overlays */}
          <div className="absolute inset-0 z-0 scale-105 animate-slow-zoom">
            <img 
              src={heroImage} 
              alt={page?.title || "Sermons & Messages"} 
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
            <div className="max-w-4xl text-ksf-white">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-accent font-black text-bold-red text-[10px] sm:text-xs tracking-[6px] uppercase mb-4 sm:mb-6 block">
                  {page?.hero_subtitle || 'THE WORD OF GOD'}
                </span>

                <h1 className="font-headlines font-black text-5xl sm:text-7xl md:text-8xl leading-[0.85] mb-6 tracking-tighter">
                  {page?.hero_heading || 'Sermons & Messages'}
                </h1>

                <p className="font-body text-base sm:text-xl md:text-2xl opacity-80 font-medium tracking-tight max-w-2xl leading-relaxed italic">
                  {page?.hero_description || '"Faith comes by hearing, and hearing by the word of God. Be fed by the Word of God through our collection of life-transforming messages."'}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <main className="relative z-10">

      {/* Featured Sermon */}
      <section id="featured-sermon-section" className="container mx-auto px-4 sm:px-6 lg:px-12 -mt-12 sm:-mt-16 relative z-20">
        <div className="bg-ksf-white rounded-ksf-lg shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          <div className="aspect-video lg:aspect-auto h-full bg-ksf-dark-text flex items-center justify-center relative group min-h-[240px]">
            {/* YouTube Iframe */}
            {featuredSermon && (
              <iframe 
                key={featuredSermon.id || featuredSermon.title}
                className="w-full h-full"
                src={getYoutubeEmbedUrl(featuredSermon.video_url)} 
                title={`${featuredSermon.title}: Featured Sermon`}
                loading="lazy"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            )}
          </div>
          <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
            <span className="font-accent text-sky-blue text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-4 text-center lg:text-left">Featured Message</span>
            <h2 className="text-primary-blue text-2xl sm:text-3xl lg:text-4xl font-headlines font-bold mb-6 text-center lg:text-left leading-tight">
              {featuredSermon?.title}
            </h2>
            <p className="text-ksf-dark-text/70 font-body text-base sm:text-lg mb-8 leading-relaxed text-center lg:text-left">
              A powerful message from the "{featuredSermon?.series}" series. Be inspired and challenged to live out your faith boldly.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-8 mb-8">
              <div className="flex items-center gap-2 text-ksf-dark-text/50">
                <User size={18} className="text-primary-blue" />
                <span className="font-body text-sm font-medium">{featuredSermon?.speaker}</span>
              </div>
              <div className="flex items-center gap-2 text-ksf-dark-text/50">
                <Calendar size={18} className="text-primary-blue" />
                <span className="font-body text-sm font-medium">{featuredSermon?.date}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => {
                  const iframe = document.querySelector('iframe');
                  if (iframe) {
                    const src = iframe.getAttribute('src') || '';
                    if (!src.includes('autoplay=1')) {
                      iframe.setAttribute('src', src + (src.includes('?') ? '&' : '?') + 'autoplay=1');
                    }
                  }
                }}
                aria-label="Watch the featured sermon"
                className="bg-primary-blue text-ksf-white px-8 py-3.5 min-h-[44px] rounded-ksf-md font-accent font-bold text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-bold-red active:scale-[0.97] transition-all"
              >
                <Play size={16} fill="currentColor" /> WATCH NOW
              </button>
              <a 
                href={featuredSermon?.video_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Listen or watch on YouTube"
                className="bg-bold-red/10 text-bold-red px-8 py-3.5 min-h-[44px] rounded-ksf-md font-accent font-bold text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-bold-red hover:text-ksf-white active:scale-[0.97] transition-all text-center"
              >
                <Headset size={16} /> LISTEN ON YOUTUBE
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 sm:px-6 py-2.5 rounded-ksf-full font-accent font-bold text-[10px] sm:text-xs tracking-widest transition-all min-h-[40px] ${
                activeFilter === filter 
                  ? 'bg-bold-red text-ksf-white shadow-lg' 
                  : 'bg-ksf-gray-bg text-[#6B7280] hover:bg-bold-red hover:text-ksf-white'
              }`}
            >
              {filter.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {/* Sermon Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-12 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
          {sermonsList.filter(s => activeFilter === 'All' || s.series === activeFilter).map((sermon, i) => {
            const thumbnailSrc = getImageUrl(sermon, 'thumbnail', sermon.thumbnail || 'https://picsum.photos/seed/sermon1/800/450');
            return (
              <motion.div
                key={sermon.id || sermon.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group cursor-pointer animate-fade-in-up"
                onClick={() => handleSelectSermon(sermon)}
              >
                <div className="relative aspect-video rounded-ksf-lg overflow-hidden mb-6 shadow-md shadow-primary-blue/5">
                  <img 
                    src={thumbnailSrc} 
                    alt={`Thumbnail for sermon: ${sermon.title}`} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-primary-blue/10 group-hover:bg-primary-blue/20 transition-colors" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-ksf-white rounded-ksf-full flex items-center justify-center text-primary-blue opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl">
                    <Play size={24} fill="currentColor" />
                  </div>
                </div>
                <div className="space-y-3 px-2">
                  <span className="font-accent text-sky-blue text-[10px] font-bold tracking-[0.2em] uppercase">
                    {sermon.series}
                  </span>
                  <h3 className="text-primary-blue font-headlines font-bold text-lg sm:text-xl leading-snug group-hover:text-sky-blue transition-colors">
                    {sermon.title}
                  </h3>
                  <div className="flex flex-col gap-2">
                    <p className="text-ksf-dark-text/50 font-body text-xs sm:text-sm flex items-center gap-2">
                      <User size={14} /> {sermon.speaker}
                    </p>
                    <div className="flex items-center gap-4 text-ksf-dark-text/30 font-body text-[10px] sm:text-xs">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {sermon.date}</span>
                      <span className="flex items-center gap-1 font-medium"><Clock size={12} /> {sermon.duration}</span>
                    </div>
                  </div>
                  <div className="pt-6 grid grid-cols-2 gap-3 sm:gap-4">
                    <button 
                      aria-label={`Watch sermon: ${sermon.title}`}
                      className="bg-primary-blue text-ksf-white py-2.5 min-h-[44px] rounded-ksf-md font-accent font-bold text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-bold-red active:scale-[0.97] transition-all shadow-sm"
                    >
                      <Play size={14} fill="currentColor" /> WATCH
                    </button>
                    <a 
                      href={sermon.video_url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Listen to sermon: ${sermon.title}`}
                      className="bg-bold-red/10 text-bold-red py-2.5 min-h-[44px] rounded-ksf-md font-accent font-bold text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-bold-red hover:text-ksf-white active:scale-[0.97] transition-all shadow-sm text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Headset size={14} /> YOUTUBE
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Pagination indicator */}
        <div className="flex items-center justify-center gap-3 mt-20">
          <button className="w-8 h-3 rounded-ksf-full transition-all duration-300 bg-bold-red" />
        </div>
      </section>
    </main>
  </div>
);
}
