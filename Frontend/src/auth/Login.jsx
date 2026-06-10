import { auth } from "../firebase/config";
import { saveUser } from "../firebase/userService";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

import { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const [lang, setLang] = useState(
    localStorage.getItem("lang") || "UZ"
  );

  const langRef = useRef(null);

  const languages = [
    { code: "UZ", label: "O‘zbek", flag: "uz" },
    { code: "EN", label: "English", flag: "us" },
    { code: "RU", label: "Русский", flag: "ru" },
    { code: "DE", label: "Deutsch", flag: "de" },
    { code: "TR", label: "Türkçe", flag: "tr" },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const texts = {
    UZ: {
      subtitle: "Cheksiz kinolar va seriallar 🎬",
      email: "Email",
      password: "Parol",
      login: "Kirish →",
      loading: "Kirish...",
      or: "yoki",
      noAccount: "Akkaunt yo‘qmi?",
      register: "Ro‘yxatdan o‘tish",
      empty: "Email va parol kiriting ❌",
      success: "Muvaffaqiyatli kirdingiz ✅",
      error: "Login yoki parol noto‘g‘ri ❌",
      googleSuccess: "Google orqali kirdingiz ✅",
      googleError: "Google login xatolik ❌",
      githubSuccess: "GitHub orqali kirdingiz ✅",
      githubError: "GitHub login xatolik ❌",
    },
    EN: {
      subtitle: "Unlimited movies & series 🎬",
      email: "Email",
      password: "Password",
      login: "Login →",
      loading: "Loading...",
      or: "or",
      noAccount: "Don't have an account?",
      register: "Register",
      empty: "Enter email and password ❌",
      success: "Successfully logged in ✅",
      error: "Wrong email or password ❌",
      googleSuccess: "Logged in with Google ✅",
      googleError: "Google login failed ❌",
      githubSuccess: "Logged in with GitHub ✅",
      githubError: "GitHub login failed ❌",
    },
    RU: {
      subtitle: "Безлимитные фильмы и сериалы 🎬",
      email: "Эл. почта",
      password: "Пароль",
      login: "Вход →",
      loading: "Вход...",
      or: "или",
      noAccount: "Нет аккаунта?",
      register: "Регистрация",
      empty: "Введите email и пароль ❌",
      success: "Успешный вход ✅",
      error: "Неверный логин или пароль ❌",
      googleSuccess: "Вход через Google ✅",
      googleError: "Ошибка Google входа ❌",
      githubSuccess: "Вход через GitHub ✅",
      githubError: "Ошибка GitHub входа ❌",
    },
    DE: {
      subtitle: "Unbegrenzte Filme und Serien 🎬",
      email: "E-Mail",
      password: "Passwort",
      login: "Anmelden →",
      loading: "Wird geladen...",
      or: "oder",
      noAccount: "Noch kein Konto?",
      register: "Registrieren",
      empty: "E-Mail und Passwort eingeben ❌",
      success: "Erfolgreich eingeloggt ✅",
      error: "Falsche Daten ❌",
      googleSuccess: "Mit Google eingeloggt ✅",
      googleError: "Google Anmeldung fehlgeschlagen ❌",
      githubSuccess: "Mit GitHub eingeloggt ✅",
      githubError: "GitHub Anmeldung fehlgeschlagen ❌",
    },
    TR: {
      subtitle: "Sınırsız film ve diziler 🎬",
      email: "E-posta",
      password: "Şifre",
      login: "Giriş →",
      loading: "Giriş yapılıyor...",
      or: "veya",
      noAccount: "Hesabın yok mu?",
      register: "Kayıt ol",
      empty: "Email ve şifre gir ❌",
      success: "Başarıyla giriş yapıldı ✅",
      error: "Hatalı giriş ❌",
      googleSuccess: "Google ile giriş yapıldı ✅",
      googleError: "Google giriş hatası ❌",
      githubSuccess: "GitHub ile giriş yapıldı ✅",
      githubError: "GitHub giriş hatası ❌",
    },
  };

  const t = useMemo(() => texts[lang] || texts.UZ, [lang]);

  const login = async () => {
    if (!email || !password) {
      toast.error(t.empty);
      return;
    }

    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      await saveUser(result.user);
      toast.success(t.success);
    } catch {
      toast.error(t.error);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      await saveUser(result.user);

      toast.success(t.googleSuccess);
    } catch {
      toast.error(t.googleError);
    }
  };

  const githubLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);

      await saveUser(result.user);
      toast.success(t.githubSuccess);
    } catch {
      toast.error(t.githubError);
    }
  };

  return (
    <div>
      <div ref={langRef} className="fixed top-3 right-3 sm:top-3 sm:right-4 z-[999]">
        <div className="relative">

          <button onClick={() => setLangOpen(!langOpen)}
            className="w-12 h-11 sm:w-12 sm:h-10 flex items-center justify-center cursor-pointer rounded-xl bg-[#0d1117] border border-[#30363d] text-white font-bold hover:bg-[#161b22] transition text-sm sm:text-base">
            {lang}
          </button>

          {langOpen && (
            <div className="absolute right-0 mt-2 sm:mt-3 bg-[#0d1117] border border-[#30363d] p-2 rounded-xl shadow-lg w-40 sm:w-44">
              {languages.map((l) => (
                <div key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    localStorage.setItem("lang", l.code);
                    setLangOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 hover:bg-[#161b22] cursor-pointer rounded-lg text-white text-sm sm:text-base">

                  <img src={`https://flagcdn.com/w40/${l.flag}.png`}
                    className="w-4 h-3 sm:w-5 sm:h-4 rounded-sm"
                    alt={l.label}/>

                  <span>{l.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={styles.page}>
        <div style={styles.banner}>
          <video autoPlay muted loop playsInline style={styles.video}>
            <source src="https://www.w3schools.com/howto/rain.mp4" />
          </video>

          <div style={styles.overlay}></div>

          <div style={styles.movies}>
            {[
              "https://image.tmdb.org/t/p/w300/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
              "https://image.tmdb.org/t/p/w300/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
              "https://image.tmdb.org/t/p/w300/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
              "https://image.tmdb.org/t/p/w300/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg",
              "https://image.tmdb.org/t/p/w300/r7XifzvtezNt31ypvsmb6Oqxw49.jpg",
            ].map((img, i) => (
              <img key={i}
                src={img}
                style={{
                  ...styles.poster,
                  animationDelay: `${i * 0.2}s`,
                }} />
            ))}
          </div>
        </div>

        {/* CARD */}
        <div style={{
          ...styles.card,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(30px)",
        }}>

          <h1 style={styles.title}>NeverX</h1>
          <p style={styles.subtitle}>{t.subtitle}</p>

          <input
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input} />

          <input
            type="password"
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input} />

          <button className="w-full py-3 cursor-pointer rounded-xl bg-blue-800 hover:bg-blue-900 font-bold transition-all" 
            onClick={login} style={styles.loginBtn}>
            {loading ? t.loading : t.login}
          </button>

          <div style={styles.divider}>{t.or}</div>

          <div style={styles.socials}>
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0d1117] text-white
             font-semibold border border-[#30363d] transition-all duration-200 hover:scale-[1.03] hover:shadow-lg
              hover:bg-[#161b22]" onClick={googleLogin} style={styles.googleBtn}>
              <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
                alt="google"
                style={styles.icon} />
              Google
            </button>

            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0d1117] text-white 
            font-semibold  border border-[#30363d] transition-all duration-200 hover:scale-[1.03] hover:shadow-lg
             hover:bg-[#161b22]" onClick={githubLogin} style={styles.githubBtn}>
              <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                alt="github"
                style={styles.iconGithub} />
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div> 
  );
}

const styles = {
  banner: {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
  },

  video: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "brightness(0.35)",
    transform: "scale(1.1)", 
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0.3), rgba(0,0,0,0.95))",
  },

  movies: {
    position: "absolute",
    right: "4%",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    gap: 14,
    zIndex: 2,
  },

  poster: {
    width: 130,
    height: 190,
    borderRadius: 18,
    objectFit: "cover",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.5)",
    animation:
      "floatPoster 4s ease-in-out infinite",
  },

  card: {
    position: "relative",
    zIndex: 5,
    width: "100%",
    maxWidth: 430,
    padding: 34,
    borderRadius: 28,
    background:
      "rgba(15,15,15,0.65)",
    backdropFilter: "blur(18px)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    transition: "0.4s ease",
  },

  badge: {
    background: "#e50914",
    padding: "7px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: 1,
  },

  title: {
    color: "#fff",
    fontSize: 52,
    marginTop: 20,
    marginBottom: 8,
    fontWeight: 900,
  },

  subtitle: {
    color: "rgba(255,255,255,0.6)",
    marginBottom: 28,
  },

  input: {
    width: "100%",
    padding: 15,
    borderRadius: 14,
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.05)",
    color: "#fff",
    marginBottom: 14,
    outline: "none",
    fontSize: 15,
  },

  divider: {
    display: "flex",
    justifyContent: "center",
    margin: "18px 0",
    color: "rgba(255,255,255,0.35)",
    fontSize: 17,
  },

  socials: {
    display: "flex",
    gap: 10,
  },

  googleBtn: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid #dadce0",
    background: "#fff",
    color: "#111",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "0.2s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  githubBtn: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid #30363d",
    background: "#0d1117",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "0.2s ease",
    boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
  },

  icon: {
    width: 18,
    height: 18,
  },

  iconGithub: {
    width: 18,
    height: 18,
    filter: "invert(1)",
  },

  text: {
    marginTop: 20,
    textAlign: "center",
    color: "rgba(255,255,255,0.5)",
    fontSize: 15,
  },

  link: {
    color: "#ff3344",
    cursor: "pointer",
    fontWeight: 700,
  },

  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  logoMini: {
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: 1,
  },

  live: {
    background: "#E50914",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
  },

  langRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 20,
  },

  langBtn: {
    border: "none",
    padding: "8px 12px",
    borderRadius: 12,
    color: "#fff",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
    transition: "0.3s",
  },
  langWrapper: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
  },

  langSelect: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    outline: "none",
    cursor: "pointer",
  },
};