import { auth } from "../firebase/config";
import { saveUser } from "../firebase/userService";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "react-toastify";

import {
  FaApple,
  FaEye,
  FaEyeSlash,
  FaFilm,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaMobileAlt,
  FaGithub,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [langOpen, setLangOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // PHONE LOGIN
  const [phoneMode, setPhoneMode] = useState(false);
  const [phone, setPhone] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState(null);
  const [verificationCode, setVerificationCode] =
    useState("");

  const [lang, setLang] = useState(
    localStorage.getItem("lang") || "UZ"
  );

  const langRef = useRef(null);
  const navigate = useNavigate();

  const languages = [
    {
      code: "UZ",
      label: "O‘zbek",
      flag: "uz",
    },
    {
      code: "EN",
      label: "English",
      flag: "us",
    },
    {
      code: "RU",
      label: "Русский",
      flag: "ru",
    },
    {
      code: "DE",
      label: "Deutsch",
      flag: "de",
    },
    {
      code: "TR",
      label: "Türkçe",
      flag: "tr",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  // =====================================================
  // RECAPTCHA CLEANUP
  // =====================================================

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (error) {
          console.log(error);
        }

        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const texts = {
    UZ: {
      subtitle: "Cheksiz kinolar va seriallar",

      email: "Email",
      password: "Parol",

      phonePlaceholder: "+998 90 123 45 67",
      smsPlaceholder: "SMS kodni kiriting",

      login: "Kirish",

      phoneLogin: "Telefon raqam orqali kirish",
      emailLogin: "Email orqali kirish",

      sendSms: "SMS yuborish",
      verify: "Tasdiqlash",

      loading: "Kirish...",

      or: "yoki",

      empty: "Email va parol kiriting",
      phoneEmpty: "Telefon raqamini kiriting",
      codeEmpty: "SMS kodni kiriting",

      success: "Muvaffaqiyatli kirdingiz",

      error: "Login yoki parol noto‘g‘ri",

      phoneSuccess: "Telefon orqali kirdingiz",
      smsSent: "SMS kod yuborildi",

      googleSuccess: "Google orqali kirdingiz",
      googleError: "Google login xatolik",

      githubSuccess: "GitHub orqali kirdingiz",
      githubError: "GitHub login xatolik",

      appleSuccess: "Apple orqali kirdingiz",
      appleError: "Apple login xatolik",

      wrongCode: "SMS kod noto‘g‘ri",

      invalidPhone: "Telefon raqamini to‘g‘ri kiriting",
      sendCodeFirst: "Avval SMS kod yuboring",
      phoneError: "Telefon orqali kirishda xatolik",

      register: "Ro‘yxatdan o‘tish",
      noAccount: "Akkaunt yo‘qmi?",
    },

    EN: {
      subtitle: "Unlimited movies & series",

      email: "Email",
      password: "Password",

      phonePlaceholder: "+998 90 123 45 67",
      smsPlaceholder: "Enter SMS code",

      login: "Login",

      phoneLogin: "Login with phone",
      emailLogin: "Login with email",

      sendSms: "Send SMS",
      verify: "Verify",

      loading: "Loading...",

      or: "or",

      empty: "Enter email and password",
      phoneEmpty: "Enter phone number",
      codeEmpty: "Enter SMS code",

      success: "Successfully logged in",

      error: "Wrong email or password",

      phoneSuccess: "Logged in with phone",
      smsSent: "SMS code sent",

      googleSuccess: "Logged in with Google",
      googleError: "Google login failed",

      githubSuccess: "Logged in with GitHub",
      githubError: "GitHub login failed",

      appleSuccess: "Logged in with Apple",
      appleError: "Apple login failed",

      wrongCode: "Wrong SMS code",

      invalidPhone: "Enter a valid phone number",
      sendCodeFirst: "Send the SMS code first",
      phoneError: "Phone login failed",

      register: "Register",
      noAccount: "Don't have an account?",
    },

    RU: {
      subtitle: "Безлимитные фильмы и сериалы",

      email: "Эл. почта",
      password: "Пароль",

      phonePlaceholder: "+998 90 123 45 67",
      smsPlaceholder: "Введите SMS код",

      login: "Вход",

      phoneLogin: "Вход по телефону",
      emailLogin: "Вход по email",

      sendSms: "Отправить SMS",
      verify: "Подтвердить",

      loading: "Вход...",

      or: "или",

      empty: "Введите email и пароль",
      phoneEmpty: "Введите номер телефона",
      codeEmpty: "Введите SMS код",

      success: "Успешный вход",

      error: "Неверный логин или пароль",

      phoneSuccess: "Вход по телефону выполнен",
      smsSent: "SMS код отправлен",

      googleSuccess: "Вход через Google",
      googleError: "Ошибка Google входа",

      githubSuccess: "Вход через GitHub",
      githubError: "Ошибка GitHub входа",

      appleSuccess: "Вход через Apple",
      appleError: "Ошибка Apple входа",

      wrongCode: "Неверный SMS код",

      invalidPhone: "Введите правильный номер телефона",
      sendCodeFirst: "Сначала отправьте SMS код",
      phoneError: "Ошибка входа по телефону",

      register: "Регистрация",
      noAccount: "Нет аккаунта?",
    },

    DE: {
      subtitle: "Unbegrenzte Filme und Serien",

      email: "E-Mail",
      password: "Passwort",

      phonePlaceholder: "+998 90 123 45 67",
      smsPlaceholder: "SMS-Code eingeben",

      login: "Anmelden",

      phoneLogin: "Mit Telefon anmelden",
      emailLogin: "Mit E-Mail anmelden",

      sendSms: "SMS senden",
      verify: "Bestätigen",

      loading: "Wird geladen...",

      or: "oder",

      empty: "E-Mail und Passwort eingeben",
      phoneEmpty: "Telefonnummer eingeben",
      codeEmpty: "SMS-Code eingeben",

      success: "Erfolgreich eingeloggt",

      error: "Falsche Daten",

      phoneSuccess: "Mit Telefon eingeloggt",
      smsSent: "SMS-Code wurde gesendet",

      googleSuccess: "Mit Google eingeloggt",
      googleError: "Google Anmeldung fehlgeschlagen",

      githubSuccess: "Mit GitHub eingeloggt",
      githubError: "GitHub Anmeldung fehlgeschlagen",

      appleSuccess: "Mit Apple eingeloggt",
      appleError: "Apple Anmeldung fehlgeschlagen",

      wrongCode: "Falscher SMS-Code",

      invalidPhone: "Geben Sie eine gültige Telefonnummer ein",
      sendCodeFirst: "Senden Sie zuerst den SMS-Code",
      phoneError: "Telefonanmeldung fehlgeschlagen",

      register: "Registrieren",
      noAccount: "Noch kein Konto?",
    },

    TR: {
      subtitle: "Sınırsız film ve diziler",

      email: "E-posta",
      password: "Şifre",

      phonePlaceholder: "+998 90 123 45 67",
      smsPlaceholder: "SMS kodunu girin",

      login: "Giriş",

      phoneLogin: "Telefon ile giriş",
      emailLogin: "E-posta ile giriş",

      sendSms: "SMS gönder",
      verify: "Doğrula",

      loading: "Giriş yapılıyor...",

      or: "veya",

      empty: "Email ve şifre gir",
      phoneEmpty: "Telefon numarası gir",
      codeEmpty: "SMS kodunu gir",

      success: "Başarıyla giriş yapıldı",

      error: "Hatalı giriş",

      phoneSuccess: "Telefon ile giriş yapıldı",
      smsSent: "SMS kodu gönderildi",

      googleSuccess: "Google ile giriş yapıldı",
      googleError: "Google giriş hatası",

      githubSuccess: "GitHub ile giriş yapıldı",
      githubError: "GitHub giriş hatası",

      appleSuccess: "Apple ile giriş yapıldı",
      appleError: "Apple giriş hatası",

      wrongCode: "SMS kodu yanlış",

      invalidPhone: "Geçerli bir telefon numarası girin",
      sendCodeFirst: "Önce SMS kodunu gönderin",
      phoneError: "Telefon ile giriş başarısız",

      register: "Kayıt ol",
      noAccount: "Hesabın yok mu?",
    },
  };

  const t = useMemo(
    () => texts[lang] || texts.UZ,
    [lang]
  );

  const login = async () => {
    if (!email || !password) {
      toast.error(
        <div className="flex items-center gap-2">
          <FaTimesCircle className="text-red-500" />
          <span>{t.empty}</span>
        </div>
      );
      return;
    }

    setLoading(true);

    try {
      const result =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      await saveUser(result.user);

      toast.success(
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-green-500" />
          <span>{t.success}</span>
        </div>
      );
    } catch (error) {
      console.error(
        "EMAIL LOGIN ERROR:",
        error
      );

      toast.error(
        <div className="flex items-center gap-2">
          <FaTimesCircle className="text-red-500" />
          <span>
            {error.code || t.error}
          </span>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const googleLogin = async () => {
    try {
      setLoading(true);

      const provider =
        new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result =
        await signInWithPopup(
          auth,
          provider
        );

      await saveUser(result.user);

      toast.success(
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-green-500" />
          <span>{t.googleSuccess}</span>
        </div>
      );
    } catch (error) {
      console.error(
        "GOOGLE LOGIN ERROR:",
        error
      );

      toast.error(
        <div className="flex items-center gap-2">
          <FaTimesCircle className="text-red-500" />
          <span>
            {error.code ||
              error.message ||
              t.googleError}
          </span>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GITHUB LOGIN
  // =====================================================

  const githubLogin = async () => {
    try {
      setLoading(true);

      const provider =
        new GithubAuthProvider();

      const result =
        await signInWithPopup(
          auth,
          provider
        );

      await saveUser(result.user);

      toast.success(
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-green-500" />
          <span>{t.githubSuccess}</span>
        </div>
      );
    } catch (error) {
      console.error(
        "GITHUB LOGIN ERROR:",
        error
      );

      toast.error(
        <div className="flex items-center gap-2">
          <FaTimesCircle className="text-red-500" />
          <span>
            {error.code ||
              error.message ||
              t.githubError}
          </span>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // APPLE LOGIN
  // =====================================================

  const appleLogin = async () => {
    try {
      setLoading(true);

      const provider =
        new OAuthProvider("apple.com");

      provider.addScope("email");
      provider.addScope("name");

      const result =
        await signInWithPopup(
          auth,
          provider
        );

      await saveUser(result.user);

      toast.success(
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-green-500" />
          <span>{t.appleSuccess}</span>
        </div>
      );
    } catch (error) {
      console.error(
        "APPLE LOGIN ERROR:",
        error
      );

      toast.error(
        <div className="flex items-center gap-2">
          <FaTimesCircle className="text-red-500" />
          <span>
            {error.code ||
              error.message ||
              t.appleError}
          </span>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PHONE FORMAT
  // =====================================================

  const formatPhoneNumber = (value) => {
    let cleaned = value.replace(
      /[^\d+]/g,
      ""
    );

    if (
      cleaned.startsWith("998") &&
      !cleaned.startsWith("+998")
    ) {
      cleaned = "+" + cleaned;
    }

    if (
      cleaned.length > 0 &&
      !cleaned.startsWith("+")
    ) {
      cleaned = "+998" + cleaned;
    }

    return cleaned;
  };

  // =====================================================
  // PHONE LOGIN
  // =====================================================

  const phoneLogin = async () => {
    if (!phone) {
      toast.error(
        <div className="flex items-center gap-2">
          <FaTimesCircle className="text-red-500" />
          <span>{t.phoneEmpty}</span>
        </div>
      );
      return;
    }

    const formattedPhone =
      formatPhoneNumber(phone);

    if (
      !formattedPhone.startsWith("+") ||
      formattedPhone.length < 10
    ) {
      toast.error(
        <div className="flex items-center gap-2">
          <FaTimesCircle className="text-red-500" />
          <span>{t.invalidPhone}</span>
        </div>
      );
      return;
    }

    setLoading(true);

    try {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch { }

        window.recaptchaVerifier = null;
      }

      window.recaptchaVerifier =
        new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",

            callback: () => {
              console.log(
                "reCAPTCHA verified"
              );
            },

            "expired-callback": () => {
              console.log(
                "reCAPTCHA expired"
              );
            },
          }
        );

      const confirmation =
        await signInWithPhoneNumber(
          auth,
          formattedPhone,
          window.recaptchaVerifier
        );

      setConfirmationResult(
        confirmation
      );

      toast.success(
        <div className="flex items-center gap-2">
          <FaMobileAlt className="text-blue-400" />
          <span>{t.smsSent}</span>
        </div>
      );
    } catch (error) {
      console.error(
        "PHONE LOGIN ERROR:",
        error
      );

      toast.error(
        <div className="flex items-center gap-2">
          <FaTimesCircle className="text-red-500" />
          <span>
            {error.code ||
              error.message ||
              t.phoneError}
          </span>
        </div>
      );

      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch { }

        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VERIFY PHONE
  // =====================================================

  const verifyPhoneCode = async () => {
    if (!verificationCode) {
      toast.error(
        <div className="flex items-center gap-2">
          <FaTimesCircle className="text-red-500" />
          <span>{t.codeEmpty}</span>
        </div>
      );
      return;
    }

    if (!confirmationResult) {
      toast.error(
        <div className="flex items-center gap-2">
          <FaTimesCircle className="text-red-500" />
          <span>{t.sendCodeFirst}</span>
        </div>
      );
      return;
    }

    setLoading(true);

    try {
      const result =
        await confirmationResult.confirm(
          verificationCode
        );

      await saveUser(result.user);

      toast.success(
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-green-500" />
          <span>{t.phoneSuccess}</span>
        </div>
      );
    } catch (error) {
      console.error(
        "PHONE CODE ERROR:",
        error
      );

      toast.error(
        <div className="flex items-center gap-2">
          <FaTimesCircle className="text-red-500" />
          <span>
            {error.code || t.wrongCode}
          </span>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SWITCH LOGIN MODE
  // =====================================================

  const switchLoginMode = () => {
    setPhoneMode(!phoneMode);

    setConfirmationResult(null);
    setVerificationCode("");
    setPhone("");
    setShowPassword(false);

    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch { }

      window.recaptchaVerifier = null;
    }
  };

  return (
    <main
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-black
        text-white
      "
    >

      {/* ================================================= */}
      {/* BACKGROUND VIDEO */}
      {/* ================================================= */}

      <div
        className="
          absolute
          inset-0
          z-0
          overflow-hidden
        "
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
            scale-110
          "
        >
          <source
            src="https://www.w3schools.com/howto/rain.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-black/65" />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/90
            via-black/40
            to-black/80
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-black/50
            via-transparent
            to-black/80
          "
        />
      </div>

      {/* ================================================= */}
      {/* LANGUAGE */}
      {/* ================================================= */}

      <div
        ref={langRef}
        className="
          absolute
          top-4
          right-4
          z-[100]
        "
      >
        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setLangOpen(!langOpen)
            }
            className="
              h-10
              min-w-12
              px-3
              flex
              items-center
              justify-center
              rounded-xl
              bg-black/70
              backdrop-blur-xl
              border
              border-white/10
              text-white
              font-bold
              text-sm
              hover:bg-white/10
              transition
              cursor-pointer
            "
          >
            {lang}
          </button>

          {langOpen && (
            <div
              className="
                absolute
                right-0
                top-12
                w-44
                p-2
                rounded-2xl
                bg-[#0d1117]/95
                backdrop-blur-xl
                border
                border-white/10
                shadow-2xl
              "
            >
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    setLang(l.code);
                    setLangOpen(false);
                  }}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    p-2.5
                    rounded-xl
                    hover:bg-white/10
                    transition
                    cursor-pointer
                    text-left
                    text-sm
                    text-white
                  "
                >
                  <img
                    src={`https://flagcdn.com/w40/${l.flag}.png`}
                    alt={l.label}
                    className="
                      w-5
                      h-4
                      rounded-sm
                      object-cover
                    "
                  />

                  <span>
                    {l.label}
                  </span>
                </button>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ================================================= */}
      {/* MOVING POSTERS */}
      {/* ================================================= */}

      <div
        className="
          absolute
          inset-0
          z-10
          pointer-events-none
          overflow-hidden
        "
      >

        {/* LEFT TOP */}

        <img
          src="https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg"
          alt=""
          className="
            absolute
            left-[12%]
            top-[10%]
            w-28
            lg:w-36
            xl:w-40
            h-40
            lg:h-52
            xl:h-60
            object-cover
            rounded-2xl
            opacity-50
            shadow-2xl
            -rotate-12
            animate-bounce
          "
        />

        {/* RIGHT TOP */}

        <img
          src="https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg"
          alt=""
          className="
            absolute
            right-[10%]
            top-[8%]
            w-32
            lg:w-40
            xl:w-44
            h-44
            lg:h-56
            xl:h-64
            object-cover
            rounded-2xl
            opacity-60
            shadow-2xl
            rotate-6
            animate-bounce
          "
          style={{
            animationDuration: "5s",
          }}
        />

        {/* LEFT BOTTOM */}

        <img
          src="https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg"
          alt=""
          className="
            absolute
            left-[18%]
            bottom-[8%]
            w-28
            lg:w-36
            xl:w-40
            h-40
            lg:h-52
            xl:h-60
            object-cover
            rounded-2xl
            opacity-50
            shadow-2xl
            rotate-6
            animate-bounce
          "
          style={{
            animationDuration: "6s",
          }}
        />

        {/* RIGHT BOTTOM */}

        <img
          src="https://image.tmdb.org/t/p/w500/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg"
          alt=""
          className="
            absolute
            right-[16%]
            bottom-[8%]
            w-28
            lg:w-36
            xl:w-40
            h-40
            lg:h-52
            xl:h-60
            object-cover
            rounded-2xl
            opacity-55
            shadow-2xl
            -rotate-6
            animate-bounce
          "
          style={{
            animationDuration: "7s",
          }}
        />

        {/* CENTER LEFT */}

        <img
          src="https://image.tmdb.org/t/p/w500/r7XifzvtezNt31ypvsmb6Oqxw49.jpg"
          alt=""
          className="
            absolute
            left-[29%]
            top-[18%]
            w-24
            lg:w-32
            xl:w-36
            h-36
            lg:h-48
            xl:h-56
            object-cover
            rounded-2xl
            opacity-35
            shadow-2xl
            rotate-6
            animate-bounce
          "
          style={{
            animationDuration: "6.5s",
          }}
        />

        {/* CENTER RIGHT */}

        <img
          src="https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg"
          alt=""
          className="
            absolute
            right-[28%]
            bottom-[17%]
            w-24
            lg:w-32
            xl:w-36
            h-36
            lg:h-48
            xl:h-56
            object-cover
            rounded-2xl
            opacity-35
            shadow-2xl
            -rotate-6
            animate-bounce
          "
          style={{
            animationDuration: "5.5s",
          }}
        />

        {/* FAR LEFT */}

        <img
          src="https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg"
          alt=""
          className="
            absolute
            left-[-2%]
            top-[42%]
            w-24
            lg:w-32
            h-36
            lg:h-48
            object-cover
            rounded-2xl
            opacity-30
            rotate-6
            animate-bounce
          "
          style={{
            animationDuration: "7s",
          }}
        />

        {/* FAR RIGHT */}

        <img
          src="https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg"
          alt=""
          className="
            absolute
            right-[-2%]
            top-[43%]
            w-24
            lg:w-32
            h-36
            lg:h-48
            object-cover
            rounded-2xl
            opacity-30
            -rotate-6
            animate-bounce
          "
          style={{
            animationDuration: "6s",
          }}
        />

      </div>

      {/* ================================================= */}
      {/* CENTER CARD */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-30
          min-h-screen
          w-full
          flex
          items-center
          justify-center
          px-4
          sm:px-6
          py-16
        "
      >

        <div
          className={`
            relative
            z-50
            w-full
            max-w-[430px]
            p-6
            sm:p-8
            rounded-3xl
            bg-black/80
            backdrop-blur-2xl
            border
            border-white/10
            shadow-[0_25px_100px_rgba(0,0,0,0.85)]
            transition-all
            duration-700
            ${mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
            }
          `}
        >

          {/* ================================================= */}
          {/* NEVERX LOGO */}
          {/* ================================================= */}

          <div className="mb-7 text-center">

            <div
              className="
                flex
                items-center
                justify-center
                gap-3
              "
            >
              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-red-600
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  shadow-red-600/30
                "
              >
                <FaFilm className="text-white text-2xl" />
              </div>

              <h1
                className="
                  text-4xl
                  sm:text-5xl
                  font-black
                  tracking-tight
                "
              >
                NEVER
                <span className="text-red-600">
                  X
                </span>
              </h1>
            </div>

            <p
              className="
                mt-3
                text-sm
                sm:text-base
                text-white/50
              "
            >
              {t.subtitle}
            </p>

          </div>

          {/* ================================================= */}
          {/* EMAIL LOGIN */}
          {/* ================================================= */}

          {!phoneMode ? (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder={t.email}
                autoComplete="email"
                className="
                  w-full
                  h-14
                  px-4
                  rounded-2xl
                  bg-white/5
                  border
                  border-white/10
                  outline-none
                  text-white
                  placeholder:text-white/30
                  focus:border-blue-500/60
                  focus:bg-white/10
                  transition
                  mb-3.5
                "
              />

              {/* PASSWORD */}

              <div
                className="
                  relative
                  w-full
                  mb-3.5
                "
              >
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder={t.password}
                  autoComplete="current-password"
                  className="
                    w-full
                    h-14
                    px-4
                    pr-12
                    rounded-2xl
                    bg-white/5
                    border
                    border-white/10
                    outline-none
                    text-white
                    placeholder:text-white/30
                    focus:border-blue-500/60
                    focus:bg-white/10
                    transition
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-white/40
                    hover:text-white
                    transition
                    cursor-pointer
                  "
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* PHONE */}

              <div className="relative">

                <FaMobileAlt
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-white/30
                  "
                />

                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder={
                    t.phonePlaceholder
                  }
                  className="
                    w-full
                    h-14
                    pl-11
                    pr-4
                    rounded-2xl
                    bg-white/5
                    border
                    border-white/10
                    outline-none
                    text-white
                    placeholder:text-white/30
                    focus:border-blue-500/60
                    focus:bg-white/10
                    transition
                    mb-3.5
                  "
                />

              </div>

              {confirmationResult && (
                <div className="relative">

                  <FaMobileAlt
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-white/30
                    "
                  />

                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder={
                      t.smsPlaceholder
                    }
                    className="
                      w-full
                      h-14
                      pl-11
                      pr-4
                      rounded-2xl
                      bg-white/5
                      border
                      border-white/10
                      outline-none
                      text-white
                      placeholder:text-white/30
                      focus:border-blue-500/60
                      focus:bg-white/10
                      transition
                      mb-3.5
                    "
                  />

                </div>
              )}
            </>
          )}

          {/* ================================================= */}
          {/* LOGIN BUTTON */}
          {/* ================================================= */}

          <button
            type="button"
            onClick={
              phoneMode
                ? confirmationResult
                  ? verifyPhoneCode
                  : phoneLogin
                : login
            }
            disabled={loading}
            className="
              w-full
              h-14
              rounded-2xl
              bg-blue-700
              hover:bg-blue-600
              active:scale-[0.98]
              disabled:opacity-50
              disabled:cursor-not-allowed
              text-white
              font-bold
              transition
              cursor-pointer
              shadow-lg
              shadow-blue-900/30
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <span>
              {loading
                ? t.loading
                : phoneMode
                  ? confirmationResult
                    ? t.verify
                    : t.sendSms
                  : t.login}
            </span>

            {!loading && (
              <FaArrowRight className="text-sm" />
            )}
          </button>

          {/* ================================================= */}
          {/* PHONE / EMAIL */}
          {/* ================================================= */}

          <button
            type="button"
            onClick={switchLoginMode}
            className="
              w-full
              mt-4
              text-sm
              text-blue-400
              hover:text-blue-300
              font-semibold
              transition
              cursor-pointer
            "
          >
            {phoneMode
              ? t.emailLogin
              : t.phoneLogin}
          </button>

          {/* RECAPTCHA */}

          <div id="recaptcha-container" />

          {/* ================================================= */}
          {/* OR */}
          {/* ================================================= */}

          <div
            className="
              flex
              items-center
              gap-4
              my-6
              text-white/30
              text-sm
            "
          >
            <div
              className="
                flex-1
                h-px
                bg-white/10
              "
            />

            <span>{t.or}</span>

            <div
              className="
                flex-1
                h-px
                bg-white/10
              "
            />
          </div>

          {/* ================================================= */}
          {/* SOCIAL LOGIN */}
          {/* ================================================= */}

          <div
            className="
              grid
              grid-cols-3
              gap-2.5
            "
          >

            {/* GOOGLE */}

            <button
              type="button"
              onClick={googleLogin}
              disabled={loading}
              className="h-12 rounded-xl bg-white hover:bg-gray-100 text-black flex items-center justify-center gap-2
               font-semibold transition hover:scale-[1.03] disabled:opacity-50 cursor-pointer">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.93-4.18 2.93-7.4Z"
                />

                <path
                  fill="#34A853"
                  d="M12 21.5c2.63 0 4.84-.87 6.46-2.36l-3.14-2.44c-.87.58-1.98.93-3.32.93-2.55 0-4.71-1.72-5.49-4.03H3.27v2.52A9.75 9.75 0 0 0 12 21.5Z"
                />

                <path
                  fill="#FBBC05"
                  d="M6.51 13.6A5.86 5.86 0 0 1 6.2 12c0-.56.1-1.1.31-1.6V7.88H3.27A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.02 4.12l3.24-2.52Z"
                />

                <path
                  fill="#EA4335"
                  d="M12 6.37c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.46 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.73 5.38l3.24 2.52C7.29 8.09 9.45 6.37 12 6.37Z"
                />
              </svg>

              <span className="hidden sm:inline">
                Google
              </span>
            </button>

            {/* GITHUB */}

            <button
              type="button"
              onClick={githubLogin}
              disabled={loading}
              className="
                h-12
                rounded-xl
                bg-[#0d1117]
                hover:bg-[#161b22]
                text-white
                border
                border-[#30363d]
                flex
                items-center
                justify-center
                gap-2
                font-semibold
                transition
                hover:scale-[1.03]
                disabled:opacity-50
                cursor-pointer
              "
            >
              <FaGithub className="text-xl" />

              <span className="hidden sm:inline">
                GitHub
              </span>
            </button>

            {/* APPLE */}

            <button
              type="button"
              onClick={appleLogin}
              disabled={loading}
              className="
                h-12
                rounded-xl
                bg-white
                hover:bg-gray-100
                text-black
                border
                border-gray-200
                flex
                items-center
                justify-center
                gap-2
                font-semibold
                transition
                hover:scale-[1.03]
                disabled:opacity-50
                cursor-pointer
              "
            >
              <FaApple className="text-xl" />

              <span className="hidden sm:inline">
                Apple
              </span>
            </button>

          </div>

          {/* ================================================= */}
          {/* REGISTER */}
          {/* ================================================= */}

          <p
            className="
              text-center
              text-sm
              text-white/40
              mt-6
            "
          >
            {t.noAccount}

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
              className="
                ml-1.5
                text-blue-400
                hover:text-blue-300
                font-semibold
                cursor-pointer
              "
            >
              {t.register}
            </button>
          </p>

        </div>
      </div>

    </main>
  );
}