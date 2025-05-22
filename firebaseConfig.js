import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAy22gURdGyV9oyIF2TmRZaOSG_Xj9vCBM",
  authDomain: "notification-45c40.firebaseapp.com",
  projectId: "notification-45c40",
  storageBucket: "notification-45c40.appspot.com", // fixed typo: was "firebasestorage.app"
  messagingSenderId: "138204598686",
  appId: "1:138204598686:web:5f7d60bd9d2e83d1d5868f",
  measurementId: "G-WND8XSTCQJ"
};

// Prevent duplicate app initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize messaging with the app
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
