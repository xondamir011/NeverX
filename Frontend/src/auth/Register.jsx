import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { saveUser } from "../firebase/userService";
import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const LANGUAGES = [
  { code: "UZ", label: "O'zbek", flag: "uz" },
  { code: "EN", label: "English", flag: "us" },
  { code: "RU", label: "Русский", flag: "ru" },
  { code: "DE", label: "Deutsch", flag: "de" },
  { code: "TR", label: "Türkçe", flag: "tr" },
];

const TEXTS = {
  UZ: {
    title: "Ro'yxatdan o'tish",
    subtitle: "Cheksiz kinolar va seriallar",
    name: "Ism",
    email: "Email",
    password: "Parol (kamida 6 belgi)",
    register: "Ro'yxatdan o'tish",
    haveAccount: "Akkauntingiz bormi?",
    login: "Kirish",
    nameEmpty: "Ismingizni kiriting",
    emailEmpty: "Emailni kiriting",
    passEmpty: "Parolni kiriting",
    passShort: "Parol kamida 6 ta belgi bo'lishi kerak",
    success: "Ro'yxatdan muvaffaqiyatli o'tdingiz",
    emailUsed: "Bu email allaqachon ro'yxatdan o'tgan",
    emailInvalid: "Email manzili noto'g'ri",
    weak: "Parol juda zaif",
    notAllowed: "Email/Parol usuli Firebase'da yoqilmagan",
    network: "Internet bilan bog'liq xatolik",
    tooMany: "Juda ko'p urinish. Birozdan keyin urinib ko'ring",
    error: "Ro'yxatdan o'tishda xatolik yuz berdi",
    weakL: "Zaif",
    midL: "O'rtacha",
    strongL: "Kuchli",
  },
  EN: {
    title: "Create account",
    subtitle: "Unlimited movies & series",
    name: "Name",
    email: "Email",
    password: "Password (min 6 characters)",
    register: "Register",
    haveAccount: "Already have an account?",
    login: "Login",
    nameEmpty: "Enter your name",
    emailEmpty: "Enter your email",
    passEmpty: "Enter your password",
    passShort: "Password must be at least 6 characters",
    success: "Registered successfully",
    emailUsed: "This email is already registered",
    emailInvalid: "Invalid email address",
    weak: "Password is too weak",
    notAllowed: "Email/Password sign-in is not enabled in Firebase",
    network: "Network error",
    tooMany: "Too many attempts. Try again later",
    error: "Registration failed",
    weakL: "Weak",
    midL: "Medium",
    strongL: "Strong",
  },
  RU: {
    title: "Регистрация",
    subtitle: "Безлимитные фильмы и сериалы",
    name: "Имя",
    email: "Эл. почта",
    password: "Пароль (минимум 6 символов)",
    register: "Зарегистрироваться",
    haveAccount: "Уже есть аккаунт?",
    login: "Войти",
    nameEmpty: "Введите имя",
    emailEmpty: "Введите email",
    passEmpty: "Введите пароль",
    passShort: "Пароль должен быть не менее 6 символов",
    success: "Регистрация прошла успешно",
    emailUsed: "Этот email уже зарегистрирован",
    emailInvalid: "Неверный email",
    weak: "Слишком слабый пароль",
    notAllowed: "Вход по email/паролю не включён в Firebase",
    network: "Ошибка сети",
    tooMany: "Слишком много попыток. Попробуйте позже",
    error: "Ошибка регистрации",
    weakL: "Слабый",
    midL: "Средний",
    strongL: "Сильный",
  },
  DE: {
    title: "Registrieren",
    subtitle: "Unbegrenzte Filme und Serien",
    name: "Name",
    email: "E-Mail",
    password: "Passwort (mind. 6 Zeichen)",
    register: "Registrieren",
    haveAccount: "Schon ein Konto?",
    login: "Anmelden",
    nameEmpty: "Namen eingeben",
    emailEmpty: "E-Mail eingeben",
    passEmpty: "Passwort eingeben",
    passShort: "Passwort muss mindestens 6 Zeichen haben",
    success: "Erfolgreich registriert",
    emailUsed: "Diese E-Mail ist bereits registriert",
    emailInvalid: "Ungültige E-Mail-Adresse",
    weak: "Passwort ist zu schwach",
    notAllowed: "E-Mail/Passwort-Anmeldung ist in Firebase nicht aktiviert",
    network: "Netzwerkfehler",
    tooMany: "Zu viele Versuche. Bitte später erneut versuchen",
    error: "Registrierung fehlgeschlagen",
    weakL: "Schwach",
    midL: "Mittel",
    strongL: "Stark",
  },
  TR: {
    title: "Kayıt ol",
    subtitle: "Sınırsız film ve diziler",
    name: "İsim",
    email: "E-posta",
    password: "Şifre (en az 6 karakter)",
    register: "Kayıt ol",
    haveAccount: "Hesabın var mı?",
    login: "Giriş",
    nameEmpty: "İsminizi girin",
    emailEmpty: "E-posta girin",
    passEmpty: "Şifre girin",
    passShort: "Şifre en az 6 karakter olmalı",
    success: "Başarıyla kayıt olundu",
    emailUsed: "Bu e-posta zaten kayıtlı",
    emailInvalid: "Geçersiz e-posta",
    weak: "Şifre çok zayıf",
    notAllowed: "E-posta/Şifre girişi Firebase'de etkin değil",
    network: "Ağ hatası",
    tooMany: "Çok fazla deneme. Daha sonra tekrar deneyin",
    error: "Kayıt başarısız",
    weakL: "Zayıf",
    midL: "Orta",
    strongL: "Güçlü",
  },
};

