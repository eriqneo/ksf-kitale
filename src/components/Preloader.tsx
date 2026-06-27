import React from 'react';
import { motion } from 'motion/react';

export default function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#070F1F] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#0D3875]/20 blur-[120px] pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-[#B49121]/5 blur-[100px] pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-lg z-10 space-y-8">
        
        {/* Animated Circular Logo Wrapper */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[#B49121]/30 bg-white p-2 shadow-2xl flex items-center justify-center"
        >
          <img 
            src="/KSF LOGO.jpg" 
            alt="KSF Logo" 
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/150/0d3875/ffffff?text=KSF';
            }}
          />
          {/* Subtle spinning glow border */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t-2 border-b-2 border-t-[#B49121] border-b-transparent pointer-events-none"
          />
        </motion.div>

        {/* Text Area */}
        <div className="space-y-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="font-headlines font-black text-2xl sm:text-3xl text-white leading-tight tracking-tight uppercase"
          >
            Welcome To <br />
            <span className="text-[#3B82F6] font-extrabold">Kingdom Seekers Fellowship Kitale</span>
          </motion.h1>

          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="font-accent font-black text-xs sm:text-sm text-[#B49121] tracking-[5px] uppercase"
          >
            Seek Ye First...
          </motion.p>
        </div>

        {/* Custom Premium Loader Dot Indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex gap-2.5 justify-center pt-2"
        >
          <div className="w-2.5 h-2.5 bg-[#CC1B1B] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2.5 h-2.5 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
          <div className="w-2.5 h-2.5 bg-[#B49121] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
        </motion.div>
      </div>
    </motion.div>
  );
}
