import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Users, MessageCircle, Heart, ArrowRight, Home, Globe, X, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePocketBase, pb } from '../context/PocketBaseContext';

export default function MinistriesHomeFellowship() {
  const { pages, getImageUrl } = usePocketBase();
  const page = pages['ministries-home-fellowship'];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [residence, setResidence] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Let KSF Choose');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setFullName('');
      setPhoneNumber('');
      setResidence('');
      setSelectedRegion('Let KSF Choose');
    }, 300);
  };

  const openModalWithRegion = (regionName: string) => {
    setSelectedRegion(regionName);
    setIsModalOpen(true);
  };

  const fallbackRegions = [
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
  ];

  const [regionsList, setRegionsList] = useState<any[]>(fallbackRegions);

  React.useEffect(() => {
    async function fetchMinistryData() {
      try {
        const record = await pb.collection('ministries').getFirstListItem('slug="home-fellowship"');
        if (record && record.regions) {
          const parsedRegions = typeof record.regions === 'string' ? JSON.parse(record.regions) : record.regions;
          if (parsedRegions && parsedRegions.length > 0) {
            setRegionsList(parsedRegions);
          }
        }
      } catch (err) {
        console.error("Failed to load home fellowship regions from PocketBase:", err);
      }
    }
    fetchMinistryData();
  }, []);

  return (
    <div className="min-h-screen bg-ksf-white">
      <div className="relative pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 pb-0">
        {/* Hero Section - Floating Card Style */}
        <section className="relative h-[60vh] sm:h-[70vh] w-full rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden flex items-end pb-12 sm:pb-20 lg:pb-24">
          {/* Background Image & Dark Overlays */}
          <div className="absolute inset-0 z-0 scale-105 animate-slow-zoom">
            <img 
              src={getImageUrl(page, 'hero_image', 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1920&q=80')} 
              alt={page?.title || "Home Fellowship"} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Subtle Dark Overlay */}
            <div className="absolute inset-0 bg-primary-blue/40 z-10" />
            {/* Bottom-up gradient for content readability */}
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-primary-blue/90 via-primary-blue/30 to-transparent z-20" />
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
                  {page?.hero_subtitle || 'MINISTRIES'}
                </span>

                <h1 className="font-headlines font-black text-5xl sm:text-7xl md:text-8xl leading-[0.85] mb-6 tracking-tighter uppercase">
                  {page?.hero_heading ? page.hero_heading.split('<br />').map((t: string, i: number) => <React.Fragment key={i}>{t}{i === 0 && <br />}</React.Fragment>) : <>Home <br />Fellowship</>}
                </h1>

                <p className="font-body text-base sm:text-xl md:text-2xl opacity-80 font-medium tracking-tight max-w-2xl leading-relaxed">
                  {page?.hero_description || 'Real community happens in circles, not just rows. Join a Home Fellowship in your region to experience life-changing relationships and spiritual growth.'}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <main className="relative z-10">

      {/* WHY HOME FELLOWSHIP */}
      <section className="bg-ksf-white py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-primary-blue font-headlines font-black text-4xl sm:text-5xl mb-8 tracking-tight leading-tight uppercase">
                A Place to Call <br className="hidden sm:block" /> Home
              </h2>
              <p className="text-[#555555] font-body text-lg leading-relaxed mb-10 opacity-90">
                At Kingdom Seekers Fellowship, we believe that "The Church" isn't a building you visit—it's a family you belong to. Home Fellowships are small groups that meet throughout our city to study the Word, pray for one another, and serve our neighbors.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: <MessageCircle className="text-bold-red" />, title: "Open Conversation", desc: "A safe space to ask questions and discuss how the Word applies to your daily life." },
                  { icon: <Heart className="text-sky-blue" />, title: "Mutual Support", desc: "Walking together through life's highs and lows with prayer and practical help." },
                  { icon: <Globe className="text-primary-blue" />, title: "Regional Impact", desc: "Each group focuses on transforming its specific neighborhood for Christ." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-5">
                    <div className="w-12 h-12 rounded-ksf-md bg-ksf-gray-bg flex-shrink-0 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-headlines font-black text-primary-blue text-lg mb-1 uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[#6B7280] font-body text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-bold-red -rotate-3 rounded-ksf-lg group-hover:rotate-0 transition-transform duration-500" />
              <div className="relative rounded-ksf-lg overflow-hidden shadow-2xl aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1543269664-566a59e8f77c?w=800&q=80" 
                  alt="Home Fellowship Community" 
                  className="w-full h-full object-cover transition-transform hover:scale-110 duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-blue/80 to-transparent flex items-end p-8">
                  <p className="text-ksf-white font-headlines font-black text-2xl uppercase tracking-tighter italic">
                    "They broke bread in their homes and ate together with glad hearts."
                    <span className="block font-accent text-xs tracking-[4px] mt-2 text-bold-red not-italic">ACTS 2:46</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* REGIONAL DIRECTORY */}
      <section className="bg-ksf-gray-bg py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 text-center mb-16">
          <span className="font-accent font-black text-bold-red text-[0.8rem] tracking-[4px] uppercase mb-4 block">
            FIND A GROUP
          </span>
          <h2 className="text-primary-blue font-headlines font-black text-4xl sm:text-5xl mb-6 tracking-tight uppercase">
            Regional Fellowships
          </h2>
          <p className="text-[#555555] font-body text-lg max-w-2xl mx-auto">
            Choose a region near you and get connected to a smaller family within the KSF body.
          </p>
        </div>

        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {regionsList.map((region, idx) => (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-ksf-white flex flex-col sm:flex-row rounded-ksf-lg overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className="sm:w-2/5 h-64 sm:h-auto overflow-hidden relative">
                  <img src={region.img} alt={region.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-primary-blue/10 group-hover:bg-primary-blue/0 transition-colors" />
                </div>
                <div className="p-8 lg:p-12 sm:w-3/5 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-bold-red font-accent font-black text-[10px] tracking-[2px] uppercase mb-4">
                    <MapPin size={14} />
                    {region.location}
                  </div>
                  <h3 className="font-headlines font-black text-3xl text-primary-blue mb-4 tracking-tighter uppercase leading-none">{region.name}</h3>
                  <p className="text-[#6B7280] font-body text-sm leading-relaxed mb-8 opacity-80">{region.desc}</p>
                  <button 
                    onClick={() => openModalWithRegion(region.name)}
                    className="flex items-center gap-3 text-primary-blue font-accent font-black text-[10px] tracking-[4px] uppercase hover:text-bold-red transition-all group-hover:translate-x-2"
                  >
                    JOIN THIS FELLOWSHIP <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-primary-blue py-24 lg:py-32 relative text-center">
        <div className="container mx-auto px-6 lg:px-[60px] relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-bold-red rounded-full mx-auto mb-10 flex items-center justify-center animate-bounce shadow-2xl">
              <Home className="text-ksf-white" size={32} />
            </div>
            <h2 className="text-ksf-white font-headlines font-black text-4xl sm:text-7xl mb-10 tracking-tight uppercase leading-[0.9]">
              Every Neighbor <br /> A Kingdom Seeker.
            </h2>
            <p className="text-ksf-white/60 font-body text-xl mb-14 leading-relaxed max-w-2xl mx-auto">
              If your region isn't listed or you're interested in hosting a Home Fellowship, we'd love to talk to you about our leader training program.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <button 
                onClick={() => openModalWithRegion('Let KSF Choose')}
                className="w-full sm:w-auto bg-bold-red text-ksf-white px-12 py-6 rounded-ksf-md font-accent font-black tracking-[4px] text-xs hover:bg-bold-red transition-all shadow-2xl uppercase"
              >
                Find Cell Group
              </button>
              <button className="w-full sm:w-auto text-ksf-white font-accent font-black text-xs tracking-[3px] uppercase hover:text-bold-red transition-colors flex items-center justify-center gap-3">
                INTERESTED IN LEADING? <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    {/* Cell Group Find/Registration Modal */}
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            className="absolute inset-0 bg-[#001D4A]/95 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 sm:p-10 shadow-3xl text-slate-800 overflow-hidden z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-bold-red hover:text-white rounded-full flex items-center justify-center text-slate-700 transition-all active:scale-95"
            >
              <X size={18} />
            </button>

            {!submitted ? (
              <div>
                <span className="font-accent text-bold-red font-black tracking-widest text-[9px] uppercase mb-2 block">COMMUNITY IN CIRCLES</span>
                <h3 className="font-headlines text-3xl font-black text-primary-blue mb-2">Find a Cell Group</h3>
                <p className="font-body text-xs text-slate-500 mb-6 leading-relaxed">
                  Join a warm, Christ-centered home fellowship in your neighborhood to grow in God's Word and authentic friendship.
                </p>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="font-accent text-[10px] font-black tracking-wider text-slate-500 uppercase mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rachel Atieno"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 font-body text-sm focus:outline-none focus:border-primary-blue bg-slate-50/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-accent text-[10px] font-black tracking-wider text-slate-500 uppercase mb-1.5 block">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +254 712 345 678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 font-body text-sm focus:outline-none focus:border-primary-blue bg-slate-50/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-accent text-[10px] font-black tracking-wider text-slate-500 uppercase mb-1.5 block">Residence / Estate</label>
                    <input
                      type="text"
                      placeholder="e.g. South B, Roysambu, Ngong"
                      value={residence}
                      onChange={(e) => setResidence(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 font-body text-sm focus:outline-none focus:border-primary-blue bg-slate-50/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-accent text-[10px] font-black tracking-wider text-slate-500 uppercase mb-1.5 block">Preferred Region / Zone</label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 font-body text-sm focus:outline-none focus:border-primary-blue bg-slate-50/50 appearance-none cursor-pointer"
                    >
                      <option value="Let KSF Choose">Let KSF Choose for Me</option>
                      <option value="Judea Region (Central)">Judea Region (Central)</option>
                      <option value="Bethlehem Region (North)">Bethlehem Region (North)</option>
                      <option value="Antioch Region (West)">Antioch Region (West)</option>
                      <option value="Galilee Region (South)">Galilee Region (South)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4.5 bg-primary-blue hover:bg-bold-red text-white font-accent font-black tracking-widest rounded-xl text-xs uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-2"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      'FIND MY CELL GROUP'
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 size={32} strokeWidth={2.5} />
                </div>
                <h3 className="font-headlines text-2xl sm:text-3xl font-black text-slate-800 mb-2">Finding Your Circle!</h3>
                <p className="text-sm font-body text-slate-600 leading-relaxed max-w-sm mx-auto mb-6">
                  Amen, <span className="font-bold text-primary-blue">{fullName}</span>! We have captured your request. We're matching you with a warm home fellowship near <strong>{residence}</strong>.
                </p>

                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-left text-xs space-y-2 mb-8 max-w-sm mx-auto font-body text-slate-600">
                  <p className="font-headlines font-black text-primary-blue uppercase tracking-wider text-[9px] mb-1">WHAT'S NEXT?</p>
                  <p>• A Regional Leader for <strong>{selectedRegion === 'Let KSF Choose' ? 'your area' : selectedRegion}</strong> will contact you via <strong className="font-mono">{phoneNumber}</strong>.</p>
                  <p>• They'll send you the directions and contact details for the host home nearest to you.</p>
                  <p>• Experience warmth, prayer, study, and delicious community fellowship!</p>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="bg-primary-blue hover:bg-bold-red text-white px-8 py-3.5 rounded-xl font-accent font-bold tracking-wider text-xs uppercase transition-all duration-300 shadow-md"
                >
                  Amen, Can't Wait!
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
