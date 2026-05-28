import { useState, useRef, useEffect } from "react";
import Drawer from "./Drawer";
import { FaUserCircle, FaPalette } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { FaFilm } from "react-icons/fa";
import { FaCog } from "react-icons/fa";

export default function Navbar({
  user,
  setLang,
  lang,
  theme,
  setTheme,
  isAdmin,
  setShowAdmin,
  handleLogout,
}) {
  const [langOpen, setLangOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const langRef = useRef(null);
  const dropRef = useRef(null);

  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setInstallPrompt(null);
  };

  const t = {
    EN: { role: "Frontend Dev | Mobile Graphics" },
    UZ: { role: "Frontend dasturchi | Mobilograf" },
    RU: { role: "Фронтенд разработчик | Мобильная графика" },
    DE: { role: "Frontend Entwickler | Mobile Grafik" },
    TR: { role: "Fröntend Gelíştírící | Möbíl Grâfík" },
  };

  const languages = [
    { code: "EN", label: "English", flag: "us" },
    { code: "UZ", label: "O'zbek", flag: "uz" },
    { code: "RU", label: "Русский", flag: "ru" },
    { code: "DE", label: "Deutsch", flag: "de" },
    { code: "TR", label: "Türkçe", flag: "tr" },
  ];

  const adminText = {
    EN: "Admin",
    UZ: "Admin",
    RU: "Админ",
    DE: "Admin",
    TR: "Admin",
  };

  const texts = {
    EN: {
      profile: "Profile",
      logout: "Logout",
    },
    UZ: {
      profile: "Profil",
      logout: "Chiqish",
    },
    RU: {
      profile: "Профиль",
      logout: "Выход",
    },
    DE: {
      profile: "Profil",
      logout: "Abmelden",
    },
    TR: {
      profile: "Profil",
      logout: "Çıkış",
    },
  };

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return (
    <div className="sticky top-0 z-30 bg-base-200 border-b border-white/10">
      <div className="flex items-center justify-between px-3 py-2 sm:px-4">

        {/* LEFT */}
        <div className="flex items-center gap-2">
          <Drawer lang={lang} user={user} open={drawerOpen} setOpen={setDrawerOpen} />
          <h2 className="flex items-center gap-1 text-xl ml-3 font-semibold truncate">
            <FaFilm size={25} /> NeverX
          </h2>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button onClick={() => setShowAdmin(true)}
              className="w-18 h-12 sm:w-18 sm:h-12 rounded-lg cursor-pointer border-none hover:bg-base-100
               flex items-center justify-center gap-1 font-semibold">
              <span className="text-lg"><FaCog /></span>
              <span>{adminText[lang] || "Admin"}</span>
            </button>
          )}

          {/* THEME */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="flex items-center cursor-pointer justify-center w-12 h-10 rounded-xl">
              <FaPalette />
            </div>
            <ul tabIndex={0} className="dropdown-content bg-base-300 mt-2 rounded-box w-40 p-2 shadow">
              {["dark", "valentine", "cyberpunk", "retro", "aqua"].map((t) => (
                <li key={t}>
                  <button onClick={() => {
                    setTheme(t);
                    localStorage.setItem("theme", t);
                  }}
                    className={`btn btn-sm w-full justify-start mb-1 ${theme === t ? "btn-primary" : "btn-ghost"
                      }`}>
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* LANGUAGE */}
          <div ref={langRef} className="relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="w-12 h-10 cursor-pointer rounded-xl">
              {lang}
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-3 bg-base-200 p-2 rounded-xl shadow w-40 z-50">
                {languages.map((l) => (
                  <div key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      localStorage.setItem("lang", l.code);
                      setLangOpen(false);
                    }}
                    className="flex gap-2 p-2 hover:bg-base-300 cursor-pointer rounded-lg">
                    <img src={`https://flagcdn.com/w40/${l.flag}.png`}
                      className="w-5 h-4"
                      alt={l.label} />
                    <span>{l.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* USER DROPDOWN */}
          <div ref={dropRef} style={{ position: "relative" }}>
            <button onClick={() => setDropOpen((p) => !p)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}>

              {user?.photoURL ? (
                <img className="rounded-full bg-base-200 object-cover border-2 border-white/20" src={user.photoURL}
                  alt="avatar"
                  style={{
                    width: isMobile ? 34 : 40,
                    height: isMobile ? 34 : 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid rgba(255,255,255,0.2)",
                  }} />
              ) : (
                <FaUserCircle
                  style={{
                    fontSize: isMobile ? 34 : 40,
                    color: "#9ca3af",
                  }}
                />
              )}
            </button>

            {!installed && installPrompt && (
              <button
                onClick={handleInstall}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #234E70, #5B8DB8)" }}>
                <FaDownload size={16} />
                {t[lang]?.install || t.EN.install}
              </button>
            )}

            {installed && (
              <div className="mt-4 w-full text-center py-3 rounded-xl text-sm opacity-50 border border-current">
                {t[lang]?.installed || t.EN.installed}
              </div>
            )}

            {dropOpen && (
              <div className="absolute right-0 top-[52px] w-[260px] bg-base-200 border border-white/10 rounded-3xl shadow-2xl p-4 z-[999]">
                <div className="flex flex-col items-center text-center">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="avatar"
                      className="w-20 h-20 rounded-full object-cover border-2 border-white/20"/>
                  ) : (
                    <FaUserCircle className="text-7xl text-gray-400" />
                  )}

                  <h2 className="mt-3 font-bold text-lg">
                    {user?.displayName || user?.email}
                  </h2>

                  <p className="text-sm text-cyan-400 mt-1">
                    {t[lang]?.role}
                  </p>
                </div>

                {/* INSTALL BUTTON */}
                {!installed && installPrompt && (
                  <button onClick={handleInstall}
                    className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 active:scale-[0.98] transition-all">
                    <FaDownload size={15} />
                    {t[lang]?.install || "Install"}
                  </button>
                )}

                {/* INSTALLED */}
                {installed && (
                  <div className="mt-4 w-full text-center py-3 rounded-2xl text-sm opacity-60">
                    {t[lang]?.installed || "Installed"}
                  </div>
                )}

                {/* PROFILE */}
                <button onClick={() => {
                  setDrawerOpen(true);
                  setDropOpen(false);
                }}
                  className="w-full mt-5 text-left cursor-pointer rounded-xl hover:bg-base-300 active:bg-base-300 active:scale-[0.98]
                    transition-all duration-150"
                  style={{
                    padding: isMobile ? "8px 10px" : "10px 12px",
                    fontSize: isMobile ? 13 : 15,
                  }}>
                  {texts[lang]?.profile}
                </button>

                {/* LOGOUT */}
                <button onClick={handleLogout}
                  className="w-full text-left cursor-pointer rounded-xl hover:bg-base-300 active:bg-base-300 active:scale-[0.98]
                   transition-all duration-150"
                  style={{
                    padding: isMobile ? "8px 10px" : "10px 12px",
                    fontSize: isMobile ? 13 : 15,
                  }}>
                  {texts[lang]?.logout}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ANIMATION */}
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div >
  );
}