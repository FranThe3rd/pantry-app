// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3sxy4Zrfq97EL4zli208Wc1LbGNrxL5Y",
  authDomain: "inventory-management-bb15b.firebaseapp.com",
  projectId: "inventory-management-bb15b",
  storageBucket: "inventory-management-bb15b.appspot.com",
  messagingSenderId: "73828801848",
  appId: "1:73828801848:web:5ba09cf808b77f38e3f5cd",
  measurementId: "G-T75HGLMKZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}