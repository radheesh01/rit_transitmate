import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import the auth module

const firebaseConfig = {
  apiKey: "AIzaSyB2DIzXsYtI_puj8YWEgYSLQz5pqjaoWuA",
  authDomain: "rittransitmate.firebaseapp.com",
  projectId: "rittransitmate",
  storageBucket: "rittransitmate.firebasestorage.app",
  messagingSenderId: "100009722625",
  appId: "1:100009722625:web:f68cfc7f1a7fb553e51100",
  measurementId: "G-D8DXK2T10V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize auth

export { app, auth }; // Export auth
