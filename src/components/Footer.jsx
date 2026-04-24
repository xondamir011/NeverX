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

  const titles = {
    EN: "🎬 Movies",
    UZ: "🎬 Filmlar",
    RU: "🎬 Фильмы",
    DE: "🎬 Filme",
    TR: "🎬 Filmler",
  };
  return (
    <footer className="bg-base-200 text-base-content mt-28 p-6 text-center">
      <p className="text-lg font-semibold mr-5 mb-5">{titles[lang] || titles.EN}</p>

      <div className="flex justify-center gap-12 mt-3 mr-5 mb-3">
        <a href="https://t.me/mars_it_school" className="link link-hover hover:text-info transition-all">Telegram</a>
        <a href="https://github.com/xondamir011" className="link link-hover hover:text-accent">GitHub</a>
       <a href="https://xondamirmadaliyev79@gmail.com" className="link link-hover hover:text-secondary transition-all">Contact</a>
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