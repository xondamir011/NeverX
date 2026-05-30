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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover">
        <source src="/videos/neverx.mp4" type="video/mp4" />
      </video>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 w-[92%] max-w-[320px] sm:max-w-[380px] p-5 sm:p-6 rounded-2xl backdrop-blur-xl
       bg-black/30 border border-white/10 shadow-2xl text-white">

        <ToastContainer
          position="top-right"
          autoClose={2000}
          theme="dark"/>

        <h2 className="text-xl font-bold mb-4 text-center">
          Ro'yxatdan o'tish 📝
        </h2>

        <input className="input input-bordered w-full mb-3 bg-white/10 border-white/10 text-white"
          placeholder="Ism (ixtiyoriy)"
          onChange={(e) => setName(e.target.value)} />

        <input className="input input-bordered w-full mb-3 bg-white/10 border-white/10 text-white"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)} />

        <input type="password"
          className="input input-bordered w-full mb-4 bg-white/10 border-white/10 text-white"
          placeholder="Parol (kamida 6 belgi)"
          onChange={(e) => setPassword(e.target.value)} />

        <button onClick={register}
          disabled={loading}
          className="btn btn-primary w-full">
          {loading
            ? <span className="loading loading-spinner loading-sm" />
            : "Register"}
        </button>

        <p onClick={() => navigate("/login")}
          className="text-sm text-center mt-4 cursor-pointer text-gray-300 hover:text-white">
          Already have account? Login
        </p>
      </div>
    </div>
  );
}