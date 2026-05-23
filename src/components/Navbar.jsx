import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Drawer from "./Drawer";
import { FaUserCircle } from "react-icons/fa";
import { LogOut } from "react-feather";
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
  showAdmin
}) {
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

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

  useEffect(() => {
    const handleClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="sticky top-0 z-30 bg-base-200 border-b border-white/10">
      <div className="flex flex-col gap-2 px-3 py-2 sm:px-4">

        {/* TOP ROW */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Drawer lang={lang} />

            <h2 className="text-sm sm:text-lg font-semibold truncate max-w-[120px] sm:max-w-none">
              🎬 {titles[lang] || "Movies"}
            </h2>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button onClick={() => setShowAdmin(true)}
                className="btn btn-sm sm:btn-sm bg-indigo-600 text-white border-none hover:bg-indigo-700">
                ⚙️ Admin
              </button>
            )}

            {/* THEME */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-sm sm:btn-sm btn-secondary rounded-xl">
                🎨
              </div>

              <ul className="dropdown-content bg-base-300 mt-2 rounded-box w-40 p-2 shadow z-50">
                {["dark", "valentine", "cyberpunk", "retro", "aqua"].map((t) => (
                  <li key={t}>
                    <input
                      type="radio"
                      name="theme"
                      className="theme-controller w-full btn btn-sm btn-ghost justify-start"
                      value={t}
                      checked={theme === t}
                      onChange={() => {
                        setTheme(t);
                        localStorage.setItem("theme", t);
                      }}/>
                  </li>
                ))}
              </ul>
            </div>

            {/* LANGUAGE */}
            <div ref={langRef} className="relative">

              <button onClick={() => setLangOpen(!langOpen)}
                className="btn btn-sm btn-primary rounded-xl flex items-center gap-1">
                <span>{lang}</span>
              </button>

              {langOpen && (
                <div className="absolute left-0 mt-2 bg-base-200 p-2 rounded-xl shadow z-50 w-44">
                  {languages.map((l) => (
                    <div
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        localStorage.setItem("lang", l.code);
                        setLangOpen(false);
                      }}
                      className="flex gap-2 p-2 hover:bg-base-300 rounded cursor-pointer">
                      <img src={`https://flagcdn.com/w40/${l.flag}.png`}
                        className="w-4 h-3"/>
                      <span>{l.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* USER ICON ONLY MOBILE CLEAN */}
            {user && (
              <div className="avatar">
                <div className="w-10 rounded-full border">
                  {user.photoURL ? (
                    <img src={user.photoURL} />
                  ) : (
                    <FaUserCircle className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECOND ROW (LANG ONLY) */}
        <div className="flex items-center justify-between">
          {user ? (
            <span className="text-xs text-white/60 font-semibold truncate">
              {user.displayName || user.email}
            </span>
          ) : (
            <button onClick={() => navigate("/login")}
              className="btn btn-xs btn-primary">
              Login
            </button>
          )}
        </div>

      </div>
    </div>
  );
}