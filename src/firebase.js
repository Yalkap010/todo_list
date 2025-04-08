import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCGukf1kZZxoy7P8jFdS4bXyG8x0SVf3ME",
  authDomain: "todo-app-1cb36.firebaseapp.com",
  projectId: "todo-app-1cb36",
  storageBucket: "todo-app-1cb36.appspot.com",
  messagingSenderId: "105843973910",
  appId: "1:105843973910:web:162e8a679f9c0ff4f83a37",
  measurementId: "G-T2Z66PLYWP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };