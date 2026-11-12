import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function ReviewsSection({ reviews = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [reviews.length]);

  if (reviews.length === 0) return null;

  const current = reviews[currentIndex];

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + reviews.length) % reviews.length);
  };

  return (
    <section id="reviews" className="py-24 sm:py-32 bg-[#1A110D] text-white relative overflow-hidden">
      
      {/* Background Decorative Gold Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-gold/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-gold/5 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-gold tracking-[0.3em] uppercase text-xs font-semibold">
              Words of Distinction
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal tracking-tight">
            Guest Testimonials
          </h2>
        </div>

        {/* Carousel Card */}
        <div className="relative bg-[#231713] rounded-3xl p-8 sm:p-14 border border-gold/30 shadow-2xl">
          
          <Quote className="w-12 h-12 text-gold/30 mb-6" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              {/* Rating Stars */}
              <div className="flex items-center gap-1 mb-6 text-gold">
                {[...Array(current.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold" />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl text-white font-normal leading-relaxed mb-8 italic">
                "{current.review}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-white/10">
                <div className="flex items-center gap-4">
                  {current.avatar && (
                    <img
                      src={current.avatar}
                      alt={current.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-gold/60"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-lg font-semibold text-white">
                        {current.name}
                      </h4>
                      {current.verified && (
                        <div className="flex items-center gap-1 text-[10px] text-gold uppercase tracking-wider font-semibold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified Guest</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-champagne-300/70">{current.title}</p>
                    {current.service && (
                      <p className="text-[11px] text-gold/80 mt-0.5 font-medium">
                        Treatment: {current.service}
                      </p>
                    )}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full border border-white/20 hover:border-gold text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Previous review"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full border border-white/20 hover:border-gold text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Next review"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === i ? 'w-8 bg-gold' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

