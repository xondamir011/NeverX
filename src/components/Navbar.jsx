import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Drawer from "./Drawer";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { LogOut } from "react-feather";

export default function Navbar({ setLang, lang }) {
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
  const { user, logout } = useAuth(); // real user
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
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
    EN: "🎬 Movies",
    UZ: "🎬 Filmlar",
    RU: "🎬 Фильмы",
    DE: "🎬 Filme",
    TR: "🎬 Filmler",
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
    <div className="flex justify-between items-center p-4 bg-base-200 sticky top-0 z-30">
      
      {/* LEFT: Drawer + Movies title */}
      <div className="flex items-center gap-4">
        <Drawer lang={lang} />

        {/* Movies text: mobile hide, md+ show */}
        <h2 className="hidden md:block text-xl font-bold">
          {titles[lang] || titles.EN}
        </h2>
      </div>

      {/* RIGHT: User + Language + Theme */}
      <div className="flex gap-4 items-center">

        {/* Language selector */}
        <div ref={langRef} className="relative">
          <button onClick={() => setLangOpen(!langOpen)} className="btn btn-sm">
            <img
              src={`https://flagcdn.com/w40/${languages.find(l => l.code === lang)?.flag}.png`}
              className="w-6 h-4"
            />
          </button>

          {langOpen && (
            <div className="absolute right-0 mt-2 bg-base-200 p-2 rounded-xl shadow z-50">
              {languages.map((l) => (
                <div
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    localStorage.setItem("lang", l.code);
                    setLangOpen(false);
                  }}
                  className="flex gap-2 p-2 mr-3 hover:bg-base-300 rounded cursor-pointer"
                >
                  <img src={`https://flagcdn.com/w40/${l.flag}.png`} className="w-5 h-4" />
                  {l.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theme selector (static example) */}
     <div className="dropdown">
      <div tabIndex={0} role="button" className="btn m-1">
        Theme
        <svg width="12px" height="12px" className="inline-block h-2 w-2 fill-current opacity-60"
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>

      <ul tabIndex="-1" className="dropdown-content bg-base-300 rounded-box z-1 w-32 p-2 shadow-2xl">
        {["default","retro","cyberpunk","valentine","aqua"].map(theme => (
          <li key={theme}>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
              aria-label={theme}
              value={theme}/>
          </li>
        ))}
      </ul>
    </div>

        {/* 🔥 USER QISMI */}
        {user && (
          <div className="flex items-center gap-3">
            {/* Avatar + name */}
            <div className="flex items-center gap-2">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-accent"
                />
              ) : (
                <FaUserCircle className="w-8 h-8 text-accent" />
              )}
              <span className="text-sm font-semibold text-base-content hidden sm:block truncate max-w-32">
                {user.name}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-sm gap-1.5 text-base-content/70 hover:text-error"
              title="Logout"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline text-xs">Logout</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}