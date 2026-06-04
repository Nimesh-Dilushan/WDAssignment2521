// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; //Firebase Authentication

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD6Kmf-7I0wysaL-DPbEyrcJyWtErT1eCU",
    authDomain: "webassignment-11507.firebaseapp.com",
    projectId: "webassignment-11507",
    storageBucket: "webassignment-11507.firebasestorage.app",
    messagingSenderId: "402893173351",
    appId: "1:402893173351:web:980af323d197a12e011ac2"
};

// Initialize Firebase app and Firestore database
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);