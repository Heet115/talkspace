import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCqid3NG10oq9AbXzeEqfWgBrzHcDA-wgo",
  authDomain: "talkspace-53a51.firebaseapp.com",
  projectId: "talkspace-53a51",
  storageBucket: "talkspace-53a51.firebasestorage.app",
  messagingSenderId: "424040903101",
  appId: "1:424040903101:web:27e56070b294bdedce62d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
