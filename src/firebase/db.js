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
import {
  createUserWithEmailAndPassword,
  getIdTokenResult,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, db, isLiveFirebaseConfigured } from './config';
import { INITIAL_SETTINGS, INITIAL_SCHEDULE_SETTINGS } from './seedData';

// Local storage storage keys for robust offline/demo fallback
const STORAGE_KEYS = {
  SERVICES: 'lelixir_services',
  PACKAGES: 'lelixir_packages',
  OFFERS: 'lelixir_offers',
  GALLERY: 'lelixir_gallery',
  BEFORE_AFTER: 'lelixir_before_after',
  REVIEWS: 'lelixir_reviews',
  EXPERIENCE: 'lelixir_experience',
  SETTINGS: 'lelixir_settings',
  SCHEDULE: 'lelixir_schedule',
  BOOKINGS: 'lelixir_bookings',
  USERS: 'lelixir_users',
  CURRENT_USER: 'lelixir_current_user',
  ADMIN_AUTH: 'lelixir_admin_auth'
};

const CLEANUP_VERSION = 'lelixir_data_cleanup_v1';
const DEFAULT_SETTINGS = { parlourName: 'GLAMMORA' };
const normalizeSettings = (settings = {}) => {
  const normalized = {
    ...settings,
    parlourName: settings.parlourName === "L'ÉLIXIR"
      ? 'GLAMMORA'
      : settings.parlourName || DEFAULT_SETTINGS.parlourName,
    tagline: settings.tagline || settings.parlourTagline || '',
    subtitle: settings.subtitle || settings.parlourDescription || '',
    address: settings.address || settings.parlourAddress || '',
    email: settings.email || settings.parlourContactEmail || ''
  };

  Object.entries(LEGACY_DEMO_SETTINGS).forEach(([key, demoValue]) => {
    if (normalized[key] === demoValue) {
      normalized[key] = '';
    }
  });
  if (normalized.googleMapsEmbed?.includes('Eiffel%20Tower')) {
    normalized.googleMapsEmbed = '';
  }

  return normalized;
};
const LEGACY_DEMO_IDS = {
  services: Array.from({ length: 12 }, (_, index) => `srv-${index + 1}`),
  packages: Array.from({ length: 4 }, (_, index) => `pkg-${index + 1}`),
  offers: Array.from({ length: 3 }, (_, index) => `off-${index + 1}`),
  gallery: Array.from({ length: 6 }, (_, index) => `gal-${index + 1}`),
  beforeAfter: ['ba-1', 'ba-2'],
  reviews: Array.from({ length: 4 }, (_, index) => `rev-${index + 1}`),
  experience: Array.from({ length: 6 }, (_, index) => `exp-${index + 1}`),
  bookings: ['LX-89104A', 'LX-44129B', 'LX-22081C']
};
const LEGACY_DEMO_SETTINGS = {
  tagline: 'Haute Beauté & Sanctuary of Timeless Elegance',
  subtitle: 'Step into an oasis where Parisian artistry meets Swiss cellular science. Bespoke beauty rituals tailored exclusively for discerning individuals.',
  phone: '+1 (800) 589-3549',
  whatsapp: '+18005893549',
  email: 'concierge@lelixir-beaute.com',
  address: '742 Royale Boulevard, Haute District, Suite 400',
  city: 'Beverly Hills / Paris',
  openingHours: 'Mon - Sat: 9:00 AM – 8:00 PM | Sun: 10:00 AM – 6:00 PM',
  instagramUrl: 'https://instagram.com/lelixir.beaute',
  facebookUrl: 'https://facebook.com/lelixir.beaute',
  announcement: '✨ Reserve your festive beauty suites early — Complimentary champagne with all VIP Packages.',
  heroHeadline: 'Where Artistry Meets Pure Luxury',
  heroSubheadline: 'Experience world-class hair artistry, 24K gold facial rituals, and bespoke bridal transformations in private marble suites.'
};

const removeSeededLocalRecords = (key, seededRecords) => {
  const records = JSON.parse(localStorage.getItem(key) || '[]');
  const demoIds = new Set(seededRecords);
  localStorage.setItem(key, JSON.stringify(records.filter(record => !demoIds.has(record.id))));
};

