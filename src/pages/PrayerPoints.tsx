import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  BookOpen, 
  Sparkles, 
  ChevronDown, 
  Search, 
  Copy, 
  Share2, 
  Check, 
  Shield, 
  Coins, 
  Globe, 
  Flame, 
  Calendar,
  MessageSquare
} from 'lucide-react';
import { usePocketBase, pb } from '../context/PocketBaseContext';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Heart,
  BookOpen,
  Sparkles,
  Shield,
  Coins,
  Globe,
  Flame,
  Calendar,
  MessageSquare
};

const FALLBACK_CATEGORIES: any[] = [
  {
    id: 'children',
    title: 'Prayer for Children & Next Gen',
    icon: 'Heart',
    color: 'text-bold-red',
    key_verse: 'All your children shall be taught by the Lord, and great shall be the peace of your children.',
    key_reference: 'Isaiah 54:13',
    prayers: [
      {
        id: 'child-1',
        focus: 'Early Salvation & Spiritual Foundation',
        scripture: '2 Timothy 3:15 & Deuteronomy 6:5-7',
        verseText: 'And that from childhood you have known the Holy Scriptures, which are able to make you wise for salvation through faith which is in Christ Jesus.',
        prayerDeclaration: 'Heavenly Father, we declare that our children are soft soil to Your Word. We pray that they will choose to seek and surrender to Jesus at an early age. Let Your Spirit capture their hearts and establish a firm foundation of faith that cannot be shaken by peer pressure or cultural winds.'
      },
      {
        id: 'child-2',
        focus: 'Divine Safety & Emotional Protection',
        scripture: 'Psalm 91:11-12 & Luke 2:52',
        verseText: 'For He shall give His angels charge over you, to keep you in all your ways.',
        prayerDeclaration: 'Lord, we erect a hedge of fire around our children. Protect them from spiritual predators, physical harm, accidents, and toxic emotional environments. Build emotional resilience in them, guarding their minds with Your perfect peace and shielding them from anxiety, depression, and low self-worth.'
      },
      {
        id: 'child-3',
        focus: 'Intellectual Excellence & Divine Wisdom',
        scripture: 'Daniel 1:17 & James 1:5',
        verseText: 'As for these four young men, God gave them knowledge and skill in all literature and wisdom; and Daniel had understanding in all visions and dreams.',
        prayerDeclaration: 'Father, bless our children with exceptional wisdom, focus, and creativity. We decree that they are the head and not the tail. Equip them to excel in school, to grasp complex subjects with ease, and to discover their God-given purposes so they can make an impact in the marketplace for Your Glory.'
      },
      {
        id: 'child-4',
        focus: 'Godly Friendships & Associations',
        scripture: 'Proverbs 13:20 & 1 Corinthians 15:33',
        verseText: 'He who walks with wise men will be wise, but the companion of fools will be destroyed.',
        prayerDeclaration: 'Holy Spirit, guide our children in selecting their friends. Weed out any negative influences or associations that might compromise their character. Direct them to godly peers and mentors who will encourage them to love Christ, run with righteousness, and grow in destiny.'
      }
    ]
  },
  {
    id: 'family',
    title: 'Prayer for Families & Marriages',
    icon: 'Shield',
    color: 'text-primary-blue',
    key_verse: 'As for me and my house, we will serve the Lord.',
    key_reference: 'Joshua 24:15',
    prayers: [
      {
        id: 'fam-1',
        focus: 'Unity, Forgiveness & Peace',
        scripture: 'Colossians 3:13-14',
        verseText: 'Bearing with one another, and forgiving one another... But above all these things put on love, which is the bond of perfection.',
        prayerDeclaration: 'Lord, we decree that KSF marriages and families are bound together in perfect harmony. Root out all strife, resentment, pride, and communication barriers. Let Your supernatural peace reign in every home, making them safe havens of healing, laughter, and prayer.'
      },
      {
        id: 'fam-2',
        focus: 'Marital Restoration & Faithfulness',
        scripture: 'Malachi 2:16 & Genesis 2:24',
        verseText: 'Therefore a man shall leave his father and mother and be joined to his wife, and they shall become one flesh.',
        prayerDeclaration: 'Father, strengthen every marital union under KSF. We pray against separation, divorce, and infidelity. Reignite first-love passion, restore trust where it has been fractured, and supply supernatural grace to husbands and wives to love and honor each other unconditionally.'
      }
    ]
  },
  {
    id: 'healing',
    title: 'Prayer for Healing & Restoration',
    icon: 'Sparkles',
    color: 'text-emerald-600',
    key_verse: 'For I will restore health to you and heal you of your wounds, says the Lord.',
    key_reference: 'Jeremiah 30:17',
    prayers: [
      {
        id: 'heal-1',
        focus: 'Physical Healing & Deliverance',
        scripture: 'Isaiah 53:5 & 1 Peter 2:24',
        verseText: 'But He was wounded for our transgressions, He was bruised for our iniquities; the chastisement for our peace was upon Him, and by His stripes we are healed.',
        prayerDeclaration: 'Jehovah Rapha, we stand on the finished work of the cross and command every sickness, terminal disease, pain, and physical infirmity to leave the bodies of Your saints now! We declare fresh strength, functioning organs, and supernatural restoration from the crown of their heads to the soles of their feet.'
      },
      {
        id: 'heal-2',
        focus: 'Mental & Emotional Wellness',
        scripture: '2 Timothy 1:7 & Isaiah 26:3',
        verseText: 'For God has not given us a spirit of fear, but of power and of love and of a sound mind.',
        prayerDeclaration: 'Lord, deliver Your people from trauma, anxiety, panic attacks, and depression. Restructure broken neural pathways and mend shattered hearts. We take captive every dark, obsessive, or suicidal thought and declare that Your perfect love casts out all fear, gifting us a clear, sound, and disciplined mind.'
      }
    ]
  },
  {
    id: 'finances',
    title: 'Prayer for Financial Breakthrough & Provision',
    icon: 'Coins',
    color: 'text-amber-600',
    key_verse: 'And my God shall supply all your need according to His riches in glory by Christ Jesus.',
    key_reference: 'Philippians 4:19',
    prayers: [
      {
        id: 'fin-1',
        focus: 'Debt Deliverance & Open Doors',
        scripture: 'Deuteronomy 28:12 & Proverbs 10:22',
        verseText: 'The Lord will open to you His good treasure, the heavens, to give the rain to your land in its season and to bless all the work of your hand.',
        prayerDeclaration: 'Father, break the back of systemic poverty, lack, and debt in our lives. We speak financial freedom over every KSF member. Open fresh channels of income, supernatural employment opportunities, and business ideas that command wealth. Grant us the wisdom to manage, save, and invest for kingdom expansion.'
      },
      {
        id: 'fin-2',
        focus: 'Generosity & Tithing Blessings',
        scripture: 'Malachi 3:10 & 2 Corinthians 9:8',
        verseText: 'And God is able to make all grace abound toward you, that you, always having all sufficiency in all things, may have an abundance for every good work.',
        prayerDeclaration: 'We pray for a heart of radical generosity. Make us cheerful givers and faithful stewards of tithes and offerings. As we sow into Your Kingdom, let the windows of heaven be thrown open wide, bringing forth blessings, favor, and security that no devourer can touch.'
      }
    ]
  },
  {
    id: 'revival',
    title: 'Spiritual Growth & Church Revival',
    icon: 'Flame',
    color: 'text-orange-600',
    key_verse: 'Will You not revive us again, that Your people may rejoice in You?',
    key_reference: 'Psalm 85:6',
    prayers: [
      {
        id: 'rev-1',
        focus: 'Hunger for God & Prayer Revival',
        scripture: 'Ephesians 1:17-18 & Matthew 5:6',
        verseText: 'Blessed are those who hunger and thirst for righteousness, for they shall be filled.',
        prayerDeclaration: 'Holy Spirit, rekindle a burning, unquenchable passion for prayer and study of the Word in KSF. Do not let us grow lukewarm or comfortable. Open the eyes of our understanding to see Christ in His full beauty, prompting daily surrender and intercession that shakes our homes and our city.'
      },
      {
        id: 'rev-2',
        focus: 'Supernatural Manifestations & Salvation of Souls',
        scripture: 'Acts 4:30 & Mark 16:20',
        verseText: 'By stretching out Your hand to heal, and that signs and wonders may be done through the name of Your holy Servant Jesus.',
        prayerDeclaration: 'Heavenly Father, accompany Your Word at Kingdom Seekers Fellowship with raw demonstrations of power—miracles, signs, wonders, and instant healings. Draw the lost, the broken, and the skeptical into Your gates, and let thousands find salvation, transformation, and water baptism in Jesus\' name.'
      }
    ]
  },
  {
    id: 'nation',
    title: 'Prayer for our Nation & Leadership',
    icon: 'Globe',
    color: 'text-purple-600',
    key_verse: 'If My people who are called by My name will humble themselves, and pray and seek My face... then I will hear from heaven, and will forgive their sin and heal their land.',
    key_reference: '2 Chronicles 7:14',
    prayers: [
      {
        id: 'nat-1',
        focus: 'Peace, Economic Justice & Integrity',
        scripture: '1 Timothy 2:1-2 & Proverbs 29:2',
        verseText: 'When the righteous are in authority, the people rejoice; but when a wicked man rules, the people groan.',
        prayerDeclaration: 'Lord, we lift the nation of Kenya and its leadership. Grant our President, governors, lawmakers, and judges judicial integrity, pure motives, and divine wisdom. We bind tribal division, corruption, corruption networks, and social injustice. Let equity, economic prosperity, and national cohesion saturate our land.'
      }
    ]
  }
];

