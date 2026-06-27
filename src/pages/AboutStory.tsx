import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Compass, Target, ChevronRight, Facebook, Linkedin, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePocketBase, pb } from '../context/PocketBaseContext';

const FALLBACK_MILESTONES = [
  {
    year: "2016",
    era: "genesis",
    title: "Founding & House Fellowships",
    text: "Kingdom Seekers Fellowship begins as a small prayer gathering of faithful believers seeking God's face in home rooms, dedicated to a simple vision: seek God first."
  },
  {
    year: "2017",
    era: "genesis",
    title: "The First Public Sanctuary",
    text: "Formally launching public Sunday services in Kitale, setting the foundational mission 'Seek Ye First' and establishing our core values of humility and excellence."
  },
  {
    year: "2018",
    era: "genesis",
    title: "Youth and Kids Ministries",
    text: "Dedicating structured programs, custom teaching tools, and safe environments to ground the next generation of KSF children and teens in biblical truth."
  },
  {
    year: "2019",
    era: "genesis",
    title: "Connect Groups Multiply",
    text: "Midweek home fellowships multiply across distinct Kitale neighborhoods to foster deep, authentic discipleship, care networks, and mutual support."
  },
  {
    year: "2020",
    era: "roots",
    title: "The Digital Shift",
    text: "Pivoting swiftly to state-of-the-art online live broadcasts and media, connecting thousands of KSF family members globally during challenging global seasons."
  },
  {
    year: "2021",
    era: "roots",
    title: "New Sanctuary & Worship Expansion",
    text: "Moving into a larger, dedicated sanctuary space with high-quality media facilities to accommodate our rapidly growing community and worship team."
  },
  {
    year: "2022",
    era: "roots",
    title: "Regional Zone Formatting",
    text: "Organizing home fellowships into four primary spiritual and care zones: Judea (Central), Bethlehem (North), Antioch (West), and Galilee (South) for decentralized care."
  },
  {
    year: "2023",
    era: "roots",
    title: "Leadership Academy Launch",
    text: "Initiating a comprehensive leadership training school to equip, mentor, and commission believers for practical service and marketplace ministry."
  },
  {
    year: "2024",
    era: "impact",
    title: "Global Prayer Network",
    text: "Unveiling the 24/7 global intercessory prayer lines and digital prayer chains, connecting intercessors across nations for continuous spiritual warfare."
  },
  {
    year: "2025",
    era: "impact",
    title: "Missions & Mercy Outreaches",
    text: "Expanding active charity works, regional missions, medical camps, and community-empowering help initiatives to demonstrate God's love practically."
  },
  {
    year: "2026",
    era: "impact",
    title: "The Future & Beyond",
    text: "Walking in total obedience to the Holy Spirit's guidance, multiplying our reach, launching new campuses, and serving the body of Christ with absolute excellence."
  }
];

const FALLBACK_CORE_VALUES = [
  {
    title: "Humility",
    slogan: "Walking in lowliness of mind, esteeming others better than ourselves.",
    content: "We pattern our lives after Jesus Christ, who took the form of a servant. True power and spiritual authority are birthed from a humble heart that seeks God's glory rather than human recognition. We serve with joy, without pretense, and count it a privilege to lift up others."
  },
  {
    title: "Integrity",
    slogan: "Living transparently, matching our private devotion with our public witness.",
    content: "We value honesty, accountability, and ethical purity. At KSF, integrity means being the same person in the secret place as we are in the spotlight. We guard our character above our reputation, ensuring our words, actions, and finances are aligned with Scripture."
  },
  {
    title: "Stewardship",
    slogan: "Managing God's resources, time, and talents for His eternal purpose.",
    content: "Everything we have belongs to God. We are faithful managers of the time, talents, spiritual gifts, and material resources He has entrusted to us. We give generously, manage wisely, and invest diligently in the local community to multiply God's Kingdom on earth."
  },
  {
    title: "Prayer",
    slogan: "Our lifeline, breath, and the engine of every breakthrough.",
    content: "We do not merely pray to start our meetings; we pray to sustain our lives. Prayer is our direct connection to the Father, where we seek His face, receive His strategies, and petition for breakthroughs. KSF is a house of prayer, intercession, and spiritual warfare."
  },
  {
    title: "Holiness",
    slogan: "Set apart for God's glory, pursuing purity in a compromising world.",
    content: "God is holy, and He calls us to be holy in all our conduct. Holiness is not legalism, but a loving response to His grace. We actively pursue purity of heart, mind, and action, setting ourselves apart from worldly compromises to be vessels fit for the Master's use."
  },
  {
    title: "Excellence",
    slogan: "Doing our best, with the best attitude, for the Greatest Master.",
    content: "We believe that God deserves our absolute best. In worship, media, teaching, and hospitality, we pursue the highest standards. Excellence is a reflection of God's character and our ultimate love for Him. We do everything heartily, as unto the Lord."
  }
];

