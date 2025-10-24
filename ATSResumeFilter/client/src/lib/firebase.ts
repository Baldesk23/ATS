import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAYQj3_zSjBnC74PREQBv6rEShr2QVrWHQ",
  authDomain: "ats-filtro.firebaseapp.com",
  projectId: "ats-filtro",
  storageBucket: "ats-filtro.firebasestorage.app",
  messagingSenderId: "117884251795",
  appId: "1:117884251795:web:3067c411d82937aa386766",
  measurementId: "G-ME1Z6E0LQP"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export { ref, uploadBytes, getDownloadURL, collection, addDoc, serverTimestamp };
