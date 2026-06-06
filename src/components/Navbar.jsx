import { useState, useRef, useEffect } from "react";
import Drawer from "./Drawer";
import { FaUserCircle, FaPalette, FaPlus, FaUserShield, FaCrown, FaFilm, FaSearch } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Navbar({
  user, setLang, lang, theme, setTheme,
  isAdmin, setShowAdmin, setShowAddMovie, onSearch,
}) {
  const [langOpen, setLangOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const langRef = useRef(null);
  const dropRef = useRef(null);

  const handleLogout = async () => await signOut(auth);

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const languages = [
    { code: "EN", label: "English", flag: "us" },
    { code: "UZ", label: "O'zbek", flag: "uz" },
    { code: "RU", label: "Русский", flag: "ru" },
    { code: "DE", label: "Deutsch", flag: "de" },
    { code: "TR", label: "Türkçe", flag: "tr" },
  ];

  const premium = {
    EN: {
      label: "Premium",
    },
    UZ: {
      label: "Obuna",
    },
    RU: {
      label: "Премиум",
    },
    DE: {
      label: "Abonnement",
    },
    TR: {
      label: "Abonelik",
    }
  };

  const add = {
    EN: {
      label: "Add Movie",
    },
    UZ: {
      label: "Film qo'shish",
    },
    RU: {
      label: "Добавить фильм",
    },
    DE: {
      label: "Film hinzufügen",
    },
    TR: {
      label: "Film ekle",
    }
  }

  const admin = {
    EN: {
      label: "Admin",
    },
    UZ: {
      label: "Adminstrator",
    },
    RU: {
      label: "Админ",
    },
    DE: {
      label: "Admin",
    },
    TR: {
      label: "Yönetici",
    }
  }

  return (
    <div className="sticky top-0 z-30 bg-base-200 border-b border-white/10">
      <div className="flex items-center justify-between gap-2 py-2 px-3 sm:px-4">

        {/* CHAP — Drawer + Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isMobile && (
            <Drawer
              lang={lang} user={user}
              open={drawerOpen} setOpen={setDrawerOpen}
              onSearch={onSearch} setShowAddMovie={setShowAddMovie}
              isAdmin={isAdmin} />
          )}
          <div className="hidden md:flex items-center gap-1">
            <FaFilm size={25} />
            <h2 className="font-bold text-lg">NeverX</h2>
          </div>
        </div>

        {/* O'RTA — Search */}
        <div className="flex flex-1 justify-center px-2 md:px-6">
          <div className="relative w-full md:max-w-sm">
            <FaSearch className="absolute z-5 text-white left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={14} />
            <input type="text"
              placeholder="Search..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="input input-bordered pl-8 h-11 w-full sm:w-xl"/>
          </div>
        </div>

        {/* O'NG — tugmalar */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {!isMobile && isAdmin && (
            <button onClick={() => { setShowAddMovie(true); localStorage.setItem("admin_tab", "add"); }}
              className="btn bg-base-200 hover:bg-base-100 border-none gap-1">
              <FaPlus size={12} /> {add[lang]?.label || "Add Movie"}
            </button>
          )}

          {!isMobile && isAdmin && (
            <button onClick={() => setShowAdmin(true)}
              className="flex items-center btn gap-1 cursor-pointer px-3 py-2 rounded-lg hover:bg-base-300 transition text-sm font-semibold">
              <FaUserShield size={14} /> {admin[lang]?.label || "Admin"}
            </button>
          )}

          <button className="btn bg-gradient-to-r from-blue-800 to-red-500 text-white border-none hover:scale-105 transition-all duration-300 shadow-lg gap-1">
            <FaCrown size={17} />{premium[lang]?.label || "Premium"}
          </button>

          <div ref={langRef} className="relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="cursor-pointer text-sm font-semibold px-2 py-1 rounded-lg hover:bg-base-300 transition">
              {lang}
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 bg-base-200 p-2 rounded-xl shadow-xl w-40 z-50 border border-base-300">
                {languages.map((l) => (
                  <div key={l.code}
                    onClick={() => { setLang(l.code); localStorage.setItem("lang", l.code); setLangOpen(false); }}
                    className="flex gap-2 p-2 hover:bg-base-300 cursor-pointer rounded-lg items-center">
                    <img src={`https://flagcdn.com/w40/${l.flag}.png`} className="w-5 h-4 rounded-sm" alt={l.label} />
                    <span className="text-sm">{l.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div ref={dropRef} className="relative">
            <button onClick={() => setDropOpen(!dropOpen)}>
              {user?.photoURL ? (
                <img src={user.photoURL} alt="avatar"
                  className="rounded-full object-cover border-2 border-cyan-400 cursor-pointer"
                  style={{ width: isMobile ? 32 : 38, height: isMobile ? 32 : 38 }} />
              ) : (
                <FaUserCircle size={isMobile ? 30 : 36} className="text-gray-400 cursor-pointer" />
              )}
            </button>

            {dropOpen && (
              <div className="absolute right-0 top-12 w-56 bg-base-200 p-4 rounded-2xl shadow-2xl border border-base-300 z-50"
                style={{ animation: "dropIn 0.2s ease" }}>
                <div className="text-center mb-4">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="avatar"
                      className="w-14 h-14 mx-auto rounded-full border-2 border-cyan-400 object-cover" />
                  ) : (
                    <FaUserCircle size={52} className="mx-auto text-gray-400" />
                  )}
                  <h2 className="mt-2 font-bold text-sm truncate">
                    {user?.displayName || user?.email}
                  </h2>
                </div>

                <div className="border-t border-base-300 pt-3">
                  <div className="dropdown dropdown-end w-full">
                    <div tabIndex={0} className="cursor-pointer flex gap-2 items-center px-2 py-2 rounded-lg hover:bg-base-300 font-semibold text-sm mb-1">
                      <FaPalette size={13} /> Theme
                    </div>
                    <ul className="dropdown-content bg-base-300 rounded-xl w-40 p-2 shadow-xl z-50">
                      {["dark", "valentine", "synthwave", "winter", "aqua"].map((t) => (
                        <li key={t}>
                          <button onClick={() => { setTheme(t); localStorage.setItem("theme", t); }}
                            className={`btn btn-sm w-full justify-start mb-1 ${theme === t ? "btn-primary" : "btn-ghost"}`}>
                            {t}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={handleLogout}
                    className="w-full px-2 py-2 text-sm text-red-500 hover:bg-base-300 rounded-lg text-left font-semibold transition">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
    @keyframes dropIn {
      from { opacity: 0; transform: translateY(-8px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
  `}</style>
    </div>
  );
}