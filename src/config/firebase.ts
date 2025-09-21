// src/config/firebase.ts

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2fkZAJDLibETIT8md1NQ3_L5FkfHvovw",
  authDomain: "darkaiclient.firebaseapp.com",
  projectId: "darkaiclient",
  storageBucket: "darkaiclient.firebasestorage.app",
  messagingSenderId: "483134051021",
  appId: "1:483134051021:web:5869034d4e2628cbfa8f84",
  measurementId: "G-S6XKD54LXM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Firebase Auth instance
export const auth = getAuth(app);

// Google provider with forced account chooser
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});

export default app;
