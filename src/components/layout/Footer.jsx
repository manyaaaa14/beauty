import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  Facebook, 
  ArrowUp, 
  Check, 
  Heart,
  Shield,
  FileText
} from 'lucide-react';

export default function Footer({ settings, onOpenBooking }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState(null); // 'terms' | 'privacy' | null

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1A110D] text-[#FAF7F2] border-t border-gold/20 pt-16 pb-12 relative overflow-hidden">
      {/* Background Subtle Luxury Watermark */}
      <div className="absolute right-0 bottom-0 text-[18vw] font-serif font-black text-white/[0.02] pointer-events-none select-none leading-none -mb-8">
        ÉLIXIR
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Newsletter / Privilege Club Row */}
        <div className="border-b border-white/10 pb-12 mb-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-lg text-center lg:text-left">
            <span className="text-gold tracking-[0.3em] uppercase text-xs font-medium flex items-center justify-center lg:justify-start gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              L'Élixir VIP Society
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white mt-1">
              Join Our Haute Beauté Circle
            </h3>
            <p className="text-champagne-300/70 text-xs sm:text-sm mt-2">
              Receive private invitations to seasonal beauty galas, preview exclusive treatments, and enjoy member privileges.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full max-w-md flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3 rounded-full bg-white/5 border border-gold/30 text-white placeholder-champagne-300/40 text-xs sm:text-sm focus:outline-none focus:border-gold transition-colors"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-gold via-gold-shimmer to-gold text-espresso-900 font-semibold text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-md flex-shrink-0 cursor-pointer"
            >
              {subscribed ? (
                <>
                  <Check className="w-4 h-4" /> Joined
                </>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full border border-gold/60 flex items-center justify-center bg-black/40">
                <span className="font-serif text-sm text-gold font-light">É</span>
              </div>
              <span className="font-serif text-2xl tracking-wider text-white">
                {settings?.parlourName || "L'ÉLIXIR"}
              </span>
            </div>
            <p className="text-champagne-300/70 text-xs leading-relaxed mb-5">
              {settings?.subtitle || "Sanctuary of Haute Beauté where bespoke Parisian elegance meets clinically proven botanical therapies in private marble suites."}
            </p>
            <div className="flex items-center gap-3">
              <a 
                href={settings?.instagramUrl || "#"} 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 hover:border-gold flex items-center justify-center text-champagne-200 hover:text-gold transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={settings?.facebookUrl || "#"} 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 hover:border-gold flex items-center justify-center text-champagne-200 hover:text-gold transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Signature Services */}
          <div>
            <h4 className="font-serif text-base text-gold tracking-wider mb-4 uppercase text-xs">
              Curated Services
            </h4>
            <ul className="space-y-2 text-xs text-champagne-300/80">
              <li><a href="#services" className="hover:text-white transition-colors">24K Gold Cellular Facial</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Haute Couture Bridal Artistry</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Balayage & Bespoke Colour</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Caviar & Keratin Scalp Spa</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Rose Quartz Velvet Manicure</a></li>
              <li><a href="#packages" className="hover:text-white transition-colors">VIP Wedding Symphony</a></li>
            </ul>
          </div>

          {/* Col 3: Operating Hours */}
          <div>
            <h4 className="font-serif text-base text-gold tracking-wider mb-4 uppercase text-xs">
              Atelier Hours
            </h4>
            <div className="space-y-2.5 text-xs text-champagne-300/80">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Monday – Saturday</p>
                  <p>9:00 AM – 8:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gold/70 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Sunday & Holidays</p>
                  <p>10:00 AM – 6:00 PM</p>
                </div>
              </div>
              <p className="text-[11px] text-champagne-400/60 pt-2 italic">
                *Private late-evening suites available upon advance concierge reservation.
              </p>
            </div>
          </div>

          {/* Col 4: Location & Direct Concierge */}
          <div>
            <h4 className="font-serif text-base text-gold tracking-wider mb-4 uppercase text-xs">
              Concierge & Atelier
            </h4>
            <div className="space-y-2.5 text-xs text-champagne-300/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>{settings?.address || "742 Royale Boulevard, Haute District, Suite 400"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href={`tel:${settings?.phone || '+18005893549'}`} className="hover:text-white">
                  {settings?.phone || "+1 (800) 589-3549"}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href={`mailto:${settings?.email || 'concierge@lelixir-beaute.com'}`} className="hover:text-white">
                  {settings?.email || "concierge@lelixir-beaute.com"}
                </a>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onOpenBooking()}
                  className="w-full py-2.5 rounded-full border border-gold/60 text-gold-light hover:bg-gold hover:text-espresso-900 transition-all font-medium uppercase tracking-widest text-[11px] cursor-pointer"
                >
                  Book Private Suite
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-champagne-400/60 gap-4">
          <p>© {new Date().getFullYear()} {settings?.parlourName || "L'ÉLIXIR"} Haute Beauté. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveLegalModal('privacy')} 
              className="hover:text-champagne-200 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setActiveLegalModal('terms')} 
              className="hover:text-champagne-200 transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full border border-white/10 hover:border-gold flex items-center justify-center text-champagne-200 hover:text-gold transition-colors"
              title="Return to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Legal Modals */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#231713] border border-gold/40 text-champagne-100 max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            <h3 className="font-serif text-2xl text-gold mb-4 flex items-center gap-2">
              {activeLegalModal === 'privacy' ? <Shield className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              {activeLegalModal === 'privacy' ? 'Privacy Guarantee' : 'Terms of Reservation'}
            </h3>
            <div className="text-xs text-champagne-300/80 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {activeLegalModal === 'privacy' ? (
                <>
                  <p>At L'ÉLIXIR, we hold client discretion and personal privacy as fundamental virtues. All customer details gathered during appointment bookings are strictly encrypted.</p>
                  <p>We never sell, rent, or publicly disclose customer names, contact numbers, or treatment records to third parties.</p>
                  <p>Your contact data is strictly used for reservation notifications, appointment reminders, and concierge communication.</p>
                </>
              ) : (
                <>
                  <p>1. <strong>Appointments:</strong> Please arrive 10 minutes prior to your scheduled treatment to savor complimentary herbal refreshments in our lounge.</p>
                  <p>2. <strong>Cancellations:</strong> In consideration of our master aestheticians, we appreciate at least 4 hours advance notice for rescheduling.</p>
                  <p>3. <strong>Payment:</strong> Payment is collected directly at the parlour following your treatment session. We accept all major credit cards and cash.</p>
                  <p>4. <strong>Sanitation:</strong> All implements are sterilized in hospital-grade autoclaves between clients.</p>
                </>
              )}
            </div>
            <button
              onClick={() => setActiveLegalModal(null)}
              className="mt-6 w-full py-2.5 rounded-full bg-gold text-espresso-900 font-semibold uppercase tracking-widest text-xs hover:brightness-110 transition-all cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}

