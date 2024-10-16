// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6hEQCltG_aYtqLeRp08HO0j61ILHBI8E",
  authDomain: "dprendd.firebaseapp.com",
  projectId: "dprendd",
  storageBucket: "dprendd.appspot.com",
  messagingSenderId: "289333551537",
  appId: "1:289333551537:web:3cf966365b6668ba0fdd90",
  measurementId: "G-7MGEH9Z2WY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db};