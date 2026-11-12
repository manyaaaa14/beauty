import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  Mail, 
  Instagram, 
  Send, 
  Check, 
  Sparkles,
  Calendar
} from 'lucide-react';

export default function ContactSection({ settings, onOpenBooking }) {
  const [formState, setFormState] = useState({ name: '', phone: '', note: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: '', phone: '', note: '' });
    }, 4000);
  };

  const cleanPhone = (settings?.phone || '+18005893549').replace(/\D/g, '');

  return (
    <section id="contact" className="py-24 sm:py-32 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-6 h-[1.5px] bg-gold-deep" />
            <span className="text-gold-deep tracking-[0.3em] uppercase text-xs font-semibold">
              Visit The Atelier
            </span>
            <div className="w-6 h-[1.5px] bg-gold-deep" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-espresso-900 font-normal tracking-tight mb-4">
            Contact & Private Suites
          </h2>
          <p className="text-espresso-600 text-sm sm:text-base font-light">
            Our concierge team is at your immediate service for private consultations, bridal inquiries, and special requests.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Contact Cards & Quick Inquiry */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Salon Details Card */}
            <div className="bg-white rounded-3xl p-8 border border-champagne-300 shadow-luxury space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-champagne-200 flex items-center justify-center text-gold-deep flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-espresso-900">Atelier Location</h4>
                  <p className="text-xs sm:text-sm text-espresso-600 mt-1 leading-relaxed">
                    {settings?.address || "742 Royale Boulevard, Haute District, Suite 400"}
                  </p>
                  <p className="text-xs text-gold-deep mt-0.5">{settings?.city || "Beverly Hills / Paris"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-champagne-200 flex items-center justify-center text-gold-deep flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-espresso-900">Operating Hours</h4>
                  <p className="text-xs sm:text-sm text-espresso-600 mt-1">
                    {settings?.openingHours || "Mon - Sat: 9:00 AM – 8:00 PM | Sun: 10:00 AM – 6:00 PM"}
                  </p>
                  <span className="text-[11px] text-espresso-400 mt-0.5 block">
                    Private evening appointments upon concierge reservation.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-champagne-200 flex items-center justify-center text-gold-deep flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-espresso-900">Direct Telephone</h4>
                  <a href={`tel:${settings?.phone || '+18005893549'}`} className="text-xs sm:text-sm text-espresso-800 font-medium hover:text-gold-deep transition-colors block mt-1">
                    {settings?.phone || "+1 (800) 589-3549"}
                  </a>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-full bg-[#25D366] text-white hover:brightness-105 transition-all text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp Concierge</span>
                </a>

                <button
                  onClick={() => onOpenBooking()}
                  className="flex-1 py-3 px-4 rounded-full bg-espresso-900 hover:bg-gold hover:text-espresso-900 text-white transition-all text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Online</span>
                </button>
              </div>

            </div>

            {/* Quick Inquiry Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300 shadow-luxury">
              <h4 className="font-serif text-lg font-semibold text-espresso-900 mb-1">
                Have a Special Request?
              </h4>
              <p className="text-xs text-espresso-500 mb-4">
                Leave a direct note for our salon concierge.
              </p>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-champagne-300 text-xs text-espresso-800 placeholder-espresso-400 focus:outline-none focus:border-gold"
                  required
                />
                <input
                  type="tel"
                  placeholder="Mobile Number (WhatsApp)"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-champagne-300 text-xs text-espresso-800 placeholder-espresso-400 focus:outline-none focus:border-gold"
                  required
                />
                <textarea
                  rows="2"
                  placeholder="Bridal date, questions, or specific treatment inquiry..."
                  value={formState.note}
                  onChange={(e) => setFormState({ ...formState, note: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-champagne-300 text-xs text-espresso-800 placeholder-espresso-400 focus:outline-none focus:border-gold"
                />

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-gradient-to-r from-espresso-900 to-espresso-700 hover:from-gold hover:to-gold-deep hover:text-espresso-900 text-white font-semibold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {submitted ? (
                    <>
                      <Check className="w-4 h-4" /> Message Delivered to Concierge
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Send Inquiry
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>

          {/* Right Column: Interactive Map & Atelier Ambience */}
          <div className="lg:col-span-7 flex flex-col rounded-3xl overflow-hidden border border-champagne-300 shadow-luxury bg-white min-h-[450px]">
            
            <div className="relative flex-1 w-full min-h-[380px] bg-champagne-200">
              <iframe
                title="Salon Atelier Map"
                src={settings?.googleMapsEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.292292615674393!3d48.858370079287475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sEiffel%20Tower!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '380px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

            <div className="p-6 bg-espresso-900 text-champagne-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-gold uppercase tracking-widest text-[10px] font-semibold">Valet & Chauffeur Services</span>
                <p className="text-xs text-champagne-300/80 mt-0.5">Complimentary valet parking available directly at our private rear porte-cochère.</p>
              </div>
              <a
                href={settings?.instagramUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gold hover:text-white font-medium flex-shrink-0"
              >
                <Instagram className="w-4 h-4" />
                <span>Follow @lelixir.beaute</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

