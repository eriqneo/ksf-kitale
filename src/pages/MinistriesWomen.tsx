import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Flower, Users, BookOpen, ArrowRight, Sparkles, Coffee, X, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePocketBase } from '../context/PocketBaseContext';

export default function MinistriesWomen() {
  const { pages, getImageUrl } = usePocketBase();
  const page = pages['ministries-women'];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [womenName, setWomenName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [residence, setResidence] = useState('');
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
      setWomenName('');
      setPhoneNumber('');
      setResidence('');
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
              src={getImageUrl(page, 'hero_image', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&q=80')} 
              alt={page?.title || "Women's Fellowship"} 
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
                  {page?.hero_heading ? page.hero_heading.split('<br />').map((t: string, i: number) => <React.Fragment key={i}>{t}{i === 0 && <br />}</React.Fragment>) : <>Women's <br />Fellowship</>}
                </h1>

                <p className="font-body text-base sm:text-xl md:text-2xl opacity-80 font-medium tracking-tight max-w-2xl leading-relaxed">
                  {page?.hero_description || 'Empowering women to walk boldly in their God-given identity, strength, and grace. A sisterhood committed to prayer, growth, and transformation.'}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <main className="relative z-10">

      {/* OUR HEART */}
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
                A Sisterhood <br className="hidden sm:block" /> Beyond Sundays
              </h2>
              <p className="text-[#555555] font-body text-lg leading-relaxed mb-10 opacity-90">
                The Women's Fellowship at KSF is a place where every woman—no matter her age or stage of life—finds a community that celebrates her and challenges her to grow. We believe that when women are anchored in the Word, they become anchors for their families and communities.
              </p>
              
              <div className="space-y-8">
                {[
                  { icon: <Sparkles className="text-bold-red" />, title: "Daughter of the King", desc: "Healing and restoration of your true identity in Christ." },
                  { icon: <Heart className="text-primary-blue" />, title: "Grace-Led Sisterhood", desc: "Building authentic, vulnerability-based relationships." },
                  { icon: <Coffee className="text-[#B49121]" />, title: "Equipped to Lead", desc: "Training and mentoring for impact in the home and workplace." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="w-14 h-14 rounded-full bg-ksf-gray-bg flex-shrink-0 flex items-center justify-center group-hover:bg-primary-blue transition-colors duration-300">
                      {React.cloneElement(item.icon as React.ReactElement, { className: "group-hover:text-ksf-white transition-colors" })}
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
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" 
                  alt="Women Praying" 
                  className="w-full h-full object-cover transition-transform hover:scale-110 duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-blue/80 to-transparent flex items-end p-8">
                  <p className="text-ksf-white font-headlines font-black text-2xl uppercase tracking-tighter italic">
                    "Strength and dignity are her clothing..."
                    <span className="block font-accent text-xs tracking-[4px] mt-2 text-bold-red not-italic">PROVERBS 31:25</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GATHERINGS */}
      <section className="bg-ksf-gray-bg py-24">
        <div className="container mx-auto px-6 lg:px-12 text-center mb-16">
          <span className="font-accent font-black text-sky-blue text-[0.8rem] tracking-[4px] uppercase mb-4 block">
            GATHERINGS
          </span>
          <h2 className="text-primary-blue font-headlines font-black text-4xl sm:text-5xl mb-6 tracking-tight uppercase">
            Let's Walk Together
          </h2>
        </div>

        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Monthly Breakfast", 
                date: "First Saturday • 7:00 AM",
                desc: "A time of intimate worship, deep intercession, and fellowship over a meal.",
                img: "https://picsum.photos/seed/breakfast/800/600"
              },
              { 
                title: "Grace Circles", 
                date: "Midweek • Various Locations",
                desc: "Bi-weekly small groups for Bible study and mutual support in our neighbourhoods.",
                img: "https://picsum.photos/seed/grace/800/600"
              },
              { 
                title: "Annual Conference", 
                date: "Summer 2025",
                desc: "A flagship weekend encounter designed to refresh the spirit and ignite purpose.",
                img: "https://picsum.photos/seed/conference/800/600"
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-ksf-white rounded-ksf-lg overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-300 border border-ksf-gray-border"
              >
                <div className="h-56 overflow-hidden relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-ksf-dark-text/20" />
                </div>
                <div className="p-8">
                  <span className="font-accent font-black text-bold-red text-[10px] tracking-[2px] uppercase mb-2 block">
                    {item.date}
                  </span>
                  <h3 className="font-headlines font-black text-2xl text-primary-blue mb-4 tracking-tight uppercase leading-none">{item.title}</h3>
                  <p className="text-[#6B7280] font-body text-sm leading-relaxed mb-6 opacity-80">{item.desc}</p>
                  <button className="flex items-center gap-2 text-primary-blue font-accent font-black text-[10px] tracking-widest uppercase group-hover:text-bold-red transition-colors">
                    LEARN MORE <ArrowRight size={14} />
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
          <div className="max-w-3xl mx-auto">
            <h2 className="text-ksf-white font-headlines font-black text-4xl sm:text-7xl mb-8 tracking-tight uppercase leading-none">
              You Belong <br className="hidden sm:block" /> In This Room.
            </h2>
            <p className="text-ksf-white/60 font-body text-xl mb-12 leading-relaxed">
              Whether you're a student, a professional, a mother, or a grandmother—there is a sister waiting to welcome you home. Join a Grace Circle today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-bold-red text-ksf-white px-10 py-5 rounded-ksf-md font-accent font-black tracking-[3px] text-xs hover:bg-primary-blue transition-all shadow-xl"
              >
                JOIN A GRACE CIRCLE
              </button>
              <Link to="/im-new" className="w-full sm:w-auto text-ksf-white font-accent font-bold text-xs tracking-widest uppercase hover:text-bold-red transition-colors flex items-center justify-center gap-2">
                I'M NEW HERE <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>

    {/* Women's Fellowship Registration Modal */}
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
                <span className="font-accent text-bold-red font-black tracking-widest text-[9px] uppercase mb-2 block">DAUGHTERS OF THE KING</span>
                <h3 className="font-headlines text-3xl font-black text-primary-blue mb-2">Join a Grace Circle</h3>
                <p className="font-body text-xs text-slate-500 mb-6 leading-relaxed">
                  Join a warm, loving, and prayerful sisterhood where you can grow, share your life, and be strengthened in God's Grace.
                </p>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="font-accent text-[10px] font-black tracking-wider text-slate-500 uppercase mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Grace Wambui"
                      value={womenName}
                      onChange={(e) => setWomenName(e.target.value)}
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
                      placeholder="e.g. Kileleshwa, South B, Kahawa Sukari"
                      value={residence}
                      onChange={(e) => setResidence(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 font-body text-sm focus:outline-none focus:border-primary-blue bg-slate-50/50"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4.5 bg-primary-blue hover:bg-bold-red text-white font-accent font-black tracking-widest rounded-xl text-xs uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-2"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      'REGISTER FOR GRACE CIRCLE'
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 size={32} strokeWidth={2.5} />
                </div>
                <h3 className="font-headlines text-2xl sm:text-3xl font-black text-slate-800 mb-2">Welcome Home, Sister!</h3>
                <p className="text-sm font-body text-slate-600 leading-relaxed max-w-sm mx-auto mb-6">
                  We are so excited to walk with you, <span className="font-bold text-primary-blue">{womenName}</span>! Your slot in a Grace Circle is registered successfully.
                </p>

                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-left text-xs space-y-2 mb-8 max-w-sm mx-auto font-body text-slate-600">
                  <p className="font-headlines font-black text-primary-blue uppercase tracking-wider text-[9px] mb-1">WHAT'S NEXT?</p>
                  <p>• A Grace Circle coordinator will reach out to you via <strong className="font-mono">{phoneNumber}</strong>.</p>
                  <p>• We'll place you in a group near <strong>{residence}</strong> that meets weekly or bi-weekly.</p>
                  <p>• See you at our next Monthly Breakfast Fellowship!</p>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="bg-primary-blue hover:bg-bold-red text-white px-8 py-3.5 rounded-xl font-accent font-bold tracking-wider text-xs uppercase transition-all duration-300 shadow-md"
                >
                  Amen, See You Soon!
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
