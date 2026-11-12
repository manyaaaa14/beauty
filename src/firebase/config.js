import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables or safe luxury defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoLuxuryBeautySalonApiKey2025",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "luxury-beauty-parlour.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "luxury-beauty-parlour",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "luxury-beauty-parlour.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "109823485721",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:109823485721:web:8a7df09c31b2e17"
};

// Check if valid user-configured Firebase credentials exist
export const isLiveFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID && 
  !import.meta.env.VITE_FIREBASE_API_KEY.includes('Demo')
);

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

