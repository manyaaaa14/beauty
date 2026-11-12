import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, KeyRound, ChevronRight } from 'lucide-react';

export default function ParlourDoorIntro({ onComplete, forceShow = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(true);

  // Check if user already saw the intro in this session
  useEffect(() => {
    if (!forceShow) {
      const seen = sessionStorage.getItem('lelixir_door_intro_seen');
      if (seen) {
        setShowContent(false);
        onComplete?.();
      }
    }
  }, [forceShow, onComplete]);

  const handleOpenDoors = () => {
    if (isAnimating || isOpen) return;
    setIsAnimating(true);
    setIsOpen(true);

    try {
      sessionStorage.setItem('lelixir_door_intro_seen', 'true');
    } catch (e) {
      // ignore storage error in private browsing
    }

    // Sequence timing:
    // 0s: Doors start swinging open + light explodes
    // 1.5s: Letters reveal in the center
    // 2.8s: Camera glides forward through into the parlour
    // 3.6s: Complete transition into homepage
    setTimeout(() => {
      setShowContent(false);
      onComplete?.();
    }, 3600);
  };

  const handleSkip = () => {
    sessionStorage.setItem('lelixir_door_intro_seen', 'true');
    setShowContent(false);
    onComplete?.();
  };

  if (!showContent) return null;

  const brandLetters = "GLAMMORA".split('');

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#120B08] select-none"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      >
        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 z-50 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest text-[#E8DCCB]/80 hover:text-white bg-black/40 hover:bg-black/70 border border-gold/30 backdrop-blur-md transition-all duration-300"
        >
          Skip Intro <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* 3D Scene Wrapper */}
        <div 
          className="relative w-full h-full flex items-center justify-center"
          style={{ perspective: '1400px' }}
        >
          {/* INTERIOR SANCTUARY (Visible when doors swing open) */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={isOpen ? { scale: 1.15, opacity: 1 } : { scale: 0.85, opacity: 0 }}
            transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Interior Parlour Backdrop Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center filter brightness-95"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=85')`,
              }}
            >
              {/* Golden Ambient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A110D]/90 via-[#231713]/40 to-[#1A110D]/85 mix-blend-multiply" />
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#1A110D]/50 to-[#120B08]" />
            </div>

            {/* Radiant Volumetric Center Light */}
            <motion.div 
              className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-gold/40 via-champagne-300/30 to-rosegold-300/20 blur-[100px] pointer-events-none"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={isOpen ? { opacity: 1, scale: [0.5, 2] } : { opacity: 0 }}
              transition={{ duration: 2.8, ease: "easeOut" }}
            />

            {/* Revealed Brand Identity in Center */}
            <div className="relative z-20 flex flex-col items-center text-center px-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="flex items-center gap-2 mb-3"
              >
                <div className="w-8 h-[1px] bg-gold" />
                <span className="text-gold tracking-[0.35em] text-xs uppercase font-medium">
                  Sanctuary of Haute Beauté
                </span>
                <div className="w-8 h-[1px] bg-gold" />
              </motion.div>

              {/* Letter by Letter Brand Reveal */}
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#FAF7F2] font-semibold tracking-wider flex justify-center drop-shadow-2xl">
                {brandLetters.map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
                    animate={isOpen ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                    transition={{
                      delay: 1.3 + index * 0.08,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0 }}
                transition={{ delay: 2.1, duration: 0.8 }}
                className="mt-4 text-champagne-200/90 tracking-[0.25em] text-xs md:text-sm uppercase max-w-md font-light"
              >
                Beauty • Elegance • Confidence
              </motion.p>
            </div>
          </motion.div>

          {/* DOORS CONTAINER */}
          <div className="relative w-full h-full flex">
            {/* LEFT DOOR */}
            <motion.div
              className="relative w-1/2 h-full origin-left overflow-hidden shadow-2xl"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'left center',
                background: 'linear-gradient(135deg, #2D1E18 0%, #1F1511 60%, #150D0A 100%)',
              }}
              animate={isOpen ? {
                rotateY: -105,
                transition: { duration: 2.4, ease: [0.4, 0, 0.2, 1] }
              } : { rotateY: 0 }}
            >
              {/* Door Wood Texture / Shading */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#C8AE90_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />

              {/* Classical Architectural Door Panels */}
              <div className="absolute inset-6 md:inset-12 flex flex-col justify-between pointer-events-none">
                {/* Upper Arch Panel */}
                <div className="w-full h-[40%] rounded-t-full border-2 border-gold/40 p-3 md:p-5 relative shadow-inner bg-gradient-to-b from-[#3D2B24]/40 to-transparent">
                  <div className="w-full h-full rounded-t-full border border-gold/25 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-gold/30 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-gold/60" />
                    </div>
                  </div>
                </div>

                {/* Lower Rectangular Panel */}
                <div className="w-full h-[48%] border-2 border-gold/40 p-3 md:p-5 relative shadow-inner bg-gradient-to-t from-[#3D2B24]/40 to-transparent">
                  <div className="w-full h-full border border-gold/25 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 border border-gold/20 rotate-45" />
                  </div>
                </div>
              </div>

              {/* Left Door Gold Handle */}
              <div className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 flex items-center z-30">
                <div className="w-3 md:w-5 h-28 md:h-44 rounded-full bg-gradient-to-b from-[#FAF7F2] via-[#D4AF37] to-[#8C6514] shadow-2xl border border-gold/80 flex items-center justify-center">
                  <div className="w-1 md:w-1.5 h-20 md:h-32 bg-white/40 rounded-full" />
                </div>
                {/* Escutcheon plate */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 md:w-6 h-8 md:h-12 bg-gold/90 rounded border border-gold-light shadow-md -z-10" />
              </div>

              {/* Edge Brass Trim */}
              <div className="absolute top-0 right-0 w-1 md:w-1.5 h-full bg-gradient-to-b from-gold-light via-gold to-gold-dark shadow-lg" />
            </motion.div>

            {/* RIGHT DOOR */}
            <motion.div
              className="relative w-1/2 h-full origin-right overflow-hidden shadow-2xl"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'right center',
                background: 'linear-gradient(225deg, #2D1E18 0%, #1F1511 60%, #150D0A 100%)',
              }}
              animate={isOpen ? {
                rotateY: 105,
                transition: { duration: 2.4, ease: [0.4, 0, 0.2, 1] }
              } : { rotateY: 0 }}
            >
              {/* Door Wood Texture / Shading */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#C8AE90_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-transparent to-black/30" />

              {/* Classical Architectural Door Panels */}
              <div className="absolute inset-6 md:inset-12 flex flex-col justify-between pointer-events-none">
                {/* Upper Arch Panel */}
                <div className="w-full h-[40%] rounded-t-full border-2 border-gold/40 p-3 md:p-5 relative shadow-inner bg-gradient-to-b from-[#3D2B24]/40 to-transparent">
                  <div className="w-full h-full rounded-t-full border border-gold/25 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-gold/30 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-gold/60" />
                    </div>
                  </div>
                </div>

                {/* Lower Rectangular Panel */}
                <div className="w-full h-[48%] border-2 border-gold/40 p-3 md:p-5 relative shadow-inner bg-gradient-to-t from-[#3D2B24]/40 to-transparent">
                  <div className="w-full h-full border border-gold/25 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 border border-gold/20 rotate-45" />
                  </div>
                </div>
              </div>

              {/* Right Door Gold Handle */}
              <div className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 flex items-center z-30">
                <div className="w-3 md:w-5 h-28 md:h-44 rounded-full bg-gradient-to-b from-[#FAF7F2] via-[#D4AF37] to-[#8C6514] shadow-2xl border border-gold/80 flex items-center justify-center">
                  <div className="w-1 md:w-1.5 h-20 md:h-32 bg-white/40 rounded-full" />
                </div>
                {/* Escutcheon plate */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 md:w-6 h-8 md:h-12 bg-gold/90 rounded border border-gold-light shadow-md -z-10" />
              </div>

              {/* Edge Brass Trim */}
              <div className="absolute top-0 left-0 w-1 md:w-1.5 h-full bg-gradient-to-b from-gold-light via-gold to-gold-dark shadow-lg" />
            </motion.div>

            {/* LIGHT SEAM IN THE CENTER CRACK (BEFORE OPENING) */}
            {!isOpen && (
              <motion.div 
                className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-full bg-gold shadow-[0_0_20px_#D4AF37] pointer-events-none z-30"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>

          {/* INTERACTIVE CALL TO ACTION (BEFORE OPENING) */}
          {!isOpen && (
            <motion.div 
              className="absolute z-40 flex flex-col items-center text-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {/* Emblem Logo */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-gold/50 bg-[#231713]/90 backdrop-blur-md flex items-center justify-center mb-6 shadow-gold-glow">
                <span className="font-serif text-2xl md:text-3xl text-gold font-light tracking-widest">
                  É
                </span>
              </div>

              {/* Tagline Instruction */}
              <p className="text-champagne-300 font-serif italic text-lg md:text-2xl mb-2 drop-shadow-md">
                Your beauty experience begins here.
              </p>
              <p className="text-champagne-400/80 text-xs md:text-sm tracking-[0.25em] uppercase mb-8">
                GLAMMORA
              </p>

              {/* OPEN THE DOORS BUTTON */}
              <motion.button
                onClick={handleOpenDoors}
                disabled={isAnimating}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-8 md:px-12 py-4 md:py-5 rounded-full overflow-hidden shadow-2xl transition-all duration-300 border border-gold/60 cursor-pointer"
              >
                {/* Button background with gold gradient & glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#2D1E18] via-[#483726] to-[#2D1E18] transition-all group-hover:brightness-125" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Button label */}
                <span className="relative z-10 flex items-center gap-3 text-gold-light group-hover:text-white font-medium text-xs md:text-sm tracking-[0.3em] uppercase">
                  <KeyRound className="w-4 h-4 text-gold group-hover:rotate-45 transition-transform duration-500" />
                  OPEN THE DOORS
                  <Sparkles className="w-4 h-4 text-gold" />
                </span>
              </motion.button>

              <span className="mt-4 text-[11px] text-champagne-400/60 tracking-wider">
                Click to unlock
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

