import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjjpuUTVR-huy5OCdYSsGLQJb1ZGK_R7Y",
  authDomain: "neverx-1bc28.firebaseapp.com",
  projectId: "neverx-1bc28",
  storageBucket: "neverx-1bc28.firebasestorage.app",
  messagingSenderId: "812758745661",
  appId: "1:812758745661:web:82e9b65cd411d6e1122054",
  measurementId: "G-VPJHV7L068"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();