const FALLBACK_LEADERS = [
  {
    name: "Pastor Herman Walucho",
    role: "Lead Pastor",
    bio: "Devoted to preaching the Gospel, local discipleship, and guiding the spiritual vision of KSF.",
    image_url: "https://picsum.photos/seed/herman/300/300"
  },
  {
    name: "Pastor Faith Walucho",
    role: "Lead Pastor",
    bio: "Passionate about building healthy families, shepherd leadership, and nurturing our connect group networks.",
    image_url: "https://picsum.photos/seed/faith/300/300"
  },
  {
    name: "Pastor Stella Opicho",
    role: "Associate Pastor",
    bio: "Overseeing connect groups, local missions, and dedicated pastoral counseling.",
    image_url: "https://picsum.photos/seed/stella/300/300"
  },
  {
    name: "Pastor Erickson Wabuke",
    role: "Associate Pastor",
    bio: "Empowering youth ministries, community outreach, and discipleship pathways.",
    image_url: "https://picsum.photos/seed/erickson/300/300"
  },
  {
    name: "Pastor Martin Simiyu",
    role: "Associate Pastor",
    bio: "Leading prayer ministries, family enrichment programs, and worship fellowship integrations.",
    image_url: "https://picsum.photos/seed/martin/300/300"
  },
  {
    name: "Pastor Jane Juma",
    role: "Associate Pastor",
    bio: "Dedicated to women's fellowship, children ministries, and caring pastoral care services.",
    image_url: "https://picsum.photos/seed/jane/300/300"
  }
];

