import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB9IjR-9SbDyqR2OLmY-EtIRbk-p_GZTlI",
  authDomain: "forhumanhigh.firebaseapp.com",
  projectId: "forhumanhigh",
  storageBucket: "forhumanhigh.firebasestorage.app",
  messagingSenderId: "746402862113",
  appId: "1:746402862113:web:162aa4c13fc3e542f83f60",
  measurementId: "G-GJQS2BJTEP",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