const removeLegacyDemoRecords = () => {
  if (localStorage.getItem(CLEANUP_VERSION) === 'complete') return;

  const seededCollections = [
    [STORAGE_KEYS.SERVICES, LEGACY_DEMO_IDS.services],
    [STORAGE_KEYS.PACKAGES, LEGACY_DEMO_IDS.packages],
    [STORAGE_KEYS.OFFERS, LEGACY_DEMO_IDS.offers],
    [STORAGE_KEYS.GALLERY, LEGACY_DEMO_IDS.gallery],
    [STORAGE_KEYS.BEFORE_AFTER, LEGACY_DEMO_IDS.beforeAfter],
    [STORAGE_KEYS.REVIEWS, LEGACY_DEMO_IDS.reviews],
    [STORAGE_KEYS.EXPERIENCE, LEGACY_DEMO_IDS.experience],
    [STORAGE_KEYS.BOOKINGS, LEGACY_DEMO_IDS.bookings]
  ];

  seededCollections.forEach(([key, seededRecords]) => {
    removeSeededLocalRecords(key, seededRecords);
  });

  const currentSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || 'null');
  if (currentSettings) {
    const cleanSettings = { ...currentSettings };
    if (cleanSettings.parlourName === "L'ÉLIXIR") {
      cleanSettings.parlourName = INITIAL_SETTINGS.parlourName;
    }
    Object.entries(LEGACY_DEMO_SETTINGS).forEach(([key, demoValue]) => {
      if (cleanSettings[key] === demoValue) {
        cleanSettings[key] = INITIAL_SETTINGS[key] || '';
      }
    });
    if (cleanSettings.googleMapsEmbed?.includes('Eiffel%20Tower')) {
      cleanSettings.googleMapsEmbed = '';
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(cleanSettings));
  }

  localStorage.setItem(CLEANUP_VERSION, 'complete');
};

// Initialize local store
const initLocalStore = () => {
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PACKAGES)) {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.OFFERS)) {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BEFORE_AFTER)) {
    localStorage.setItem(STORAGE_KEYS.BEFORE_AFTER, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXPERIENCE)) {
    localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SCHEDULE)) {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(INITIAL_SCHEDULE_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
  }

  removeLegacyDemoRecords();

  const savedSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || 'null');
  if (savedSettings) {
    const normalizedSettings = normalizeSettings(savedSettings);
    if (JSON.stringify(savedSettings) !== JSON.stringify(normalizedSettings)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(normalizedSettings));
    }
  }
};

// Run initialization
initLocalStore();

// ==========================================
// USER AUTHENTICATION API
// ==========================================
const getStoredUsers = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  return raw ? JSON.parse(raw) : [];
};

const toPublicUser = ({ password, passwordHash, passwordSalt, ...user }) => user;

const hashPassword = async (password, salt) => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: Uint8Array.from(salt.match(/.{2}/g), byte => parseInt(byte, 16)),
    iterations: 120000,
    hash: 'SHA-256'
  }, key, 256);

  return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, '0')).join('');
};

const createPasswordSalt = () => Array.from(
  crypto.getRandomValues(new Uint8Array(16)),
  byte => byte.toString(16).padStart(2, '0')
).join('');

export const getUsers = () => getStoredUsers().map(toPublicUser);

export const registerUser = async ({ name, email, phone, password }) => {
  const cleanEmail = email.trim().toLowerCase();
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }

  if (isLiveFirebaseConfigured) {
    const { user } = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    await updateProfile(user, { displayName: name.trim() });
    const newUser = {
      id: user.uid,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim()
    };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return newUser;
  }

  const users = getStoredUsers();
  if (users.some(u => u.email === cleanEmail)) {
    throw new Error('An account with this email address already exists. Please sign in.');
  }

  const passwordSalt = createPasswordSalt();
  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    phone: phone.trim(),
    passwordSalt,
    passwordHash: await hashPassword(password, passwordSalt),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  const publicUser = toPublicUser(newUser);
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(publicUser));
  return publicUser;
};

