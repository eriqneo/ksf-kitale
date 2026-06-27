import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { usePocketBase } from '../context/PocketBaseContext';

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

const DRAWER_LINKS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: "I'm New", href: '/im-new' },
  { 
    label: 'About', 
    children: [
      { label: 'Our Story', href: '/about/story' },
      { label: 'Leadership', href: '/about/story#leadership' },
      { label: 'Beliefs', href: '/about/story#beliefs' },
      { label: 'KSF History', href: '/about/story#history' }
    ]
  },
  { 
    label: 'Ministries', 
    children: [
      { label: 'KSF Kids', href: '/ministries/kids' },
      { label: 'Youth', href: '/ministries/youth' },
      { label: 'Women', href: '/ministries/women' },
      { label: 'Men', href: '/ministries/men' },
      { label: 'Home Fellowship', href: '/ministries/home-fellowship' },
      { label: 'Missions', href: '/about/story#strategies' },
      { label: 'Trivias', href: '/bible-trivia' }
    ]
  },
  { 
    label: 'Next Steps', 
    children: [
      { label: 'Baptism', href: '/im-new#baptism' },
      { label: 'Membership', href: '/im-new#membership' },
      { label: 'Volunteering', href: '/im-new#volunteering' },
      { label: 'Discipleship', href: '/im-new#discipleship' },
      { label: 'Prayer Points', href: '/prayer-points' }
    ]
  },
  { 
    label: 'Media', 
    children: [
      { label: 'Sermons', href: '/sermons' },
      { label: 'Podcast', href: '/sermons' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Live Stream', href: 'https://www.youtube.com/@KsfKitale/streams' }
    ]
  },
  { label: 'Events', href: '/#events' },
  { label: 'Give', href: '/give' },
];

