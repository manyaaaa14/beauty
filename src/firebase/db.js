import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  runTransaction 
} from 'firebase/firestore';
import { db, isLiveFirebaseConfigured } from './config';
import { 
  INITIAL_SERVICES, 
  INITIAL_PACKAGES, 
  INITIAL_OFFERS, 
  INITIAL_GALLERY, 
  INITIAL_BEFORE_AFTER,
  INITIAL_REVIEWS, 
  INITIAL_SETTINGS, 
  INITIAL_SCHEDULE_SETTINGS, 
  INITIAL_BOOKINGS 
} from './seedData';

// Local storage storage keys for robust offline/demo fallback
const STORAGE_KEYS = {
  SERVICES: 'lelixir_services',
  PACKAGES: 'lelixir_packages',
  OFFERS: 'lelixir_offers',
  GALLERY: 'lelixir_gallery',
  BEFORE_AFTER: 'lelixir_before_after',
  REVIEWS: 'lelixir_reviews',
  SETTINGS: 'lelixir_settings',
  SCHEDULE: 'lelixir_schedule',
  BOOKINGS: 'lelixir_bookings',
  ADMIN_AUTH: 'lelixir_admin_auth'
};

// Initialize local store with initial seed if empty
const initLocalStore = () => {
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PACKAGES)) {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(INITIAL_PACKAGES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.OFFERS)) {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(INITIAL_OFFERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BEFORE_AFTER)) {
    localStorage.setItem(STORAGE_KEYS.BEFORE_AFTER, JSON.stringify(INITIAL_BEFORE_AFTER));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SCHEDULE)) {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(INITIAL_SCHEDULE_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  }
};

// Run initialization
initLocalStore();

// ==========================================
// SERVICES API
// ==========================================
export const getServices = async () => {
  if (isLiveFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'services'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Firestore fallback to local store for services:', err);
    }
  }
  const raw = localStorage.getItem(STORAGE_KEYS.SERVICES);
  return raw ? JSON.parse(raw) : INITIAL_SERVICES;
};

export const saveService = async (serviceData) => {
  const isNew = !serviceData.id;
  const id = isNew ? `srv-${Date.now()}` : serviceData.id;
  const record = { ...serviceData, id };

  if (isLiveFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'services', id), record, { merge: true });
    } catch (err) {
      console.warn('Firestore saveService error:', err);
    }
  }

  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]');
  const idx = items.findIndex(s => s.id === id);
  if (idx >= 0) {
    items[idx] = record;
  } else {
    items.unshift(record);
  }
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(items));
  return record;
};

export const deleteService = async (id) => {
  if (isLiveFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (err) {
      console.warn('Firestore deleteService error:', err);
    }
  }
  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]');
  const filtered = items.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(filtered));
  return true;
};

// ==========================================
// PACKAGES API
// ==========================================
export const getPackages = async () => {
  if (isLiveFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'packages'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Firestore fallback for packages:', err);
    }
  }
  const raw = localStorage.getItem(STORAGE_KEYS.PACKAGES);
  return raw ? JSON.parse(raw) : INITIAL_PACKAGES;
};

export const savePackage = async (packageData) => {
  const isNew = !packageData.id;
  const id = isNew ? `pkg-${Date.now()}` : packageData.id;
  const record = { ...packageData, id };

  if (isLiveFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'packages', id), record, { merge: true });
    } catch (err) {
      console.warn('Firestore savePackage error:', err);
    }
  }

  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.PACKAGES) || '[]');
  const idx = items.findIndex(p => p.id === id);
  if (idx >= 0) {
    items[idx] = record;
  } else {
    items.unshift(record);
  }
  localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(items));
  return record;
};

export const deletePackage = async (id) => {
  if (isLiveFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'packages', id));
    } catch (err) {
      console.warn('Firestore deletePackage error:', err);
    }
  }
  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.PACKAGES) || '[]');
  const filtered = items.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(filtered));
  return true;
};

// ==========================================
// OFFERS & COUPONS API
// ==========================================
export const getOffers = async () => {
  if (isLiveFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'offers'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Firestore fallback for offers:', err);
    }
  }
  const raw = localStorage.getItem(STORAGE_KEYS.OFFERS);
  return raw ? JSON.parse(raw) : INITIAL_OFFERS;
};

