import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';

interface PinGateProps {
  onSuccess: () => void;
  correctPin?: string;
}

export default function PinGate({ onSuccess, correctPin = '7777' }: PinGateProps) {
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === correctPin) {
      setIsError(false);
      onSuccess();
    } else {
      setIsError(true);
      setPin('');
      setAttempts(prev => prev + 1);
      setTimeout(() => setIsError(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#070F1F] flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Premium background gradients & shapes */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0D3875]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-bold-red/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Outer gold glow border card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] hover:border-white/15 rounded-3xl p-8 text-center relative z-10"
      >
        {/* Lock Icon Wrapper with gradient border */}
        <motion.div
          animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-2xl transition-all duration-300 ${
            isError 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
              : 'bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 text-sky-blue'
          }`}
        >
          <Lock size={38} className={isError ? 'animate-bounce' : ''} />
        </motion.div>

        <span className="font-accent font-black text-[10px] tracking-[6px] uppercase text-sky-blue">
          KSF KITALE PORTAL
        </span>
        <h2 className="font-headlines font-black text-2xl text-white mt-3 mb-3 tracking-tight">
          Security Verification
        </h2>
        <p className="font-body text-xs text-white/50 leading-relaxed mb-8 max-w-xs mx-auto">
          Please enter the authorized church access PIN to unlock the Analytics and Headcount Dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative max-w-xs mx-auto">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="••••"
              className="w-full text-center tracking-[1em] text-2xl py-3 rounded-2xl border border-white/10 focus:border-sky-blue focus:ring-1 focus:ring-sky-blue bg-white/[0.02] text-white font-bold placeholder:text-white/20 outline-none transition-all duration-300"
              maxLength={6}
              autoFocus
            />
          </div>

          {attempts > 0 && !isError && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-1.5 text-[11px] text-red-400 font-medium"
            >
              <ShieldAlert size={14} />
              <span>Incorrect PIN. Please try again.</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={pin.length < 4}
            className={`w-full max-w-xs mx-auto py-3.5 rounded-2xl font-accent font-black text-[11px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
              pin.length >= 4
                ? 'bg-sky-blue hover:bg-sky-blue/90 text-white shadow-sky-blue/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
            }`}
          >
            <span>Unlock Dashboard</span>
            <ArrowRight size={13} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
