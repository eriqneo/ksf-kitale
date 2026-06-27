import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Maximize2, X, ChevronRight, Filter } from 'lucide-react';
import { usePocketBase, pb } from '../context/PocketBaseContext';

interface GalleryImage {
  id: string;
  image: string;
  title: string;
  category: 'Worship' | 'Community' | 'Outreach' | 'Youth';
  image_url?: string;
}

const FALLBACK_GALLERY_IMAGES: any[] = [
  {
    id: 'g1',
    image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&q=80',
    title: 'Sunday Morning Worship',
    category: 'Worship'
  },
  {
    id: 'g2',
    image_url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&q=80',
    title: 'Youth Night Fellowship',
    category: 'Youth'
  },
  {
    id: 'g3',
    image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
    title: 'Community Outreach Program',
    category: 'Outreach'
  },
  {
    id: 'g4',
    image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80',
    title: 'Heart of Worship',
    category: 'Worship'
  },
  {
    id: 'g5',
    image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&q=80',
    title: 'Small Groups Breakfast',
    category: 'Community'
  },
  {
    id: 'g6',
    image_url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1200&q=80',
    title: 'Youth Prayer Summit',
    category: 'Youth'
  },
  {
    id: 'g7',
    image_url: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=1200&q=80',
    title: 'Grace Circle Gathering',
    category: 'Community'
  },
  {
    id: 'g8',
    image_url: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200&q=80',
    title: 'Missions in the City',
    category: 'Outreach'
  },
  {
    id: 'g9',
    image_url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80',
    title: 'Festival of Faith',
    category: 'Worship'
  }
];

const CATEGORIES = ['All', 'Worship', 'Community', 'Outreach', 'Youth'];

export default function Gallery() {
  const { pages, getImageUrl } = usePocketBase();
  const page = pages['gallery'];

  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  useEffect(() => {
    async function loadImages() {
      try {
        const records = await pb.collection('gallery_images').getFullList({
          sort: 'sort_order'
        });
        if (records.length > 0) {
          setGalleryImages(records);
        } else {
          setGalleryImages(FALLBACK_GALLERY_IMAGES);
        }
      } catch (err) {
        console.error("Failed to load gallery images from PocketBase:", err);
        setGalleryImages(FALLBACK_GALLERY_IMAGES);
      }
    }
    loadImages();
  }, []);

  const filteredImages = activeCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const heroImage = getImageUrl(page, 'hero_image', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&q=80');

  return (
    <div className="min-h-screen bg-ksf-white">
      {/* Premium Hero Section */}
      <div className="relative pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 pb-0">
        <section className="relative h-[60vh] sm:h-[70vh] w-full rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden flex items-end pb-12 sm:pb-20 lg:pb-24">
          <div className="absolute inset-0 z-0 scale-105 animate-slow-zoom">
            <img 
              src={heroImage} 
              alt={page?.title || "Gallery Background"} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-20" />
          </div>

          <div className="container mx-auto px-8 sm:px-16 md:px-24 relative z-30">
            <div className="max-w-4xl text-ksf-white">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-accent font-black text-bold-red text-[10px] sm:text-xs tracking-[6px] uppercase mb-4 sm:mb-6 block">
                  {page?.hero_subtitle || 'THROUGH THE LENS'}
                </span>

                <h1 className="font-headlines font-black text-5xl sm:text-7xl md:text-8xl leading-[0.85] mb-6 tracking-tighter">
                  {page?.hero_heading || 'Our Moments & Messages'}
                </h1>

                <p className="font-body text-base sm:text-xl md:text-2xl opacity-80 font-medium tracking-tight max-w-2xl leading-relaxed">
                  {page?.hero_description || "A visual journey through the life of Kingdom Seekers Fellowship. Catch a glimpse of God's glory in our community."}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <main className="relative z-10">
        {/* Filter Controls */}
        <section className="container mx-auto px-6 sm:px-12 py-12 sm:py-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 sm:px-8 py-3 rounded-full font-accent font-black text-[10px] sm:text-xs tracking-[2px] uppercase transition-all duration-300 ${
                    activeCategory === cat 
                      ? 'bg-bold-red text-ksf-white shadow-xl scale-105' 
                      : 'bg-ksf-gray-bg text-ksf-dark-text/40 hover:bg-ksf-gray-bg/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="hidden lg:flex items-center gap-3 text-ksf-dark-text/20 font-accent font-black text-xs tracking-widest uppercase">
              <Filter size={16} />
              <span>Filter Moments</span>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="container mx-auto px-6 sm:px-12 pb-24 sm:pb-32">
          <motion.div 
            layout
            className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
          >
              {filteredImages.map((image) => {
                const imageUrl = getImageUrl(image, 'image', image.image_url || '');
                return (
                  <motion.div
                    key={image.id || image.title}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative group cursor-pointer overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-ksf-gray-bg"
                    onClick={() => setSelectedImage(image)}
                  >
                    <motion.img
                      src={imageUrl}
                      alt={image.title}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary-blue/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 sm:p-10 text-ksf-white">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                        <span className="font-accent font-black text-[10px] tracking-[4px] uppercase text-sky-blue mb-2 block">
                          {image.category}
                        </span>
                        <h3 className="font-headlines font-black text-xl sm:text-2xl leading-tight mb-4">
                          {image.title}
                        </h3>
                        <div className="flex items-center gap-3 font-accent font-black text-[10px] tracking-[2px] uppercase">
                          <Maximize2 size={16} />
                          VIEW FULLSCREEN
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </motion.div>
          
          {/* Load More Mock */}
          <div className="mt-24 text-center">
            <button className="bg-ksf-gray-bg hover:bg-bold-red hover:text-ksf-white text-ksf-dark-text px-12 py-5 rounded-full font-accent font-black tracking-[3px] text-xs transition-all active:scale-95 uppercase flex items-center gap-4 mx-auto group">
              Discover More Captured Moments
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </main>

      {/* Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-ksf-dark-text/95 backdrop-blur-2xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-7xl max-h-full overflow-hidden rounded-[2rem] sm:rounded-[3rem] shadow-2xl z-20"
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-ksf-white border border-ksf-gray-bg/20 shadow-xl rounded-full flex items-center justify-center text-primary-blue hover:bg-bold-red hover:text-ksf-white hover:rotate-90 transition-all duration-500 z-50 group"
              >
                <X size={24} />
              </button>
              
              <img 
                src={getImageUrl(selectedImage, 'image', selectedImage.image_url || '')} 
                alt={selectedImage.title} 
                className="w-full h-auto max-h-[85vh] object-contain"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-8 sm:p-12">
                <span className="font-accent font-black text-[10px] tracking-[5px] uppercase text-sky-blue mb-2 block">
                  {selectedImage.category}
                </span>
                <h2 className="text-ksf-white font-headlines font-black text-2xl sm:text-4xl">
                  {selectedImage.title}
                </h2>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