export default function PrayerPoints() {
  const { pages, getImageUrl } = usePocketBase();
  const page = pages['prayer-points'];

  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    children: true // Open first category by default
  });
  const [expandedPrayers, setExpandedPrayers] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const records = await pb.collection('prayer_categories').getFullList({
          sort: 'sort_order'
        });
        if (records.length > 0) {
          const formatted = records.map(r => ({
            ...r,
            prayers: typeof r.prayers === 'string' ? JSON.parse(r.prayers) : r.prayers
          }));
          setCategoriesList(formatted);
          // Set expanded categories
          if (formatted.length > 0) {
            setExpandedCategories({ [formatted[0].id]: true });
          }
        } else {
          setCategoriesList(FALLBACK_CATEGORIES);
        }
      } catch (err) {
        console.error("Failed to load prayer categories from PocketBase:", err);
        setCategoriesList(FALLBACK_CATEGORIES);
      }
    }
    loadCategories();
  }, []);

  const handleToggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const handleTogglePrayer = (prayerId: string) => {
    setExpandedPrayers(prev => ({
      ...prev,
      [prayerId]: !prev[prayerId]
    }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleWhatsAppShare = (title: string, scripture: string, prayerText: string) => {
    const formattedText = `*KSF Daily Prayer Focus: ${title}*\n\n📖 *Scripture:* ${scripture}\n\n🙏 *Declaration:* "${prayerText}"\n\nJoin the KSF prayer movement! Join our WhatsApp group: https://chat.whatsapp.com/KSFPrayerPoints`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedText)}`;
    window.open(url, '_blank');
  };

  const getBgLight = (color: string) => {
    if (color.includes('red')) return 'bg-red-50/50';
    if (color.includes('blue')) return 'bg-blue-50/50';
    if (color.includes('emerald')) return 'bg-emerald-50/30';
    if (color.includes('amber')) return 'bg-amber-50/30';
    if (color.includes('orange')) return 'bg-orange-50/30';
    if (color.includes('purple')) return 'bg-purple-50/30';
    return 'bg-slate-50/50';
  };

  const getBorderCol = (color: string) => {
    if (color.includes('red')) return 'border-red-100';
    if (color.includes('blue')) return 'border-blue-100';
    if (color.includes('emerald')) return 'border-emerald-100';
    if (color.includes('amber')) return 'border-amber-100';
    if (color.includes('orange')) return 'border-orange-100';
    if (color.includes('purple')) return 'border-purple-100';
    return 'border-slate-100';
  };

  // Filter categories and prayer items based on search query
  const filteredCategories = categoriesList.map(cat => {
    const prayers = cat.prayers || [];
    const matchingPrayers = prayers.filter((p: any) => 
      p.focus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.scripture.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.verseText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.prayerDeclaration.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesCategoryHeader = 
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.key_verse || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.key_reference || '').toLowerCase().includes(searchQuery.toLowerCase());

    return {
      ...cat,
      prayers: matchesCategoryHeader ? prayers : matchingPrayers,
      isMatch: matchesCategoryHeader || matchingPrayers.length > 0
    };
  }).filter(cat => cat.isMatch);

  return (
    <main className="bg-slate-50 min-h-screen pb-24">
      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden mb-12 bg-gradient-to-b from-[#0D3875] to-[#001D4A] pt-36 sm:pt-44 pb-16 text-white">
        {/* Abstract Light Flare */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[25rem] bg-sky-blue/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-accent text-bold-red font-black tracking-[4px] text-xs uppercase mb-4 block"
          >
            {page?.hero_subtitle || 'MATTHEW 18:19 · UNIFIED INTERCESSION'}
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-headlines text-4xl sm:text-6xl font-black mb-6 tracking-tight max-w-4xl mx-auto leading-none"
          >
            {page?.hero_heading || 'Prayer Points & Declarations'}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-body text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-10"
          >
            {page?.hero_description || '"If two of you agree on earth about anything they ask, it will be done for them by my Father in heaven." Explore our interactive, scriptural prayer declarations below.'}
          </motion.p>

          {/* Quick Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left mb-12 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-bold-red/20 flex items-center justify-center text-bold-red">
                <Calendar size={18} />
              </div>
              <div>
                <p className="font-accent text-[9px] font-bold text-slate-400 tracking-wider uppercase">Prayer Chain</p>
                <p className="font-headlines text-sm font-black text-white">24/7 Cover</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6">
              <div className="w-10 h-10 rounded-2xl bg-sky-blue/20 flex items-center justify-center text-sky-blue">
                <MessageSquare size={18} />
              </div>
              <div>
                <p className="font-accent text-[9px] font-bold text-slate-400 tracking-wider uppercase">Active Network</p>
                <p className="font-headlines text-sm font-black text-white">WhatsApp Updates</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="font-accent text-[9px] font-bold text-slate-400 tracking-wider uppercase">Weekly Focus</p>
                <p className="font-headlines text-sm font-black text-white">6 Rich Core Keys</p>
              </div>
            </div>
          </motion.div>

          {/* Dynamic Search bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-xl mx-auto relative shadow-2xl rounded-2xl overflow-hidden"
          >
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by keyword, scripture reference, or prayer theme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 sm:py-5 bg-white text-slate-800 placeholder-slate-400 focus:outline-none font-body text-sm rounded-2xl border-none shadow-inner"
            />
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: ACCORDION LISTING */}
      <section className="container mx-auto px-6 lg:px-12 max-w-4xl">
        
        {/* Dynamic empty state */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-200 shadow-md">
            <span className="text-4xl">🔍</span>
            <h3 className="font-headlines text-xl font-black text-primary-blue mt-4 mb-2">No Matching Prayer Points</h3>
            <p className="font-body text-sm text-slate-500 max-w-sm mx-auto">
              We couldn't find any scripture or prayer points matching "{searchQuery}". Try searching for categories like "children", "healing", "family", "finances", or specific verses.
            </p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-6 px-6 py-2.5 bg-primary-blue text-white rounded-xl font-accent font-black tracking-wider text-xs uppercase"
            >
              Reset Search
            </button>
          </div>
        )}

        <div className="space-y-6">
          {filteredCategories.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || Flame;
            const isOpen = expandedCategories[cat.id];

            return (
              <motion.div 
                key={cat.id}
                layout="position"
                className="bg-white rounded-[2rem] shadow-sm border border-slate-200/80 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Category Header (Accordion trigger) */}
                <button
                  onClick={() => handleToggleCategory(cat.id)}
                  className="w-full flex items-center justify-between p-6 sm:p-8 text-left transition-colors hover:bg-slate-50/50"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className={`w-12 h-12 rounded-2xl ${getBgLight(cat.color || '')} flex items-center justify-center shrink-0`}>
                      <IconComponent className={`w-6 h-6 ${cat.color || 'text-bold-red'}`} />
                    </div>
                    <div>
                      <h2 className="font-headlines text-lg sm:text-xl font-black text-primary-blue leading-tight">
                        {cat.title}
                      </h2>
                      <p className="font-body text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <span className="font-semibold">{(cat.prayers || []).length}</span> structured prayer points
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 pl-4">
                    <span className="hidden sm:inline-block font-accent text-[9px] font-black tracking-widest text-slate-400 uppercase">
                      {isOpen ? 'Collapse' : 'Expand'}
                    </span>
                    <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </button>

                {/* Category Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden border-t border-slate-100"
                    >
                      <div className="p-6 sm:p-8 bg-slate-50/30 space-y-6">
                        {/* Key Focal Verse Banner */}
                        <div className={`p-5 rounded-2xl border ${getBorderCol(cat.color || '')} ${getBgLight(cat.color || '')} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                          <div className="space-y-1">
                            <p className="font-accent text-[9px] font-bold text-slate-400 tracking-wider uppercase">Focal Era Verse</p>
                            <p className="font-body text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                              "{cat.key_verse || cat.keyVerse}"
                            </p>
                          </div>
                          <span className={`shrink-0 font-headlines font-black text-xs sm:text-sm uppercase tracking-wider ${cat.color || 'text-bold-red'}`}>
                            — {cat.key_reference || cat.keyReference}
                          </span>
                        </div>

                        {/* Prayers Accordion Loop */}
                        <div className="space-y-4">
                          {cat.prayers.map((prayer) => {
                            const isPrayerOpen = expandedPrayers[prayer.id];
                            
                            return (
                              <div 
                                key={prayer.id}
                                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
                              >
                                {/* Inner Trigger */}
                                <button
                                  type="button"
                                  onClick={() => handleTogglePrayer(prayer.id)}
                                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50/50 transition-colors"
                                >
                                  <div className="flex items-center gap-3 pr-4">
                                    <div className="w-2 h-2 rounded-full bg-bold-red shrink-0" />
                                    <h4 className="font-headlines font-black text-sm sm:text-base text-primary-blue tracking-tight leading-tight">
                                      {prayer.focus}
                                    </h4>
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0">
                                    <span className="hidden md:inline-block font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                      {prayer.scripture.split('&')[0]}
                                    </span>
                                    <ChevronDown 
                                      size={16} 
                                      className={`text-slate-400 transition-transform duration-300 ${isPrayerOpen ? 'rotate-180' : ''}`} 
                                    />
                                  </div>
                                </button>

                                {/* Inner Content */}
                                <AnimatePresence initial={false}>
                                  {isPrayerOpen && (
                                    <motion.div
                                      initial={{ height: 0 }}
                                      animate={{ height: 'auto' }}
                                      exit={{ height: 0 }}
                                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                                      className="overflow-hidden"
                                    >
                                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-4">
                                        {/* Scripture Box */}
                                        <div className="bg-white p-4 rounded-xl border border-slate-200 font-body text-xs leading-relaxed text-slate-600">
                                          <p className="font-accent text-[9px] font-black tracking-widest text-primary-blue uppercase mb-1">SCRIPTURAL GROUNDING</p>
                                          <p className="italic">"{prayer.verseText}"</p>
                                          <p className="text-right font-headlines font-black text-slate-800 text-[10px] mt-1.5 uppercase">
                                            — {prayer.scripture}
                                          </p>
                                        </div>

                                        {/* Declaration Box */}
                                        <div className="p-4 rounded-xl bg-primary-blue/5 border border-primary-blue/10 font-body text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                                          <p className="font-accent text-[9px] font-black tracking-widest text-bold-red uppercase">PRAYER DECLARATION</p>
                                          <p className="font-medium">"{prayer.prayerDeclaration}"</p>
                                        </div>

                                        {/* Utility Toolbar */}
                                        <div className="flex items-center justify-end gap-3 pt-2">
                                          {/* Copy Button */}
                                          <button
                                            onClick={() => handleCopy(
                                              `*Prayer Focus: ${prayer.focus}*\nScripture: ${prayer.scripture}\n\n"${prayer.prayerDeclaration}"`, 
                                              prayer.id
                                            )}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-accent font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 transition-colors active:scale-95"
                                          >
                                            {copiedId === prayer.id ? (
                                              <>
                                                <Check size={12} className="text-emerald-500" />
                                                <span className="text-emerald-500">Copied</span>
                                              </>
                                            ) : (
                                              <>
                                                <Copy size={12} />
                                                <span>Copy</span>
                                              </>
                                            )}
                                          </button>

                                          {/* Share WhatsApp */}
                                          <button
                                            onClick={() => handleWhatsAppShare(
                                              prayer.focus,
                                              prayer.scripture,
                                              prayer.prayerDeclaration
                                            )}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-[11px] font-accent font-bold uppercase tracking-wider text-white hover:bg-emerald-600 transition-colors active:scale-95"
                                          >
                                            <Share2 size={12} />
                                            <span>WhatsApp</span>
                                          </button>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: BOTTOM JOIN BANNER */}
      <section className="container mx-auto px-6 lg:px-12 max-w-4xl mt-16">
        <div className="bg-[#001D4A] rounded-[3rem] p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-bold-red/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-blue/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <span className="font-accent text-bold-red font-black tracking-widest text-[10px] uppercase">
              ACTIVATE SPIRITUAL SHIELDS
            </span>
            <h3 className="font-headlines text-2xl sm:text-4xl font-black tracking-tight leading-none">
              Have a Specific Prayer Request?
            </h3>
            <p className="font-body text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our intercessory prayer network is standing by to lift you up in faith. Send us your request or join our active WhatsApp community for weekly prayer alerts.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a 
                href="https://chat.whatsapp.com/KSFPrayerPoints"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-bold-red hover:bg-primary-blue text-white px-8 py-4 rounded-xl font-accent font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-lg hover:scale-105 active:scale-[0.97]"
              >
                Join WhatsApp Group
              </a>
              <Link
                to="/im-new"
                className="w-full sm:w-auto text-white hover:text-bold-red font-accent font-bold text-xs tracking-wider uppercase transition-colors"
              >
                Submit Prayer Request →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
