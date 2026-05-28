import { FaFilm } from "react-icons/fa";

export default function Footer({ lang }) {
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
    EN: {
      text: "Contact",
    },
    UZ: {
      text: "Telefon",
    },
    RU: {
      text: "Контакт",
    },
    DE: {
      text: "Køntakt",
    },
    TR: {
      text: "İletişim",
    },
  }

  return (
    <footer className="bg-base-200 text-base-content mt-28 p-6 text-center">
      <div className="flex justify-center items-center">
        <h2 className="flex items-center gap-1 text-xl ml-3 font-semibold truncate">
          <FaFilm size={25} /> NeverX
        </h2>
      </div>

      <div className="flex justify-center gap-12 mt-3 mr-5 mb-3">
        <a href="https://t.me/xondamir_mi" className="link link-hover hover:text-info transition-all">Telegram</a>
        <a href="https://github.com/xondamir011" className="link link-hover hover:text-gray-400 transition-all">GitHub</a>
        <a href="https://xondamirmadaliyev79@gmail.com" className="link link-hover hover:text-accent transition-all">Email</a>
        <a href="tel:+998935607563" className="link link-hover hover:text-secondary transition-all">{text[lang?.toUpperCase()]?.text || "Contact"}</a>
      </div>

      <p className="mt-3 opacity-60">
        {t[lang?.toUpperCase()]?.made || "Made with Leslie ❤️"}
      </p>

      <p className="opacity-70 mt-3">
        © {new Date().getFullYear()} — {t[lang?.toUpperCase()]?.text}
      </p>

    </footer>
  );
}