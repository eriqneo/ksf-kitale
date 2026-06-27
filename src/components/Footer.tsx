import React from 'react';
import { Facebook, Youtube, Instagram, MessageCircle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePocketBase } from '../context/PocketBaseContext';

export default function Footer() {
  const { siteSettings } = usePocketBase();
  return (
    <footer className="relative bg-ksf-footer-bg text-ksf-white pt-24">
      {/* Separator Gradient */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-ksf-white to-transparent opacity-10"></div>
      
      <div className="container mx-auto px-6 lg:px-12 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link to="/" className="group flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-2 border-ksf-white/20 bg-ksf-white shadow-md group-hover:border-bold-red transition-all duration-300">
                <img 
                  src="/KSF LOGO.jpg" 
                  alt="KSF Logo" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/150/0d3875/ffffff?text=KSF';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-headlines font-black text-lg text-ksf-white tracking-tight leading-none group-hover:text-bold-red transition-colors duration-300">
                  Kingdom Seekers
                </span>
                <span className="font-accent font-bold tracking-[0.2em] text-[9px] text-sky-blue uppercase">
                  Fellowship Kitale
                </span>
              </div>
            </Link>
            <p className="text-ksf-white/60 font-body italic leading-relaxed max-w-xs">
              {siteSettings?.tagline || "Seek Ye First the Kingdom of God"} — {siteSettings?.scripture_ref || "Matthew 6:33"}
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, href: siteSettings?.facebook_url || "#" },
                { Icon: Youtube, href: siteSettings?.youtube_url || "https://www.youtube.com/@KsfKitale/streams" },
                { Icon: Instagram, href: siteSettings?.instagram_url || "#" },
                { Icon: MessageCircle, href: siteSettings?.whatsapp_url || "#" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target={social.href && social.href !== "#" ? "_blank" : undefined}
                  rel={social.href && social.href !== "#" ? "noopener noreferrer" : undefined}
                  className="w-10 h-10 border border-ksf-white/10 rounded-ksf-full flex items-center justify-center hover:bg-bold-red hover:border-bold-red transition-all duration-300"
                >
                  <social.Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-accent text-sky-blue text-xs font-bold tracking-[0.2em] uppercase mb-8">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'Home', href: '/' },
                { label: 'Who We Are', href: '/#who-we-are' },
                { label: 'Events', href: '/#events' },
                { label: 'Sermons', href: '/sermons' },
                { label: 'Prayer Points', href: '/prayer-points' },
                { label: 'Give', href: '/give' },
                { label: 'Prayer Requests', href: '/#prayer' }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-ksf-white/60 font-body hover:text-bold-red transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Ministries */}
          <div>
            <h4 className="font-accent text-sky-blue text-xs font-bold tracking-[0.2em] uppercase mb-8">
              Ministries
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'KSF Kids', href: '/ministries/kids' },
                { label: 'Youth', href: '/ministries/youth' },
                { label: "Women's Fellowship", href: '/ministries/women' },
                { label: "Men's Brotherhood", href: '/ministries/men' },
                { label: 'Home Fellowship', href: '/ministries/home-fellowship' },
                { label: 'Global Missions', href: '/about/story#strategies' }
              ].map((min) => (
                <li key={min.label}>
                  <Link to={min.href} className="text-ksf-white/60 font-body hover:text-bold-red transition-colors duration-300">
                    {min.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Service Times */}
          <div>
            <h4 className="font-accent text-sky-blue text-xs font-bold tracking-[0.2em] uppercase mb-8">
              Sunday Services
            </h4>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center group">
                  <span className="text-ksf-white/40 text-xs font-accent uppercase tracking-widest">First Service</span>
                  <span className="text-ksf-white font-headlines font-bold">8:00 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ksf-white/40 text-xs font-accent uppercase tracking-widest">Second Service</span>
                  <span className="text-ksf-white font-headlines font-bold">10:30 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ksf-white/40 text-xs font-accent uppercase tracking-widest">Evening Service</span>
                  <span className="text-ksf-white font-headlines font-bold">5:00 PM</span>
                </div>
              </div>
              
              <div className="pt-6 border-t border-ksf-white/10 flex items-start gap-3">
                <MapPin size={18} className="text-sky-blue mt-1" />
                <p className="text-ksf-white/60 font-body">{siteSettings?.location || "Kitale, Kenya"}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-ksf-white/5 py-8 bg-[#040A15]">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <p className="text-ksf-white/30 text-xs font-body">
              &copy; {new Date().getFullYear()} Kingdom Seekers Fellowship. All Rights Reserved.
            </p>
            <p className="text-ksf-white/20 text-[10px] uppercase font-accent tracking-widest">
              Made with ❤️ for God&apos;s Glory
            </p>
          </div>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Use'].map((item) => (
              <a key={item} href="#" className="text-ksf-white/30 text-xs font-body hover:text-ksf-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