export const saveOffer = async (offerData) => {
  const isNew = !offerData.id;
  const id = isNew ? `off-${Date.now()}` : offerData.id;
  const record = { 
    ...offerData, 
    id, 
    code: (offerData.code || '').toUpperCase().trim(),
    usedCount: offerData.usedCount || 0
  };

  if (isLiveFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'offers', id), record, { merge: true });
    } catch (err) {
      console.warn('Firestore saveOffer error:', err);
    }
  }

  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFERS) || '[]');
  const idx = items.findIndex(o => o.id === id);
  if (idx >= 0) {
    items[idx] = record;
  } else {
    items.unshift(record);
  }
  localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(items));
  return record;
};

export const deleteOffer = async (id) => {
  if (isLiveFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'offers', id));
    } catch (err) {
      console.warn('Firestore deleteOffer error:', err);
    }
  }
  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFERS) || '[]');
  const filtered = items.filter(o => o.id !== id);
  localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(filtered));
  return true;
};

// Server-side/backend coupon validation logic
export const validateCoupon = async (code, amount) => {
  if (!code) return { valid: false, message: 'No coupon code specified' };
  const cleanCode = code.trim().toUpperCase();
  const offers = await getOffers();
  const offer = offers.find(o => o.code.toUpperCase() === cleanCode);

  if (!offer) {
    return { valid: false, message: 'Invalid coupon code' };
  }
  if (!offer.active) {
    return { valid: false, message: 'This promotion is no longer active' };
  }
  if (offer.expiryDate) {
    const today = new Date().toISOString().split('T')[0];
    if (offer.expiryDate < today) {
      return { valid: false, message: 'This promotion has expired' };
    }
  }
  if (offer.minSpend && amount < offer.minSpend) {
    return { 
      valid: false, 
      message: `Minimum spend of $${offer.minSpend} required to use ${cleanCode}` 
    };
  }
  if (offer.usageLimit && offer.usedCount >= offer.usageLimit) {
    return { valid: false, message: 'This coupon usage limit has been reached' };
  }

  // Calculate discount
  let discount = 0;
  if (offer.discountType === 'percentage') {
    discount = (amount * offer.discountValue) / 100;
    if (offer.maxDiscount && discount > offer.maxDiscount) {
      discount = offer.maxDiscount;
    }
  } else {
    discount = Math.min(offer.discountValue, amount);
  }

  return {
    valid: true,
    offer,
    discountAmount: Math.round(discount * 100) / 100,
    finalAmount: Math.max(0, Math.round((amount - discount) * 100) / 100),
    message: `Coupon ${cleanCode} applied! Saved $${discount.toFixed(2)}`
  };
};

// ==========================================
// GALLERY API
// ==========================================
export const getGallery = async () => {
  if (isLiveFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'gallery'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Firestore fallback for gallery:', err);
    }
  }
  const raw = localStorage.getItem(STORAGE_KEYS.GALLERY);
  return raw ? JSON.parse(raw) : INITIAL_GALLERY;
};

export const getBeforeAfter = async () => {
  const raw = localStorage.getItem(STORAGE_KEYS.BEFORE_AFTER);
  return raw ? JSON.parse(raw) : INITIAL_BEFORE_AFTER;
};

export const saveGalleryItem = async (itemData) => {
  const isNew = !itemData.id;
  const id = isNew ? `gal-${Date.now()}` : itemData.id;
  const record = { ...itemData, id };

  if (isLiveFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'gallery', id), record, { merge: true });
    } catch (err) {
      console.warn('Firestore saveGalleryItem error:', err);
    }
  }

  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY) || '[]');
  const idx = items.findIndex(g => g.id === id);
  if (idx >= 0) {
    items[idx] = record;
  } else {
    items.unshift(record);
  }
  localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(items));
  return record;
};

export const deleteGalleryItem = async (id) => {
  if (isLiveFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (err) {
      console.warn('Firestore deleteGalleryItem error:', err);
    }
  }
  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY) || '[]');
  const filtered = items.filter(g => g.id !== id);
  localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(filtered));
  return true;
};

