import { useState, useEffect } from "react";
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
  FaFilm
} from "react-icons/fa";

export default function Drawer({
  lang,
  user,
  open,
  setOpen,
  onSearch,
  setShowAddMovie
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsMobile(window.innerWidth < 768);

    check();

    window.addEventListener("resize", check);

    return () =>
      window.removeEventListener("resize", check);
  }, []);

  const filters = [
    {
      key: "series",
      icon: <FaTv />,
      label: { EN: "Series", UZ: "Serial" }
    },
    {
      key: "horror",
      icon: <FaGhost />,
      label: { EN: "Horror", UZ: "Qo'rqinchli" }
    },
    {
      key: "drama",
      icon: <FaHeart />,
      label: { EN: "Drama", UZ: "Drama" }
    },
    {
      key: "comedy",
      icon: <FaLaugh />,
      label: { EN: "Comedy", UZ: "Komediya" }
    },
    {
      key: "action",
      icon: <FaBolt />,
      label: { EN: "Action", UZ: "Jangari" }
    },
    {
      key: "anime",
      icon: <FaDragon />,
      label: { EN: "Anime", UZ: "Anime" }
    },
    {
      key: "cartoon",
      icon: <FaChild />,
      label: { EN: "Cartoon", UZ: "Multfilm" }
    },
    {
      key: "thriller",
      icon: <FaMask />,
      label: { EN: "Thriller", UZ: "Triller" }
    },
    {
      key: "fantasy",
      icon: <FaMagic />,
      label: { EN: "Fantasy", UZ: "Fantastika" }
    }
  ];

  return (
    <div className="z-20">
      <button onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center text-2xl w-11 h-11 rounded-xl hover:bg-base-300">
        <FaBars />
      </button>

      {/* OVERLAY */}
      {open && (
        <div onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden" />
      )}

      {/* DRAWER */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-base-200 p-5 z-40 flex flex-col transition-transform duration-300 md:hidden ${open
          ? "translate-x-0"
          : "-translate-x-full"
        }`}>

        {/* CLOSE */}
        <button onClick={() => setOpen(false)}
          className="w-12 h-10 rounded-full border-2 hover:bg-base-300 flex items-center justify-center">
          <FaTimes />
        </button>

        {/* TITLE */}
        <div className="flex ml-2 mt-5 items-center gap-2 mb-3">
          <FaFilm size={25} />
          <h2 className="font-bold text-lg">NeverX</h2>
        </div>

        {/* CATEGORIES */}
        <div className="flex flex-col gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => {
                onSearch?.("", f.key);
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-base-300 hover:bg-base-100 transition"
            >
              <span className="text-lg">
                {f.icon}
              </span>

              <span>
                {f.label[lang] || f.label.EN}
              </span>
            </button>
          ))}
        </div>

        {/* BANNER */}
        <div className="mt-5 rounded-2xl overflow-hidden bg-base-300">
          <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
            alt="banner"
            className="w-full h-36 object-cover" />

          <div className="p-3">
            <h3 className="font-bold">
              Premium Movies
            </h3>

            <p className="text-xs opacity-70 mt-1">
              Watch latest movies and series
            </p>
          </div>
        </div>

        {/* ADD MOVIE */}
        {isMobile && (
          <button onClick={() => {
            setShowAddMovie(true);
            setOpen(false);
          }}
            className="mt-4 py-3 rounded-xl bg-primary text-white flex items-center justify-center gap-2">
            <FaPlus />
            Add Movie
          </button>
        )}

        {/* USER */}
        <div className="mt-auto pt-5 border-t border-base-300">
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="user"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-4xl" />
            )}

            <div>
              <p className="font-semibold text-sm">
                {user?.displayName || "Guest"}
              </p>

              <p className="text-xs opacity-60 truncate max-w-[180px]">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}