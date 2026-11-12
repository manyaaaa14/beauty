import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  Clock4, 
  AlertCircle, 
  XCircle, 
  MessageCircle,
  ShieldCheck 
} from 'lucide-react';
import { lookupBooking } from '../../firebase/db';

export default function TrackBookingModal({ isOpen, onClose, settings }) {
  const [bookingId, setBookingId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!bookingId.trim() || !phone.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await lookupBooking(bookingId, phone);
      if (res.found) {
        setResult(res.booking);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('An error occurred during lookup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock4 className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl border border-gold/40 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#231713] text-[#FAF7F2] px-6 py-4 flex items-center justify-between border-b border-gold/30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border border-gold/50 flex items-center justify-center bg-black/30">
              <Search className="w-3.5 h-3.5 text-gold" />
            </div>
            <div>
              <h3 className="font-serif text-base text-white tracking-wider">
                Track Reservation Status
              </h3>
              <p className="text-[10px] uppercase tracking-widest text-gold">
                Confidential Guest Lookup
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-champagne-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1.5">
                Booking Reference ID *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. LX-89104A"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-champagne-300 font-mono text-sm uppercase text-espresso-900 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1.5">
                Registered Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="Mobile number used while booking"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-champagne-300 text-sm text-espresso-900 focus:outline-none focus:border-gold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-espresso-900 hover:bg-gold hover:text-espresso-900 text-white font-semibold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {loading ? (
                <span>Locating Reservation...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Check Status</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-3.5 rounded-xl bg-rosegold-50 border border-rosegold-200 text-rosegold-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div className="bg-white rounded-2xl p-6 border border-champagne-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-champagne-200">
                <div>
                  <span className="text-[10px] text-espresso-400 uppercase tracking-widest font-mono">
                    Ref: {result.id}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-espresso-900">
                    {result.itemName}
                  </h4>
                </div>
                <div>{getStatusBadge(result.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-espresso-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold-deep" />
                  <span>{result.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold-deep" />
                  <span>{result.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gold-deep" />
                  <span className="truncate">{result.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-espresso-900">
                    ${result.finalAmount?.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-espresso-400">Pay at Parlour</span>
                </div>
              </div>

              {result.notes && (
                <div className="p-2.5 rounded-lg bg-champagne-200/50 text-[11px] text-espresso-600">
                  <strong>Notes:</strong> {result.notes}
                </div>
              )}

              {/* Concierge WhatsApp Link */}
              {(settings?.whatsapp || settings?.phone) && (
                <a
                  href={`https://wa.me/${(settings.whatsapp || settings.phone).replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello ${settings?.parlourName || 'GLAMMORA'}! Regarding my reservation #${result.id} on ${result.date} at ${result.time}: `
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-full bg-[#25D366] text-white hover:brightness-105 transition-all text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Message Salon Concierge</span>
                </a>
              )}
            </div>
          )}

          <div className="text-center pt-2">
            <span className="text-[11px] text-espresso-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-deep" />
              <span>Strict data confidentiality guaranteed.</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
