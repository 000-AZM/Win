// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCGN7t5FjDeJ-ewm7S_9z0VJrRSggTaJ2Q",
  authDomain: "coin-base-by-hector.firebaseapp.com",
  databaseURL: "https://coin-base-by-hector-default-rtdb.firebaseio.com",
  projectId: "coin-base-by-hector",
  storageBucket: "coin-base-by-hector.firebasestorage.app",
  messagingSenderId: "398789890422",
  appId: "1:398789890422:web:ed6a928037b24be2e36a57",
  measurementId: "G-SGJJM5K3G9"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
