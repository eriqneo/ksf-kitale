import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Tv, Users, Send, Heart, Flame, MessageSquare, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { usePocketBase } from '../context/PocketBaseContext';

interface ChatMessage {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  isStaff?: boolean;
}

const INITIAL_CHAT: ChatMessage[] = [
  { id: '1', name: 'Pastor Stella Opicho', message: 'Welcome to our Live Stream worship today! We are so blessed to gather with you in the spirit. Connect and share your prayer requests!', timestamp: '10:28 AM', isStaff: true },
  { id: '2', name: 'John Kiprop', message: 'Amen! Watching live from Nakuru. Glory to Jesus!', timestamp: '10:30 AM' },
  { id: '3', name: 'Mary Wanjiku', message: 'The praise team is leading us so beautifully today. Thank you Lord!', timestamp: '10:33 AM' },
  { id: '4', name: 'Erickson Wafula', message: 'Hello KSF family! God bless you all.', timestamp: '10:34 AM' },
  { id: '5', name: 'Sarah Nekesa', message: 'Receiving this word in divine strength. Praise the Lord.', timestamp: '10:37 AM' },
];

export default function Live() {
  const { siteSettings } = usePocketBase();
  const [chatList, setChatList] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [userName, setUserName] = useState('');
  const [typedMessage, setTypedMessage] = useState('');
  const [hasSetIdentity, setHasSetIdentity] = useState(false);
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [prayerRequest, setPrayerRequest] = useState('');
  const [prayerSubmitted, setPrayerSubmitted] = useState(false);
  const [submittingPrayer, setSubmittingPrayer] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatList]);

  // Simulate incoming chat messages occasionally to feel "live"
  useEffect(() => {
    const randomMsgs = [
      "Amen, praise God!",
      "Walking in divine purpose indeed!",
      "Such a powerful word from our Lead Pastor.",
      "Greetings from Mombasa, watching with my whole family.",
      "Lord, touch my family in this season.",
      "God is faithful!"
    ];
    const randomNames = [
      "Alice Mwangi",
      "David Omwamba",
      "Grace Atieno",
      "Peter Kamau",
      "Mercy Chebet",
      "Julius Wekesa"
    ];

    const interval = setInterval(() => {
      const name = randomNames[Math.floor(Math.random() * randomNames.length)];
      const msg = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setChatList((prev) => [
        ...prev,
        {
          id: String(prev.length + 1),
          name,
          message: msg,
          timestamp: timeStr,
        },
      ]);
    }, 15000); // add a message every 15s

    return () => clearInterval(interval);
  }, []);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const finalName = userName.trim() || 'Guest User';
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: String(chatList.length + 1),
      name: finalName,
      message: typedMessage,
      timestamp: timeStr,
    };

    setChatList((prev) => [...prev, newMsg]);
    setTypedMessage('');
    if (!hasSetIdentity) {
      setHasSetIdentity(true);
    }
  };

  const submitPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerRequest.trim()) return;
    setSubmittingPrayer(true);
    setTimeout(() => {
      setSubmittingPrayer(false);
      setPrayerSubmitted(true);
    }, 1000);
  };

  // Helper to parse/convert watch URL or live URL to embed URL
  const getYoutubeEmbedUrl = (youtubeUrl: string) => {
    if (!youtubeUrl) return "https://www.youtube.com/embed/uEnVhRdDUBk?si=VQtnbJifKdptOzU6&autoplay=1";
    if (youtubeUrl.includes('youtube.com/embed/')) return youtubeUrl;
    
    const watchMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1`;
    }
    
    const liveMatch = youtubeUrl.match(/youtube\.com\/live\/([^&\s?]+)/);
    if (liveMatch && liveMatch[1]) {
      return `https://www.youtube.com/embed/${liveMatch[1]}?autoplay=1`;
    }

    return "https://www.youtube.com/embed/uEnVhRdDUBk?si=VQtnbJifKdptOzU6&autoplay=1";
  };

  const embedUrl = getYoutubeEmbedUrl(siteSettings?.youtube_url);

  return (
    <div className="min-h-screen bg-ksf-gray-bg pt-28 pb-16 sm:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
        
        {/* Banner header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-red-600 animate-pulse" />
            <div>
              <span className="font-accent text-bold-red text-xs font-black tracking-widest uppercase block">SUNDAY SERVICES BROADCAST</span>
              <h1 className="font-headlines text-3xl font-black text-primary-blue tracking-tight">KSF Live Sanctuary</h1>
            </div>
          </div>
          <div className="bg-white border border-slate-200 px-5 py-2.5 rounded-full shadow-sm flex items-center gap-3">
            <Users size={16} className="text-sky-blue" />
            <span className="font-accent font-bold text-xs text-slate-600 uppercase tracking-wider">
              148 Familes Watching Online
            </span>
          </div>
        </div>

        {/* Live Container Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Video Broadcast Area (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            <div className="bg-black rounded-3xl overflow-hidden aspect-video relative shadow-2xl border border-black/40 group">
              <iframe 
                className="w-full h-full"
                src={embedUrl} 
                title="KSF Live Worship Broadcast"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>

            {/* Broadcast info & interactive actions */}
            <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-lg shadow-slate-100/50">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="bg-sky-blue/10 text-sky-blue font-accent font-bold text-[9px] tracking-widest uppercase py-1 px-3 rounded-full">
                    SERMON SERIES: KINGDOM LIFE
                  </span>
                  <h2 className="font-headlines text-2xl font-black text-slate-800 mt-2">
                    Walking in Divine Purpose & Covenant Grace
                  </h2>
                  <p className="text-xs text-slate-400 font-accent font-bold mt-1 uppercase">
                    Speaker: Pastor David Maina • KSF Lead Pastor
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setIsPrayerModalOpen(true);
                      setPrayerSubmitted(false);
                      setPrayerRequest('');
                    }}
                    className="bg-primary-blue hover:bg-bold-red text-white font-accent font-bold text-[10px] tracking-widest uppercase px-5 py-3 rounded-xl transition-all shadow-md"
                  >
                    Request Prayer
                  </button>
                </div>
              </div>

              {/* Service broadcasting guide */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-accent text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">SERVICE 1</h4>
                  <p className="font-headlines text-sm font-black text-slate-800">8:00 AM — 10:00 AM</p>
                  <p className="text-xs font-body text-slate-500 mt-1">Praise, Worship & Foundational Word.</p>
                </div>
                <div className="border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
                  <h4 className="font-accent text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">SERVICE 2</h4>
                  <p className="font-headlines text-sm font-black text-slate-800">10:30 AM — 12:30 PM</p>
                  <p className="text-xs font-body text-slate-500 mt-1">Main gathering with deep discipleship preaching.</p>
                </div>
                <div className="border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
                  <h4 className="font-accent text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">EVENING GATHERING</h4>
                  <p className="font-headlines text-sm font-black text-slate-800">5:00 PM — 7:00 PM</p>
                  <p className="text-xs font-body text-slate-500 mt-1">Intimate prayer, prophetic worship, and testimony.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Chat Panel (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-2xl h-[450px] lg:h-auto min-h-[500px]">
            {/* Header */}
            <div className="bg-primary-blue text-white p-5 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <h3 className="font-headlines font-bold text-sm uppercase tracking-wider">Sanctuary Live Chat</h3>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span className="font-accent font-black text-[8px] text-emerald-400 tracking-wider">ONLINE</span>
              </div>
            </div>

            {/* Messages body */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4 custom-scrollbar bg-slate-50/50">
              {chatList.map((chat) => (
                <div key={chat.id} className="text-sm font-body leading-relaxed">
                  <div className="flex justify-between items-baseline gap-2 mb-0.5">
                    <span className={`font-headlines font-black text-xs ${chat.isStaff ? 'text-bold-red' : 'text-primary-blue'}`}>
                      {chat.name} {chat.isStaff && '⛪ (Pastoral Care)'}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">{chat.timestamp}</span>
                  </div>
                  <p className="text-slate-600 bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm text-xs leading-normal">
                    {chat.message}
                  </p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Footer Form */}
            <form onSubmit={handleSendChat} className="p-4 border-t border-slate-100 bg-white space-y-3">
              {!hasSetIdentity && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter your name to join chat..."
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-body focus:outline-none focus:border-primary-blue bg-slate-50"
                  />
                </div>
              )}
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={hasSetIdentity ? "Type your message..." : "Join chat as Guest..."}
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl text-xs font-body focus:outline-none focus:border-primary-blue bg-slate-50"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  className="absolute right-2 text-primary-blue hover:text-bold-red p-2 transition-colors duration-200"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

      {/* Prayer Request Modal Sheet */}
      <AnimatePresence>
        {isPrayerModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrayerModalOpen(false)}
              className="absolute inset-0 bg-[#001D4A]/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 sm:p-10 shadow-3xl text-[#001D4A] overflow-hidden z-10"
            >
              <button
                onClick={() => setIsPrayerModalOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center text-slate-700 transition-all active:scale-95"
              >
                ✕
              </button>

              {!prayerSubmitted ? (
                <div>
                  <span className="font-accent text-bold-red font-black tracking-widest text-[9px] uppercase mb-2 block">PASTORAL STANDING</span>
                  <h3 className="font-headlines text-2xl sm:text-3xl font-black mb-6">Submit Prayer Request</h3>
                  
                  <form onSubmit={submitPrayer} className="space-y-4">
                    <div>
                      <label className="font-accent text-[10px] font-black tracking-wider text-slate-500 uppercase mb-1.5 block">Your Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Christine Gakii"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 font-body text-sm focus:outline-none focus:border-primary-blue"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-accent text-[10px] font-black tracking-wider text-slate-500 uppercase mb-1.5 block">Prayer Request</label>
                      <textarea
                        rows={4}
                        value={prayerRequest}
                        onChange={(e) => setPrayerRequest(e.target.value)}
                        placeholder="Share details of your situation. Our prayer warriors stand in faith with you."
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 font-body text-sm focus:outline-none focus:border-primary-blue resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingPrayer}
                      className="w-full py-4 bg-primary-blue hover:bg-bold-red text-white font-accent font-black tracking-widest rounded-xl text-xs uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      {submittingPrayer ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        'SUBMIT TO ALtar'
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckCircle2 size={32} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-headlines text-2xl sm:text-3xl font-black mb-2">Request Placed</h3>
                  <p className="text-sm font-body text-slate-600 leading-relaxed max-w-xs mx-auto mb-8">
                    Your request has been placed on the altar of Kingdom Seekers Fellowship. Our pastors and prayer intercessors will stand with you this week!
                  </p>
                  <button
                    onClick={() => setIsPrayerModalOpen(false)}
                    className="bg-[#001D4A] hover:bg-bold-red text-white px-8 py-3 rounded-xl font-accent font-bold tracking-wider text-xs uppercase transition-all duration-300"
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
