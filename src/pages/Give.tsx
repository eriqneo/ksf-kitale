import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Landmark, Smartphone, ShieldCheck, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';
import { usePocketBase } from '../context/PocketBaseContext';

export default function Give() {
  const { pages, siteSettings, getImageUrl } = usePocketBase();
  const page = pages['give'];

  const [giveAmount, setGiveAmount] = useState('1000');
  const [customAmount, setCustomAmount] = useState('');
  const [givingType, setGivingType] = useState('Tithe');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleGiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const currentAmount = giveAmount === 'custom' ? customAmount : giveAmount;
  const heroImage = getImageUrl(page, 'hero_image', 'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=1920&q=80');

  return (
    <div className="min-h-screen bg-ksf-white">
      {/* Hero Header */}
      <div className="relative pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 pb-0">
        <section className="relative h-[45vh] sm:h-[50vh] w-full rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden flex items-end pb-12 sm:pb-16 lg:pb-20">
          <div className="absolute inset-0 z-0 scale-105 animate-slow-zoom">
            <img 
              src={heroImage} 
              alt={page?.title || "Generosity & Giving"} 
              className="w-full h-full object-cover brightness-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-20" />
          </div>

          <div className="container mx-auto px-8 sm:px-16 md:px-24 relative z-30">
            <div className="max-w-4xl text-ksf-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="font-accent font-black text-bold-red text-[10px] sm:text-xs tracking-[6px] uppercase mb-4 block">
                  {page?.hero_subtitle || 'GENEROSITY'}
                </span>
                <h1 className="font-headlines font-black text-4xl sm:text-6xl md:text-7xl leading-[0.9] mb-4 tracking-tighter">
                  {page?.hero_heading || 'Support KSF Ministries'}
                </h1>
                <p className="font-body text-base sm:text-lg md:text-xl opacity-85 font-medium max-w-xl leading-relaxed">
                  {page?.hero_description || '"Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver." — 2 Corinthians 9:7'}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Interactive Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 sm:p-12 shadow-xl shadow-slate-100/50">
              {!submitted ? (
                <form onSubmit={handleGiveSubmit} className="space-y-8">
                  {/* Giving Category */}
                  <div>
                    <label className="font-accent text-[11px] font-black tracking-widest text-slate-400 uppercase mb-4 block">
                      1. SELECT GIVING CATEGORY
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['Tithe', 'Offering', 'Missions', 'Benevolence'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setGivingType(cat)}
                          className={`py-3.5 px-4 rounded-xl font-accent font-bold text-xs tracking-wider uppercase transition-all duration-200 border-2 text-center ${
                            givingType === cat
                              ? 'bg-primary-blue text-white border-primary-blue shadow-md'
                              : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100 hover:border-slate-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Giving Amount */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="font-accent text-[11px] font-black tracking-widest text-slate-400 uppercase block">
                        2. SELECT AMOUNT (KES)
                      </label>
                      {giveAmount !== 'custom' && (
                        <span className="font-headlines text-lg font-black text-primary-blue">
                          KSh {parseInt(giveAmount).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                      {['500', '1000', '2500', '5000', '10000'].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setGiveAmount(amt);
                            setCustomAmount('');
                          }}
                          className={`py-3 rounded-xl font-body text-sm font-bold transition-all duration-200 border-2 text-center ${
                            giveAmount === amt
                              ? 'bg-primary-blue text-white border-primary-blue shadow-md'
                              : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                          }`}
                        >
                          {parseInt(amt).toLocaleString()}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setGiveAmount('custom')}
                        className={`col-span-3 sm:col-span-5 py-3 rounded-xl font-accent text-xs font-bold tracking-wider uppercase transition-all border-2 text-center ${
                          giveAmount === 'custom'
                            ? 'bg-primary-blue text-white border-primary-blue shadow-md'
                            : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                        }`}
                      >
                        Enter Custom Amount
                      </button>
                    </div>

                    <AnimatePresence>
                      {giveAmount === 'custom' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-4"
                        >
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body font-bold text-slate-400">KSh</span>
                            <input
                              type="number"
                              min="1"
                              placeholder="Enter custom amount"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl font-body font-bold focus:outline-none focus:border-primary-blue bg-slate-50"
                              required
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Donor Info */}
                  <div className="space-y-4">
                    <label className="font-accent text-[11px] font-black tracking-widest text-slate-400 uppercase block">
                      3. YOUR DETAILS (OPTIONAL)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl font-body text-sm focus:outline-none focus:border-primary-blue bg-slate-50"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl font-body text-sm focus:outline-none focus:border-primary-blue bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div>
                    <label className="font-accent text-[11px] font-black tracking-widest text-slate-400 uppercase mb-4 block">
                      4. SELECT PREFERRED WAY TO GIVE
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('mpesa')}
                        className={`p-5 rounded-2xl border-2 text-left flex items-start gap-4 transition-all ${
                          paymentMethod === 'mpesa'
                            ? 'bg-emerald-50/30 border-emerald-500 shadow-md'
                            : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                        }`}
                      >
                        <Smartphone className={`w-8 h-8 ${paymentMethod === 'mpesa' ? 'text-emerald-500' : 'text-slate-400'}`} />
                        <div>
                          <p className="font-headlines font-black text-sm text-slate-800">M-PESA / MOBILE MONEY</p>
                          <p className="text-xs text-slate-500 font-body mt-1">Pay via Safaricom M-Pesa Paybill or Sim Toolkit immediately.</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank')}
                        className={`p-5 rounded-2xl border-2 text-left flex items-start gap-4 transition-all ${
                          paymentMethod === 'bank'
                            ? 'bg-blue-50/30 border-primary-blue shadow-md'
                            : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                        }`}
                      >
                        <Landmark className={`w-8 h-8 ${paymentMethod === 'bank' ? 'text-primary-blue' : 'text-slate-400'}`} />
                        <div>
                          <p className="font-headlines font-black text-sm text-slate-800">BANK / WIRE TRANSFER</p>
                          <p className="text-xs text-slate-500 font-body mt-1">Direct deposits to Kingdom Seekers Fellowship church accounts.</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || (giveAmount === 'custom' && !customAmount)}
                    className="w-full py-4.5 bg-primary-blue hover:bg-bold-red text-white font-accent font-black tracking-widest rounded-xl text-xs uppercase transition-all duration-300 shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Heart size={16} fill="currentColor" />
                        GIVE KSh {currentAmount ? parseInt(currentAmount).toLocaleString() : '0'} NOW
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Success Screen */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20">
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-headlines text-3xl font-black text-slate-800 mb-4">Generous Contribution Received!</h3>
                  <p className="text-sm font-body text-slate-600 leading-relaxed max-w-md mx-auto mb-8">
                    Thank you {donorName || 'faithful brother/sister'} for your seed of <span className="font-extrabold text-primary-blue">KSh {parseInt(currentAmount).toLocaleString()}</span> towards KSF {givingType}. Your support allows us to continue making disciples and serving our community!
                  </p>
                  
                  {paymentMethod === 'mpesa' ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl max-w-md mx-auto mb-8 text-left space-y-3">
                      <span className="font-accent text-emerald-800 font-bold text-[10px] tracking-wider uppercase block">FAST CHECKOUT DETAILS</span>
                      <p className="font-body text-xs text-slate-600 leading-relaxed">
                        To complete your M-Pesa transaction, please use the following credentials on your mobile device:
                      </p>
                      <div className="pt-2 space-y-2">
                        <div className="flex justify-between text-xs font-accent font-bold">
                          <span className="text-slate-500">PAYBILL NO:</span>
                          <span className="text-slate-800">{siteSettings?.mpesa_paybill || '222111'} (KSF Church)</span>
                        </div>
                        <div className="flex justify-between text-xs font-accent font-bold">
                          <span className="text-slate-500">ACCOUNT NAME:</span>
                          <span className="text-slate-800">{givingType.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between text-xs font-accent font-bold">
                          <span className="text-slate-500">AMOUNT:</span>
                          <span className="text-emerald-700">KSh {parseInt(currentAmount).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl max-w-md mx-auto mb-8 text-left space-y-3">
                      <span className="font-accent text-primary-blue font-bold text-[10px] tracking-wider uppercase block">BANK DEPOSIT CREDENTIALS</span>
                      <p className="font-body text-xs text-slate-600 leading-relaxed">
                        Please wire the funds to our primary church account:
                      </p>
                      <div className="pt-2 space-y-2">
                        <div className="flex justify-between text-xs font-accent font-bold">
                          <span className="text-slate-500">BANK:</span>
                          <span className="text-slate-800">{siteSettings?.bank_name || 'Co-operative Bank of Kenya'}</span>
                        </div>
                        <div className="flex justify-between text-xs font-accent font-bold">
                          <span className="text-slate-500">BRANCH:</span>
                          <span className="text-slate-800">{siteSettings?.bank_branch || 'Kitale Branch'}</span>
                        </div>
                        <div className="flex justify-between text-xs font-accent font-bold">
                          <span className="text-slate-500">A/C NAME:</span>
                          <span className="text-slate-800">{siteSettings?.bank_account_name || 'Kingdom Seekers Fellowship'}</span>
                        </div>
                        <div className="flex justify-between text-xs font-accent font-bold">
                          <span className="text-slate-500">A/C NUMBER:</span>
                          <span className="text-slate-800">{siteSettings?.bank_account_number || '01129334582900'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setDonorName('');
                      setDonorEmail('');
                      setCustomAmount('');
                      setGiveAmount('1000');
                    }}
                    className="bg-primary-blue hover:bg-bold-red text-white font-accent font-bold text-xs tracking-widest uppercase px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Give Again
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column: Information (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Quick M-Pesa reference */}
            <div className="bg-emerald-600/5 border border-emerald-600/10 rounded-[2rem] p-8 sm:p-10 text-slate-800">
              <div className="flex items-center gap-3 text-emerald-700 mb-6">
                <Smartphone size={24} />
                <h4 className="font-headlines font-black text-xl">Quick M-Pesa Giving</h4>
              </div>
              <p className="font-body text-sm text-slate-600 leading-relaxed mb-6">
                You can give directly at any time from your phone. Send tithes, offerings, or benevolence seeds using our official church paybill number:
              </p>
              
              <div className="space-y-4">
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[10px] font-accent text-slate-400 font-extrabold uppercase tracking-wider block">M-PESA PAYBILL NO.</span>
                    <span className="font-mono text-lg font-black text-slate-800">{siteSettings?.mpesa_paybill || '222111'}</span>
                  </div>
                  <button 
                    onClick={() => handleCopy(siteSettings?.mpesa_paybill || '222111', 'paybill')}
                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center transition-all"
                  >
                    {copiedText === 'paybill' ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[10px] font-accent text-slate-400 font-extrabold uppercase tracking-wider block">ACCOUNT NAME</span>
                    <span className="font-body text-sm font-black text-slate-800">TITHE / OFFERING / MISSIONS</span>
                  </div>
                  <button 
                    onClick={() => handleCopy('TITHE', 'account')}
                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center transition-all"
                  >
                    {copiedText === 'account' ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Bank details info card */}
            <div className="bg-blue-600/5 border border-blue-600/10 rounded-[2rem] p-8 sm:p-10 text-slate-800">
              <div className="flex items-center gap-3 text-primary-blue mb-6">
                <Landmark size={24} />
                <h4 className="font-headlines font-black text-xl">Bank Wire Transfers</h4>
              </div>
              <p className="font-body text-sm text-slate-600 leading-relaxed mb-6">
                For larger contributions, monthly commitments, or standing order donations, please wire your seed directly to our bank account:
              </p>

              <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm text-sm">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-body font-bold">Bank Name:</span>
                  <span className="text-slate-800 font-headlines font-bold">{siteSettings?.bank_name || 'Co-operative Bank of Kenya'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-body font-bold">Branch Name:</span>
                  <span className="text-slate-800 font-headlines font-bold">{siteSettings?.bank_branch || 'Kitale Branch'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-body font-bold">Account Name:</span>
                  <span className="text-slate-800 font-headlines font-bold">{siteSettings?.bank_account_name || 'Kingdom Seekers Fellowship'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-body font-bold">Account No:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-800 font-mono font-bold">{siteSettings?.bank_account_number || '01129334582900'}</span>
                    <button 
                      onClick={() => handleCopy(siteSettings?.bank_account_number || '01129334582900', 'bank_ac')}
                      className="text-slate-400 hover:text-primary-blue transition-colors p-1"
                    >
                      {copiedText === 'bank_ac' ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Generosity & Trust promise */}
            <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 sm:p-10 flex gap-4">
              <ShieldCheck className="text-primary-blue shrink-0 w-8 h-8 mt-1" />
              <div>
                <h4 className="font-headlines font-black text-base text-slate-800 mb-2">Our Financial Commitment</h4>
                <p className="font-body text-xs text-slate-500 leading-relaxed">
                  We believe in complete transparency and biblical stewardship of every seed planted in KSF. Regular audits and reports are provided to our church council and membership bodies to ensure funds are deployed only for the advancement of God&apos;s Kingdom.
                </p>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
