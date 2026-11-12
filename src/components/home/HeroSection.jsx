import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, ArrowDown, Award, Star, Compass } from 'lucide-react';

export default function HeroSection({ settings, onOpenBooking }) {
  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-[#1A110D]">
      
      {/* Background Image with Cinematic Slow Zoom */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2200&q=85')`,
        }}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 12, ease: "easeOut" }}
      >
        {/* Editorial Gradients & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A110D]/90 via-[#1A110D]/70 to-[#1A110D]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A110D] via-transparent to-[#1A110D]/60" />
      </motion.div>

      {/* Floating Decorative Gold Badges */}
      <motion.div
        className="hidden lg:flex absolute top-32 left-16 z-20 items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/40 backdrop-blur-md border border-gold/40 shadow-luxury"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
          <Award className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-champagne-300 font-medium">Recognized Atelier</p>
          <p className="text-xs font-serif text-white font-medium">Haute Beauté Award 2025</p>
        </div>
      </motion.div>

      <motion.div
        className="hidden lg:flex absolute bottom-36 right-16 z-20 items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/40 backdrop-blur-md border border-gold/40 shadow-luxury"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <div className="flex text-gold">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-gold" />
          ))}
        </div>
        <div>
          <p className="text-xs font-serif text-white font-medium">4.98 / 5.0 Rating</p>
          <p className="text-[10px] uppercase tracking-widest text-champagne-300">Over 3,400 VIP Guests</p>
        </div>
      </motion.div>

      {/* Center Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
        
        {/* Tagline / Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 backdrop-blur-sm mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
          <span className="text-gold tracking-[0.3em] uppercase text-xs font-medium">
            Private Luxury Suites & Haute Beauté
          </span>
        </motion.div>

        {/* Animated Main Heading Reveal */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-normal tracking-tight leading-[1.1] mb-6 drop-shadow-xl"
        >
          {settings?.heroHeadline || "Where Artistry Meets Pure Luxury"}
        </motion.h1>

        {/* Brand Narrative Excerpt */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-champagne-200/90 text-sm sm:text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed mb-10"
        >
          {settings?.heroSubheadline || "Experience world-class hair artistry, 24K gold facial rituals, and bespoke bridal transformations in private marble suites."}
        </motion.p>

        {/* Two CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
        >
          {/* CTA 1: Book Appointment */}
          <button
            onClick={() => onOpenBooking()}
            className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full bg-gradient-to-r from-gold via-gold-shimmer to-gold text-espresso-900 font-semibold text-xs sm:text-sm uppercase tracking-[0.25em] shadow-gold-glow hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Calendar className="w-4 h-4 text-espresso-900 group-hover:scale-110 transition-transform" />
            Book Appointment
          </button>

          {/* CTA 2: Explore Services */}
          <button
            onClick={scrollToServices}
            className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm uppercase tracking-[0.25em] border border-white/20 backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-gold" />
            Explore Services
          </button>
        </motion.div>

        {/* Animated Quick Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-white/10 max-w-4xl mx-auto"
        >
          <div>
            <p className="font-serif text-2xl sm:text-3xl text-gold font-medium">15k+</p>
            <p className="text-[11px] uppercase tracking-widest text-champagne-300/70 mt-1">Distinguished Guests</p>
          </div>
          <div>
            <p className="font-serif text-2xl sm:text-3xl text-gold font-medium">12+</p>
            <p className="text-[11px] uppercase tracking-widest text-champagne-300/70 mt-1">Master Aestheticians</p>
          </div>
          <div>
            <p className="font-serif text-2xl sm:text-3xl text-gold font-medium">99.4%</p>
            <p className="text-[11px] uppercase tracking-widest text-champagne-300/70 mt-1">Client Satisfaction</p>
          </div>
          <div>
            <p className="font-serif text-2xl sm:text-3xl text-gold font-medium">8</p>
            <p className="text-[11px] uppercase tracking-widest text-champagne-300/70 mt-1">Private Suites</p>
          </div>
        </motion.div>

      </div>

      {/* Elegant Scrolling Indicator */}
      <motion.div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        onClick={scrollToServices}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-champagne-300/80 mb-2">
          Discover
        </span>
        <div className="w-5 h-8 rounded-full border border-gold/40 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-gold animate-bounce" />
        </div>
      </motion.div>

    </section>
  );
}