export default function AboutStory() {
  const { pages, getImageUrl } = usePocketBase();
  const page = pages['about-story'];

  const [activeBelief, setActiveBelief] = useState<number | null>(null);
  const [activeEra, setActiveEra] = useState<string>('all');
  const [milestonesList, setMilestonesList] = useState<any[]>([]);
  const [coreValuesList, setCoreValuesList] = useState<any[]>([]);
  const [leadersList, setLeadersList] = useState<any[]>([]);

  useEffect(() => {
    async function loadAboutData() {
      try {
        const milestonesRecords = await pb.collection('milestones').getFullList({
          sort: 'sort_order'
        });
        if (milestonesRecords.length > 0) {
          const formatted = milestonesRecords.map(r => ({
            ...r,
            text: r.description
          }));
          setMilestonesList(formatted);
        } else {
          setMilestonesList(FALLBACK_MILESTONES);
        }
      } catch (err) {
        console.error("Failed to load milestones from PocketBase:", err);
        setMilestonesList(FALLBACK_MILESTONES);
      }

      try {
        const valuesRecords = await pb.collection('core_values').getFullList({
          sort: 'sort_order'
        });
        if (valuesRecords.length > 0) {
          setCoreValuesList(valuesRecords);
        } else {
          setCoreValuesList(FALLBACK_CORE_VALUES);
        }
      } catch (err) {
        console.error("Failed to load core values from PocketBase:", err);
        setCoreValuesList(FALLBACK_CORE_VALUES);
      }

      try {
        const leadersRecords = await pb.collection('leadership_team').getFullList({
          sort: 'sort_order'
        });
        if (leadersRecords.length > 0) {
          setLeadersList(leadersRecords);
        } else {
          setLeadersList(FALLBACK_LEADERS);
        }
      } catch (err) {
        console.error("Failed to load leaders from PocketBase:", err);
        setLeadersList(FALLBACK_LEADERS);
      }
    }
    loadAboutData();
  }, []);

  const eras = [
    { name: "All Years", filter: "all" },
    { name: "Genesis (2016-2019)", filter: "genesis" },
    { name: "Roots (2020-2023)", filter: "roots" },
    { name: "Impact (2024-Present)", filter: "impact" }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const heroImage = getImageUrl(page, 'hero_image', 'https://images.unsplash.com/photo-1437603565678-c6f6ba998f64?w=1920&q=80');

  return (
    <div className="min-h-screen bg-ksf-white">
      <div className="relative pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 pb-0">
        {/* Hero Section - Floating Card Style */}
        <section className="relative h-[60vh] sm:h-[70vh] w-full rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden flex items-end pb-12 sm:pb-20 lg:pb-24">
          {/* Background Image & Dark Overlays */}
          <div className="absolute inset-0 z-0 scale-105 animate-slow-zoom">
            <img 
              src={heroImage} 
              alt={page?.title || "Our Story"} 
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
                  {page?.hero_subtitle || 'CRAFTING A LEGACY'}
                </span>

                <h1 className="font-headlines font-black text-5xl sm:text-7xl md:text-8xl leading-[0.85] mb-6 tracking-tighter">
                  {page?.hero_heading || 'Our Story'}
                </h1>

                <p className="font-body text-base sm:text-xl md:text-2xl opacity-80 font-medium tracking-tight max-w-2xl leading-relaxed">
                  {page?.hero_description || "The journey of faith at Kingdom Seekers Fellowship. Discover where we've been and where God is leading us next."}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <main className="relative z-10">

      {/* SECTION 2: IT'S ALL ABOUT JESUS */}
      <section className="bg-white py-20 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left Column: Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-start"
            >
              <span className="font-accent font-bold text-sky-blue text-[0.8rem] tracking-[3px] uppercase mb-4">
                About Us
              </span>
              <h2 className="text-primary-blue font-headlines font-black text-4xl sm:text-5xl mb-6 leading-[1.1] tracking-tight">
                It's All About Jesus
              </h2>
              <p className="text-ksf-dark-text font-body font-bold text-[1.15rem] mb-6 leading-relaxed">
                Our story started when Jesus rose from the grave. This is the reason for our existence today.
              </p>
              <p className="text-[#555555] font-body text-[1rem] leading-[1.8] mb-10 opacity-90">
                Everything we do at Kingdom Seekers Fellowship is anchored in the resurrection 
                of Jesus Christ — His life, death, and victory over the grave. That truth is 
                what compels us to gather, to serve, and to reach our city and the world with 
                the Gospel. Whether you're exploring faith for the first time or deepening your 
                walk, you belong here.
              </p>
              <a 
                href="#beliefs"
                className="bg-primary-blue text-ksf-white px-8 py-4 rounded-[6px] font-body font-bold text-base hover:bg-bold-red transition-all duration-300 flex items-center gap-2"
              >
                Our Core Values <ArrowRight size={18} />
              </a>
            </motion.div>

            {/* Right Column: Photo Collage */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative min-h-[500px] flex items-center justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[450px]">
                {/* LARGE CARD (Portrait) */}
                <div 
                  className="w-[70%] aspect-[2/3] rounded-[16px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] ml-auto"
                >
                  <img 
                    src="https://picsum.photos/400/600?seed=ksf-large" 
                    alt="Community Life" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* MEDIUM CARD (Overlap lower-left) */}
                <div 
                  className="absolute bottom-[10%] left-0 w-[55%] aspect-square rounded-[12px] overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.12)] border-4 border-white"
                >
                  <img 
                    src="https://picsum.photos/300/300?seed=ksf-medium" 
                    alt="Worship Moment" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* SMALL CARD (Bottom-right overlap, slightly rotated) */}
                <div 
                  className="absolute bottom-0 right-[-10%] w-[45%] aspect-square rounded-[12px] overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.1)] border-4 border-white rotate-3"
                >
                  <img 
                    src="https://picsum.photos/250/250?seed=ksf-small" 
                    alt="Small Group" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 3: THE GREAT COMMISSION */}
      <section className="bg-ksf-drawer-bg py-24 lg:py-32 text-ksf-white relative">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Centered Header */}
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-ksf-white font-headlines font-black text-4xl sm:text-5xl mb-8 tracking-tight"
            >
              The Great Commission
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[#AAAAAA] font-body italic text-[0.95rem] leading-relaxed"
            >
              "Go, therefore, and make disciples of all nations, baptizing them in the name 
              of the Father and of the Son and of the Holy Spirit, teaching them to observe 
              everything I have commanded you. And remember, I am with you always, to the 
              end of the age." — Matthew 28:19–20
            </motion.p>
          </div>

          {/* Cards Grid */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {/* VISION CARD */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="bg-ksf-white p-9 sm:p-11 rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.3)] w-full lg:w-[45%] group transition-all duration-300"
            >
              <div className="bg-sky-blue/10 w-16 h-16 rounded-full flex items-center justify-center mb-8 text-sky-blue">
                <Compass size={32} />
              </div>
              <h3 className="text-ksf-dark-text font-accent font-bold text-[1.2rem] mb-4">Vision</h3>
              <p className="text-[#555555] font-body text-[0.95rem] leading-[1.7]">
                God has called KSF to connect all people to a growing relationship with Jesus. 
                We will do this by reaching every corner of Kitale and beyond — making 
                disciples who make disciples.
              </p>
            </motion.div>

            {/* MISSION CARD */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="bg-ksf-white p-9 sm:p-11 rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.3)] w-full lg:w-[45%] group transition-all duration-300"
            >
              <div className="bg-sky-blue/10 w-16 h-16 rounded-full flex items-center justify-center mb-8 text-sky-blue">
                <Target size={32} />
              </div>
              <h3 className="text-ksf-dark-text font-accent font-bold text-[1.2rem] mb-4">Mission</h3>
              <p className="text-[#555555] font-body text-[0.95rem] leading-[1.7]">
                We exist to seek God's Kingdom first and to transform our communities 
                through worship, discipleship, fellowship, and service.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 4: OUR STRATEGIES */}
      <section id="strategies" className="bg-white py-24 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          
          {/* Header Area */}
          <div className="text-center mb-16 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 0.5, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-accent font-bold text-[120px] sm:text-[180px] text-[#E5EEFA] pointer-events-none z-0"
            >
              KSF
            </motion.div>
            
            <div className="relative z-10">
              <span className="font-accent font-black text-bold-red text-[0.8rem] tracking-[4px] uppercase mb-4 block">
                OUR STRATEGIES
              </span>
              <h2 className="text-primary-blue font-headlines font-black text-4xl sm:text-5xl mb-6 tracking-tight">
                How We Live It Out
              </h2>
              <p className="text-ksf-dark-text font-body text-[1.1rem] max-w-[600px] mx-auto leading-relaxed opacity-70">
                Based on scripture, we have developed five pillars to carry out the mission 
                God has given us.
              </p>
            </div>
          </div>

          {/* Scripture Passage */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-[680px] mx-auto mb-24 bg-ksf-gray-bg p-6 sm:p-8 rounded-[8px] border-l-4 border-bold-red"
          >
            <p className="text-[#666666] font-body italic text-[0.95rem] leading-[1.8]">
              "They devoted themselves to the apostles' teaching, to the fellowship, to the 
              breaking of bread, and to prayer... Every day the Lord added to their number 
              those who were being saved." — Acts 2:42–47
            </p>
          </motion.div>

          {/* Strategy Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Worship Gatherings", id: "worship" },
              { title: "Connect Groups", id: "groups" },
              { title: "Families", id: "families" },
              { title: "Equip Pathways", id: "equip" },
              { title: "Global Missions", id: "missions" },
              { title: "Local Outreach", id: "outreach" }
            ].map((strategy, idx) => (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="group relative aspect-[3/2] rounded-[12px] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img 
                  src={`https://picsum.photos/seed/ksf-strat-${idx}/400/270`} 
                  alt={strategy.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-[40%]" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-ksf-white transform group-hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="font-headlines font-black text-[1.4rem] mb-4 tracking-tight leading-tight">
                    {strategy.title}
                  </h3>
                  <button 
                    className="self-start flex items-center gap-2 border border-ksf-white px-5 py-2 rounded-ksf-md font-accent font-black text-[10px] tracking-[2px] uppercase hover:bg-bold-red hover:text-ksf-white transition-all"
                  >
                    LEARN MORE <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: LEADERSHIP TEAM */}
      <section id="leadership" className="bg-ksf-gray-bg py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="font-accent font-black text-sky-blue text-[0.8rem] tracking-[4px] uppercase mb-4 block">
              MEET THE TEAM
            </span>
            <h2 className="text-primary-blue font-headlines font-black text-4xl sm:text-5xl mb-6 tracking-tight">
              Led by the Spirit, Guided by the Word
            </h2>
            <p className="text-[#555555] font-body text-[1.1rem] max-w-[650px] mx-auto leading-relaxed opacity-80">
              Our leadership team is committed to serving KSF with humility, 
              integrity, and a deep love for God and people.
            </p>
          </div>

          {/* Leaders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadersList.map((leader, idx) => {
              const imageSrc = getImageUrl(leader, 'image', leader.image_url || leader.image || 'https://picsum.photos/seed/herman/300/300');
              return (
                <motion.div
                  key={leader.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-ksf-white p-8 rounded-[12px] shadow-sm hover:shadow-xl hover:border-t-4 hover:border-bold-red transition-all duration-300 flex flex-col items-center text-center group"
                >
                  <div className="relative mb-6">
                    <div className="w-[124px] h-[124px] rounded-full border-4 border-primary-blue p-1">
                      <img 
                        src={imageSrc} 
                        alt={leader.name} 
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                <h3 className="text-primary-blue font-headlines font-black text-[1.3rem] mb-2 tracking-tight">
                  {leader.name}
                </h3>
                <span className="font-accent text-bold-red text-[0.75rem] font-black tracking-[3px] uppercase mb-4">
                  {leader.role}
                </span>
                <p className="text-[#555555] font-body text-[0.95rem] leading-[1.6] mb-6 flex-grow opacity-90">
                  {leader.bio}
                </p>
                <div className="flex items-center gap-4 text-[#AAAAAA]">
                  <a href="#" className="hover:text-primary-blue transition-colors">
                    <Facebook size={18} />
                  </a>
                  <a href="#" className="hover:text-primary-blue transition-colors">
                    <Linkedin size={18} />
                  </a>
                </div>
              </motion.div>
            )})}
          </div>
        </div>
      </section>

      {/* SECTION 6: OUR CORE VALUES */}
      <section id="beliefs" className="bg-primary-blue py-24 lg:py-32 text-ksf-white relative px-4 sm:px-12 lg:px-[60px]">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="font-accent font-black text-bold-red text-[0.8rem] tracking-[4px] uppercase mb-4 block">
              OUR CORE VALUES
            </span>
            <h2 className="text-ksf-white font-headlines font-black text-4xl sm:text-5xl mb-6 tracking-tight">
              How We Walk & Serve
            </h2>
            <p className="text-ksf-white/70 font-body text-[1.1rem] max-w-[600px] mx-auto leading-relaxed">
              We hold fast to the biblical principles that guide our character, choices, and culture. Click on each core value below to explore our commitment.
            </p>
          </div>

          {/* Core Values Accordion */}
          <div className="space-y-4">
            {coreValuesList.map((value, idx) => (
              <div 
                key={value.title}
                className={`bg-ksf-white/5 rounded-[8px] overflow-hidden transition-all duration-300 border-l-4 ${
                  activeBelief === idx ? 'border-bold-red bg-ksf-white/10' : 'border-transparent'
                }`}
              >
                <button 
                  onClick={() => setActiveBelief(activeBelief === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left group animate-fade-in"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-accent font-black text-ksf-white text-[1.1rem] sm:text-[1.2rem] uppercase tracking-wider">
                      {value.title}
                    </span>
                    <span className="font-body text-white/60 text-[0.8rem] sm:text-[0.85rem] font-medium italic">
                      {value.slogan}
                    </span>
                  </div>
                  <div className="text-sky-blue shrink-0">
                    {activeBelief === idx ? <X size={20} /> : <Plus size={20} />}
                  </div>
                </button>
                <AnimatePresence>
                  {activeBelief === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 sm:px-7 pb-6 sm:pb-7">
                        <p className="text-ksf-white/80 font-body text-[0.95rem] leading-[1.7] border-t border-white/10 pt-4">
                          {value.content}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: OUR HISTORY */}
      <section id="history" className="bg-slate-50/50 py-24 lg:py-32 relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-bold-red/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-accent font-black text-bold-red text-[0.8rem] tracking-[4px] uppercase mb-4 block">
              OUR JOURNEY
            </span>
            <h2 className="text-primary-blue font-headlines font-black text-4xl sm:text-5xl mb-6 tracking-tight leading-none">
              Over a Decade of Faithfulness
            </h2>
            <p className="text-slate-600 font-body text-base leading-relaxed">
              From a handful of seekers to a global family, see how God has established KSF across the years. Select an era to explore our milestones.
            </p>
          </div>

          {/* Interactive Era Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-20 max-w-3xl mx-auto p-1.5 bg-slate-100 rounded-[2rem] border border-slate-200">
            {eras.map((era) => (
              <button
                key={era.filter}
                onClick={() => setActiveEra(era.filter)}
                className={`px-5 py-3 sm:px-6 sm:py-3.5 rounded-[1.5rem] font-accent font-black text-[10px] sm:text-xs tracking-wider uppercase transition-all duration-300 ${
                  activeEra === era.filter
                    ? 'bg-primary-blue text-white shadow-md'
                    : 'text-slate-500 hover:text-primary-blue hover:bg-slate-200/50'
                }`}
              >
                {era.name}
              </button>
            ))}
          </div>

          {/* Timeline Container */}
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-[16px] sm:left-[24px] md:left-1/2 md:-translate-x-1/2 top-2 bottom-2 w-[3px] bg-slate-200/80 rounded-full z-0" />

            {/* Timeline Items */}
            <div className="space-y-12">
              <AnimatePresence mode="popLayout">
                {milestonesList
                  .filter((m) => activeEra === 'all' || m.era === activeEra)
                  .map((milestone, idx) => (
                    <motion.div
                      key={milestone.year + '-' + milestone.title}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`relative flex items-stretch w-full ${
                        idx % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
                      } flex-row`}
                    >
                      {/* Timeline Dot with Year */}
                      <div className="absolute left-[16px] sm:left-[24px] md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full z-10 border-4 border-white bg-bold-red shadow-lg flex items-center justify-center translate-x-[-12px] sm:translate-x-[-12px] md:translate-x-[-16px] transition-transform duration-300 hover:scale-110">
                        <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping opacity-75" />
                      </div>

                      {/* Content Card Side */}
                      <div className={`w-full md:w-1/2 ${
                        idx % 2 === 0 ? 'md:pr-14' : 'md:pl-14'
                      } pl-12 sm:pl-16 md:pl-0`}>
                        <div className="bg-white p-6 sm:p-8 rounded-[1.8rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] relative group hover:-translate-y-1 transition-all duration-300">
                          {/* Year Badge */}
                          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-blue/5 border border-primary-blue/10 text-primary-blue font-accent font-black text-[10px] tracking-widest uppercase mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-blue animate-pulse" />
                            {milestone.year}
                          </div>
                          
                          <h3 className="text-primary-blue font-headlines font-black text-xl sm:text-2xl mb-2.5 leading-tight group-hover:text-bold-red transition-colors">
                            {milestone.title}
                          </h3>
                          <p className="text-slate-600 font-body text-sm leading-relaxed">
                            {milestone.text}
                          </p>
                        </div>
                      </div>

                      {/* Empty Side (For desktop spacing) */}
                      <div className="hidden md:block md:w-1/2" />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
);
}