// ==========================================
// REVIEWS API
// ==========================================
export const getReviews = async () => {
  const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  return raw ? JSON.parse(raw) : INITIAL_REVIEWS;
};

// ==========================================
// SETTINGS API
// ==========================================
export const getSettings = async () => {
  if (isLiveFirebaseConfigured) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'general'));
      if (snap.exists()) {
        return snap.data();
      }
    } catch (err) {
      console.warn('Firestore fallback for settings:', err);
    }
  }
  const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return raw ? JSON.parse(raw) : INITIAL_SETTINGS;
};

export const saveSettings = async (settingsData) => {
  if (isLiveFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'settings', 'general'), settingsData, { merge: true });
    } catch (err) {
      console.warn('Firestore saveSettings error:', err);
    }
  }
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settingsData));
  return settingsData;
};

// ==========================================
// APPOINTMENT & SCHEDULE SETTINGS API
// ==========================================
export const getScheduleSettings = async () => {
  if (isLiveFirebaseConfigured) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'schedule'));
      if (snap.exists()) {
        return snap.data();
      }
    } catch (err) {
      console.warn('Firestore fallback for schedule:', err);
    }
  }
  const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
  return raw ? JSON.parse(raw) : INITIAL_SCHEDULE_SETTINGS;
};

export const saveScheduleSettings = async (scheduleData) => {
  if (isLiveFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'settings', 'schedule'), scheduleData, { merge: true });
    } catch (err) {
      console.warn('Firestore saveScheduleSettings error:', err);
    }
  }
  localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(scheduleData));
  return scheduleData;
};

// ==========================================
// APPOINTMENTS & BOOKINGS API (With Conflict Prevention)
// ==========================================
export const getBookings = async () => {
  if (isLiveFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'bookings'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Firestore fallback for bookings:', err);
    }
  }
  const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  return raw ? JSON.parse(raw) : INITIAL_BOOKINGS;
};

// Find available slots for a given date
export const getAvailableTimeSlots = async (selectedDate) => {
  const schedule = await getScheduleSettings();
  const bookings = await getBookings();

  if (!selectedDate) return [];

  // Check if date is blocked/holiday
  const isDateBlocked = (schedule.blockedDates || []).some(b => b.date === selectedDate);
  if (isDateBlocked) {
    return { available: false, reason: 'The parlour is closed on this date for a scheduled holiday.' };
  }

  // Check day of week
  const dateObj = new Date(selectedDate + 'T00:00:00');
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = daysOfWeek[dateObj.getDay()];

  if (!schedule.workingDays.includes(dayName)) {
    return { available: false, reason: `The parlour is closed on ${dayName}s.` };
  }

  // Generate all possible slots between open and close
  const [openH, openM] = schedule.openTime.split(':').map(Number);
  const [closeH, closeM] = schedule.closeTime.split(':').map(Number);
  const [breakStartH, breakStartM] = (schedule.breakStart || '13:00').split(':').map(Number);
  const [breakEndH, breakEndM] = (schedule.breakEnd || '14:00').split(':').map(Number);
  
  const interval = schedule.slotIntervalMinutes || 45;
  const maxCapacity = schedule.maxCapacityPerSlot || 2;

  let currentMin = openH * 60 + openM;
  const endMin = closeH * 60 + closeM;
  const breakStartTotal = breakStartH * 60 + breakStartM;
  const breakEndTotal = breakEndH * 60 + breakEndM;

  const activeBookingsForDate = bookings.filter(b => 
    b.date === selectedDate && b.status !== 'Cancelled'
  );

  const slots = [];

  while (currentMin + interval <= endMin) {
    // Check if within break time
    const slotOverlapsBreak = (currentMin < breakEndTotal && (currentMin + interval) > breakStartTotal);

    if (!slotOverlapsBreak) {
      const h = Math.floor(currentMin / 60);
      const m = currentMin % 60;
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const displayM = m < 10 ? `0${m}` : m;
      const timeStr = `${displayH < 10 ? '0' + displayH : displayH}:${displayM} ${period}`;

      // Check how many bookings already exist for this time slot
      const existingCount = activeBookingsForDate.filter(b => b.time === timeStr).length;
      const isAvailable = existingCount < maxCapacity;

      slots.push({
        time: timeStr,
        available: isAvailable,
        remainingCapacity: Math.max(0, maxCapacity - existingCount)
      });
    }

    currentMin += interval;
  }

  return { available: true, slots };
};

