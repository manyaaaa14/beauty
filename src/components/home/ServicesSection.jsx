import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Clock, 
  Search, 
  Filter, 
  ArrowRight, 
  Check, 
  X, 
  Star,
  Info
} from 'lucide-react';

export default function ServicesSection({ services = [], onSelectServiceForBooking }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState(null);

  const categories = ['All', 'Hair', 'Skin & Facials', 'Makeup & Bridal', 'Nails & Spa'];

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      // Must be published or default true
      const isPublished = srv.published !== false;
      if (!isPublished) return false;

      const matchesCategory = activeCategory === 'All' || srv.category === activeCategory;
      const matchesSearch = 
        (srv.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (srv.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategory, searchQuery]);

  return (
    <section id="services" className="py-24 sm:py-32 bg-[#F6F0E6] relative">
      
      {/* Decorative floral/parlour element */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-6 h-[1.5px] bg-gold-deep" />
            <span className="text-gold-deep tracking-[0.3em] uppercase text-xs font-semibold">
              Your Beauty, Our Expertise.
            </span>
            <div className="w-6 h-[1.5px] bg-gold-deep" />
          </div>
          
          <h2 className="font-serif text-3xl sm:text-5xl text-espresso-900 font-normal tracking-tight mb-4">
            Our Signature Treatments
          </h2>
          <p className="text-espresso-600 text-sm sm:text-base font-light">
            Each ritual is performed in a private suite with certified botanical serums, tailored to restore natural radiance and poise.
          </p>

          {/* Search Bar & Category Filters */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-espresso-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rituals or styles..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-champagne-300 text-xs text-espresso-800 placeholder-espresso-400 focus:outline-none focus:border-gold transition-colors shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-400 hover:text-espresso-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-espresso-900 text-white shadow-md'
                      : 'bg-white/80 text-espresso-700 hover:bg-white border border-champagne-300/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white/60 rounded-3xl border border-champagne-300/80 p-8 max-w-md mx-auto">
            <Sparkles className="w-8 h-8 text-gold mx-auto mb-3" />
            <p className="font-serif text-lg text-espresso-800">No treatments found</p>
            <p className="text-xs text-espresso-500 mt-1">Try searching with a different term or select all categories.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="mt-4 px-4 py-2 rounded-full bg-espresso-900 text-white text-xs uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="group bg-white rounded-2xl overflow-hidden border border-champagne-300/80 shadow-luxury hover:shadow-luxury-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Service Image with Zoom */}
                <div className="relative h-60 overflow-hidden bg-champagne-200">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Category Pill on Image */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold bg-[#231713]/85 text-champagne-100 backdrop-blur-md border border-gold/30">
                      {service.category}
                    </span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-medium bg-black/60 text-white backdrop-blur-md">
                    <Clock className="w-3 h-3 text-gold" />
                    <span>{service.duration} mins</span>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-4 left-4">
                    <span className="font-serif text-2xl font-bold text-white drop-shadow-md">
                      ${service.price}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif text-lg font-semibold text-espresso-900 group-hover:text-gold-deep transition-colors line-clamp-1">
                        {service.name}
                      </h3>
                      {service.rating && (
                        <div className="flex items-center gap-1 text-gold text-xs font-medium">
                          <Star className="w-3.5 h-3.5 fill-gold" />
                          <span>{service.rating}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-espresso-600 text-xs leading-relaxed line-clamp-3 mb-6">
                      {service.description}
                    </p>
                  </div>

                  {/* Actions: Details & Book Now */}
                  <div className="pt-4 border-t border-champagne-200/60 flex items-center gap-3">
                    <button
                      onClick={() => setSelectedServiceForDetail(service)}
                      className="p-2.5 rounded-full border border-champagne-300 hover:border-gold text-espresso-600 hover:text-espresso-900 transition-colors"
                      title="View full ritual details"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onSelectServiceForBooking(service)}
                      className="flex-1 py-2.5 px-4 rounded-full bg-espresso-900 text-white hover:bg-gold hover:text-espresso-900 text-xs uppercase tracking-widest font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer shadow-sm"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedServiceForDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF7F2] border border-gold/40 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedServiceForDetail(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative h-64">
                <img
                  src={selectedServiceForDetail.image}
                  alt={selectedServiceForDetail.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="text-gold-deep uppercase tracking-widest text-xs font-semibold">
                    {selectedServiceForDetail.category}
                  </span>
                  <h3 className="font-serif text-2xl text-espresso-900 font-bold">
                    {selectedServiceForDetail.name}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between pb-4 border-b border-champagne-300 mb-4">
                  <div className="flex items-center gap-2 text-xs text-espresso-600">
                    <Clock className="w-4 h-4 text-gold-deep" />
                    <span>Duration: <strong>{selectedServiceForDetail.duration} Minutes</strong></span>
                  </div>
                  <div className="font-serif text-2xl font-bold text-espresso-900">
                    ${selectedServiceForDetail.price}
                  </div>
                </div>

                <p className="text-espresso-700 text-sm leading-relaxed mb-6">
                  {selectedServiceForDetail.description}
                </p>

                <div className="space-y-2 mb-6 text-xs text-espresso-600 bg-champagne-200/50 p-4 rounded-xl border border-champagne-300/60">
                  <p className="font-semibold text-espresso-800 uppercase tracking-wider text-[11px]">Treatment Highlights:</p>
                  <p className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-gold-deep" /> Performed in private soundproof marble suite
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-gold-deep" /> Certified Swiss botanicals & organic active serums
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-gold-deep" /> Complimentary herbal infusion or French sparkling water
                  </p>
                </div>

                <button
                  onClick={() => {
                    const srv = selectedServiceForDetail;
                    setSelectedServiceForDetail(null);
                    onSelectServiceForBooking(srv);
                  }}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-espresso-900 to-espresso-700 hover:from-gold hover:to-gold-deep hover:text-espresso-900 text-white font-semibold text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer"
                >
                  Confirm & Reserve Appointment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}

