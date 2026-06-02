import { useState, useRef, useEffect } from "react";
import Drawer from "./Drawer";
import { FaUserCircle, FaPalette, FaFilm, FaPlus, FaUserShield } from "react-icons/fa";
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
  setShowAddMovie,
  onSearch
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

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setInstallPrompt(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
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

  const languages = [
    { code: "EN", label: "English", flag: "us" },
    { code: "UZ", label: "O'zbek", flag: "uz" },
    { code: "RU", label: "Русский", flag: "ru" },
    { code: "DE", label: "Deutsch", flag: "de" },
    { code: "TR", label: "Türkçe", flag: "tr" },
  ];

  const isGoogleAvatar = user?.photoURL?.includes("googleusercontent");

  return (
    <div className="sticky top-0 z-30 bg-base-200 border-b border-white/10">
      <div className="flex items-center justify-between py-2 sm:px-4">

        {/* LEFT */}
        <div className="flex items-center gap-1">
          <Drawer lang={lang} user={user} open={drawerOpen} setOpen={setDrawerOpen} onSearch={onSearch}
            setShowAddMovie={setShowAddMovie} />

          <h2 className="flex items-center gap-1 text-xl font-semibold">
            <FaFilm size={22} /> NeverX
          </h2>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5">
          {!isMobile && (
            <button onClick={() => {
              setShowAddMovie(true);
              localStorage.setItem("admin_tab", "add");
            }}
              className="btn bg-base-300 hover:bg-base-200 text-base border-none">
              <FaPlus size={15} /> Add Movie
            </button>
          )}

          {/* ADMIN */}
          {isAdmin && (
            <button onClick={() => setShowAdmin(true)}
              className="flex items-center cursor-pointer gap-1 py-2 rounded-lg hover:bg-base-100" >
              <FaUserShield />
              <span>Admin</span>
            </button>
          )}

          {/* THEME */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="cursor-pointer flex items-center">
              <FaPalette />
            </div>

            <ul className="dropdown-content bg-base-300 mt-2 rounded-box w-40 p-2 shadow">
              {["dark", "valentine", "synthwave", "winter", "aqua"].map((t) => (
                <li key={t}>
                  <button onClick={() => {
                    setTheme(t);
                    localStorage.setItem("theme", t);
                  }}
                    className="btn w-full justify-start mb-2">
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* LANGUAGE */}
          <div ref={langRef} className="relative">
            <button className="cursor-pointer" onClick={() => setLangOpen(!langOpen)}>
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
                      className="w-5 h-4" alt={l.label} />
                    <span>{l.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* USER */}
          <div ref={dropRef} className="relative">
            <button onClick={() => setDropOpen(!dropOpen)}>
              {user?.photoURL ? (
                <img src={user.photoURL} alt="avatar"
                  className="w-10 h-10 cursor-pointer rounded-full object-cover border-2 border-cyan-400" />
              ) : (
                <FaUserCircle size={34} className="text-gray-400" />
              )}
            </button>

            {dropOpen && (
              <div className="absolute right-0 top-12 w-64 bg-base-200 p-4 rounded-2xl shadow-xl">
                <div className="text-center">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="avatar"
                      className="w-16 h-16 cursor-pointer mx-auto rounded-full border-2 border-cyan-400 object-cover" />
                  ) : (
                    <FaUserCircle size={60} className="mx-auto text-gray-400" />
                  )}

                  <h2 className="mt-2 font-bold">
                    {user?.displayName || user?.email}
                  </h2>
                </div>

                {/* PROFILE */}
                <button onClick={() => {
                  setDrawerOpen(true);
                  setDropOpen(false);
                }}
                  className="w-full mt-3 p-2 cursor-pointer hover:bg-base-300 rounded-lg text-left">
                  Settings
                </button>

                {/* LOGOUT */}
                <button onClick={handleLogout}
                  className="w-full p-2 cursor-pointer hover:bg-base-300 rounded-lg text-left text-red-500">
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}