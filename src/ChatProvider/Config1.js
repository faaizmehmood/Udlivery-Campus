// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLFdUe7l0ZZjoglPLMd1jVKEslgkngFOk",
  authDomain: "udelivery-97b48.firebaseapp.com",
  databaseURL: "https://udelivery-97b48.firebaseio.com",
  projectId: "udelivery-97b48",
  storageBucket: "udelivery-97b48.appspot.com",
  messagingSenderId: "809390235305",
  appId: "1:809390235305:android:efc0155139fa17e7e513b8",
  measurementId: "G-TH8MV6TBG8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Setup DB connection
const db = getDatabase(app);

export { app, db}