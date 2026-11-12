import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Sliders } from 'lucide-react';

// Interactive Before/After Split Slider Subcomponent
function BeforeAfterSlider({ item }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX !== undefined ? e.clientX : (e.touches ? e.touches[0].clientX : 0);
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-champagne-300 shadow-luxury p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <span className="text-gold-deep uppercase tracking-widest text-[10px] font-bold">
            {item.category}
          </span>
          <h4 className="font-serif text-xl sm:text-2xl text-espresso-900 font-semibold">
            {item.title}
          </h4>
        </div>
        <div className="flex items-center gap-2 text-xs text-espresso-500 font-medium">
          <Sliders className="w-3.5 h-3.5 text-gold-deep" />
          <span>Drag slider left / right</span>
        </div>
      </div>

      <div 
        className="relative h-[340px] sm:h-[420px] rounded-2xl overflow-hidden cursor-ew-resize select-none"
        onMouseMove={(e) => { if (e.buttons === 1) handleSliderMove(e); }}
        onClick={handleSliderMove}
        onTouchMove={handleSliderMove}
      >
        {/* AFTER IMAGE (Underneath) */}
        <img
          src={item.afterImage}
          alt="After Transformation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-black/60 text-white text-[11px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full backdrop-blur-md">
          After (Haute Glow)
        </div>

        {/* BEFORE IMAGE (Clipped on Top) */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={item.beforeImage}
            alt="Before Treatment"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: '100%', minWidth: '100%' }}
          />
          <div className="absolute top-4 left-4 bg-espresso-900/80 text-champagne-100 text-[11px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full backdrop-blur-md">
            Before
          </div>
        </div>

        {/* Dividing Vertical Line and Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-gold shadow-[0_0_15px_#D4AF37] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gold text-espresso-900 flex items-center justify-center shadow-lg border-2 border-white">
            <span className="text-xs font-bold font-mono">⬌</span>
          </div>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-espresso-600 mt-4 leading-relaxed italic">
        "{item.description}"
      </p>
    </div>
  );
}

export default function GallerySection({ gallery = [], beforeAfter = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);

  const categories = ['All', 'Bridal', 'Hair', 'Skin & Facials', 'Nails', 'Makeup'];

  const filteredItems = gallery.filter(item => 
    activeCategory === 'All' || item.category === activeCategory
  );

  const openLightbox = (index) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-6 h-[1.5px] bg-gold-deep" />
            <span className="text-gold-deep tracking-[0.3em] uppercase text-xs font-semibold">
              The Atelier Portfolio
            </span>
            <div className="w-6 h-[1.5px] bg-gold-deep" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-espresso-900 font-normal tracking-tight mb-4">
            Our Work & Transformations
          </h2>
          <p className="text-espresso-600 text-sm sm:text-base font-light">
            Glimpse into the radiant transformations created daily by our master colorists and aesthetic artists.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-espresso-900 text-white shadow-md'
                    : 'bg-white text-espresso-700 hover:bg-champagne-200 border border-champagne-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry / Grid Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden cursor-pointer shadow-luxury border border-champagne-300"
              onClick={() => openLightbox(index)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/90 via-espresso-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white" />

              {/* Hover Details */}
              <div className="absolute inset-x-0 bottom-0 p-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                <span className="text-gold tracking-[0.2em] text-[10px] uppercase font-bold">
                  {item.category}
                </span>
                <h4 className="font-serif text-xl font-semibold mt-1">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-xs text-champagne-200/80 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-gold font-medium">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>View in High Resolution</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Before and After Section */}
        {beforeAfter.length > 0 && (
          <div className="mt-12 pt-16 border-t border-champagne-300">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-gold-deep uppercase tracking-widest text-xs font-semibold">
                Authentic Results
              </span>
              <h3 className="font-serif text-3xl text-espresso-900 mt-1">
                Real Client Transformations
              </h3>
              <p className="text-xs sm:text-sm text-espresso-500 mt-2">
                All photos shared with explicit guest consent. Drag the slider to witness the cellular renewal.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {beforeAfter.map((ba) => (
                <BeforeAfterSlider key={ba.id} item={ba} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxIndex !== null && filteredItems[activeLightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-50 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-50 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-50 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div 
              className="max-w-4xl max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredItems[activeLightboxIndex].image}
                alt={filteredItems[activeLightboxIndex].title}
                className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-gold/40"
              />
              <div className="mt-4 text-center text-white">
                <span className="text-gold text-xs uppercase tracking-widest font-semibold">
                  {filteredItems[activeLightboxIndex].category}
                </span>
                <h3 className="font-serif text-2xl font-semibold mt-1">
                  {filteredItems[activeLightboxIndex].title}
                </h3>
                {filteredItems[activeLightboxIndex].description && (
                  <p className="text-xs text-champagne-300 mt-1 max-w-xl">
                    {filteredItems[activeLightboxIndex].description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}

