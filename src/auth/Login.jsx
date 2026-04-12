import { auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider
} from "firebase/auth";

import { useState } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const githubLogin = async () => {
    const provider = new GithubAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="w-100 bg-slate-800 p-6 rounded-2xl shadow-xl text-white">

        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome Back 👋
        </h2>

        <input className="w-full p-3 mb-3 rounded-lg bg-slate-700 outline-none"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}/>

        <input type="password"
          className="w-full p-3 mb-4 rounded-lg bg-slate-700 outline-none"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}/>

        <button onClick={login}
          className="w-full bg-blue-500 p-3 rounded-lg font-semibold hover:bg-blue-600">
          Login
        </button>

        <p className="text-center my-4 text-gray-400">OR</p>

        <div className="flex gap-3">
          <button onClick={googleLogin}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-secondary cursor-pointer p-2 rounded-lg hover:bg-gray-200">
            <FaGoogle /> Google
          </button>

          <button onClick={githubLogin}
            className="flex-1 flex items-center justify-center gap-2 bg-black cursor-pointer p-2 rounded-lg hover:bg-gray-900">
            <FaGithub /> GitHub
          </button>
        </div>
     </div>
   </div>
  );
}