const POSTERS = [
  { src: "qNBAXBIQlnOThrVvA6mA2B5ggV6", pos: "left-[12%] top-[10%]", size: "w-28 lg:w-36 xl:w-40 h-40 lg:h-52 xl:h-60", rot: "-rotate-12", n: 50, l: 70, dur: "3s", shadow: true },
  { src: "8UlWHLMpgZm9bx6QYh0NFoq67TZ", pos: "right-[10%] top-[8%]", size: "w-32 lg:w-40 xl:w-44 h-44 lg:h-56 xl:h-64", rot: "rotate-6", n: 60, l: 75, dur: "5s", shadow: true },
  { src: "9Gtg2DzBhmYamXBS1hKAhiwbBKS", pos: "left-[18%] bottom-[8%]", size: "w-28 lg:w-36 xl:w-40 h-40 lg:h-52 xl:h-60", rot: "rotate-6", n: 50, l: 70, dur: "6s", shadow: true },
  { src: "5YZbUmjbMa3ClvSW1Wj3D6XGolb", pos: "right-[16%] bottom-[8%]", size: "w-28 lg:w-36 xl:w-40 h-40 lg:h-52 xl:h-60", rot: "-rotate-6", n: 55, l: 70, dur: "7s", shadow: true },
  { src: "r7XifzvtezNt31ypvsmb6Oqxw49", pos: "left-[29%] top-[18%]", size: "w-24 lg:w-32 xl:w-36 h-36 lg:h-48 xl:h-56", rot: "rotate-6", n: 35, l: 55, dur: "6.5s", shadow: true },
  { src: "qNBAXBIQlnOThrVvA6mA2B5ggV6", pos: "right-[28%] bottom-[17%]", size: "w-24 lg:w-32 xl:w-36 h-36 lg:h-48 xl:h-56", rot: "-rotate-6", n: 35, l: 55, dur: "5.5s", shadow: true },
  { src: "8UlWHLMpgZm9bx6QYh0NFoq67TZ", pos: "left-[-2%] top-[42%]", size: "w-24 lg:w-32 h-36 lg:h-48", rot: "rotate-6", n: 30, l: 45, dur: "7s" },
  { src: "9Gtg2DzBhmYamXBS1hKAhiwbBKS", pos: "right-[-2%] top-[43%]", size: "w-24 lg:w-32 h-36 lg:h-48", rot: "-rotate-6", n: 30, l: 45, dur: "6s" },
];

const inputClass = `
  w-full h-14 rounded-2xl
  bg-white/10 border border-white/20
  text-white outline-none
  placeholder:text-white/50
  focus:border-primary focus:bg-white/15
  transition-all
`;

