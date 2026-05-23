import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDnJCaACKYimBbKX8Hsb0j5Cmgt958zrPA",
  authDomain: "mongodb-af2aa.firebaseapp.com",
  projectId: "mongodb-af2aa",
  storageBucket: "mongodb-af2aa.appspot.com",
  messagingSenderId: "753459863047",
  appId: "1:753459863047:web:8736ac7c2978ed375814a2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();