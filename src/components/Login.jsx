import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { auth, googleProvider, githubProvider } from "../firebase";
import { 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult 
} from "firebase/auth"; // ✅ getRedirectResult import qilindi
import { FcGoogle } from "react-icons/fc"; 
import { FaGithub } from "react-icons/fa";  

export default function Login() {
  const { setUser, login } = useAuth(); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 

  useEffect(() => {
    // Redirect login natijasini tekshirish (mobil uchun)
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          const userData = {
            name: result.user.displayName,
            email: result.user.email,
            avatar: result.user.photoURL,
          };
          setUser(userData);
          alert(`Hello, ${userData.name}`);
        }
      })
      .catch((error) => {
        console.error("Redirect login error:", error);
      });
  }, []);

  const handleEmailLogin = async () => {
    try {
      await login(email, password);
      alert(`Logged in as ${email}`);
    } catch (error) {
      console.error("Email login error:", error);
      alert("Error: " + error.message);
    }
  };

  const handleGoogleLogin = () => {
    // Desktop: popup, mobil: redirect
    if (window.innerWidth < 768) {
      // mobil qurilma
      signInWithRedirect(auth, googleProvider);
    } else {
      signInWithPopup(auth, googleProvider)
        .then((result) => {
          const userData = {
            name: result.user.displayName,
            email: result.user.email,
            avatar: result.user.photoURL,
          };
          setUser(userData);
          alert(`Hello, ${userData.name}`);
        })
        .catch((error) => {
          console.error("Google login error:", error);
          alert("Error: " + error.message);
        });
    }
  };

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