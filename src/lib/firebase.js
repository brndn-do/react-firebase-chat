import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "react-firebase-chat-535f6.firebaseapp.com",
  projectId: "react-firebase-chat-535f6",
  storageBucket: "react-firebase-chat-535f6.firebasestorage.app",
  messagingSenderId: "540761816174",
  appId: "1:540761816174:web:2f6c2d4a0ef066d1923a7f",
  measurementId: "G-FBD09WQXYH"
};

const app = initializeApp(firebaseConfig);