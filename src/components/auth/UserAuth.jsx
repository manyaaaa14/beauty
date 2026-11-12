import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  User, 
  Phone, 
  Key, 
  ArrowRight, 
  AlertCircle 
} from 'lucide-react';
import { loginUser, registerUser } from '../../firebase/db';

export default function UserAuth({ onAuthenticated, settings }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const user = await loginUser({ email, password });
        onAuthenticated(user);
      } else {
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (!phone.trim()) throw new Error('Please enter your mobile phone number.');
        const user = await registerUser({ name, email, phone, password });
        onAuthenticated(user);
      }
    } catch (err) {
      setError(err.message || 'Authentication error. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#120B08] text-[#FAF7F2] flex items-center justify-center p-4 relative overflow-hidden select-none">
      
      {/* Background Volumetric Lighting & Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 filter brightness-50"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=80')`,
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-rosegold-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Auth Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-[#231713]/90 backdrop-blur-xl rounded-3xl border border-gold/40 shadow-2xl p-8 sm:p-10"
      >
        {/* Brand Monogram */}
        <div className="w-16 h-16 rounded-full border border-gold/60 bg-[#1A110D] flex items-center justify-center mx-auto mb-5 shadow-gold-glow">
          <span className="font-serif text-3xl text-gold font-light">G</span>
        </div>

        <div className="text-center mb-6">
          <span className="text-gold tracking-[0.3em] uppercase text-[10px] font-semibold">
            Where Beauty Meets Luxury
          </span>
          <h2 className="font-serif text-3xl text-white font-normal mt-1">
            {settings?.parlourName || 'GLAMMORA'}
          </h2>
          <p className="text-champagne-300/70 text-xs mt-1">
            Sign in to unlock bespoke beauty suites, appointment booking, and seasonal privilege offers.
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Create Account */}
        <div className="flex rounded-full bg-black/40 p-1 mb-6 border border-gold/20">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'login' ? 'bg-gradient-to-r from-gold via-gold-shimmer to-gold text-espresso-900 shadow-md font-bold' : 'text-champagne-300 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'register' ? 'bg-gradient-to-r from-gold via-gold-shimmer to-gold text-espresso-900 shadow-md font-bold' : 'text-champagne-300 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-champagne-300 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gold/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lady Genevieve Laurent"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-gold/30 text-white text-xs sm:text-sm focus:outline-none focus:border-gold placeholder-champagne-400/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-champagne-300 uppercase tracking-wider mb-1">
                  Mobile Number (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gold/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 555-349-8821"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-gold/30 text-white text-xs sm:text-sm focus:outline-none focus:border-gold placeholder-champagne-400/40"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-champagne-300 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gold/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="client@luxurymail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-gold/30 text-white text-xs sm:text-sm focus:outline-none focus:border-gold placeholder-champagne-400/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-champagne-300 uppercase tracking-wider mb-1">
              Password *
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-gold/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={mode === 'register' ? 8 : undefined}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-gold/30 text-white text-xs sm:text-sm focus:outline-none focus:border-gold placeholder-champagne-400/40"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold via-gold-shimmer to-gold text-espresso-900 font-semibold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-gold-glow flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In & Enter Sanctuary' : 'Register & Enter Sanctuary'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </motion.div>
    </div>
  );
}
