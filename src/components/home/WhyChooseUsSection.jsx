import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ShieldCheck, 
  Gem, 
  Award, 
  HeartHandshake, 
  Leaf, 
  Lock 
} from 'lucide-react';

export default function WhyChooseUsSection() {
  const pillars = [
    {
      icon: Award,
      title: 'Master European Artisans',
      description: 'Our colorists and aestheticians hold master credentials from Parisian academies, possessing over a decade of high-fashion and bridal artistry.'
    },
    {
      icon: Gem,
      title: 'Swiss & French Formulations',
      description: 'We strictly utilize certified cruelty-free botanical actives, pure 24-karat gold leaf, and clinical peptide serums devoid of parabens or harsh sulfates.'
    },
    {
      icon: ShieldCheck,
      title: 'Hospital-Grade Purity & Safety',
      description: 'Full autoclave sterilization between every guest, medical-grade air filtration, and sealed disposable organic bamboo linens for complete peace of mind.'
    },
    {
      icon: Lock,
      title: 'Individual Marble Suites',
      description: 'Enjoy tranquil seclusion. Every facial, massage, and bridal ritual is conducted within soundproof, aromatherapeutic private suites.'
    },
    {
      icon: HeartHandshake,
      title: 'Bespoke Architectural Consult',
      description: 'No template styling. We analyze facial symmetry, skin biome, and lifestyle preferences before recommending personalized treatments.'
    },
    {
      icon: Leaf,
      title: '100% Satisfaction Guarantee',
      description: 'We are committed to perfection. If your styling or color does not surpass expectations, our creative director will personally refine it with priority.'
    }
  ];

  return (
    <section id="why-us" className="py-24 sm:py-32 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-6 h-[1.5px] bg-gold-deep" />
            <span className="text-gold-deep tracking-[0.3em] uppercase text-xs font-semibold">
              The L'Élixir Standard
            </span>
            <div className="w-6 h-[1.5px] bg-gold-deep" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-espresso-900 font-normal tracking-tight mb-4">
            Why Discerning Guests Choose Us
          </h2>
          <p className="text-espresso-600 text-sm sm:text-base font-light">
            An unwavering commitment to aesthetic mastery, absolute privacy, and therapeutic excellence.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-champagne-300 shadow-luxury hover:shadow-luxury-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-champagne-200/70 border border-gold/40 flex items-center justify-center text-gold-deep mb-6">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-serif text-xl font-semibold text-espresso-900 mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-espresso-600 text-xs sm:text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-champagne-200/60 flex items-center gap-1.5 text-gold-deep text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Haute Standard</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