export default function Navbar() {
  const { siteSettings } = usePocketBase();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  const liveStreamUrl = siteSettings?.youtube_url || 'https://www.youtube.com/@KsfKitale/streams';

  const dynamicLinks = DRAWER_LINKS.map(item => {
    if (item.label === 'Media' && item.children) {
      return {
        ...item,
        children: item.children.map(child => 
          child.label === 'Live Stream' ? { ...child, href: liveStreamUrl } : child
        )
      };
    }
    return item;
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const forceOpaque = location.pathname === '/bible-trivia';
  const isOpaque = isScrolled || forceOpaque;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isOpaque 
            ? 'bg-ksf-white border-b border-ksf-gray-bg/50 py-2.5 shadow-ksf-scroll' 
            : 'bg-transparent py-4 md:py-6'
        }`}
      >
        <div className="container mx-auto flex items-center justify-between transition-all duration-500 px-6 md:px-12 lg:px-16">
          {/* Logo */}
          <Link to="/" className="z-10 group flex items-center gap-2.5">
            <div className={`relative rounded-full flex items-center justify-center overflow-hidden border-2 transition-all duration-500 ${
              isOpaque 
                ? 'w-10 h-10 md:w-12 md:h-12 border-primary-blue/20 bg-ksf-white shadow-md group-hover:border-bold-red' 
                : 'w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 border-ksf-white/30 bg-ksf-white/10 backdrop-blur-sm group-hover:border-ksf-white'
            }`}>
              <img 
                src="/KSF LOGO.jpg" 
                alt="Kingdom Seekers Fellowship" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/150/0d3875/ffffff?text=KSF';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className={`font-headlines font-black tracking-tight leading-none transition-all duration-500 ${
                isOpaque 
                  ? 'text-primary-blue text-sm sm:text-base md:text-lg' 
                  : 'text-ksf-white text-base sm:text-lg md:text-xl'
              }`}>
                Kingdom Seekers
              </span>
              <span className={`font-accent font-bold tracking-[0.2em] text-[7px] sm:text-[8px] md:text-[9px] uppercase transition-all duration-500 ${
                isOpaque 
                  ? 'text-bold-red' 
                  : 'text-sky-blue'
              }`}>
                Fellowship Kitale
              </span>
            </div>
          </Link>

          {/* Desktop Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-6">
            <div className={`hidden md:flex items-center gap-10 font-accent font-black text-xs tracking-[3px] uppercase transition-colors duration-300 ${isOpaque ? 'text-primary-blue' : 'text-ksf-white'}`}>
              <Link to="/im-new" className="hover:text-bold-red transition-colors relative group">
                I'm New Here
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-bold-red transition-all group-hover:w-full" />
              </Link>
              <Link to="/#who-we-are" className="hover:text-bold-red transition-colors relative group">
                Who We Are
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-bold-red transition-all group-hover:w-full" />
              </Link>
              <Link to="/#events" className="hover:text-bold-red transition-colors relative group">
                Events
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-bold-red transition-all group-hover:w-full" />
              </Link>
            </div>

            {/* Vertical Divider */}
            <div className={`hidden md:block h-6 w-px mx-4 ${isOpaque ? 'bg-ksf-dark-text/20' : 'bg-ksf-white/20'}`} />

            {/* Hamburger Icon */}
            <button
              onClick={toggleDrawer}
              className={`flex items-center gap-4 group transition-colors duration-300 ${isOpaque ? 'text-ksf-dark-text' : 'text-ksf-white'}`}
              aria-label="Toggle Menu"
            >
              <div className="flex flex-col items-end gap-1.5 w-8 overflow-hidden">
                <span className={`h-0.5 w-full transition-all duration-500 group-hover:translate-x-2 ${isOpaque ? 'bg-primary-blue' : 'bg-ksf-white'} group-hover:bg-bold-red`} />
                <span className={`h-0.5 w-full transition-all duration-500 ${isOpaque ? 'bg-primary-blue' : 'bg-ksf-white'} group-hover:bg-bold-red`} />
                <span className={`h-0.5 w-5 transition-all duration-500 group-hover:w-full ${isOpaque ? 'bg-primary-blue' : 'bg-ksf-white'} group-hover:bg-bold-red`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer & Overlay */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleDrawer}
              className="fixed inset-0 bg-ksf-dark-text/80 backdrop-blur-sm z-[60]"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-gradient-to-br from-deep-navy via-[#070F1F] to-[#040812] border-l border-white/5 z-[70] shadow-[0_0_80px_rgba(0,0,0,0.6)] flex flex-col"
            >
              {/* Header inside Drawer */}
              <div className="px-10 pt-10 pb-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-white">
                    <img 
                      src="/KSF LOGO.jpg" 
                      alt="KSF Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headlines font-black text-sm text-ksf-white tracking-tight leading-none">
                      Kingdom Seekers
                    </span>
                    <span className="font-accent font-bold tracking-[0.2em] text-[7px] text-sky-blue uppercase">
                      Fellowship Kitale
                    </span>
                  </div>
                </div>
                {/* Close Button */}
                <button 
                  onClick={toggleDrawer}
                  className="w-10 h-10 rounded-full border border-white/10 hover:border-bold-red bg-white/5 hover:bg-bold-red text-ksf-white hover:text-ksf-white transition-all flex items-center justify-center group"
                  aria-label="Close Menu"
                >
                  <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              {/* Links List */}
              <div className="flex-grow overflow-y-auto px-10 py-8 custom-scrollbar">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-6"
                >
                  {dynamicLinks.map((item, index) => {
                    const itemNumber = String(index + 1).padStart(2, '0');
                    return (
                      <motion.div key={item.label} variants={itemVariants}>
                        {item.children ? (
                          <div className="space-y-3">
                            <button 
                              onClick={() => toggleDropdown(item.label)}
                              className="w-full flex items-center justify-between text-ksf-white font-headlines text-xl md:text-2xl font-bold hover:text-bold-red transition-all group py-1.5 text-left cursor-pointer"
                            >
                              <div className="flex items-center gap-4">
                                <span className="font-accent font-black text-[10px] text-bold-red tracking-widest">{itemNumber}</span>
                                <span className="group-hover:translate-x-1.5 transition-transform duration-300">{item.label}</span>
                              </div>
                              <ChevronDown 
                                size={18} 
                                className={`transition-transform duration-300 text-white/40 group-hover:text-bold-red ${openDropdown === item.label ? 'rotate-180 text-bold-red' : ''}`} 
                              />
                            </button>
                            <AnimatePresence>
                              {openDropdown === item.label && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden pl-8 border-l border-white/5 space-y-3"
                                >
                                  {item.children.map((child) => {
                                    const isExternal = child.href.startsWith('http');
                                    return isExternal ? (
                                      <a
                                        key={child.label}
                                        href={child.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-ksf-white/60 font-body text-base hover:text-bold-red hover:translate-x-1 transition-all duration-300 py-1"
                                      >
                                        {child.label}
                                      </a>
                                    ) : (
                                      <Link
                                        key={child.label}
                                        to={child.href}
                                        className="block text-ksf-white/60 font-body text-base hover:text-bold-red hover:translate-x-1 transition-all duration-300 py-1"
                                      >
                                        {child.label}
                                      </Link>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          (() => {
                            const isExternal = item.href?.startsWith('http');
                            const linkClasses = `flex items-center gap-4 font-headlines text-xl md:text-2xl font-bold py-1.5 transition-all group ${
                              location.pathname === item.href ? 'text-bold-red' : 'text-ksf-white hover:text-bold-red'
                            }`;
                            const numClass = `font-accent font-black text-[10px] tracking-widest ${
                              location.pathname === item.href ? 'text-bold-red' : 'text-white/20 group-hover:text-bold-red'
                            }`;
                            
                            return isExternal ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={linkClasses}
                              >
                                <span className={numClass}>{itemNumber}</span>
                                <span className="group-hover:translate-x-1.5 transition-transform duration-300">{item.label}</span>
                              </a>
                            ) : (
                              <Link
                                to={item.href || '#'}
                                className={linkClasses}
                              >
                                <span className={numClass}>{itemNumber}</span>
                                <span className="group-hover:translate-x-1.5 transition-transform duration-300">{item.label}</span>
                              </Link>
                            );
                          })()
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Quick Seeker Info Card inside Drawer */}
                <div className="mt-12 bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sky-blue font-accent font-black text-[9px] tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-bold-red animate-pulse"></span>
                    NEXT Sunday Services
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-white/50">
                      <span>1st Service</span>
                      <strong className="text-white">8:00 AM</strong>
                    </div>
                    <div className="flex justify-between text-white/50">
                      <span>2nd Service</span>
                      <strong className="text-white">10:30 AM</strong>
                    </div>
                  </div>
                  <a 
                    href={liveStreamUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={toggleDrawer}
                    className="block text-center bg-bold-red text-white py-2.5 rounded-xl font-accent font-black text-[10px] tracking-widest uppercase hover:bg-primary-blue hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    WATCH LIVE STREAM
                  </a>
                </div>
              </div>

              {/* Social Icons Footer */}
              <div className="p-10 border-t border-white/5 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-4">
                  {[
                    { icon: Facebook, href: siteSettings?.facebook_url || "#" },
                    { icon: Instagram, href: siteSettings?.instagram_url || "#" },
                    { icon: Youtube, href: liveStreamUrl },
                    { icon: Twitter, href: "#" }
                  ].map((social, idx) => (
                    <a 
                      key={idx} 
                      href={social.href} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <social.icon size={16} />
                    </a>
                  ))}
                </div>
                <div className="text-[9px] font-accent font-bold text-white/30 uppercase tracking-widest">
                  Matthew 6:33
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
