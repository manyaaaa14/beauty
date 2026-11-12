import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Scissors, 
  Gift, 
  Tag, 
  Image as ImageIcon, 
  Users, 
  Settings, 
  Clock, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X,
  Award,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function AdminLayout({ 
  currentTab, 
  onSelectTab, 
  onLogout, 
  onBackToSite, 
  pendingCount = 0,
  parlourName = 'GLAMMORA',
  children 
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Calendar, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'services', label: 'Services', icon: Scissors },
    { id: 'packages', label: 'Packages', icon: Gift },
    { id: 'offers', label: 'Offers & Coupons', icon: Tag },
    { id: 'gallery', label: 'Gallery & Portfolio', icon: ImageIcon },
    { id: 'experience', label: 'Experience Pillars', icon: Award },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Website Settings & Contact', icon: Settings },
    { id: 'schedule', label: 'Appointment Rules', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-[#F6F1EA] flex flex-col lg:flex-row text-espresso-900">
      
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-[#231713] text-white px-4 py-3.5 flex items-center justify-between border-b border-gold/30 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full border border-gold/60 flex items-center justify-center bg-black/40 text-gold font-serif text-xs">
            É
          </div>
          <div>
            <span className="font-serif text-sm font-semibold text-white tracking-wider">{parlourName}</span>
            <span className="text-[9px] uppercase tracking-widest text-gold block">Admin Suite</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToSite}
            className="p-2 text-champagne-300 hover:text-white"
            title="View Live Website"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 text-champagne-300 hover:text-white"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#1A110D] text-champagne-100 flex flex-col justify-between border-r border-gold/20 transition-transform duration-300 lg:translate-x-0 lg:static
        ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Brand Top */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gold/60 bg-[#231713] flex items-center justify-center shadow-gold-glow flex-shrink-0">
              <span className="font-serif text-lg text-gold font-light">G</span>
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold tracking-wider text-white">
                {parlourName}
              </h2>
              <span className="text-[9px] uppercase tracking-[0.25em] text-gold font-medium">
                Atelier Control Suite
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileNavOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-gold via-gold-shimmer to-gold text-espresso-900 shadow-md font-bold' 
                    : 'text-champagne-300/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-espresso-900' : 'text-gold'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-espresso-900 text-white' : 'bg-gold text-espresso-900'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={onBackToSite}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-medium text-champagne-300/70 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-gold" />
            <span>Visit Public Website</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-medium text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Admin Suite</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Desktop Topbar */}
        <header className="hidden lg:flex bg-white/80 backdrop-blur-md border-b border-champagne-300/80 px-8 py-4 items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="font-serif text-2xl font-bold text-espresso-900 capitalize">
              {menuItems.find(m => m.id === currentTab)?.label || 'Overview'}
            </h1>
            <p className="text-xs text-espresso-500">
              Manage appointments, catalogue items, pricing, and salon configuration.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onBackToSite}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-champagne-300 text-espresso-800 text-xs uppercase tracking-wider font-semibold hover:bg-champagne-200 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gold-deep" />
              <span>Customer Site</span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-champagne-300">
              <div className="w-9 h-9 rounded-full bg-espresso-900 text-gold flex items-center justify-center font-serif text-sm font-bold shadow-sm">
                A
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-espresso-900">Atelier Director</p>
                <p className="text-[10px] text-espresso-400 uppercase tracking-widest font-mono">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Tab View Container */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>

      </main>

    </div>
  );
}
