import React from 'react';
import { motion } from 'motion/react';

export default function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[1000] bg-ksf-white flex flex-col items-center justify-center"
    >
      <div className="relative">
        <h1 className="text-6xl font-headlines font-black text-primary-blue pulsing-ksf tracking-tighter">KSF</h1>
        <div className="mt-4 flex gap-1">
          <div className="w-1.5 h-1.5 bg-bold-red rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-1.5 h-1.5 bg-bold-red rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-1.5 h-1.5 bg-bold-red rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </motion.div>
  );
}
