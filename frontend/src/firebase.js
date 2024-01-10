// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "techtales-564.firebaseapp.com",
  projectId: "techtales-564",
  storageBucket: "techtales-564.appspot.com",
  messagingSenderId: "299231581734",
  appId: "1:299231581734:web:130abcb5c6ab4bf0baf8e7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
