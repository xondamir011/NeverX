import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import neverx from "../assets/neverx.png";
import {
  FaUserCircle,
  FaTimes,
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
  FaPlus,
} from "react-icons/fa";

const filters = [
  { key: "series",   icon: <FaTv />,    label: { EN: "Series",   UZ: "Serial",      RU: "Сериалы",    DE: "Serien",     TR: "Diziler" } },
  { key: "horror",   icon: <FaGhost />, label: { EN: "Horror",   UZ: "Qo'rqinchli", RU: "Ужасы",      DE: "Horror",     TR: "Korku" } },
  { key: "drama",    icon: <FaHeart />, label: { EN: "Drama",    UZ: "Drama",       RU: "Драма",      DE: "Drama",      TR: "Dram" } },
  { key: "comedy",   icon: <FaLaugh />, label: { EN: "Comedy",   UZ: "Komediya",    RU: "Комедия",    DE: "Komödie",    TR: "Komedi" } },
  { key: "action",   icon: <FaBolt />,  label: { EN: "Action",   UZ: "Jangari",     RU: "Боевик",     DE: "Action",     TR: "Aksiyon" } },
  { key: "anime",    icon: <FaDragon />,label: { EN: "Anime",    UZ: "Anime",       RU: "Аниме",      DE: "Anime",      TR: "Anime" } },
  { key: "cartoon",  icon: <FaChild />, label: { EN: "Cartoon",  UZ: "Multfilm",    RU: "Мультфильм", DE: "Zeichentrick", TR: "Çizgi film" } },
  { key: "thriller", icon: <FaMask />,  label: { EN: "Thriller", UZ: "Triller",     RU: "Триллер",    DE: "Thriller",   TR: "Gerilim" } },
  { key: "fantasy",  icon: <FaMagic />, label: { EN: "Fantasy",  UZ: "Fantastika",  RU: "Фэнтези",    DE: "Fantasy",    TR: "Fantastik" } },
];

const addLabel = {
  EN: "Add Movie",
  UZ: "Film qo'shish",
  RU: "Добавить фильм",
  DE: "Film hinzufügen",
  TR: "Film ekle",
};

export default function Drawer({
  lang,
  user,
  open,
  setOpen,
  onSearch,
  setShowAddMovie,
  isAdmin,
}) {
  // Drawer ochiq bo'lsa orqa sahifa scroll bo'lmasin
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc bilan yopish
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const drawerUI = (
    <>
      {/* OVERLAY */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/60 z-[90] md:hidden transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* DRAWER */}
      <aside
        className={`fixed top-0 left-0 h-[100dvh] w-72 max-w-[85vw] bg-base-200 z-[100] flex flex-col md:hidden shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}>

        {/* HEADER: logo + yopish */}
        <div className="flex items-center justify-between px-5 border-b border-base-300 flex-shrink-0">
          <img src={neverx} alt="NeverX"
            className="h-28 w-auto max-w-[170px] object-contain"/>
          <button
            onClick={() => setOpen(false)}
            className="w-10 h-10 rounded-full border-2 border-base-300 hover:bg-base-300 flex items-center justify-center flex-shrink-0">
            <FaTimes />
          </button>
        </div>

        {/* SCROLL QISMI */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* CATEGORIES */}
          <div className="flex flex-col gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  onSearch?.("", f.key);
                  setOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-base-300 hover:bg-base-100 transition text-left">
                <span className="text-lg">{f.icon}</span>
                <span>{f.label[lang] || f.label.EN}</span>
              </button>
            ))}
          </div>

          {/* ADD MOVIE (faqat admin) */}
          {isAdmin && (
            <button
              onClick={() => {
                setShowAddMovie(true);
                setOpen(false);
              }}
              className="mt-4 w-full py-3 rounded-xl bg-primary text-white flex items-center justify-center gap-2">
              <FaPlus />
              {addLabel[lang] || addLabel.EN}
            </button>
          )}
        </div>

        {/* USER (pastda qotib turadi) */}
        <div className="px-5 py-4 border-t border-base-300 flex-shrink-0">
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="user"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-4xl text-gray-400" />
            )}

            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">
                {user?.displayName || "Guest"}
              </p>
              <p className="text-xs opacity-60 truncate">{user?.email || ""}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center text-2xl w-11 h-11 rounded-xl hover:bg-base-300">
        <FaBars />
      </button>

      {createPortal(drawerUI, document.body)}
    </>
  );
}