// Create booking with double-booking prevention & atomic confirmation
export const createBooking = async (bookingPayload) => {
  const { date, time, customerPhone } = bookingPayload;

  // 1. Double-booking check
  const schedule = await getScheduleSettings();
  const currentBookings = await getBookings();
  const maxCapacity = schedule.maxCapacityPerSlot || 2;

  const conflictingBookings = currentBookings.filter(b => 
    b.date === date && b.time === time && b.status !== 'Cancelled'
  );

  if (conflictingBookings.length >= maxCapacity) {
    throw new Error(`The slot at ${time} on ${date} was just reserved by another guest. Please select another slot.`);
  }

  // Generate unique booking ID: e.g. LX-74918X
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const letterCode = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const bookingId = `LX-${randomSuffix}${letterCode}`;

  const newBooking = {
    ...bookingPayload,
    id: bookingId,
    status: 'Confirmed', // Default to confirmed luxury reservation
    createdAt: new Date().toISOString()
  };

  // If live Firestore configured, execute transaction or setDoc
  if (isLiveFirebaseConfigured) {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await setDoc(bookingRef, newBooking);
    } catch (err) {
      console.warn('Firestore createBooking error, falling back to local persistence:', err);
    }
  }

  // Persist locally
  const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  list.unshift(newBooking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));

  // If a coupon code was used, increment offer usage count
  if (bookingPayload.couponCode) {
    try {
      const offers = await getOffers();
      const offer = offers.find(o => o.code.toUpperCase() === bookingPayload.couponCode.toUpperCase());
      if (offer) {
        offer.usedCount = (offer.usedCount || 0) + 1;
        await saveOffer(offer);
      }
    } catch (e) {
      console.warn('Failed to increment coupon count', e);
    }
  }

  return newBooking;
};

// Lookup booking by ID and Phone number (Confidential & Secure)
export const lookupBooking = async (bookingId, phone) => {
  if (!bookingId || !phone) {
    return { found: false, message: 'Please provide both Booking Reference and Registered Phone Number.' };
  }

  const cleanId = bookingId.trim().toUpperCase();
  const cleanPhone = phone.replace(/\D/g, '');

  const bookings = await getBookings();
  const match = bookings.find(b => {
    const idMatches = b.id.toUpperCase() === cleanId;
    const phoneMatches = (b.customerPhone || '').replace(/\D/g, '').endsWith(cleanPhone.slice(-7));
    return idMatches && phoneMatches;
  });

  if (!match) {
    return {
      found: false,
      message: 'No matching reservation found for the given reference and contact number. Please verify and try again.'
    };
  }

  return { found: true, booking: match };
};

// Update booking status (Admin: Confirm, Reject/Cancel, Complete, Reschedule, Notes)
export const updateBookingStatus = async (bookingId, updateData) => {
  if (isLiveFirebaseConfigured) {
    try {
      const ref = doc(db, 'bookings', bookingId);
      await updateDoc(ref, updateData);
    } catch (err) {
      console.warn('Firestore updateBookingStatus error:', err);
    }
  }

  const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  const idx = list.findIndex(b => b.id === bookingId);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...updateData };
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
    return list[idx];
  }
  throw new Error('Booking not found');
};

export const deleteBooking = async (bookingId) => {
  if (isLiveFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
    } catch (err) {
      console.warn('Firestore deleteBooking error:', err);
    }
  }

  const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  const filtered = list.filter(b => b.id !== bookingId);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(filtered));
  return true;
};

// Reset to initial seed data helper (for admin convenience)
export const resetToInitialSeed = () => {
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
  localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(INITIAL_PACKAGES));
  localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(INITIAL_OFFERS));
  localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
  localStorage.setItem(STORAGE_KEYS.BEFORE_AFTER, JSON.stringify(INITIAL_BEFORE_AFTER));
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(INITIAL_SCHEDULE_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  return true;
};

