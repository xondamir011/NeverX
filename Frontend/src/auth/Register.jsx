import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
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
    const cleanEmail = email.trim();
    const cleanName = name.trim();

    if (!cleanName) {
      toast.error("Ismingizni kiriting ❌");
      return;
    }

    if (!cleanEmail) {
      toast.error("Emailni kiriting ❌");
      return;
    }

    if (!password) {
      toast.error("Parolni kiriting ❌");
      return;
    }

    if (password.length < 6) {
      toast.error("Parol kamida 6 ta belgi bo'lishi kerak ❌");
      return;
    }

    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      const user = result.user;

      await updateProfile(user, {
        displayName: cleanName,
      });

      try {
        await sendEmailVerification(user);
      } catch (verificationError) {
        console.log(
          "Email verification yuborilmadi:",
          verificationError
        );
      }

      await saveUser(user);

      toast.success(
        "Ro'yxatdan muvaffaqiyatli o'tdingiz! ✅"
      );

      setEmail("");
      setPassword("");
      setName("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      switch (err.code) {
        case "auth/email-already-in-use":
          toast.error(
            "Bu email allaqachon ro'yxatdan o'tgan ❌"
          );
          break;

        case "auth/invalid-email":
          toast.error(
            "Email manzili noto'g'ri ❌"
          );
          break;

        case "auth/weak-password":
          toast.error(
            "Parol juda zaif. Kamida 6 ta belgi bo'lishi kerak ❌"
          );
          break;

        case "auth/operation-not-allowed":
          toast.error(
            "Email/Password login Firebase'da yoqilmagan ❌"
          );
          break;

        case "auth/network-request-failed":
          toast.error(
            "Internet bilan bog'liq xatolik ❌"
          );
          break;

        case "auth/too-many-requests":
          toast.error(
            "Juda ko'p urinish. Birozdan keyin qayta urinib ko'ring ⏳"
          );
          break;

        default:
          toast.error(
            "Ro'yxatdan o'tishda xatolik yuz berdi ❌"
          );
          console.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      register();
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      onKeyDown={handleKeyDown}>
  
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-110">
        <source
          src="/videos/neverx.mp4"
          type="video/mp4"
        />
      </video>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60 sm:bg-black/50" />

      {/* GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

      {/* CENTER CARD */}
      <div
        className="
          relative z-10
          w-[92%] sm:w-[420px]
          max-w-[420px]
          p-6 sm:p-8
          rounded-3xl
          backdrop-blur-2xl
          bg-white/10
          border border-white/20
          shadow-2xl
          text-white
          scale-105 sm:scale-100
        "
      >
        {/* TOAST */}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          theme="dark"
        />

        {/* TITLE */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-5 text-center">
          Ro'yxatdan o'tish 📝
        </h2>

        {/* NAME */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
            input input-bordered
            w-full mb-3
            bg-white/10
            border-white/20
            text-white
            placeholder-gray-300
            focus:outline-none
            focus:ring-2
            focus:ring-white/30
          "
          placeholder="Ism"
          autoComplete="name"
        />

        {/* EMAIL */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            input input-bordered
            w-full mb-3
            bg-white/10
            border-white/20
            text-white
            placeholder-gray-300
            focus:outline-none
            focus:ring-2
            focus:ring-white/30
          "
          placeholder="Email"
          autoComplete="email"
        />

        {/* PASSWORD */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
            input input-bordered
            w-full mb-5
            bg-white/10
            border-white/20
            text-white
            placeholder-gray-300
            focus:outline-none
            focus:ring-2
            focus:ring-white/30
          "
          placeholder="Parol (kamida 6 belgi)"
          autoComplete="new-password"
        />

        {/* REGISTER BUTTON */}
        <button
          onClick={register}
          disabled={loading}
          className="
            btn btn-primary
            w-full
            rounded-xl
          "
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "Register"
          )}
        </button>

        {/* LOGIN LINK */}
        <p
          onClick={() => {
            if (!loading) {
              navigate("/login");
            }
          }}
          className="
            text-sm
            text-center
            mt-5
            cursor-pointer
            text-gray-300
            hover:text-white
            transition
          ">
          Already have account? Login
        </p>
      </div>
    </div>
  );
}