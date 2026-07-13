import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA7k5OweZ0FUlSLjZXUn6f-Z5qMMWC2ma8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "e-commerce-market-d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "e-commerce-market-d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "e-commerce-market-d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "310302383319",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:310302383319:web:b703c3c5761fc167ba2492",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
