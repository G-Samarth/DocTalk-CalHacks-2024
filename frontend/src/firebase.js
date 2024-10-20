// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD0m5k7H46-Hv0guud2sUAwbOBTKdQJ0Uc",
  authDomain: "doctalk-9e28b.firebaseapp.com",
  projectId: "doctalk-9e28b",
  storageBucket: "doctalk-9e28b.appspot.com",
  messagingSenderId: "563035266383",
  appId: "1:563035266383:web:1b02a0823fba16895bb93a",
  measurementId: "G-L7GHKGZW2M",
};

// Replace the placeholder values above with your actual Firebase configuration

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