const Msg = ({ ok, text }) => (
  <div className="flex items-center gap-2">
    {ok ? (
      <FaCheckCircle className="text-success shrink-0" />
    ) : (
      <FaTimesCircle className="text-error shrink-0" />
    )}
    <span>{text}</span>
  </div>
);

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "night");
  const [lang, setLang] = useState(
    (localStorage.getItem("lang") || "UZ").toUpperCase()
  );

  const langRef = useRef(null);
  const navigate = useNavigate();

  const t = TEXTS[lang] || TEXTS.UZ;
  const night = theme === "night";

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Parol kuchi: 0-3
  const strength = useMemo(() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10 || (/[a-z]/.test(password) && /[A-Z]/.test(password))) s++;
    if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) s++;
    return Math.max(1, s);
  }, [password]);

  const strengthColor = ["", "bg-error", "bg-warning", "bg-success"][strength];
  const strengthLabel = ["", t.weakL, t.midL, t.strongL][strength];

  const errorText = (code) => {
    switch (code) {
      case "auth/email-already-in-use": return t.emailUsed;
      case "auth/invalid-email": return t.emailInvalid;
      case "auth/weak-password": return t.weak;
      case "auth/operation-not-allowed": return t.notAllowed;
      case "auth/network-request-failed": return t.network;
      case "auth/too-many-requests": return t.tooMany;
      default: return t.error;
    }
  };

  const register = async () => {
    const cleanEmail = email.trim();
    const cleanName = name.trim();

    if (!cleanName) return toast.error(<Msg text={t.nameEmpty} />);
    if (!cleanEmail) return toast.error(<Msg text={t.emailEmpty} />);
    if (!password) return toast.error(<Msg text={t.passEmpty} />);
    if (password.length < 6) return toast.error(<Msg text={t.passShort} />);

    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = result.user;

      await updateProfile(user, { displayName: cleanName });

      try {
        await sendEmailVerification(user);
      } catch (verificationError) {
        console.log("Email verification yuborilmadi:", verificationError);
      }

      await saveUser(user);

      toast.success(<Msg ok text={t.success} />);

      setEmail("");
      setPassword("");
      setName("");

      // Firebase avtomatik login qiladi, shuning uchun chiqarib, login sahifasiga qaytaramiz
      await signOut(auth);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      console.error("REGISTER ERROR:", err.code, err.message);
      toast.error(<Msg text={errorText(err.code)} />);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) register();
  };

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden bg-base-200 text-base-content transition-colors duration-500"
      onKeyDown={handleKeyDown}
    >
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />

      {/* ============ FON: VIDEO + OVERLAY ============ */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-110"
        >
          <source src="https://www.w3schools.com/howto/rain.mp4" type="video/mp4" />
        </video>

        {/* MAIN OVERLAY */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            night ? "bg-black/65" : "bg-white/25"
          }`}
        />

        {/* HORIZONTAL GRADIENT */}
        <div
          className={`absolute inset-0 bg-gradient-to-r transition-all duration-500 ${
            night
              ? "from-black/90 via-black/40 to-black/85"
              : "from-white/65 via-white/10 to-white/65"
          }`}
        />

        {/* VERTICAL GRADIENT */}
        <div
          className={`absolute inset-0 bg-gradient-to-b transition-all duration-500 ${
            night
              ? "from-black/40 via-transparent to-black/90"
              : "from-white/20 via-transparent to-white/55"
          }`}
        />

        {/* LIGHT MODE SOFT TINT */}
        {!night && <div className="absolute inset-0 bg-white/5 pointer-events-none" />}
      </div>

      {/* ============ TEMA + TIL ============ */}
      <div ref={langRef} className="absolute top-4 right-4 z-[100] flex items-center gap-2">
        {/* Tema */}
        <label
          className="swap swap-rotate h-10 w-10 rounded-xl bg-base-100/80 backdrop-blur-xl border border-base-content/15 text-base-content cursor-pointer hover:bg-base-100 shadow-lg transition-all"
          title={night ? "Light mode" : "Night mode"}
        >
          <input
            type="checkbox"
            className="theme-controller"
            value="night"
            checked={night}
            onChange={(e) => setTheme(e.target.checked ? "night" : "light")}
          />
          <svg className="swap-off h-7 w-7 fill-current text-warning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12ZM12,5a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34ZM17.66,7.34a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2ZM12,19a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Z" />
          </svg>
          <svg className="swap-on h-7 w-7 fill-current text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49,8.59,8.59,0,0,1,9.33,3.5A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05A1,1,0,0,0,21.64,13Z" />
          </svg>
        </label>

        {/* Til */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangOpen(!langOpen)}
            className="h-10 min-w-12 px-3 flex items-center justify-center rounded-xl bg-base-100/80 backdrop-blur-xl border border-base-content/15 text-base-content font-bold text-sm hover:bg-base-100 shadow-lg transition-all cursor-pointer"
          >
            {lang}
          </button>

          {langOpen && (
            <div className="absolute right-0 top-12 w-44 p-2 rounded-2xl bg-base-100 border border-base-content/15 shadow-2xl text-base-content z-[200]">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    setLang(l.code);
                    setLangOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-base-content/10 transition cursor-pointer text-left text-sm"
                >
                  <img
                    src={`https://flagcdn.com/w40/${l.flag}.png`}
                    alt={l.label}
                    className="w-5 h-4 rounded-sm object-cover"
                  />
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============ SUZIB YURUVCHI POSTERLAR ============ */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {POSTERS.map((p, i) => (
          <img
            key={i}
            src={`https://image.tmdb.org/t/p/w500/${p.src}.jpg`}
            alt=""
            className={`absolute ${p.pos} ${p.size} ${p.rot} object-cover rounded-2xl ${
              p.shadow ? "shadow-2xl" : ""
            } animate-bounce transition-opacity duration-500`}
            style={{
              opacity: (night ? p.n : p.l) / 100,
              animationDuration: p.dur,
            }}
          />
        ))}
      </div>

      {/* ============ MARKAZ: REGISTER KARTASI ============ */}
      <div className="relative z-30 min-h-screen w-full flex items-center justify-center px-4 sm:px-6 py-16">
        <div
          className={`relative z-50 w-full max-w-[430px] p-6 sm:p-8 rounded-3xl backdrop-blur-2xl border shadow-2xl transition-all duration-700 ${
            night
              ? "bg-black/45 border-white/10 shadow-black/50 text-white"
              : "bg-white/95 border-black/10 shadow-black/20 text-base-content"
          } ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Sarlavha */}
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold">{t.title}</h2>
            <p className="text-sm opacity-60 mt-1">{t.subtitle}</p>
          </div>

          {/* Ism */}
          <div className="relative mb-3.5">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.name}
              autoComplete="name"
              className={`${inputClass} pl-11 pr-4 ${
                night ? "" : "!bg-base-200/70 !text-base-content !border-base-content/15 placeholder:!text-base-content/40"
              }`}
            />
          </div>

          {/* Email */}
          <div className="relative mb-3.5">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.email}
              autoComplete="email"
              className={`${inputClass} pl-11 pr-4 ${
                night ? "" : "!bg-base-200/70 !text-base-content !border-base-content/15 placeholder:!text-base-content/40"
              }`}
            />
          </div>

          {/* Parol */}
          <div className="relative mb-2">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.password}
              autoComplete="new-password"
              className={`${inputClass} pl-11 pr-12 ${
                night ? "" : "!bg-base-200/70 !text-base-content !border-base-content/15 placeholder:!text-base-content/40"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label="Show or hide password"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Parol kuchi */}
          <div className="mb-5 h-5">
            {password && (
              <div className="flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        i <= strength ? strengthColor : night ? "bg-white/20" : "bg-black/15"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs opacity-70 w-20 text-right">{strengthLabel}</span>
              </div>
            )}
          </div>

          {/* Tugma */}
          <button
            type="button"
            onClick={register}
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-primary text-primary-content font-bold hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <>
                <span>{t.register}</span>
                <FaArrowRight className="text-sm" />
              </>
            )}
          </button>

          {/* Login havolasi */}
          <p className="text-center text-sm opacity-60 mt-6">
            {t.haveAccount}
            <button type="button" onClick={() => !loading && navigate("/login")}
              className="ml-1.5 text-primary hover:opacity-70 font-semibold cursor-pointer">
                {t.login}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}