import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Tag, 
  Check, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Share2, 
  Printer, 
  MessageCircle,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { 
  getAvailableTimeSlots, 
  createBooking, 
  validateCoupon, 
  getServices, 
  getPackages 
} from '../../firebase/db';

export default function BookingModal({ 
  isOpen, 
  onClose, 
  preselectedItem, // { type: 'service' | 'package', item: {...} }
  preselectedCoupon,
  settings 
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);

  // Form State
  const [selectedType, setSelectedType] = useState('service'); // 'service' | 'package'
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotError, setSlotError] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');

  // Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Coupon & Pricing
  const [couponCode, setCouponCode] = useState('');
  const [couponValidation, setCouponValidation] = useState(null);
  const [couponValidating, setCouponValidating] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Confirmation state
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [bookingError, setBookingError] = useState('');

  // Load services and packages
  useEffect(() => {
    if (isOpen) {
      Promise.all([getServices(), getPackages()]).then(([srvs, pkgs]) => {
        setServices(srvs.filter(s => s.published !== false));
        setPackages(pkgs.filter(p => p.active !== false));
      });

      // Default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDateStr = tomorrow.toISOString().split('T')[0];
      setSelectedDate(defaultDateStr);

      if (preselectedItem?.item) {
        setSelectedType(preselectedItem.type || 'service');
        setSelectedItem(preselectedItem.item);
        setStep(2); // Jump straight to date selection
      } else {
        setStep(1);
      }

      if (preselectedCoupon) {
        setCouponCode(preselectedCoupon.code || preselectedCoupon);
      }
    }
  }, [isOpen, preselectedItem, preselectedCoupon]);

  // Fetch slots whenever selectedDate changes
  useEffect(() => {
    if (selectedDate && (step === 2 || step === 3)) {
      setSlotsLoading(true);
      setSlotError(null);
      setSelectedTime('');

      getAvailableTimeSlots(selectedDate)
        .then((res) => {
          if (!res.available) {
            setSlotError(res.reason || 'No availability for this date.');
            setAvailableSlots([]);
          } else {
            setAvailableSlots(res.slots || []);
          }
        })
        .catch((err) => {
          setSlotError('Unable to load appointment slots for this date.');
        })
        .finally(() => {
          setSlotsLoading(false);
        });
    }
  }, [selectedDate, step]);

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponValidating(true);
    setCouponError('');
    setCouponValidation(null);

    const baseAmount = selectedItem 
      ? (selectedType === 'package' ? (selectedItem.discountedPrice || selectedItem.price) : selectedItem.price) 
      : 100;

    try {
      const res = await validateCoupon(couponCode, baseAmount);
      if (res.valid) {
        setCouponValidation(res);
      } else {
        setCouponError(res.message);
      }
    } catch (e) {
      setCouponError('Error validating coupon. Please try again.');
    } finally {
      setCouponValidating(false);
    }
  };

  // Compute final pricing
  const originalAmount = selectedItem
    ? (selectedType === 'package' ? (selectedItem.originalPrice || selectedItem.discountedPrice) : selectedItem.price)
    : 0;

  const standardAmount = selectedItem
    ? (selectedType === 'package' ? selectedItem.discountedPrice : selectedItem.price)
    : 0;

  const discountAmount = couponValidation?.valid ? couponValidation.discountAmount : 0;
  const finalAmount = Math.max(0, standardAmount - discountAmount);

  // Submit Booking
  const handleConfirmReservation = async () => {
    setLoading(true);
    setBookingError('');

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        specialRequests: specialRequests.trim(),
        itemType: selectedType,
        serviceId: selectedItem?.id,
        itemName: selectedItem?.name,
        date: selectedDate,
        time: selectedTime,
        originalAmount,
        discountAmount,
        finalAmount,
        couponCode: couponValidation?.valid ? couponCode.trim().toUpperCase() : '',
        paymentStatus: 'Pay at Parlour'
      };

      const result = await createBooking(payload);
      setConfirmedBooking(result);
      setStep(6);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#FAF7F2', '#B76E79', '#C8AE90']
        });
      } catch (e) {
        // Confetti fallback
      }
    } catch (err) {
      setBookingError(err.message || 'An error occurred while reserving your slot. Please try another time.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  // Min date is today
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl border border-gold/40 shadow-2xl overflow-hidden my-6"
      >
        {/* Header Bar */}
        <div className="bg-[#231713] text-[#FAF7F2] px-6 py-4 flex items-center justify-between border-b border-gold/30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border border-gold/50 flex items-center justify-center bg-black/30">
              <span className="font-serif text-xs text-gold">É</span>
            </div>
            <div>
              <h3 className="font-serif text-base text-white tracking-wider">
                {confirmedBooking ? 'Reservation Confirmed' : 'Haute Beauté Reservation'}
              </h3>
              <p className="text-[10px] uppercase tracking-widest text-gold">
                {step < 6 ? `Step ${step} of 5 • Private Suite Appointment` : 'VIP Pass Issued'}
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

        {/* Progress Stepper Bar (Only in Steps 1-5) */}
        {step < 6 && (
          <div className="bg-champagne-200/60 px-6 py-2.5 border-b border-champagne-300/60 flex items-center justify-between text-[11px] font-medium text-espresso-600 overflow-x-auto">
            <span className={step >= 1 ? 'text-espresso-900 font-bold' : ''}>1. Treatment</span>
            <span className="text-champagne-400">›</span>
            <span className={step >= 2 ? 'text-espresso-900 font-bold' : ''}>2. Date</span>
            <span className="text-champagne-400">›</span>
            <span className={step >= 3 ? 'text-espresso-900 font-bold' : ''}>3. Time Slot</span>
            <span className="text-champagne-400">›</span>
            <span className={step >= 4 ? 'text-espresso-900 font-bold' : ''}>4. Guest Details</span>
            <span className="text-champagne-400">›</span>
            <span className={step >= 5 ? 'text-espresso-900 font-bold' : ''}>5. Summary</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          
          {/* STEP 1: SELECT TREATMENT (SERVICE OR PACKAGE) */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-xl text-espresso-900 font-semibold mb-1">
                  Select Your Desired Treatment
                </h4>
                <p className="text-xs text-espresso-500">
                  Choose an individual bespoke service or a comprehensive VIP salon package.
                </p>
              </div>

              {/* Toggle: Services vs Packages */}
              <div className="flex rounded-full bg-champagne-200 p-1 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => { setSelectedType('service'); setSelectedItem(null); }}
                  className={`flex-1 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedType === 'service' ? 'bg-espresso-900 text-white shadow-sm' : 'text-espresso-700'
                  }`}
                >
                  Services ({services.length})
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedType('package'); setSelectedItem(null); }}
                  className={`flex-1 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedType === 'package' ? 'bg-espresso-900 text-white shadow-sm' : 'text-espresso-700'
                  }`}
                >
                  Packages ({packages.length})
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {(selectedType === 'service' ? services : packages).map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  const price = selectedType === 'package' ? item.discountedPrice : item.price;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected 
                          ? 'bg-champagne-200/80 border-gold shadow-md ring-1 ring-gold' 
                          : 'bg-white border-champagne-300 hover:border-gold/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                        />
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-gold-deep font-semibold">
                            {item.category || item.badge || 'Haute Beauté'}
                          </span>
                          <h5 className="font-serif text-sm font-semibold text-espresso-900">
                            {item.name}
                          </h5>
                          <p className="text-[11px] text-espresso-500 flex items-center gap-2 mt-0.5">
                            <Clock className="w-3 h-3 text-gold-deep" />
                            <span>{item.duration} Minutes</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="font-serif text-lg font-bold text-espresso-900">
                          ${price}
                        </span>
                        {item.originalPrice && item.originalPrice > price && (
                          <span className="block text-[11px] text-espresso-400 line-through">
                            ${item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Next Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!selectedItem}
                  onClick={() => setStep(2)}
                  className={`px-8 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    selectedItem 
                      ? 'bg-espresso-900 text-white hover:bg-gold hover:text-espresso-900 shadow-md' 
                      : 'bg-champagne-300/60 text-espresso-400 cursor-not-allowed'
                  }`}
                >
                  <span>Select Date</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT PREFERRED DATE */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-xl text-espresso-900 font-semibold mb-1">
                  Choose Appointment Date
                </h4>
                <p className="text-xs text-espresso-500">
                  Select your preferred date. Our concierge ensures no overlapping schedules.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-champagne-300 shadow-sm space-y-4">
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider">
                  Reservation Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gold-deep absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    min={minDate}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-champagne-300 text-sm text-espresso-800 font-medium focus:outline-none focus:border-gold"
                  />
                </div>

                {slotError && (
                  <div className="p-3 rounded-xl bg-rosegold-50 border border-rosegold-200 text-rosegold-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{slotError}</span>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-full border border-champagne-300 text-espresso-700 text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 hover:bg-champagne-200 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                <button
                  type="button"
                  disabled={!selectedDate || Boolean(slotError)}
                  onClick={() => setStep(3)}
                  className={`px-8 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    selectedDate && !slotError
                      ? 'bg-espresso-900 text-white hover:bg-gold hover:text-espresso-900 shadow-md'
                      : 'bg-champagne-300/60 text-espresso-400 cursor-not-allowed'
                  }`}
                >
                  <span>Select Time Slot</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DISPLAY AVAILABLE TIME SLOTS */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-xl text-espresso-900 font-semibold mb-1">
                  Available Time Slots
                </h4>
                <p className="text-xs text-espresso-500">
                  Showing real-time availability for <strong>{selectedDate}</strong>. Booked slots are blocked automatically.
                </p>
              </div>

              {slotsLoading ? (
                <div className="py-12 text-center text-espresso-500 text-xs flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  <span>Checking salon suite availability...</span>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="py-10 text-center bg-white rounded-2xl border border-champagne-300 p-6">
                  <AlertCircle className="w-8 h-8 text-rosegold-500 mx-auto mb-2" />
                  <p className="font-serif text-base text-espresso-800">No slots available on this date</p>
                  <p className="text-xs text-espresso-500 mt-1">Please select another date from our calendar.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {availableSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center justify-center transition-all ${
                        !slot.available
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                          : selectedTime === slot.time
                          ? 'bg-espresso-900 text-white border-gold shadow-md ring-1 ring-gold cursor-pointer'
                          : 'bg-white text-espresso-800 border-champagne-300 hover:border-gold cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gold-deep" />
                        <span className="font-semibold">{slot.time}</span>
                      </div>
                      <span className="text-[10px] mt-0.5 opacity-80">
                        {slot.available ? `${slot.remainingCapacity} Suite Available` : 'Reserved'}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Navigation */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-full border border-champagne-300 text-espresso-700 text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 hover:bg-champagne-200 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                <button
                  type="button"
                  disabled={!selectedTime}
                  onClick={() => setStep(4)}
                  className={`px-8 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    selectedTime 
                      ? 'bg-espresso-900 text-white hover:bg-gold hover:text-espresso-900 shadow-md' 
                      : 'bg-champagne-300/60 text-espresso-400 cursor-not-allowed'
                  }`}
                >
                  <span>Guest Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ENTER CUSTOMER DETAILS */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-xl text-espresso-900 font-semibold mb-1">
                  Guest Information
                </h4>
                <p className="text-xs text-espresso-500">
                  Your reservation reference will be delivered via WhatsApp and phone.
                </p>
              </div>

              <div className="space-y-4 bg-white p-6 rounded-2xl border border-champagne-300 shadow-sm">
                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lady Genevieve Laurent"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-800 focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1.5">
                    Mobile Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-800 focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1.5">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="guest@luxurymail.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-800 focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1.5">
                    Special Requests or Allergies (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-espresso-400 absolute left-3.5 top-3" />
                    <textarea
                      rows="2"
                      placeholder="e.g. Sensitive scalp, bridal trial session, quiet suite preference..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-800 focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-full border border-champagne-300 text-espresso-700 text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 hover:bg-champagne-200 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                <button
                  type="button"
                  disabled={!customerName.trim() || !customerPhone.trim()}
                  onClick={() => setStep(5)}
                  className={`px-8 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    customerName.trim() && customerPhone.trim()
                      ? 'bg-espresso-900 text-white hover:bg-gold hover:text-espresso-900 shadow-md'
                      : 'bg-champagne-300/60 text-espresso-400 cursor-not-allowed'
                  }`}
                >
                  <span>Review Summary</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: BOOKING SUMMARY & COUPON APPLICATION */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-xl text-espresso-900 font-semibold mb-1">
                  Reservation Summary & Privilege Codes
                </h4>
                <p className="text-xs text-espresso-500">
                  Please review your reservation details prior to confirmation.
                </p>
              </div>

              {/* Order Summary Card */}
              <div className="bg-white rounded-2xl p-6 border border-champagne-300 shadow-sm space-y-4">
                <div className="flex items-start justify-between pb-4 border-b border-champagne-200">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gold-deep font-bold">
                      {selectedType === 'package' ? 'VIP Package' : 'Bespoke Ritual'}
                    </span>
                    <h5 className="font-serif text-lg font-semibold text-espresso-900">
                      {selectedItem?.name}
                    </h5>
                    <p className="text-xs text-espresso-500 mt-0.5">
                      {selectedDate} at {selectedTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-xl font-bold text-espresso-900">
                      ${standardAmount}
                    </span>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1.5">
                    Have a Privilege Voucher or Promo Code?
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. FIRSTGLAM, ROYAL15"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-champagne-300 text-xs font-mono uppercase text-espresso-900 focus:outline-none focus:border-gold"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={couponValidating || !couponCode.trim()}
                      onClick={handleApplyCoupon}
                      className="px-5 py-2 rounded-xl bg-champagne-200 hover:bg-gold text-espresso-900 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {couponValidating ? 'Checking...' : 'Apply'}
                    </button>
                  </div>

                  {couponValidation?.valid && (
                    <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{couponValidation.message}</span>
                    </div>
                  )}

                  {couponError && (
                    <div className="mt-2 p-2.5 rounded-xl bg-rosegold-50 border border-rosegold-200 text-rosegold-700 text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rosegold-600 flex-shrink-0" />
                      <span>{couponError}</span>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-champagne-200 space-y-2 text-xs">
                  <div className="flex justify-between text-espresso-600">
                    <span>Treatment Rate</span>
                    <span>${standardAmount.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Privilege Discount ({couponCode.toUpperCase()})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-serif font-bold text-espresso-900 pt-2 border-t border-champagne-200">
                    <span>Total Payable at Parlour</span>
                    <span className="text-xl text-gold-deep">${finalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-champagne-200/50 text-[11px] text-espresso-600 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold-deep flex-shrink-0" />
                  <span>No upfront payment required. You may pay at the parlour via Credit Card or Cash upon completion.</span>
                </div>
              </div>

              {bookingError && (
                <div className="p-3 rounded-xl bg-rosegold-50 border border-rosegold-200 text-rosegold-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              {/* Navigation */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 rounded-full border border-champagne-300 text-espresso-700 text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 hover:bg-champagne-200 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleConfirmReservation}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-gold via-gold-shimmer to-gold text-espresso-900 font-semibold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-gold-glow flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-espresso-900 border-t-transparent rounded-full animate-spin" />
                      <span>Confirming Suite...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirm Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: CONFIRMATION PASS SCREEN */}
          {step === 6 && confirmedBooking && (
            <div className="space-y-6 text-center py-2">
              
              <div className="w-16 h-16 rounded-full bg-gold/20 text-gold-deep border-2 border-gold flex items-center justify-center mx-auto shadow-gold-glow">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <span className="text-gold-deep uppercase tracking-[0.3em] text-xs font-semibold">
                  Reservation Confirmed
                </span>
                <h4 className="font-serif text-2xl sm:text-3xl text-espresso-900 font-semibold mt-1">
                  We Eagerly Await Your Arrival
                </h4>
                <p className="text-xs sm:text-sm text-espresso-600 mt-2 max-w-md mx-auto">
                  A private suite has been reserved under your name. Please present your booking reference upon arrival.
                </p>
              </div>

              {/* Printable VIP Pass Card */}
              <div id="printable-pass" className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold/40 shadow-xl text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gold text-espresso-900 text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-bl-xl shadow-sm">
                  VIP Suite Pass
                </div>

                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-champagne-200">
                  <div className="w-7 h-7 rounded-full bg-espresso-900 text-gold flex items-center justify-center font-serif text-xs">
                    É
                  </div>
                  <div>
                    <h5 className="font-serif text-base font-bold text-espresso-900 leading-tight">
                      {settings?.parlourName || "L'ÉLIXIR"}
                    </h5>
                    <span className="text-[10px] uppercase tracking-widest text-espresso-500">Haute Beauté</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                  <div>
                    <span className="text-espresso-400 block text-[10px] uppercase tracking-wider font-semibold">Booking Reference</span>
                    <span className="font-mono text-base font-bold text-espresso-900 bg-champagne-200/60 px-2 py-0.5 rounded">
                      {confirmedBooking.id}
                    </span>
                  </div>

                  <div>
                    <span className="text-espresso-400 block text-[10px] uppercase tracking-wider font-semibold">Guest Name</span>
                    <span className="font-serif text-sm font-semibold text-espresso-900">
                      {confirmedBooking.customerName}
                    </span>
                  </div>

                  <div>
                    <span className="text-espresso-400 block text-[10px] uppercase tracking-wider font-semibold">Treatment</span>
                    <span className="font-medium text-espresso-800">
                      {confirmedBooking.itemName}
                    </span>
                  </div>

                  <div>
                    <span className="text-espresso-400 block text-[10px] uppercase tracking-wider font-semibold">Date & Time</span>
                    <span className="font-medium text-espresso-800">
                      {confirmedBooking.date} • {confirmedBooking.time}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-champagne-200 flex items-center justify-between">
                  <div>
                    <span className="text-espresso-400 block text-[10px] uppercase tracking-wider">Final Amount</span>
                    <span className="font-serif text-xl font-bold text-gold-deep">
                      ${confirmedBooking.finalAmount?.toFixed(2)}
                    </span>
                  </div>

                  <div className="text-right text-[11px] text-espresso-500">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      Pay at Parlour
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${(settings?.whatsapp || '18005893549').replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello L'ÉLIXIR Concierge! I have confirmed my booking #${confirmedBooking.id} for ${confirmedBooking.date} at ${confirmedBooking.time}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] text-white hover:brightness-105 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp Assistance</span>
                </a>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-champagne-300 text-espresso-800 hover:bg-champagne-200 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Pass</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-espresso-900 text-white font-semibold text-xs uppercase tracking-wider hover:bg-gold hover:text-espresso-900 transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>

            </div>
          )}

        </div>

      </motion.div>

    </div>
  );
}

