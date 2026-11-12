import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Tag, Copy, Check, Clock, Calendar, ArrowRight } from 'lucide-react';

// Countdown Timer Subcomponent for offers with expiryDate
function OfferCountdown({ expiryDate }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!expiryDate) return;

    const calculate = () => {
      const target = new Date(`${expiryDate}T23:59:59`).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [expiryDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-gold-deep font-mono font-medium bg-gold/10 px-3 py-1.5 rounded-full border border-gold/30">
      <Clock className="w-3.5 h-3.5" />
      <span>Expires in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
    </div>
  );
}

export default function OffersSection({ offers = [], onSelectOfferForBooking }) {
  const [copiedCode, setCopiedCode] = useState(null);

  const activeOffers = offers.filter(o => o.active !== false);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  if (activeOffers.length === 0) return null;

  return (
    <section id="offers" className="py-24 sm:py-32 bg-[#1A110D] text-white relative overflow-hidden">
      
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-rosegold-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-gold animate-pulse" />
            <span className="text-gold tracking-[0.3em] uppercase text-xs font-semibold">
              Privilege Rewards & Promotions
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal tracking-tight mb-4">
            Special Offers & Concessions
          </h2>
          <p className="text-champagne-300/80 text-sm sm:text-base font-light">
            Enjoy our exclusive seasonal courtesies and welcome rewards. Apply the coupon code during your reservation.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeOffers.map((offer, idx) => (
            <motion.div
              key={offer.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-[#231713] rounded-3xl p-6 sm:p-8 border border-gold/30 hover:border-gold/60 shadow-luxury transition-all duration-300 flex flex-col justify-between relative group"
            >
              {/* Badge if exists */}
              {offer.badge && (
                <div className="absolute -top-3 left-6">
                  <span className="px-3.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold bg-gradient-to-r from-gold via-gold-shimmer to-gold text-espresso-900 shadow-md">
                    {offer.badge}
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-baseline justify-between gap-4 mt-2 mb-4">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-gold">
                    {offer.discountType === 'percentage' 
                      ? `${offer.discountValue}% OFF` 
                      : `$${offer.discountValue} OFF`}
                  </span>
                  {offer.minSpend > 0 && (
                    <span className="text-[11px] text-champagne-400 font-medium">
                      Min spend: ${offer.minSpend}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl font-semibold text-white mb-2">
                  {offer.title}
                </h3>

                <p className="text-champagne-300/70 text-xs sm:text-sm leading-relaxed mb-6">
                  {offer.description}
                </p>

                {/* Countdown Timer (Only rendered when expiry date exists) */}
                {offer.expiryDate && (
                  <div className="mb-6">
                    <OfferCountdown expiryDate={offer.expiryDate} />
                  </div>
                )}
              </div>

              {/* Coupon Code Strip & Apply Action */}
              <div className="pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-dashed border-gold/50">
                  <div className="flex items-center gap-2 pl-2">
                    <Tag className="w-3.5 h-3.5 text-gold" />
                    <span className="font-mono text-sm uppercase tracking-wider font-bold text-gold">
                      {offer.code}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(offer.code)}
                    className="px-3 py-1.5 rounded-lg bg-gold/20 hover:bg-gold text-gold hover:text-espresso-900 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                    title="Click to copy coupon code"
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check className="w-3 h-3" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => onSelectOfferForBooking(offer)}
                  className="w-full py-3 rounded-full bg-gold text-espresso-900 hover:brightness-110 font-semibold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Apply to Reservation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

