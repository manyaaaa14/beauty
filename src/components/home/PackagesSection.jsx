import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, Clock, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PackagesSection({ packages = [], onSelectPackageForBooking }) {
  const activePackages = packages.filter(p => p.active !== false);

  return (
    <section id="packages" className="py-24 sm:py-32 bg-[#FAF7F2] relative overflow-hidden">
      
      {/* Background glow circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-champagne-300/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-6 h-[1.5px] bg-gold-deep" />
            <span className="text-gold-deep tracking-[0.3em] uppercase text-xs font-semibold">
              Curated Masterpieces
            </span>
            <div className="w-6 h-[1.5px] bg-gold-deep" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-espresso-900 font-normal tracking-tight mb-4">
            Exclusive Salon Packages
          </h2>
          <p className="text-espresso-600 text-sm sm:text-base font-light">
            Comprehensive multi-hour transformation rituals designed for brides, milestone galas, and complete personal renewal.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {activePackages.map((pkg, idx) => (
            <motion.div
              key={pkg.id || idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-white rounded-3xl overflow-hidden border border-champagne-300 shadow-luxury hover:shadow-luxury-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Banner Image with Overlay */}
              <div className="relative h-64 overflow-hidden bg-champagne-200">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Badge if present */}
                {pkg.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 rounded-full text-xs uppercase tracking-widest font-semibold bg-gradient-to-r from-gold via-gold-shimmer to-gold text-espresso-900 shadow-lg">
                      {pkg.badge}
                    </span>
                  </div>
                )}

                {/* Savings Pill */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-espresso-900 shadow-md">
                    Save ${pkg.savings || (pkg.originalPrice - pkg.discountedPrice)}
                  </span>
                </div>

                {/* Package Titles on Image */}
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <p className="text-champagne-300 text-xs uppercase tracking-widest font-medium">
                    {pkg.tagline || 'VIP Comprehensive Experience'}
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold mt-1">
                    {pkg.name}
                  </h3>
                </div>
              </div>

              {/* Package Content & Inclusions */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs text-espresso-500 mb-6 pb-4 border-b border-champagne-200">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gold-deep" />
                      <span>{pkg.duration ? `${pkg.duration} Minutes` : 'Bespoke Duration'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gold-deep" />
                      <span>{pkg.validity || 'Valid all season'}</span>
                    </div>
                  </div>

                  <h4 className="text-xs uppercase tracking-widest font-semibold text-espresso-800 mb-3">
                    Curated Inclusions:
                  </h4>

                  <ul className="space-y-2.5 mb-8">
                    {(pkg.includedServices || []).map((serviceName, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-espresso-700">
                        <div className="w-4 h-4 rounded-full bg-champagne-200 flex items-center justify-center flex-shrink-0 mt-0.5 text-gold-deep">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{serviceName}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & Booking Action */}
                <div className="pt-6 border-t border-champagne-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-3xl font-bold text-espresso-900">
                        ${pkg.discountedPrice}
                      </span>
                      <span className="text-sm text-espresso-400 line-through">
                        ${pkg.originalPrice}
                      </span>
                    </div>
                    <p className="text-[11px] text-espresso-500">Includes private suite & refreshments</p>
                  </div>

                  <button
                    onClick={() => onSelectPackageForBooking(pkg)}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-espresso-900 to-[#3D2B24] hover:from-gold hover:to-gold-deep hover:text-espresso-900 text-white font-semibold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer shadow-md"
                  >
                    <span>Reserve Package</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

