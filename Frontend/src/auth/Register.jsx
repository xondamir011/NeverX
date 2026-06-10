import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";
import { saveUser } from "../firebase/userService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async () => {
    if (!email || !password) {
      toast.error("Email va parol kiriting ❌");
      return;
    }
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      if (name.trim()) {
        await updateProfile(result.user, { displayName: name.trim() });
      }

      await result.user.reload();
      await saveUser(result.user);

      toast.success("Ro'yxatdan o'tildi ✅");
      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("Bu email allaqachon ro'yxatdan o'tgan ❌");
      } else if (err.code === "auth/weak-password") {
        toast.error("Parol kamida 6 ta belgi bo'lishi kerak ❌");
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-110">
        <source src="/videos/neverx.mp4" type="video/mp4" />
      </video>
      
      {/* DARK + GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-black/60 sm:bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

      {/* CENTER CARD */}
      <div className="relative z-10 w-[92%] sm:w-[420px] max-w-[420px] p-6 sm:p-8 rounded-3xl backdrop-blur-2xl bg-white/10
        border border-white/20 shadow-2xl text-white scale-105 sm:scale-100">

        <ToastContainer
          position="top-right"
          autoClose={2000}
          theme="dark" />

        {/* TITLE */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-5 text-center">
          Ro'yxatdan o'tish 📝
        </h2>

        {/* INPUTS */}
        <input className="input input-bordered w-full mb-3 bg-white/10 border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30"
          placeholder="Ism (ixtiyoriy)"
          onChange={(e) => setName(e.target.value)} />

        <input className="input input-bordered w-full mb-3 bg-white/10 border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30"
          placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

        <input type="password"
          className="input input-bordered w-full mb-5 bg-white/10 border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30"
          placeholder="Parol (kamida 6 belgi)" onChange={(e) => setPassword(e.target.value)} />

        {/* BUTTON */}
        <button onClick={register}
          disabled={loading}
          className="btn btn-primary w-full rounded-xl">
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "Register"
          )}
        </button>

        {/* LOGIN LINK */}
        <p onClick={() => navigate("/login")}
          className="text-sm text-center mt-5 cursor-pointer text-gray-300 hover:text-white transition">
          Already have account? Login
        </p>
      </div>
    </div>
  );
}