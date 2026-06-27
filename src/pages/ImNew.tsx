import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight, Smile, Users, Music, BookOpen, Heart, Shirt, ChevronRight, Droplets, UserPlus, HeartHandshake, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePocketBase } from '../context/PocketBaseContext';

const getIcon = (name: string, size = 24) => {
  switch (name) {
    case 'Smile': return <Smile size={size} />;
    case 'Users': return <Users size={size} />;
    case 'Music': return <Music size={size} />;
    case 'BookOpen': return <BookOpen size={size} />;
    case 'Heart': return <Heart size={size} />;
    case 'Shirt': return <Shirt size={size} />;
    case 'Droplets': return <Droplets size={size} />;
    case 'UserPlus': return <UserPlus size={size} />;
    case 'HeartHandshake': return <HeartHandshake size={size} />;
    case 'Compass': return <Compass size={size} />;
    default: return <Smile size={size} />;
  }
};

export default function ImNew() {
  const { pages, pageSections, getImageUrl } = usePocketBase();
  const page = pages['im-new'];
  const sections = pageSections['im-new'] || {};

  const youreInvitedSection = sections['youre-invited'];
  const whatToExpectSection = sections['what-to-expect'];
  const nextStepsSection = sections['next-steps'];

  const expectList = whatToExpectSection?.content_json && Array.isArray(whatToExpectSection.content_json)
    ? whatToExpectSection.content_json
    : [
        { icon: "Smile", title: "Smiling Faces", text: "From the car park to the auditorium, our guest services team is here to guide you, answer any questions, and make you feel right at home." },
        { icon: "Users", title: "Personal Connection", text: "Stop by our First-Time Guest area. We have a gift for you and a team of people ready to show you around and help you take your first steps." },
        { icon: "Music", title: "Engaging Worship", text: "There will be a live worship team that leads us into the presence of God with powerful songs as we exalt Jesus together every Sunday." },
        { icon: "BookOpen", title: "Biblical Teaching", text: "Most weekends our Lead Pastor preaches from the Word of God — practical, biblically grounded messages with real-life application you can walk with all week." },
        { icon: "Heart", title: "KSF Kids", text: "We always say KSF Kids is where your kids would rather be! We do more than teach Bible stories — we teach children the Gospel in a way they can understand and love.", hasAction: true },
        { icon: "Shirt", title: "Casual Dress", text: "We are not a dress-up kind of crowd! Most people wear casual attire, but you are always welcome to wear whatever makes you comfortable. Just come as you are." }
      ];

  const stepsList = nextStepsSection?.content_json && Array.isArray(nextStepsSection.content_json)
    ? nextStepsSection.content_json
    : [
        { id: "baptism", step: "STEP 1: PUBLIC DECLARATION", title: "Water Baptism", text: "Water baptism is an outward declaration of an inward decision. It symbolizes our identification with the death, burial, and resurrection of Jesus Christ. If you have repented of your sins and placed your trust in Jesus, water baptism is your direct next step!", icon: "Droplets", actionText: "Register for Baptism", actionHref: "/#contact" },
        { id: "membership", step: "STEP 2: FIND YOUR FAMILY", title: "Church Membership", text: "We believe that every believer should be committed to a local church family. Our Covenant Membership class covers our church vision, history, leadership structure, and core beliefs, outlining what it looks like to partner together for the Gospel at KSF.", icon: "UserPlus", actionText: "Join Membership Class", actionHref: "/#contact" },
        { id: "volunteering", step: "STEP 3: ACTIVE SERVICE", title: "Serve on a Team", text: "God has uniquely gifted you with talents, passions, and strengths to serve others. When you volunteer on one of our ministry teams (such as KSF Kids, Worship, Media, or Guest Services), you are actively building the local church and demonstrating Jesus' love.", icon: "HeartHandshake", actionText: "Start Volunteering", actionHref: "/#contact" },
        { id: "discipleship", step: "STEP 4: DEEPEN YOUR WALK", title: "Discipleship Pathway", text: "Our Discipleship pathway exists to guide you into spiritual maturity. Through structured Bible training, foundational doctrine classes, and active participation in our Home Fellowship networks, you will learn to feed on the Word of God and mentor others.", icon: "Compass", actionText: "Explore Home Fellowships", actionHref: "/ministries/home-fellowship" }
      ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const heroImage = getImageUrl(page, 'hero_image', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=80');

  return (
    <div className="min-h-screen bg-ksf-white">
      <div className="relative pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 pb-0">
        {/* Hero Section - Floating Card Style */}
        <section className="relative h-[60vh] sm:h-[70vh] w-full rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden flex items-end pb-12 sm:pb-20 lg:pb-24">
          {/* Background Image & Dark Overlays */}
          <div className="absolute inset-0 z-0 scale-105 animate-slow-zoom">
            <img 
              src={heroImage} 
              alt={page?.title || "Welcome"} 
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
                  {page?.hero_subtitle || 'YOU ARE WELCOME'}
                </span>

                <h1 className="font-headlines font-black text-5xl sm:text-7xl md:text-8xl leading-[0.85] mb-6 tracking-tighter style-white-space">
                  {page?.hero_heading ? (
                    <span style={{ whiteSpace: 'pre-line' }}>{page.hero_heading}</span>
                  ) : (
                    <>We're Glad <br />You're Here.</>
                  )}
                </h1>

                <p className="font-body text-base sm:text-xl md:text-2xl opacity-80 font-medium tracking-tight max-w-2xl leading-relaxed">
                  {page?.hero_description || "Welcome to Kingdom Seekers Fellowship. Whether you're a lifelong believer or just exploring faith, there's a place for you here."}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <main className="relative z-10">

      {/* SECTION 2: YOU'RE INVITED */}
      <section className="bg-ksf-gray-bg py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left: Text */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-start"
            >
              <div className="flex items-center gap-3 font-accent font-bold text-[0.75rem] tracking-[3px] uppercase text-[#888888] mb-6">
                <CheckCircle size={16} className="text-sky-blue" />
                {youreInvitedSection?.subtitle || "You're Invited"}
              </div>
              <h2 className="font-headlines font-black text-3xl sm:text-5xl text-ksf-dark-text leading-[1.1] mb-6">
                {youreInvitedSection?.title ? (
                  youreInvitedSection.title
                ) : (
                  <>Join Us Every Sunday at <span className="text-primary-blue underline decoration-bold-red decoration-4 transition-all hover:decoration-sky-blue">8:00, 10:30, & 5:00pm.</span></>
                )}
              </h2>
              <p className="text-[#555555] font-body text-[1.1rem] leading-[1.85] mb-10 max-w-lg">
                {youreInvitedSection?.description || "If it's your first time at KSF, you are our honoured guest. We understand that showing up somewhere new can feel nerve-wracking, so here's a little more about what Kingdom Seekers Fellowship is like and what you can expect when you walk through our doors."}
              </p>
              <Link 
                to="/about/story"
                className="bg-primary-blue text-ksf-white px-8 py-4 rounded-ksf-md font-accent font-bold tracking-widest text-sm hover:bg-bold-red hover:shadow-lg transition-all flex items-center gap-2 group"
              >
                MORE ABOUT US
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Right: Photo Collage */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[400px] sm:h-[460px]"
            >
              {/* Back Decorative Dot */}
              <div className="absolute top-[30px] left-[20px] w-20 h-20 rounded-full bg-primary-blue opacity-[0.08]" />
              <div className="absolute bottom-[60px] left-[60px] w-10 h-10 rounded-full bg-bold-red opacity-[0.15]" />
              
              {/* Main Photo */}
              <div className="absolute top-0 right-0 w-[280px] h-[340px] rounded-[24px_24px_24px_80px] overflow-hidden shadow-2xl z-10 transition-transform hover:scale-[1.02]">
                <img src={getImageUrl(youreInvitedSection, 'image_1', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80')} alt="KSF Congregation" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              
              {/* Overlapping Photo */}
              <div className="absolute bottom-0 right-[100px] sm:right-[120px] w-[210px] h-[200px] rounded-[20px] overflow-hidden shadow-2xl z-20 border-8 border-ksf-gray-bg transition-transform hover:scale-[1.05]">
                <img src={getImageUrl(youreInvitedSection, 'image_2', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80')} alt="KSF Welcome" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: MARQUEE STRIP */}
      <div className="bg-ksf-white border-y border-ksf-gray-border py-6 overflow-hidden">
        <div className="relative flex whitespace-nowrap overflow-hidden">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-0"
          >
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center px-8">
                <span className="font-accent font-black text-base tracking-[3px] uppercase text-ksf-dark-text">WELCOME</span>
                <div className="w-1.5 h-1.5 rounded-full bg-bold-red mx-4 flex-shrink-0" />
                <span className="font-headlines italic font-normal text-xl text-[#888888]">HOME.</span>
                <div className="w-1.5 h-1.5 rounded-full bg-bold-red mx-4 flex-shrink-0" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* SECTION 4: WHAT TO EXPECT */}
      <section className="bg-ksf-drawer-bg py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-headlines font-black text-3xl sm:text-[2.8rem] text-ksf-white mb-6 tracking-tight"
            >
              {whatToExpectSection?.title || "What To Expect"}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-ksf-white/55 font-body text-[1.1rem] max-w-xl mx-auto leading-relaxed"
            >
              {whatToExpectSection?.description || "We understand that showing up somewhere new for the first time can be nerve-wracking, so here's what to expect when you visit Kingdom Seekers Fellowship."}
            </motion.p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {expectList.map((card: any, idx: number) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="bg-ksf-white p-10 rounded-ksf-md relative overflow-hidden group transition-all duration-300 hover:shadow-2xl"
              >
                {/* Top Border Line */}
                <div className="absolute top-0 left-0 w-0 h-[3px] bg-gradient-to-r from-primary-blue to-sky-blue group-hover:w-full transition-all duration-500" />
                
                <div className="w-14 h-14 rounded-full bg-[#EEF3FB] flex items-center justify-center mb-6 text-primary-blue transition-colors group-hover:bg-primary-blue group-hover:text-ksf-white">
                  {getIcon(card.icon, 26)}
                </div>
                
                <h3 className="font-accent font-black text-base text-ksf-dark-text tracking-[2px] uppercase mb-3">
                  {card.title}
                </h3>
                <p className="text-[#555555] font-body text-[0.95rem] leading-relaxed mb-6 opacity-90">
                  {card.text}
                </p>

                {card.hasAction && (
                  <Link 
                    to="/ministries/kids"
                    className="inline-flex items-center gap-2 bg-primary-blue text-ksf-white px-5 py-3 rounded-ksf-sm font-accent font-bold text-[0.75rem] tracking-widest hover:bg-bold-red transition-all"
                  >
                    PRE-REGISTER YOUR KIDS
                    <ChevronRight size={14} />
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: NEXT STEPS TARGETS */}
      <section id="next-steps" className="bg-ksf-white py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <span className="font-accent font-bold text-sky-blue text-[0.8rem] tracking-[4px] uppercase mb-4 block">
              {nextStepsSection?.subtitle || "YOUR JOURNEY CONTINUES"}
            </span>
            <h2 className="text-primary-blue font-headlines font-black text-4xl sm:text-5xl mb-6 tracking-tight">
              {nextStepsSection?.title || "Taking Your Next Steps"}
            </h2>
            <p className="text-slate-500 font-body text-[1.1rem] max-w-xl mx-auto leading-relaxed">
              {nextStepsSection?.description || "Discipleship is a lifetime journey. Wherever you are on your walk with God, we are here to help you take the next step."}
            </p>
          </div>

          <div className="space-y-16">
            {stepsList.map((stepItem: any, idx: number) => {
              const isEven = idx % 2 === 1;
              return (
                <div key={stepItem.id || idx} id={stepItem.id} className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center bg-slate-50 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 transition-all hover:shadow-xl">
                  <div className={`lg:col-span-4 flex justify-center ${isEven ? 'lg:order-last' : ''}`}>
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-sky-blue/10 flex items-center justify-center text-sky-blue">
                      {getIcon(stepItem.icon, 48)}
                    </div>
                  </div>
                  <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
                    <span className="font-accent text-xs font-black text-bold-red tracking-widest uppercase">{stepItem.step}</span>
                    <h3 className="font-headlines font-black text-3xl text-primary-blue">{stepItem.title}</h3>
                    <p className="font-body text-slate-600 leading-relaxed max-w-2xl">
                      {stepItem.text}
                    </p>
                    <div className="pt-2">
                      <Link 
                        to={stepItem.actionHref || "/#contact"}
                        className="inline-flex items-center gap-2 bg-primary-blue text-white px-6 py-3 rounded-xl font-accent font-bold text-xs tracking-wider uppercase hover:bg-bold-red transition-all"
                      >
                        {stepItem.actionText}
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  </div>
);
}
