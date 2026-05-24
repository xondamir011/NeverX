import { useState, useRef, useEffect } from "react";
import Drawer from "./Drawer";
import { FaUserCircle, FaPalette } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

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

  const langRef = useRef(null);
  const dropRef = useRef(null);

  const languages = [
    { code: "EN", label: "English", flag: "us" },
    { code: "UZ", label: "O'zbek", flag: "uz" },
    { code: "RU", label: "Русский", flag: "ru" },
    { code: "DE", label: "Deutsch", flag: "de" },
    { code: "TR", label: "Türkçe", flag: "tr" },
  ];

  const titles = {
    EN: "Movies",
    UZ: "Filmlar",
    RU: "Фильмы",
    DE: "Filme",
    TR: "Filmler",
  };

  const adminText = {
    EN: "Admin",
    UZ: "Admin",
    RU: "Админ",
    DE: "Admin",
    TR: "Admin",
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
           <Drawer lang={lang} user={user} />
          <h2 className="text-sm sm:text-lg font-semibold truncate">
            🎬 {titles[lang] || "Movies"}
          </h2>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button onClick={() => setShowAdmin(true)}
              className="btn btn-sm bg-indigo-600 text-white border-none hover:bg-indigo-700">
              ⚙️ {adminText[lang] || "Admin"}
            </button>
          )}

          {/* THEME */}
          <div className="dropdown dropdown-end">
            <div className="btn btn-sm bg-base-100 rounded-xl">
              <FaPalette />
            </div>
            <ul className="dropdown-content bg-base-300 mt-2 rounded-box w-40 p-2 shadow">
              {["dark", "valentine", "cyberpunk", "retro", "aqua"].map((t) => (
                <li key={t}>
                  <button onClick={() => {
                      setTheme(t);
                      localStorage.setItem("theme", t);
                    }}
                    className={`btn btn-sm w-full justify-start mb-1 ${
                      theme === t ? "btn-primary" : "btn-ghost"
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
              className="btn btn-sm bg-base-100 rounded-xl">
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
                      alt={l.label}/>
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
                <img src={user.photoURL}
                  alt="avatar"
                  style={{
                    width: isMobile ? 34 : 40,
                    height: isMobile ? 34 : 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid rgba(255,255,255,0.2)",
                  }}/>
              ) : (
                <FaUserCircle
                  style={{
                    fontSize: isMobile ? 34 : 40,
                    color: "#9ca3af",
                  }}
                />
              )}
            </button>

            {dropOpen && (
              <div className="bg-base-200"
                style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  right: 0,

                  width: isMobile ? 170 : 230,
                  borderRadius: isMobile ? 14 : 22,
                  boxShadow: "0 12px 48px rgba(0,0,0,0.18)",
                  padding: isMobile ? "8px 10px" : "12px 15px",
                  zIndex: 999,
                  animation: "dropIn 0.25s ease",
                }}>
                {/* USER INFO */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: isMobile ? 6 : 10,
                    marginBottom: isMobile ? 10 : 16,
                  }}>
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      style={{
                        width: isMobile ? 50 : 76,
                        height: isMobile ? 50 : 76,
                        borderRadius: "50%",
                      }}/>
                  ) : (
                    <FaUserCircle
                      style={{
                        fontSize: isMobile ? 50 : 76,
                        color: "#d1d5db",
                      }}/>
                  )}

                  <h2 style={{
                      margin: 0,
                      fontSize: isMobile ? 14 : 18,
                      fontWeight: 700,
                      textAlign: "center",
                    }}>
                    {user?.displayName || user?.email}
                  </h2>
                </div>

                <hr style={{ margin: "0 0 6px", borderTop: "1px solid #fce7f3" }} />

                {/* PROFILE */}
                <button className="cursor-pointer hover:bg-base-300"
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: isMobile ? "6px 8px" : "10px 12px",
                    fontSize: isMobile ? 13 : 15,
                    borderRadius: 10,
                  }}>
                  Profil
                </button>

                {/* LOGOUT */}
                <button onClick={handleLogout}
                  className="cursor-pointer hover:bg-base-300"
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: isMobile ? "6px 8px" : "10px 12px",
                    fontSize: isMobile ? 13 : 15,
                    borderRadius: 10,
                  }}>
                  Chiqish
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
    </div>
  );
}