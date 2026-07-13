// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

// Authentication
import {
  getAuth
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Firestore
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDaKHUSWbFDYz0DiwUT-sO7kbvWBj17ljk",
  authDomain: "vmee-portfolio.firebaseapp.com",
  projectId: "vmee-portfolio",
  storageBucket: "vmee-portfolio.firebasestorage.app",
  messagingSenderId: "498745379282",
  appId: "1:498745379282:web:7b1cad5a9860e1101fe00b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);