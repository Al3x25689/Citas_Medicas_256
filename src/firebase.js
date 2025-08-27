// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1IKimPz_rBLbShKvx8WcJNNOsFuJBBvg",
  authDomain: "citasmedicas256.firebaseapp.com",
  projectId: "citasmedicas256",
  storageBucket: "citasmedicas256.firebasestorage.app",
  messagingSenderId: "973736247924",
  appId: "1:973736247924:web:bfc5161fe5116168694721",
  measurementId: "G-L05KZY30LG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
