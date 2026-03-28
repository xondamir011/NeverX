import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { auth, googleProvider, githubProvider } from "../firebase";
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { FcGoogle } from "react-icons/fc"; 
import { FaGithub } from "react-icons/fa";  
import { useNavigate } from "react-router-dom";

export default function Login() {
  const {setUser, login } = useAuth(); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const navigate = useNavigate();

  // 🔹 Google redirect result (mobil uchun)
  useEffect(() => {
    // getRedirectResult(auth)
    //   .then((result) => {
    //     if (result && result.user) {
    //       const currentUser = {
    //         name: result.user.displayName,
    //         email: result.user.email,
    //         avatar: result.user.photoURL,
    //       };
    //       setUser(currentUser);
          alert(`Hello, ${currentUser.name}`);
          navigate("/"); // asosiy sahifaga o‘tadi
      //   }
      // })
      // .catch((error) => {
      //   console.error("Redirect login error:", error);
      // });
  }, [setUser, navigate]);

  // 🔐 Email/Password login
  const handleEmailLogin = async () => {
    try {
      await login(email, password);
      alert(`Logged in as ${email}`);
      navigate("/");
    } catch (error) {
      console.error("Email login error:", error);
      alert("Error: " + error.message);
    }
  };

  // 🌍 Google login (desktop va mobil uchun)
  const handleGoogleLogin = async () => {
    // try {
    //   // Mobilda redirect, desktopda popup ishlaydi
    //   if (/Mobi|Android/i.test(navigator.userAgent)) {
    //     await signInWithRedirect(auth, googleProvider);
    //   } else {
    //     const result = await signInWithPopup(auth, googleProvider);
    //     const currentUser = {
    //       name: result.user.displayName,
    //       email: result.user.email,
    //       avatar: result.user.photoURL,
    //     };
    //     setUser(currentUser);
    //     alert(`Hello, ${currentUser.name}`);
        alert("Mobile: Redirecting to main page (Google login disabled temporarily)");
        navigate("/");
    //   }
    // } catch (error) {
    //   console.error("Google login error:", error);
    //   alert("Error: " + error.message);
    // }
  };

  // 🐱‍💻 GitHub login
  const handleGithubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const currentUser = {
        name: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL,
      };
      setUser(currentUser);
      alert(`Hello, ${currentUser.name}`);
      navigate("/");
    } catch (error) {
      console.error("GitHub login error:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-gray-900 text-white rounded-xl mt-40 shadow-lg">
      <h2 className="text-2xl mb-4 text-center font-bold">Login</h2>

      {/* Email/Password inputs */}
      <input type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full input input-primary p-2 mb-3 rounded"/>

      <input type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full input input-primary p-2 mb-4 rounded"/>

      <button onClick={handleEmailLogin}
        className="w-full mb-4 bg-primary p-2 cursor-pointer transition-all rounded hover:bg-secondary">
        Login
      </button>

      <div className="flex items-center justify-center gap-2 mb-2">
        <hr className="flex-1 border-gray-600" />
        <span className="text-gray-400 text-sm">OR</span>
        <hr className="flex-1 border-gray-600" />
      </div>

      {/* Google login */}
      <button onClick={handleGoogleLogin}
        className="w-full mb-2 flex items-center justify-center gap-3 cursor-pointer bg-gray-700 p-2 rounded hover:bg-gray-800 transition">
        <FcGoogle size={20} />
        <span>Login with Google</span>
      </button>

      {/* GitHub login */}
      <button onClick={handleGithubLogin}
        className="w-full flex items-center justify-center gap-3 cursor-pointer bg-gray-700 p-2 rounded hover:bg-gray-800 transition">
        <FaGithub size={20} />
        <span>Login with GitHub</span>
      </button>
    </div>
  );
}