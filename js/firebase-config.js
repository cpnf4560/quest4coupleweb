// Firebase Configuration
// Quest4Couple Firebase Project
const firebaseConfig = {
  apiKey: "AIzaSyA8-Oe449em8Tgo3Q-MJ87CHQdeIqr4tLk",
  authDomain: "quest4couple.firebaseapp.com",
  projectId: "quest4couple",
  storageBucket: "quest4couple.firebasestorage.app",
  messagingSenderId: "27375862534",
  appId: "1:27375862534:web:40039fa60931212e701487",
  measurementId: "G-VK4Z2F1693"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services (with safety checks)
let auth = null;
let googleProvider = null;

// Auth is optional - some pages only need Firestore
if (typeof firebase.auth === 'function') {
  auth = firebase.auth();
  
  // Google Auth Provider
  googleProvider = new firebase.auth.GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
  
  window.firebaseAuth = auth;
  window.googleProvider = googleProvider;
  console.log('🔥 Firebase inicializado com Auth!');
} else {
  console.log('🔥 Firebase inicializado (sem Auth SDK)');
}

// Firestore is always required
const db = firebase.firestore();
window.firebaseDb = db;
