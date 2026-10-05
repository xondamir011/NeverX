import { useState, useEffect } from "react";
import { FaTelegramPlane, FaChevronUp } from "react-icons/fa";
import neverx from "../assets/neverx.png";

const TELEGRAM_URL = "https://t.me/xondamir_blog"; 

export default function Footer({ lang }) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const t = {
    EN: {
      text: "All rights reserved",
      made: "Made with Leslie❤️",
    },
    UZ: {
      text: "Barcha huquqlar himoyalangan",
      made: "❤️Lesli bilan yaratilgan",
    },
    RU: {
      text: "Все права защищены",
      made: "Сделано с Леслие❤️",
    },
    DE: {
      text: "Alle Rechte vorbehalten",
      made: "Mit ❤️Leslie gemacht",
    },
    TR: {
      text: "Tüm hakları saklıdır",
      made: "❤️Leslie ile yapıldı",
    },
  };

  const text = {
    EN: { text: "Contact" },
    UZ: { text: "Telefon" },
    RU: { text: "Контакт" },
    DE: { text: "Kontakt" },
    TR: { text: "İletişim" },
  };

  return (
    <>
      <footer className="bg-base-200 text-base-content mt-28 p-6 text-center">
        <div className="hidden md:flex justify-center items-center h-17">
          <img src={neverx} className="h-[115px] w-auto max-w-none object-contain" alt="NeverX" />
        </div>

        <div className="flex justify-center gap-12 mt-3 mr-5 mb-3">
          <a href="https://www.instagram.com/x_madaliyevv" className="link link-hover hover:text-secondary transition-all">Instagram</a>
          <a href="https://github.com/xondamir011" className="link link-hover hover:text-gray-400 transition-all">GitHub</a>
          <a href="mailto:xondamirmadaliyev79@gmail.com" className="link link-hover hover:text-accent transition-all">Email</a>
          <a href="tel:+998935607563" className="link link-hover hover:text-info transition-all">
            {text[lang?.toUpperCase()]?.text || "Contact"}
          </a>
        </div>

        <p className="mt-3 opacity-60">
          {t[lang?.toUpperCase()]?.made || "Made with Leslie ❤️"}
        </p>

        <p className="opacity-70 mt-3">
          © 2025 {t[lang?.toUpperCase()]?.text}
        </p>
      </footer>

      {/* Suzib yuruvchi tugmalar */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-center gap-5">
        {/* Telegram */}
        <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Telegram"
          className="relative w-14 h-14 cursor-pointer tg-float">

          <span className="absolute inset-0 rounded-full bg-[#2AABEE] opacity-60 animate-ping" />
          <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#2AABEE] text-white shadow-lg shadow-[#2AABEE]/40 hover:scale-110 transition-transform duration-300">
            <FaTelegramPlane size={28} className="-ml-0.5" />
          </span>
        </a>

        {/* Tepaga chiqish */}
        <button onClick={scrollTop} aria-label="Scroll to top"
          className={`w-14 h-14 rounded-full border border-base-300 bg-base-200/80 backdrop-blur text-success flex items-center justify-center cursor-pointer hover:bg-base-300 transition-all duration-300 ${
            showTop
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}>
            
          <FaChevronUp size={20} />
        </button>
      </div>

      <style>{`
        @keyframes tgFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        .tg-float { animation: tgFloat 2.4s ease-in-out infinite; }
      `}</style>
    </>
  );
}