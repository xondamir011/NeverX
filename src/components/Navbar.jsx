import { useState, useRef, useEffect } from "react";
import Drawer from "./Drawer";

export default function Navbar({ setLang, lang }) {
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  const languages = [
    { code: "EN", label: "English", flag: "us" },
    { code: "UZ", label: "O'zbek", flag: "uz" },
    { code: "RU", label: "Русский", flag: "ru" },
    { code: "DE", label: "Deutsch", flag: "de" },
    { code: "TR", label: "Türkçe", flag: "tr" },
  ];

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
    
      <Drawer />

     <h2 className="md:ml-30 text-xl flex-col">🎬Movies</h2>
      <div className="flex gap-4 items-center">


     <div className="dropdown">
       <div tabIndex={0} role="button" className="btn m-1">
        Theme
    <svg
      width="12px"
      height="12px"
      className="inline-block h-2 w-2 fill-current opacity-60"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2048 2048">
      <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
    </svg>
  </div>
  <ul tabIndex="-1" className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl">
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
        aria-label="Default"
        value="default" />
    </li>
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
        aria-label="Retro"
        value="retro" />
    </li>
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
        aria-label="Cyberpunk"
        value="cyberpunk" />
    </li>
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
        aria-label="Valentine"
        value="valentine" />
    </li>
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
        aria-label="Aqua"
        value="aqua" />
    </li>
  </ul>
      </div>     

        <div ref={langRef} className="relative">
          <button onClick={() => setLangOpen(!langOpen)} className="btn">
            <img src={`https://flagcdn.com/w40/${languages.find(l => l.code === lang)?.flag}.png`} className="w-6 h-4"/>
          </button>

          {langOpen && (
            <div className="absolute right-0 mt-2 bg-base-200 p-2 rounded-xl shadow z-50">
              {languages.map((l) => (
                <div key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    localStorage.setItem("lang", l.code);
                    setLangOpen(false);
                  }}
                  className="flex gap-2 p-2 mr-3 hover:bg-base-300 rounded cursor-pointer">
                  <img src={`https://flagcdn.com/w40/${l.flag}.png`} className="w-5 h-4"/>
                  {l.label}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}