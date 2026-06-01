import { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaTimes,
  FaDownload,
  FaTv,
  FaGhost,
  FaHeart,
  FaLaugh,
  FaBolt,
  FaDragon,
  FaChild,
  FaMask,
  FaMagic,
  FaBars,
  FaPlus
} from "react-icons/fa";

export default function Drawer({
  lang,
  user,
  open,
  setOpen,
  onSearch,
  setShowAddMovie
}) {

  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setInstalled(true);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();

    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setInstalled(true);
    }

    setInstallPrompt(null);
  };

  const filters = [
    {
      key: "series",
      icon: <FaTv />,
      label: {
        UZ: "Serial",
        EN: "Series",
        RU: "Сериал",
        DE: "Serie",
        TR: "Dizi",
      },
    },

    {
      key: "horror",
      icon: <FaGhost />,
      label: {
        UZ: "Qo'rqinchli",
        EN: "Horror",
        RU: "Ужас",
        DE: "Horror",
        TR: "Korku",
      },
    },

    {
      key: "drama",
      icon: <FaHeart />,
      label: {
        UZ: "Drama",
        EN: "Drama",
        RU: "Драма",
        DE: "Drama",
        TR: "Drama",
      },
    },

    {
      key: "comedy",
      icon: <FaLaugh />,
      label: {
        UZ: "Kulgili",
        EN: "Comedy",
        RU: "Комедия",
        DE: "Komödie",
        TR: "Komedi",
      },
    },
    {
      key: "action",
      icon: <FaBolt />,
      label: {
        UZ: "Jangari",
        EN: "Action",
        RU: "Боевик",
        DE: "Action",
        TR: "Aksiyon",
      },
    },

    {
      key: "anime",
      icon: <FaDragon />,
      label: {
        UZ: "Anime",
        EN: "Anime",
        RU: "Аниме",
        DE: "Anime",
        TR: "Anime",
      },
    },

    {
      key: "cartoon",
      icon: <FaChild />,
      label: {
        UZ: "Multfilm",
        EN: "Cartoon",
        RU: "Мультфильм",
        DE: "Cartoon",
        TR: "Çizgi Film",
      },
    },

    {
      key: "thriller",
      icon: <FaMask />,
      label: {
        UZ: "Triller",
        EN: "Thriller",
        RU: "Триллер",
        DE: "Thriller",
        TR: "Gerilim",
      },
    },

    {
      key: "fantasy",
      icon: <FaMagic />,
      label: {
        UZ: "Fantastika",
        EN: "Fantasy",
        RU: "Фэнтези",
        DE: "Fantasy",
        TR: "Fantastik",
      },
    },
  ];

  const t = {
    EN: {
      categories: "Categories",
      install: "Install App",
      installed: "Installed ✓",
    },

    UZ: {
      categories: "Kategoriyalar",
      install: "Ilovani o'rnatish",
      installed: "O'rnatildi ✓",
    },

    RU: {
      categories: "Категории",
      install: "Установить",
      installed: "Установлено ✓",
    },

    DE: {
      categories: "Kategorien",
      install: "App installieren",
      installed: "Installiert ✓",
    },

    TR: {
      categories: "Kategoriler",
      install: "Uygulamayı yükle",
      installed: "Yüklendi ✓",
    },
  };

  const genreMap = {
    horror: 27,
    comedy: 35,
    drama: 18,
    action: 28,
    fantasy: 14,
    thriller: 53,
    cartoon: 16,
    anime: 16,
  };

  return (
    <div className="z-20">
      <button onClick={() => setOpen(true)}
        className="flex items-center justify-center text-2xl rounded-xl hover:bg-base-300 active:scale-95 transition-all w-11 h-11">
        <FaBars />
      </button>

      {/* OVERLAY */}
      {open && (
        <div onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-30" />)}

      {/* DRAWER */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-base-200 text-base p-5 transform transition-transform duration-300 z-40 flex flex-col
        ${open ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Close */}
        <div className="flex items-center justify-between">
          <button className="flex justify-center items-center cursor-pointer w-10 h-10 rounded-full border border-white/10 hover:bg-base-300 active:scale-95 transition-all"
            onClick={() => setOpen(false)}>
            <FaTimes size={18} />
          </button>
        </div>

        {/* CATEGORY TITLE */}
        <div className="mt-8">
          <h2 className="text-lg mb-3 font-bold opacity-80">
            {t[lang]?.categories}
          </h2>
        </div>

        {/* CATEGORIES */}
        <div className="flex flex-col gap-2 mb-4">
          {filters.map((filter) => (
            <button key={filter.key}
              onClick={() => {
                onSearch?.("", filter.key);
                setOpen(false);
              }}
              className="flex items-center cursor-pointer gap-3 px-4 py-3 rounded-2xl bg-base-300 hover:bg-base-100 active:scale-[0.98] transition-all text-left">
              <span className="text-lg">
                {filter.icon}
              </span>

              <span className="font-medium">
                {filter.label[lang] || filter.label.EN}
              </span>
            </button>
          ))}

        </div>

        {isMobile && (
          <button onClick={() => {
            setShowAddMovie(true);
            localStorage.setItem("admin_tab", "add");
            setOpen(false);
          }}
            className="w-full mt-5 mb-10 py-3 rounded-xl bg-base-300 text-base font-semibold flex items-center justify-center gap-2">
            <FaPlus size={16} />
            <span>Add Movie</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          {user?.photoURL ? (
            <img src={user.photoURL}
              className="w-11 h-11 rounded-full object-cover border border-white/20" />
          ) : (
            <FaUserCircle className="text-4xl text-gray-400" />
          )}

          <div>
            <h2 className="font-semibold text-sm">
              {user?.displayName || "Guest"}
            </h2>

            <p className="text-xs opacity-60">
              {user?.email || ""}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}