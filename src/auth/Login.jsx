import { auth } from "../firebase/config";
import { saveUser } from "../firebase/userService";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider
} from "firebase/auth";

import { useState } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!email || !password) {
      toast.error("Email va password kiriting ❌");
      return;
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await saveUser(result.user); 
      toast.success("Muvaffaqiyatli kirdingiz ✅");
    } catch (err) {
      toast.error("Login yoki parol noto'g'ri ❌");
    }
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      await saveUser(result.user); 
      toast.success("Google orqali kirdingiz ✅");
    } catch (err) {
      toast.error("Google login xatolik ❌");
    }
  };

  const githubLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await saveUser(result.user);
      toast.success("GitHub orqali kirdingiz ✅");
    } catch (err) {
      toast.error("GitHub login xatolik ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-115 max-w-sm md:max-w-md lg:max-w-lg bg-slate-800 p-6 rounded-2xl shadow-xl text-white">

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
          className="w-full bg-blue-500 p-3 cursor-pointer rounded-lg font-semibold hover:bg-blue-600">
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