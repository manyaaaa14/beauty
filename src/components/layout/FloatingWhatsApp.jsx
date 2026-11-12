import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp({ phone, parlourName = "L'ÉLIXIR" }) {
  const cleanPhone = (phone || '18005893549').replace(/\D/g, '');
  const message = encodeURIComponent(`Bonjour! I would like to inquire about booking an appointment at ${parlourName}.`);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative group flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-[#25D366] text-white shadow-2xl hover:shadow-[0_0_25px_rgba(37,211,102,0.6)] transition-all duration-300"
      >
        {/* Pulsing Glow Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />

        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
        
        <span className="hidden sm:inline text-xs font-semibold tracking-wider uppercase font-sans">
          WhatsApp Concierge
        </span>

        {/* Hover Tooltip on Mobile/Desktop */}
        <div className="absolute right-0 bottom-full mb-3 hidden group-hover:block whitespace-nowrap bg-[#1A110D] text-champagne-100 text-[11px] px-3 py-1.5 rounded-lg shadow-xl border border-gold/30">
          Instant booking assistance & beauty advice
        </div>
      </motion.a>
    </div>
  );
}