export const loginUser = async ({ email, password }) => {
  const cleanEmail = email.trim().toLowerCase();

  if (isLiveFirebaseConfigured) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const isAdmin = await isAuthorizedAdmin(user);
      const signedInUser = {
        id: user.uid,
        name: user.displayName || cleanEmail.split('@')[0],
        email: cleanEmail,
        isAdmin
      };

      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(signedInUser));
      return signedInUser;
    } catch (error) {
      if (!['auth/user-not-found', 'auth/invalid-credential', 'auth/wrong-password'].includes(error.code)) {
        throw error;
      }
    }
  }

  const users = getStoredUsers();
  
  const foundIndex = users.findIndex(user => user.email === cleanEmail);
  const found = users[foundIndex];
  if (found) {
    let passwordMatches = false;
    if (found.passwordHash && found.passwordSalt) {
      passwordMatches = (await hashPassword(password, found.passwordSalt)) === found.passwordHash;
    } else if (found.password === password) {
      const passwordSalt = createPasswordSalt();
      found.passwordSalt = passwordSalt;
      found.passwordHash = await hashPassword(password, passwordSalt);
      delete found.password;
      users[foundIndex] = found;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      passwordMatches = true;
    }

    if (passwordMatches) {
      const publicUser = toPublicUser(found);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(publicUser));
      return publicUser;
    }
  }

  throw new Error('Invalid email or password. Please check your credentials.');
};

export const getCurrentUser = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  const user = raw ? JSON.parse(raw) : null;
  if (user?.isGuest) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    return null;
  }
  return user;
};

export const isAuthorizedAdmin = async (user) => {
  const [adminRecord, token] = await Promise.all([
    getDoc(doc(db, 'admins', user.uid)),
    getIdTokenResult(user)
  ]);
  return adminRecord.exists() || token.claims.admin === true;
};

export const logoutUser = async () => {
  if (auth.currentUser) {
    await signOut(auth);
  }
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};


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
  return raw ? JSON.parse(raw) : [];
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
  return raw ? JSON.parse(raw) : [];
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
  return raw ? JSON.parse(raw) : [];
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

// Coupon validation
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
  return raw ? JSON.parse(raw) : [];
};

export const getBeforeAfter = async () => {
  const raw = localStorage.getItem(STORAGE_KEYS.BEFORE_AFTER);
  return raw ? JSON.parse(raw) : [];
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
// EXPERIENCE / WHY CHOOSE US API
// ==========================================
export const getExperience = async () => {
  if (isLiveFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'experience'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Firestore fallback for experience:', err);
    }
  }
  const raw = localStorage.getItem(STORAGE_KEYS.EXPERIENCE);
  return raw ? JSON.parse(raw) : [];
};

export const saveExperienceItem = async (itemData) => {
  const isNew = !itemData.id;
  const id = isNew ? `exp-${Date.now()}` : itemData.id;
  const record = { ...itemData, id };

  if (isLiveFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'experience', id), record, { merge: true });
    } catch (err) {
      console.warn('Firestore saveExperienceItem error:', err);
    }
  }

  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPERIENCE) || '[]');
  const idx = items.findIndex(e => e.id === id);
  if (idx >= 0) {
    items[idx] = record;
  } else {
    items.unshift(record);
  }
  localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(items));
  return record;
};

export const deleteExperienceItem = async (id) => {
  if (isLiveFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'experience', id));
    } catch (err) {
      console.warn('Firestore deleteExperienceItem error:', err);
    }
  }
  const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPERIENCE) || '[]');
  const filtered = items.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(filtered));
  return true;
};

// ==========================================
// REVIEWS API
// ==========================================
export const getReviews = async () => {
  const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  return raw ? JSON.parse(raw) : [];
};

// ==========================================
// SETTINGS & CONTACT API
// ==========================================
export const getSettings = async () => {
  if (isLiveFirebaseConfigured) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'general'));
      if (snap.exists()) {
        return normalizeSettings(snap.data());
      }
    } catch (err) {
      console.warn('Firestore fallback for settings:', err);
    }
  }
  const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return normalizeSettings(raw ? JSON.parse(raw) : DEFAULT_SETTINGS);
};

export const saveSettings = async (settingsData) => {
  const normalizedSettings = normalizeSettings(settingsData);
  if (isLiveFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'settings', 'general'), normalizedSettings, { merge: true });
    } catch (err) {
      console.warn('Firestore saveSettings error:', err);
    }
  }
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(normalizedSettings));
  return normalizedSettings;
};

// ==========================================
// SCHEDULE SETTINGS API
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
// APPOINTMENTS & BOOKINGS API
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
  return raw ? JSON.parse(raw) : [];
};

