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
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="p-6 bg-slate-800 rounded-2xl w-80 shadow-xl text-white">

        <h2 className="text-xl font-bold mb-5 text-center">Ro'yxatdan o'tish 📝</h2>

        <input className="input input-bordered w-full mb-3 bg-slate-700 border-none text-white"
          placeholder="Ism (ixtiyoriy)"
          onChange={(e) => setName(e.target.value)} />

        <input className="input input-bordered w-full mb-3 bg-slate-700 border-none text-white"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)} />

        <input className="input input-bordered w-full mb-4 bg-slate-700 border-none text-white"
          type="password"
          placeholder="Parol (kamida 6 belgi)"
          onChange={(e) => setPassword(e.target.value)} />

        <button onClick={register}
          disabled={loading}
          className="btn btn-success w-full">
          {loading ? <span className="loading loading-spinner loading-sm" /> : "Register"}
        </button>

        <p onClick={() => navigate("/login")}
          className="text-sm text-center mt-3 cursor-pointer text-gray-400 hover:text-white transition">
          Already have account? Login
        </p>

        <ToastContainer position="top-right" autoClose={2000} theme="dark" />
      </div>
    </div>
  );
}