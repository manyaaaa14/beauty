import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Calendar, 
  Sparkles, 
  Search, 
  DoorOpen, 
  ChevronRight,
  User,
  LogOut
} from 'lucide-react';

export default function Navbar({ 
  settings, 
  currentUser,
  onLogoutUser,
  onOpenAuth,
  onOpenBooking, 
  onOpenTrackBooking, 
  onReplayDoors
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Packages', href: '#packages' },
    { name: 'Offers', href: '#offers' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Experience', href: '#why-us' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      {settings?.announcement && (
        <div className="bg-[#1A110D] text-champagne-300 text-xs py-2 px-4 text-center border-b border-gold/20 flex items-center justify-center gap-2 overflow-hidden">
          <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse flex-shrink-0" />
          <span className="font-light tracking-wider truncate">
            {settings.announcement}
          </span>
          <button 
            onClick={() => onOpenBooking()} 
            className="hidden sm:inline underline font-medium text-gold hover:text-white ml-2 transition-colors cursor-pointer"
          >
            Claim Privilege
          </button>
        </div>
      )}

      {/* Main Sticky Navbar */}
      <nav 
        className={`sticky top-0 z-40 transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-luxury py-3 border-b border-champagne-300/40' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo & Monogram */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-gold/60 bg-[#231713] flex items-center justify-center shadow-sm group-hover:border-gold transition-colors">
              <span className="font-serif text-lg text-gold font-light tracking-widest">G</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-espresso-900 group-hover:text-gold-deep transition-colors">
                {settings?.parlourName || 'GLAMMORA'}
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-espresso-500 font-medium -mt-1">
                HAUTE BEAUTÉ
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-xs uppercase tracking-[0.2em] font-medium text-espresso-600 hover:text-espresso-900 transition-colors relative py-1 group cursor-pointer"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gold transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Track Reservation Button */}
            <button
              onClick={onOpenTrackBooking}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs uppercase tracking-wider font-medium text-espresso-600 hover:text-espresso-900 hover:bg-champagne-200/50 transition-all cursor-pointer"
              title="Track your appointment reservation"
            >
              <Search className="w-3.5 h-3.5 text-gold-deep" />
              <span>Track</span>
            </button>

            {/* Replay 3D Doors */}
            <button
              onClick={onReplayDoors}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs uppercase tracking-wider font-medium text-espresso-600 hover:text-espresso-900 hover:bg-champagne-200/50 transition-all cursor-pointer"
              title="Re-watch the 3D Grand Entrance Doors"
            >
              <DoorOpen className="w-3.5 h-3.5 text-gold-deep" />
              <span>Doors</span>
            </button>

            {/* Customer Account Pill or Sign In Button */}
            {currentUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-champagne-200/60 border border-gold/30 text-xs">
                <div className="w-6 h-6 rounded-full bg-espresso-900 text-gold flex items-center justify-center font-serif text-[11px] font-bold">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
                </div>
                <span className="font-medium text-espresso-900 truncate max-w-[100px]">
                  {currentUser.name ? currentUser.name.split(' ')[0] : 'Guest'}
                </span>
                <button
                  onClick={onLogoutUser}
                  className="p-1 text-espresso-400 hover:text-rose-600 transition-colors"
                  title="Sign out of account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs uppercase tracking-wider font-medium text-espresso-700 hover:bg-champagne-200/60 transition-all"
              >
                <User className="w-3.5 h-3.5 text-gold-deep" />
                <span>Sign In</span>
              </button>
            )}

            {/* Book Appointment CTA */}
            <button
              onClick={() => onOpenBooking()}
              className="relative group overflow-hidden px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-[#231713] via-[#3D2B24] to-[#231713] text-[#FAF7F2] text-xs uppercase tracking-[0.2em] font-medium shadow-md hover:shadow-gold-glow transition-all duration-300 cursor-pointer border border-gold/40"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                Book Now
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold/30 via-transparent to-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onOpenBooking()}
              className="px-3 py-1.5 rounded-full bg-espresso-900 text-white text-[11px] uppercase tracking-wider font-medium border border-gold/40"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-espresso-800 hover:bg-champagne-200/60"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-x-0 top-[60px] z-30 bg-[#FAF7F2] border-b border-champagne-300 shadow-2xl overflow-hidden lg:hidden"
          >
            <div className="p-6 flex flex-col gap-3">
              {/* User greeting in mobile menu */}
              {currentUser && (
                <div className="flex items-center justify-between pb-3 border-b border-champagne-300">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-espresso-900 text-gold flex items-center justify-center font-serif text-xs font-bold">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-espresso-900">{currentUser.name}</p>
                      <p className="text-[10px] text-espresso-500">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={onLogoutUser}
                    className="p-1.5 text-xs text-rose-600 bg-rose-50 rounded-lg flex items-center gap-1 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              )}

              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="flex items-center justify-between text-left text-xs uppercase tracking-widest font-medium text-espresso-800 py-2 border-b border-champagne-200/60"
                >
                  {link.name}
                  <ChevronRight className="w-4 h-4 text-gold" />
                </button>
              ))}

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTrackBooking();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-gold/50 text-espresso-800 text-xs uppercase tracking-widest font-medium"
                >
                  <Search className="w-4 h-4 text-gold-deep" />
                  Track Reservation
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onReplayDoors();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-champagne-300 text-espresso-700 text-xs uppercase tracking-widest font-medium"
                >
                  <DoorOpen className="w-4 h-4 text-gold-deep" />
                  Replay Grand Entrance
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-espresso-900 text-white text-xs uppercase tracking-widest font-medium shadow-lg"
                >
                  <Calendar className="w-4 h-4 text-gold" />
                  Book Appointment Now
                </button>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