export const getAvailableTimeSlots = async (selectedDate) => {
  const schedule = await getScheduleSettings();
  const bookings = await getBookings();

  if (!selectedDate) return [];

  const isDateBlocked = (schedule.blockedDates || []).some(b => b.date === selectedDate);
  if (isDateBlocked) {
    return { available: false, reason: 'The parlour is closed on this date for a scheduled holiday.' };
  }

  const dateObj = new Date(selectedDate + 'T00:00:00');
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = daysOfWeek[dateObj.getDay()];

  if (!schedule.workingDays.includes(dayName)) {
    return { available: false, reason: `The parlour is closed on ${dayName}s.` };
  }

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
    const slotOverlapsBreak = (currentMin < breakEndTotal && (currentMin + interval) > breakStartTotal);

    if (!slotOverlapsBreak) {
      const h = Math.floor(currentMin / 60);
      const m = currentMin % 60;
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const displayM = m < 10 ? `0${m}` : m;
      const timeStr = `${displayH < 10 ? '0' + displayH : displayH}:${displayM} ${period}`;

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

export const createBooking = async (bookingPayload) => {
  const { date, time } = bookingPayload;

  const schedule = await getScheduleSettings();
  const currentBookings = await getBookings();
  const maxCapacity = schedule.maxCapacityPerSlot || 2;

  const conflictingBookings = currentBookings.filter(b => 
    b.date === date && b.time === time && b.status !== 'Cancelled'
  );

  if (conflictingBookings.length >= maxCapacity) {
    throw new Error(`The slot at ${time} on ${date} was just reserved by another guest. Please select another slot.`);
  }

  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const letterCode = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const bookingId = `LX-${randomSuffix}${letterCode}`;

  const newBooking = {
    ...bookingPayload,
    id: bookingId,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  if (isLiveFirebaseConfigured) {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await setDoc(bookingRef, newBooking);
    } catch (err) {
      console.warn('Firestore createBooking error, falling back to local persistence:', err);
    }
  }

  const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  list.unshift(newBooking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));

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

// ==========================================
// Remove built-in sample records while preserving administrator-created content
// ==========================================
export const clearAllDemoData = async () => {
  const seededCollections = [
    ['services', LEGACY_DEMO_IDS.services],
    ['packages', LEGACY_DEMO_IDS.packages],
    ['offers', LEGACY_DEMO_IDS.offers],
    ['gallery', LEGACY_DEMO_IDS.gallery],
    ['experience', LEGACY_DEMO_IDS.experience],
    ['bookings', LEGACY_DEMO_IDS.bookings]
  ];

  if (isLiveFirebaseConfigured) {
    await Promise.all(seededCollections.flatMap(([collectionName, records]) =>
      records.map(id => deleteDoc(doc(db, collectionName, id)))
    ));
  }

  [
    [STORAGE_KEYS.SERVICES, LEGACY_DEMO_IDS.services],
    [STORAGE_KEYS.PACKAGES, LEGACY_DEMO_IDS.packages],
    [STORAGE_KEYS.OFFERS, LEGACY_DEMO_IDS.offers],
    [STORAGE_KEYS.GALLERY, LEGACY_DEMO_IDS.gallery],
    [STORAGE_KEYS.BEFORE_AFTER, LEGACY_DEMO_IDS.beforeAfter],
    [STORAGE_KEYS.REVIEWS, LEGACY_DEMO_IDS.reviews],
    [STORAGE_KEYS.EXPERIENCE, LEGACY_DEMO_IDS.experience],
    [STORAGE_KEYS.BOOKINGS, LEGACY_DEMO_IDS.bookings]
  ].forEach(([key, records]) => removeSeededLocalRecords(key, records));

  const currentSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || 'null');
  if (currentSettings) {
    const cleanSettings = { ...currentSettings };
    Object.entries(LEGACY_DEMO_SETTINGS).forEach(([key, demoValue]) => {
      if (cleanSettings[key] === demoValue) {
        cleanSettings[key] = INITIAL_SETTINGS[key] || '';
      }
    });
    if (cleanSettings.googleMapsEmbed?.includes('Eiffel%20Tower')) {
      cleanSettings.googleMapsEmbed = '';
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(cleanSettings));
  }
  localStorage.setItem(CLEANUP_VERSION, 'complete');
  return true;
};
