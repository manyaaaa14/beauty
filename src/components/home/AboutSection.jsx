import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, Award, Shield, CheckCircle2, X } from 'lucide-react';

const EXPERTS = [
  {
    name: 'Claudette Moreau',
    role: 'Creative Director & Master Colorist',
    experience: '16 Years Experience (Paris & Milan)',
    bio: 'Trained at the prestigious L’Académie de Beauté in Paris. Known for effortless dimensional balayage and couture hair architectural styling.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Dr. Valérie Laurent',
    role: 'Lead Dermal Aesthetician',
    experience: '14 Years Clinical & Aesthetic Practice',
    bio: 'Pioneered cellular micro-infusion techniques and bespoke 24K gold regenerative protocols with Swiss peptide compounds.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Seraphina Rossi',
    role: 'High-Fashion Bridal Artist',
    experience: '12 Years Editorial & Celebrity Artistry',
    bio: 'Master of radiant red carpet complexions and waterproof airbrush bridal transformations for high-profile weddings.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  }
];

export default function AboutSection({ settings, onOpenBooking }) {
  const [showExpertsModal, setShowExpertsModal] = useState(false);

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#FAF7F2] relative overflow-hidden">
      
      {/* Decorative background watermark */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-[12vw] text-champagne-300/10 pointer-events-none select-none">
        PARIS
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Creative Editorial Imagery with Overlapping Frames */}
          <div className="lg:col-span-6 relative">
            
            {/* Primary Main Image */}
            <motion.div 
              className="relative rounded-2xl overflow-hidden shadow-luxury border-2 border-champagne-300/60 max-w-md mx-auto lg:max-w-none"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80" 
                alt="Luxury Parlour Treatment" 
                className="w-full h-[460px] sm:h-[540px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-gold tracking-[0.25em] uppercase text-[10px] font-semibold">
                  Private Sanctuary
                </span>
                <p className="font-serif text-lg font-medium">Bespoke Suite Consultations</p>
              </div>
            </motion.div>

            {/* Overlapping Secondary Image */}
            <motion.div 
              className="hidden sm:block absolute -bottom-10 -right-6 lg:-right-10 w-56 h-64 rounded-xl overflow-hidden shadow-2xl border-4 border-[#FAF7F2] z-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80" 
                alt="24K Gold Facial Treatment" 
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Gold Seal Badge */}
            <div className="absolute -top-6 -left-4 sm:-left-6 w-24 h-24 rounded-full bg-[#231713] text-gold p-2 border-2 border-gold flex flex-col items-center justify-center text-center shadow-gold-glow z-20">
              <Sparkles className="w-4 h-4 text-gold mb-0.5" />
              <span className="text-[9px] uppercase tracking-widest font-bold">EST. 2018</span>
              <span className="text-[8px] text-champagne-300">HAUTE SALON</span>
            </div>
          </div>

          {/* Right Column: Editorial Text & Narrative */}
          <div className="lg:col-span-6 flex flex-col">
            
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-[1.5px] bg-gold-deep" />
              <span className="text-gold-deep tracking-[0.3em] uppercase text-xs font-semibold">
                L’Atelier & Brand Philosophy
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-espresso-900 font-normal leading-tight mb-6">
              A Refined Sanctuary Where Elegance Becomes Second Nature
            </h2>

            <p className="text-espresso-600 text-sm sm:text-base leading-relaxed mb-6">
              Founded on the principles of Parisian haute couture and Swiss botanical dermatology, 
              <strong> {settings?.parlourName || "L'ÉLIXIR"}</strong> was envisioned as a quiet haven away from the hurried world. 
              Here, every touch is deliberate, every ritual is bespoke, and no detail is overlooked.
            </p>

            <p className="text-espresso-500 text-xs sm:text-sm leading-relaxed mb-8">
              We exclusively employ certified organic cruelty-free formulations, pure 24-karat gold foils, and hospital-grade surgical sterilization within private suites, ensuring absolute privacy, comfort, and uncompromising results.
            </p>

            {/* Key Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-champagne-200/40 border border-champagne-300/60">
                <Shield className="w-5 h-5 text-gold-deep flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-semibold text-espresso-900">Hospital-Grade Purity</h4>
                  <p className="text-xs text-espresso-500 mt-0.5">Autoclave sterilization & single-use organic linens.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-champagne-200/40 border border-champagne-300/60">
                <Award className="w-5 h-5 text-gold-deep flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-semibold text-espresso-900">International Artisans</h4>
                  <p className="text-xs text-espresso-500 mt-0.5">Celebrity stylists trained in Paris, London & Milan.</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => setShowExpertsModal(true)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-espresso-800 text-espresso-900 hover:bg-espresso-900 hover:text-white transition-all text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Users className="w-4 h-4 text-gold-deep" />
                Meet Our Experts
              </button>

              <button
                onClick={() => onOpenBooking()}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-espresso-900 text-white hover:bg-espresso-800 transition-all text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                Reserve Your Suite
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Meet Our Experts Modal */}
      <AnimatePresence>
        {showExpertsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF7F2] border border-gold/40 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowExpertsModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-champagne-300 text-espresso-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <span className="text-gold-deep uppercase tracking-[0.3em] text-xs font-semibold">
                  Haute Artisans
                </span>
                <h3 className="font-serif text-3xl text-espresso-900 mt-1">
                  Meet Our Master Stylists & Aestheticians
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {EXPERTS.map((expert, i) => (
                  <div key={i} className="flex flex-col bg-white rounded-2xl overflow-hidden border border-champagne-300/70 shadow-sm">
                    <img 
                      src={expert.image} 
                      alt={expert.name} 
                      className="w-full h-48 object-cover object-top"
                    />
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-base font-semibold text-espresso-900">{expert.name}</h4>
                        <p className="text-xs text-gold-deep font-medium mt-0.5">{expert.role}</p>
                        <p className="text-[11px] text-espresso-400 mt-1 mb-2 font-mono">{expert.experience}</p>
                        <p className="text-xs text-espresso-600 leading-relaxed">{expert.bio}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowExpertsModal(false);
                          onOpenBooking();
                        }}
                        className="mt-4 w-full py-2 rounded-full bg-champagne-200 hover:bg-gold hover:text-espresso-900 text-espresso-800 text-[11px] uppercase tracking-wider font-semibold transition-colors"
                      >
                        Book With {expert.name.split(' ')[0]}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}

