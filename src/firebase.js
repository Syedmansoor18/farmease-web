// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Replace these with your actual Firebase project settings
// Found in: Firebase Console -> Project Settings -> General -> Your Apps (Web)
const firebaseConfig = {
  apiKey: "AIzaSyCH70pG4f-ph2P36J4m_JA6eDQ7T8w_eNI",
  authDomain: "farmease-8e447.firebaseapp.com",
  projectId: "farmease-8e447",
  storageBucket: "farmease-8e447.appspot.com",
  messagingSenderId: "773747951286",
  appId: "1:773747951286:web:c402d20d106a0e6f690817"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and export it for use in Login/Signup pages
export const auth = getAuth(app);