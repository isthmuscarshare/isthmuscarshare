// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyC5-8UqIJlChLK2Og69R8k0RxQX0z09oT0",
  authDomain: "carshare-53955.firebaseapp.com",
  projectId: "carshare-53955",
  storageBucket: "carshare-53955.appspot.com",
  messagingSenderId: "48005601757",
  appId: "1:48005601757:web:58ab51762f64d0a750fe34",
  measurementId: "G-4PWFKPYKJV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Initialize Firestore