import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Users, Target, Rocket, ArrowRight, MessageSquare, Flame, X, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePocketBase } from '../context/PocketBaseContext';

export default function MinistriesYouth() {
  const { pages, getImageUrl } = usePocketBase();
  const page = pages['ministries-youth'];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [youthName, setYouthName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [residence, setResidence] = useState('');
  const [ageGroup, setAgeGroup] = useState('High School');
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
      setYouthName('');
      setPhoneNumber('');
      setResidence('');
      setAgeGroup('High School');
    }, 300);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-ksf-white">
      <div className="relative pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 pb-0">
        {/* Hero Section - Floating Card Style */}
        <section className="relative h-[60vh] sm:h-[70vh] w-full rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden flex items-end pb-12 sm:pb-20 lg:pb-24">
          {/* Background Image & Dark Overlays */}
          <div className="absolute inset-0 z-0 scale-105 animate-slow-zoom">
            <img 
              src={getImageUrl(page, 'hero_image', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80')} 
              alt={page?.title || "KSF Youth"} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Subtle Dark Overlay */}
            <div className="absolute inset-0 bg-ksf-dark-text/40 z-10" />
            {/* Bottom-up gradient for content readability */}
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-ksf-dark-text/90 via-ksf-dark-text/30 to-transparent z-20" />
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

                <h1 className="font-headlines font-black text-5xl sm:text-7xl md:text-8xl leading-[0.85] mb-6 tracking-tighter">
                  {page?.hero_heading || 'KSF Youth'}
                </h1>

                <p className="font-body text-base sm:text-xl md:text-2xl opacity-80 font-medium tracking-tight max-w-2xl leading-relaxed">
                  {page?.hero_description || 'No longer a generation of the future, but a generation of the NOW. We empower teenagers to find their identity, purpose, and power in Jesus Christ.'}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <main className="relative z-10">

      {/* THE MISSION */}
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
                Igniting A <br className="hidden sm:block" /> New Movement
              </h2>
              <p className="text-[#555555] font-body text-lg leading-relaxed mb-10 opacity-90">
                KSF Youth is more than just a Friday night gathering. It's a community of young people who are unashamed of the Gospel and hungry for the presence of God. We believe that when a teenager encounters the real Jesus, everything changes.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { icon: <Zap className="text-bold-red" />, title: "Identity", desc: "Knowing who you are because of Whose you are." },
                  { icon: <Target className="text-primary-blue" />, title: "Purpose", desc: "Discovering the unique call God has on your life." },
                  { icon: <Users className="text-sky-blue" />, title: "Community", desc: "A tribe that sharpens you and has your back." },
                  { icon: <Flame className="text-[#B49121]" />, title: "Power", desc: "Walking in the authority of the Holy Spirit." },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-start gap-4">
                    <div className="w-12 h-12 rounded-ksf-sm bg-ksf-gray-bg flex items-center justify-center">
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
                  src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&q=80" 
                  alt="Youth Worship" 
                  className="w-full h-full object-cover transition-transform hover:scale-110 duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ksf-dark-text/80 to-transparent flex items-end p-8">
                  <p className="text-ksf-white font-headlines font-black text-2xl uppercase tracking-tighter italic">
                    "Don't let anyone look down on you because you are young..."
                    <span className="block font-accent text-xs tracking-[4px] mt-2 text-bold-red not-italic">1 TIMOTHY 4:12</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHEN & WHERE */}
      <section className="bg-ksf-gray-bg py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="bg-primary-blue rounded-ksf-lg overflow-hidden flex flex-col md:flex-row shadow-2xl">
            <div className="md:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
              <span className="font-accent font-black text-sky-blue text-[0.8rem] tracking-[4px] uppercase mb-6 block">
                JOIN THE TRIBE
              </span>
              <h2 className="text-ksf-white font-headlines font-black text-4xl sm:text-5xl mb-8 tracking-tight uppercase leading-none">
                Friday Nights <br /> at 6:30 PM
              </h2>
              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-4 text-ksf-white/80">
                  <Flame size={24} className="text-bold-red" />
                  <span className="font-body text-lg">High-energy worship and raw preaching.</span>
                </div>
                <div className="flex items-center gap-4 text-ksf-white/80">
                  <MessageSquare size={24} className="text-sky-blue" />
                  <span className="font-body text-lg">Real conversations in Small Groups.</span>
                </div>
                <div className="flex items-center gap-4 text-ksf-white/80">
                  <Zap size={24} className="text-[#B49121]" />
                  <span className="font-body text-lg">Epic games and brotherhood.</span>
                </div>
              </div>
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=KINGDOM+SEEKERS+FELLOWSHIP+(KITALE)"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-ksf-white text-primary-blue px-8 py-4 rounded-ksf-md font-accent font-black tracking-[3px] text-xs hover:bg-bold-red hover:text-ksf-white transition-all self-start shadow-xl inline-block"
              >
                GET DIRECTIONS
              </a>
            </div>
            <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&q=80" 
                alt="Youth Community" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* THE COLLECTIVE (Age-based focus) */}
      <section className="bg-ksf-white py-24">
        <div className="container mx-auto px-6 lg:px-12 text-center mb-16">
          <span className="font-accent font-black text-bold-red text-[0.8rem] tracking-[4px] uppercase mb-4 block">
            ENVIRONMENTS
          </span>
          <h2 className="text-primary-blue font-headlines font-black text-4xl sm:text-5xl mb-6 tracking-tight">
            The Collective Groups
          </h2>
        </div>

        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                title: "Middle School", 
                desc: "Grade 6-8. Navigating the transition with faith, fun, and firm foundations.",
                img: "https://picsum.photos/seed/middle/800/600"
              },
              { 
                title: "High School", 
                desc: "Grade 9-12. Deepening intimacy with Jesus and becoming influencers on campus.",
                img: "https://picsum.photos/seed/high/800/600"
              },
            ].map((group, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-ksf-gray-bg flex flex-col sm:flex-row rounded-ksf-lg overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden">
                  <img src={group.img} alt={group.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <div className="p-10 flex flex-col justify-center sm:w-3/5">
                  <h3 className="font-headlines font-black text-2xl text-primary-blue mb-3 tracking-tight uppercase leading-none">{group.title}</h3>
                  <p className="text-[#6B7280] font-body text-sm leading-relaxed mb-6 opacity-80">{group.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-ksf-dark-text py-24 lg:py-32 relative text-center">
        <div className="container mx-auto px-6 lg:px-[60px] relative z-10">
          <div className="max-w-3xl mx-auto">
            <Rocket className="text-bold-red w-16 h-16 mx-auto mb-8 animate-pulse" />
            <h2 className="text-ksf-white font-headlines font-black text-4xl sm:text-7xl mb-8 tracking-tight uppercase leading-none">
              Your Seat is Saved.
            </h2>
            <p className="text-ksf-white/50 font-body text-xl mb-12">
              Whether you're coming alone or with a group of friends, we can't wait to meet you. Join the most exciting youth movement in Kitale, Kenya.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-bold-red text-ksf-white px-10 py-5 rounded-ksf-md font-accent font-black tracking-[3px] text-xs hover:bg-primary-blue hover:text-ksf-white transition-all shadow-xl"
              >
                JOIN A YOUTH CONNECT GROUP
              </button>
              <Link to="/im-new" className="w-full sm:w-auto text-ksf-white font-accent font-bold text-xs tracking-widest uppercase hover:text-bold-red transition-colors flex items-center justify-center gap-2">
                I'M NEW HERE <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>

    {/* Youth Registration Modal */}
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
                <span className="font-accent text-bold-red font-black tracking-widest text-[9px] uppercase mb-2 block">THE CHOSEN GENERATION</span>
                <h3 className="font-headlines text-3xl font-black text-primary-blue mb-2">Join Youth Connect</h3>
                <p className="font-body text-xs text-slate-500 mb-6 leading-relaxed">
                  Fill in your details below to join a Youth Connect Group and run with a tribe that sharpens you.
                </p>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="font-accent text-[10px] font-black tracking-wider text-slate-500 uppercase mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. David Ondieki"
                      value={youthName}
                      onChange={(e) => setYouthName(e.target.value)}
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
                    <label className="font-accent text-[10px] font-black tracking-wider text-slate-500 uppercase mb-1.5 block">Residence / Area</label>
                    <input
                      type="text"
                      placeholder="e.g. Kilimani, South B, Westlands"
                      value={residence}
                      onChange={(e) => setResidence(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 font-body text-sm focus:outline-none focus:border-primary-blue bg-slate-50/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-accent text-[10px] font-black tracking-wider text-slate-500 uppercase mb-1.5 block">Age Group / School Level</label>
                    <select
                      value={ageGroup}
                      onChange={(e) => setAgeGroup(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 font-body text-sm focus:outline-none focus:border-primary-blue bg-slate-50/50 appearance-none cursor-pointer"
                    >
                      <option value="Middle School (Grade 6-8)">Middle School (Grade 6-8)</option>
                      <option value="High School (Grade 9-12)">High School (Grade 9-12)</option>
                      <option value="Campus / Young Adult">Campus / Young Adult</option>
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
                      'SUBMIT REGISTRATION'
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 size={32} strokeWidth={2.5} />
                </div>
                <h3 className="font-headlines text-2xl sm:text-3xl font-black text-slate-800 mb-2">Registration Received!</h3>
                <p className="text-sm font-body text-slate-600 leading-relaxed max-w-sm mx-auto mb-6">
                  Awesome, <span className="font-bold text-primary-blue">{youthName}</span>! Your request to join a Youth Connect Group is registered. We've locked in your slot.
                </p>

                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-left text-xs space-y-2 mb-8 max-w-sm mx-auto font-body text-slate-600">
                  <p className="font-headlines font-black text-primary-blue uppercase tracking-wider text-[9px] mb-1">WHAT'S NEXT?</p>
                  <p>• A Youth Connect Leader will reach out to you via <strong className="font-mono">{phoneNumber}</strong>.</p>
                  <p>• We'll connect you with a group near <strong>{residence}</strong> matching the <strong>{ageGroup}</strong> age level.</p>
                  <p>• Come ready for fire, community, and fun on Friday at 6:30 PM!</p>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="bg-primary-blue hover:bg-bold-red text-white px-8 py-3.5 rounded-xl font-accent font-bold tracking-wider text-xs uppercase transition-all duration-300 shadow-md"
                >
                  Awesome, See You Friday!
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
