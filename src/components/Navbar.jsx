import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Drawer from "./Drawer";
import { FaUserCircle } from "react-icons/fa";
import { LogOut } from "react-feather";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Navbar({ user, setLang, lang, theme, setTheme }) {
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

  // click outside
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
  <div className="sticky top-0 z-30 bg-base-200 p-2">

    <div className="flex items-center justify-between flex-nowrap">

      <div className="flex items-center gap-3">
        <Drawer lang={lang}/>
      </div>

      <div className="flex items-center gap-3 p-3 justify-start flex-1">
        <h2 className="hidden sm:inline text-lg">
         <span className="hidden sm:inline text-lg">🎬</span> {titles[lang]?.replace("🎬", "") || "Movies"}
        </h2>

         <div className="dropdown">
          <div tabIndex={0}
            role="button"
            className="btn btn-sm btn-secondary rounded-3xl">
            Theme
          </div>

          <ul className="dropdown-content bg-base-300 mt-2 rounded-box z-50 md:w-40 sm:w-28 p-3 m-2 mr-3 shadow">
            {["dark", "valentine", "cyberpunk", "retro", "aqua"].map((t) => (
              <li key={t}>
                <input
                  type="radio"
                  name="theme"
                  className="theme-controller w-full btn btn-sm p-4 btn-ghost justify-start"
                  aria-label={t}
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
      </div> 

      {/* RIGHT: USER + LANG */}
      <div className="flex items-center">
        <div ref={langRef} className="relative">

          <button onClick={() => setLangOpen(!langOpen)}
            className="btn btn-sm btn-primary rounded-3xl pr-5 mr-3 flex justify-center items-center">
            <img src={`https://flagcdn.com/w40/${languages.find((l) => l.code === lang)?.flag}.png`}
              className="w-5 h-3 ml-2"/>
            <span>{lang}</span>
          </button> 

          {langOpen && (
            <div className="absolute right-0 mt-3 bg-base-200 p-3 ml-10 rounded-xl shadow z-50">
              {languages.map((l) => (
                <div key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    localStorage.setItem("lang", l.code);
                    setLangOpen(false);
                  }}
                  className="flex gap-2 p-2 pr-5 items-center hover:bg-base-300 rounded cursor-pointer">
                  <img src={`https://flagcdn.com/w40/${l.flag}.png`}
                    className="w-5 h-4"/>
                  <span>{l.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* USER */}
        {user ? (
          <div className="flex items-center sm:gap-2">

            {user.photoURL ? (
              <img src={user.photoURL}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/img1.png";
                }}/>
            ) : (
              <FaUserCircle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" />
            )}

            <span className="block sm:block text-sm p-2 font-semibold truncate">
              {user.displayName || user.email}
            </span>

            <button onClick={handleLogout}
              className="btn btn-sm btn-error">
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button onClick={() => navigate("/login")}
            className="btn btn-xs sm:btn-sm btn-primary">
            Login
          </button>
        )}
      </div>
    </div>
  </div>
);
}