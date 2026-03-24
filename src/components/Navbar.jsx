import { useState, useRef, useEffect } from "react";
import Drawer from "./Drawer";

export default function Navbar( {setTheme, setLang, lang} ) {
  const [themeOpen, setThemeOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const themeRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setThemeOpen(false);
      }

      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };

    document.addEventListener("click", handleClick); 
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const changeTheme = (theme) => {
    setTheme(theme)
    localStorage.setItem("theme", theme)
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) changeTheme(saved);
  }, []);

  return (
    <div className="flex justify-between items-center p-4 bg-gray-900 text-white relative">

      <Drawer />

      <div className="flex gap-4">

        <div className="relative" ref={themeRef}>
          <button  onClick={() => setThemeOpen(!themeOpen)} className="bg-gray-800 p-2 rounded-lg cursor-pointer">
            🎨
          </button>

          {themeOpen && (
            <div onClick={(e) => e.stopPropagation()} className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-lg p-3 z-50">
              {[
                "Amethyst",
                "Aqua",
                "Dark",
                "Light",
                "Neon",
                "Sunset",
              ].map((theme) => (
                <div key={theme} onClick={() => changeTheme(theme)}
                 className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer">
                  <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                  {theme}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={langRef}>
          <button onClick={() => setLangOpen(!langOpen)} className="bg-gray-800 p-2 rounded-lg cursor-pointer">
            🌐
          </button>

        {langOpen && (
          <div onClick={(e) => e.stopPropagation()} className="absolute right-0 mt-2 w-52 bg-gray-800 rounded-xl shadow-lg p-2 z-50">
            {[
             { code: "EN", label: "English 🇺🇸" },
             { code: "UZ", label: "O'zbek 🇺🇿" },
             { code: "RU", label: "Русский 🇷🇺" },
             { code: "DE", label: "Deutsch 🇩🇪" },
             { code: "TR", label: "Türkçe 🇹🇷" },
           ].map((item) => (
            <div key={item.code} onClick={() => {
             setLang(item.code);  
             localStorage.setItem("lang", item.code);
             setLangOpen(false);
           }}
             className={`p-2 hover:bg-gray-700 rounded cursor-pointer ${
              lang === item.code ? "bg-gray-700" : ""}`}>
              {item.label}
           </div>
         ))}
     </div>
    )}    
        </div>
      </div>
    </div>
  );
}