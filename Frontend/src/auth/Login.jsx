import { auth } from "../firebase/config";
import { saveUser } from "../firebase/userService";
import neverxLogo from "../assets/neverx.png";
import neverxBlueLogo from "../assets/neverxBlue.png";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { toast } from "react-toastify";

import {
  FaApple,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaCheckCircle,
  FaFilm,
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

  // THEME
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "night"
  );

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

  // =====================================================
  // MOUNT
  // =====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem("theme", theme);
  }, [theme]);

  // =====================================================
  // CLOSE LANGUAGE DROPDOWN
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        langRef.current &&
        !langRef.current.contains(event.target)
      ) {
        setLangOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

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

  // =====================================================
  // EMAIL LOGIN
  // =====================================================

  const login = async () => {
    if (!email || !password) {
      toast.error(
        <div className="flex items-center gap-2">
          <FaTimesCircle className="text-error" />
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
          <FaCheckCircle className="text-success" />
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
          <FaTimesCircle className="text-error" />
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
          <FaCheckCircle className="text-success" />
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
          <FaTimesCircle className="text-error" />
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
          <FaCheckCircle className="text-success" />
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
          <FaTimesCircle className="text-error" />
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
          <FaCheckCircle className="text-success" />
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
          <FaTimesCircle className="text-error" />
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
          <FaTimesCircle className="text-error" />
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
          <FaTimesCircle className="text-error" />
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
          <FaMobileAlt className="text-info" />
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
          <FaTimesCircle className="text-error" />
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
          <FaTimesCircle className="text-error" />
          <span>{t.codeEmpty}</span>
        </div>
      );

      return;
    }

    if (!confirmationResult) {
      toast.error(
        <div className="flex items-center gap-2">
          <FaTimesCircle className="text-error" />
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
          <FaCheckCircle className="text-success" />
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
          <FaTimesCircle className="text-error" />
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

  // =====================================================
  // THEME SWITCH
  // =====================================================

  const handleThemeChange = (e) => {
    const newTheme = e.target.checked
      ? "night"
      : "light";

    setTheme(newTheme);
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-base-200 text-base-content transition-colors duration-500">

      {/* ================================================= */}
      {/* BACKGROUND VIDEO */}
      {/* ================================================= */}

      <div
        className="
          absolute
          inset-0
          z-0
          overflow-hidden">

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

        {/* MAIN OVERLAY */}

        <div
          className={`
            absolute
            inset-0
            transition-all
            duration-500
            ${theme === "night"
              ? "bg-black/65"
              : "bg-white/25"
            }
          `}
        />

        {/* HORIZONTAL GRADIENT */}

        <div
          className={`
            absolute
            inset-0
            bg-gradient-to-r
            transition-all
            duration-500
            ${theme === "night"
              ? "from-black/90 via-black/40 to-black/85"
              : "from-white/65 via-white/10 to-white/65"
            }
          `}
        />

        {/* VERTICAL GRADIENT */}

        <div
          className={`
            absolute
            inset-0
            bg-gradient-to-b
            transition-all
            duration-500
            ${theme === "night"
              ? "from-black/40 via-transparent to-black/90"
              : "from-white/20 via-transparent to-white/55"
            }
          `}
        />

        {/* LIGHT MODE SOFT TINT */}

        {theme === "light" && (
          <div
            className="
              absolute
              inset-0
              bg-white/5
              pointer-events-none
            "
          />
        )}
      </div>

      {/* ================================================= */}
      {/* TOP RIGHT CONTROLS */}
      {/* ================================================= */}

      <div ref={langRef}
        className="
          absolute
          top-4
          right-4
          z-[100]
          flex
          items-center
          gap-2">

        {/* THEME */}

        <label
          className="
            swap
            swap-rotate
            h-10
            w-10
            rounded-xl
            bg-base-100/80
            backdrop-blur-xl
            border
            border-base-content/15
            text-base-content
            cursor-pointer
            hover:bg-base-100
            shadow-lg
            transition-all
          "
          title={
            theme === "night"
              ? "Light mode"
              : "Night mode"
          }
        >
          <input
            type="checkbox"
            className="theme-controller"
            value="night"
            checked={theme === "night"}
            onChange={handleThemeChange}
          />

          {/* SUN */}

          <svg
            className="
              swap-off
              h-7
              w-7
              fill-current
              text-warning
            "
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="
                M5.64,17l-.71.71a1,1,0,0,0,0,1.41,
                1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12
                a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12ZM12,5
                a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05
                a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71
                A1,1,0,0,0,4.93,6.34ZM17.66,7.34a1,1,0,0,0,.7-.29l.71-.71
                a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20
                a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2ZM12,19a1,1,0,0,0-1,1v1
                a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36
                l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12
                A5.51,5.51,0,0,0,12,6.5Z
              "
            />
          </svg>

          {/* MOON */}

          <svg
            className="
              swap-on
              h-7
              w-7
              fill-current
              text-primary
            "
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="
                M21.64,13a1,1,0,0,0-1.05-.14,
                8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49,
                8.59,8.59,0,0,1,9.33,3.5A1,1,0,0,0,8,2.36,
                10.14,10.14,0,1,0,22,14.05A1,1,0,0,0,21.64,13Z
              "
            />
          </svg>
        </label>

        {/* LANGUAGE */}

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
              bg-base-100/80
              backdrop-blur-xl
              border
              border-base-content/15
              text-base-content
              font-bold
              text-sm
              hover:bg-base-100
              shadow-lg
              transition-all
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
                bg-base-100
                border
                border-base-content/15
                shadow-2xl
                text-base-content
                z-[200]
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
                    hover:bg-base-content/10
                    transition
                    cursor-pointer
                    text-left
                    text-sm
                    text-base-content
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

                  <span>{l.label}</span>
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
          className={`
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
            ${theme === "night"
              ? "opacity-50"
              : "opacity-70"
            }
            shadow-2xl
            -rotate-12
            animate-bounce
            transition-opacity
            duration-500
          `}
        />

        {/* RIGHT TOP */}

        <img
          src="https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg"
          alt=""
          className={`
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
            ${theme === "night"
              ? "opacity-60"
              : "opacity-75"
            }
            shadow-2xl
            rotate-6
            animate-bounce
            transition-opacity
            duration-500
          `}
          style={{
            animationDuration: "5s",
          }}
        />

        {/* LEFT BOTTOM */}

        <img
          src="https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg"
          alt=""
          className={`
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
            ${theme === "night"
              ? "opacity-50"
              : "opacity-70"
            }
            shadow-2xl
            rotate-6
            animate-bounce
            transition-opacity
            duration-500
          `}
          style={{
            animationDuration: "6s",
          }}
        />

        {/* RIGHT BOTTOM */}

        <img
          src="https://image.tmdb.org/t/p/w500/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg"
          alt=""
          className={`
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
            ${theme === "night"
              ? "opacity-55"
              : "opacity-70"
            }
            shadow-2xl
            -rotate-6
            animate-bounce
            transition-opacity
            duration-500
          `}
          style={{
            animationDuration: "7s",
          }}
        />

        {/* CENTER LEFT */}

        <img
          src="https://image.tmdb.org/t/p/w500/r7XifzvtezNt31ypvsmb6Oqxw49.jpg"
          alt=""
          className={`
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
            ${theme === "night"
              ? "opacity-35"
              : "opacity-55"
            }
            shadow-2xl
            rotate-6
            animate-bounce
            transition-opacity
            duration-500
          `}
          style={{
            animationDuration: "6.5s",
          }}
        />

        {/* CENTER RIGHT */}

        <img
          src="https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg"
          alt=""
          className={`
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
            ${theme === "night"
              ? "opacity-35"
              : "opacity-55"
            }
            shadow-2xl
            -rotate-6
            animate-bounce
            transition-opacity
            duration-500
          `}
          style={{
            animationDuration: "5.5s",
          }}
        />

        {/* FAR LEFT */}

        <img
          src="https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg"
          alt=""
          className={`
            absolute
            left-[-2%]
            top-[42%]
            w-24
            lg:w-32
            h-36
            lg:h-48
            object-cover
            rounded-2xl
            ${theme === "night"
              ? "opacity-30"
              : "opacity-45"
            }
            rotate-6
            animate-bounce
            transition-opacity
            duration-500
          `}
          style={{
            animationDuration: "7s",
          }}
        />

        {/* FAR RIGHT */}

        <img
          src="https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg"
          alt=""
          className={`
            absolute
            right-[-2%]
            top-[43%]
            w-24
            lg:w-32
            h-36
            lg:h-48
            object-cover
            rounded-2xl
            ${theme === "night"
              ? "opacity-30"
              : "opacity-45"
            }
            -rotate-6
            animate-bounce
            transition-opacity
            duration-500
          `}
          style={{
            animationDuration: "6s",
          }}
        />
      </div>

      {/* ================================================= */}
      {/* CENTER */}
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

        {/* LOGIN CARD */}

        <div
          className={`
            relative
            z-50
            w-full
            max-w-[430px]
            p-6
            sm:p-8
            rounded-3xl
            backdrop-blur-2xl
            border
            shadow-2xl
            transition-all
            duration-700

            ${theme === "night"
              ? `
                  bg-black/45
                  border-white/10
                  shadow-black/50
                `
              : `
                  bg-white/90
                  border-black/10
                  shadow-black/20
                `
            }

            ${mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
            }
          `}>

          {/* ================================================= */}
          {/* NEVERX LOGO */}
          {/* ================================================= */}

          <div className="mb-7 text-center">
            <div className="flex justify-center">
              <img
                src={
                  theme === "night"
                    ? neverxLogo
                    : neverxBlueLogo
                }
                alt="NeverX"
                className="w-[250px] sm:w-[280px] h-auto object-contain transition-all duration-500"/>
            </div>

            {/* FILM + TEXT */}

            <div
              className={`
                inline-flex
                items-center
                gap-2
                px-4
                py-2.5
                rounded-full
                border
                transition-all
                duration-500

                ${theme === "night"
                  ? `
                      border-primary/30
                      text-primary
                    `
                  : `
                      bg-primary/10
                      border-primary/40
                      text-primary
                    `
                }
              `}>

              <FaFilm
                className="
                  text-xl
                  sm:text-2xl
                  shrink-0
                "
              />

              <span
                className="
                  text-sm
                  sm:text-base
                  font-medium
                  whitespace-nowrap
                "
              >
                {t.subtitle}
              </span>
            </div>
          </div>

          {/* ================================================= */}
          {/* EMAIL LOGIN */}
          {/* ================================================= */}

          {!phoneMode ? (
            <>

              {/* EMAIL */}

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
                  bg-base-200/70
                  border
                  border-base-content/15
                  outline-none
                  text-base-content
                  placeholder:text-base-content/40
                  focus:border-primary
                  focus:bg-base-200
                  transition-all
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
                    bg-base-200/70
                    border
                    border-base-content/15
                    outline-none
                    text-base-content
                    placeholder:text-base-content/40
                    focus:border-primary
                    focus:bg-base-200
                    transition-all
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
                    text-base-content/60
                    hover:text-base-content
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
                    text-base-content/50
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
                    bg-base-200/70
                    border
                    border-base-content/15
                    outline-none
                    text-base-content
                    placeholder:text-base-content/40
                    focus:border-primary
                    focus:bg-base-200
                    transition-all
                    mb-3.5
                  "
                />
              </div>

              {/* SMS CODE */}

              {confirmationResult && (
                <div className="relative">

                  <FaMobileAlt
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-base-content/50
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
                      bg-base-200/70
                      border
                      border-base-content/15
                      outline-none
                      text-base-content
                      placeholder:text-base-content/40
                      focus:border-primary
                      focus:bg-base-200
                      transition-all
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
              bg-primary
              text-primary-content
              hover:bg-primary/90
              active:scale-[0.98]
              disabled:opacity-50
              disabled:cursor-not-allowed
              font-bold
              transition-all
              cursor-pointer
              shadow-lg
              shadow-primary/20
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
          {/* PHONE / EMAIL SWITCH */}
          {/* ================================================= */}

          <button
            type="button"
            onClick={switchLoginMode}
            className="
              w-full
              mt-4
              text-sm
              text-primary
              hover:text-primary/70
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
              text-base-content/50
              text-sm
            "
          >
            <div
              className="
                flex-1
                h-px
                bg-base-content/20
              "
            />

            <span>{t.or}</span>

            <div
              className="
                flex-1
                h-px
                bg-base-content/20
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
              className="
                h-12
                rounded-xl
                bg-white
                hover:bg-gray-100
                text-black
                border
                border-black/10
                flex
                items-center
                justify-center
                gap-2
                font-semibold
                transition-all
                hover:scale-[1.03]
                disabled:opacity-50
                cursor-pointer
              "
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#4285F4"
                  d="
                    M21.35 12.27c0-.79-.07-1.54-.2-2.27H12
                    v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93
                    v2.44h3.14c1.84-1.69 2.93-4.18
                    2.93-7.4Z
                  "
                />

                <path
                  fill="#34A853"
                  d="
                    M12 21.5c2.63 0 4.84-.87 6.46-2.36
                    l-3.14-2.44c-.87.58-1.98.93-3.32.93
                    -2.55 0-4.71-1.72-5.49-4.03
                    H3.27v2.52A9.75 9.75 0 0 0 12 21.5Z
                  "
                />

                <path
                  fill="#FBBC05"
                  d="
                    M6.51 13.6A5.86 5.86 0 0 1 6.2 12
                    c0-.56.1-1.1.31-1.6V7.88H3.27
                    A9.75 9.75 0 0 0 2.25 12
                    c0 1.57.38 3.06 1.02 4.12
                    l3.24-2.52Z
                  "
                />

                <path
                  fill="#EA4335"
                  d="
                    M12 6.37c1.43 0 2.71.49 3.72 1.46
                    l2.79-2.79C16.84 3.46 14.63 2.5 12 2.5
                    a9.75 9.75 0 0 0-8.73 5.38
                    l3.24 2.52C7.29 8.09 9.45 6.37 12 6.37Z
                  "
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
                border-black/10
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
              text-base-content/50
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
                text-primary
                hover:text-primary/70
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