import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase/config";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./auth/Login";
import Register from "./auth/Register";
import Navbar from "./components/Navbar";
import MovieCard from "./components/MovieCard";
import Footer from "./components/Footer";
import AdminPanel from "./admin/AdminPanel";
import { saveUser } from "./firebase/userService";
import AddMovie from "./admin/AddMovie";
import AddMovieModal from "./admin/AddMovieModal";
import {
  FaTv,
  FaGhost,
  FaHeart,
  FaLaugh,
  FaBolt,
  FaDragon,
  FaChild,
  FaMask,
  FaMagic,
  FaRocket
} from "react-icons/fa";

const ADMIN_UID = "N6sqvO4mcXfIB8O2rcZDvFlM59s1";

export default function App() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [lang, setLang] = useState("EN");
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);

  const API_KEY = "44cae21994113f58296e3b6d0db555f3";

  const langMap = {
    EN: "en-US",
    UZ: "en-US",
    RU: "ru-RU",
    DE: "de-DE",
    TR: "tr-TR",
  };

  const texts = {
    EN: {
      series: "Series",
      horror: "Horror",
      drama: "Drama",
      comedy: "Comedy",
      action: "Action",
      anime: "Anime",
      cartoon: "Cartoon",
      fantasy: "Fantasy",
      thriller: "Thriller",
      scifi: "Sci-Fi",

      bannerTitle: "NeverX Premium",
      bannerText: "Watch unlimited movies and series",
      watchNow: "Watch Now",
    },

    UZ: {
      series: "Serial",
      horror: "Qo'rqinchli",
      drama: "Drama",
      comedy: "Komediya",
      action: "Jangari",
      anime: "Anime",
      cartoon: "Multfilm",
      fantasy: "Fantastika",
      thriller: "Triller",
      scifi: "Ilmiy-Fantastika",

      bannerTitle: "NeverX Premium",
      bannerText: "Cheksiz film va seriallarni tomosha qiling",
      watchNow: "Tomosha qilish",
    },

    RU: {
      series: "Сериалы",
      horror: "Ужасы",
      drama: "Драма",
      comedy: "Комедия",
      action: "Боевик",
      anime: "Аниме",
      cartoon: "Мультфильм",
      fantasy: "Фантастика",
      thriller: "Триллер",
      scifi: "Научная фантастика",

      bannerTitle: "NeverX Premium",
      bannerText: "Смотрите фильмы и сериалы без ограничений",
      watchNow: "Смотреть",
    },

    DE: {
      series: "Serien",
      horror: "Horror",
      drama: "Drama",
      comedy: "Komödie",
      action: "Action",
      anime: "Anime",
      cartoon: "Zeichentrick",
      fantasy: "Fantasy",
      thriller: "Thriller",
      scifi: "Sci-Fi",

      bannerTitle: "NeverX Premium",
      bannerText: "Unbegrenzte Filme und Serien ansehen",
      watchNow: "Jetzt ansehen",
    },

    TR: {
      series: "Dizi",
      horror: "Korku",
      drama: "Drama",
      comedy: "Komedi",
      action: "Aksiyon",
      anime: "Anime",
      cartoon: "Çizgi Film",
      fantasy: "Fantastik",
      thriller: "Gerilim",
      scifi: "Bilim Kurgu",

      bannerTitle: "NeverX Premium",
      bannerText: "Sınırsız film ve dizileri izle",
      watchNow: "Şimdi İzle",
    },
  };

  const banners = [
    {
      img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
      title: { EN: "NeverX Premium", UZ: "NeverX Premium", RU: "NeverX Premium", DE: "NeverX Premium", TR: "NeverX Premium" },
      desc: { EN: "Watch unlimited movies and series", UZ: "Cheksiz film va seriallarni tomosha qiling", RU: "Смотрите фильмы без ограничений", DE: "Unbegrenzte Filme ansehen", TR: "Sınırsız film izle" },
      color: "from-blue-900/80",
    },
    {
      img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
      title: { EN: "New Releases", UZ: "Yangi Filmlar", RU: "Новинки", DE: "Neuerscheinungen", TR: "Yeni Filmler" },
      desc: { EN: "Discover the latest blockbusters", UZ: "Eng yangi kinolarni kashf eting", RU: "Откройте новые хиты", DE: "Entdecke neueste Hits", TR: "En yeni filmleri keşfet" },
      color: "from-purple-900/80",
    },
    {
      img: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9",
      title: { EN: "Top Series", UZ: "Top Seriallar", RU: "Топ Сериалы", DE: "Top Serien", TR: "En İyi Diziler" },
      desc: { EN: "Binge-watch the best series", UZ: "Eng yaxshi seriallarni tomosha qiling", RU: "Лучшие сериалы", DE: "Beste Serien schauen", TR: "En iyi dizileri izle" },
      color: "from-red-900/80",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIdx(p => (p + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const t = texts[lang] || texts.EN;

  const fetchMovies = async (queryText = "", category = "") => {
    setLoading(true);

    try {
      const pages = [1, 2, 3, 4, 5];

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

      let baseUrl = "";
      let isSeries = category === "series";

      if (isSeries) {
        const responses = await Promise.all(
          pages.map((page) =>
            fetch(
              `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=${langMap[lang]}&page=${page}`
            ).then((res) => res.json())
          )
        );

        const allSeries = responses.flatMap((d) => d.results || []);

        const uniqueSeries = Array.from(
          new Map(allSeries.map((s) => [s.id, s])).values()
        );

        setMovies(uniqueSeries);
        return;
      }

      if (category === "anime") {
        const responses = await Promise.all(
          pages.map((page) =>
            fetch(
              `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_keywords=210024&page=${page}`
            ).then((res) => res.json())
          )
        );

        const allAnime = responses.flatMap((d) => d.results || []);

        setMovies(
          Array.from(
            new Map(allAnime.map((m) => [m.id, m])).values()
          )
        );
        return;
      }

      if (category && genreMap[category]) {
        const genreId = genreMap[category];

        const responses = await Promise.all(
          pages.map((page) =>
            fetch(
              `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=${langMap[lang]}&page=${page}`
            ).then((res) => res.json())
          )
        );

        const allMovies = responses.flatMap((d) => d.results || []);

        const uniqueMovies = Array.from(
          new Map(allMovies.map((m) => [m.id, m])).values()
        );

        setMovies(uniqueMovies);
        return;
      }

      baseUrl = queryText.trim()
        ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${queryText}&language=${langMap[lang]}`
        : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=${langMap[lang]}`;

      const responses = await Promise.all(
        pages.map((page) =>
          fetch(`${baseUrl}&page=${page}`).then((res) => res.json())
        )
      );

      const allMovies = responses.flatMap((d) => d.results || []);

      const uniqueMovies = Array.from(
        new Map(allMovies.map((m) => [m.id, m])).values()
      );

      setMovies(uniqueMovies);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await saveUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user) fetchMovies("");
  }, [user, lang]);

  const isAdmin = user?.uid === ADMIN_UID;

  const loadMovies = async () => {
    const data = await getSavedMovies();
    setMovies(data);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-3">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    );
  }

  if (showAdmin && isAdmin) {
    return (
      <div>
        <Navbar
          user={user}
          setLang={setLang}
          lang={lang}
          theme={theme}
          setTheme={setTheme}
          isAdmin={isAdmin}
          setShowAdmin={setShowAdmin}
          setShowAddMovie={setShowAddMovie}
          onSearch={fetchMovies} />

        <AdminPanel setShowAdmin={setShowAdmin} lang={lang}
          showAddMovie={showAddMovie} setShowAddMovie={setShowAddMovie} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {
        showAddMovie && (
          <AddMovieModal
            onClose={() => setShowAddMovie(false)}
            adminUid={user.uid} />
        )
      }

      <Navbar
        user={user}
        setLang={setLang}
        lang={lang}
        theme={theme}
        setTheme={setTheme}
        isAdmin={isAdmin}
        setShowAdmin={setShowAdmin}
        setShowAddMovie={setShowAddMovie}
        onSearch={fetchMovies} />

      {/* BANNER */}
      <div className="max-w-7xl mx-auto px-3 md:px-5 mt-3 mb-5">
        <div className="h-50 sm:h-56 md:h-80 rounded-2xl md:rounded-3xl overflow-hidden relative">

          <img src={banners[bannerIdx].img}
            alt="" className="w-full h-full object-cover transition-opacity duration-500" />

          <div className={`absolute inset-0 bg-gradient-to-r ${banners[bannerIdx].color} to-black/60`} />

          <div className="absolute inset-0 flex flex-col justify-center ml-10 md:ml-10 px-4 md:px-8">
            <h2 className="text-lg sm:text-2xl md:text-5xl font-bold text-white max-w-[80%]">
              {banners[bannerIdx].title[lang] || banners[bannerIdx].title.EN}
            </h2>

            <p className="opacity-80 mt-2 text-xs sm:text-sm md:text-lg max-w-[75%] text-white">
              {banners[bannerIdx].desc[lang] || banners[bannerIdx].desc.EN}
            </p>

            <button className="btn btn-primary btn-sm md:btn-md w-fit mt-6">
              {t?.watchNow || "Watch Now"}
            </button>
          </div>

          {/* Prev / Next */}
          <button onClick={() => setBannerIdx(p => (p - 1 + banners.length) % banners.length)}
            className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm
              hover:bg-black/80 text-white text-2xl cursor-pointer flex items-center justify-center">
            ‹
          </button>

          <button onClick={() => setBannerIdx(p => (p + 1) % banners.length)}
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm
             hover:bg-black/80 text-white text-2xl cursor-pointer flex items-center justify-center">
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setBannerIdx(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === bannerIdx ? 20 : 8,
                  height: 8,
                  background: i === bannerIdx ? "#fff" : "rgba(255,255,255,0.4)",
                }} />
            ))}
          </div>

        </div>
      </div>

     {/* CATEGORY BAR */}
      <div className="max-w-7xl mx-auto justify-center py-5 gap-5 overflow-x-auto hidden md:flex">
        <button onClick={() => fetchMovies("", "series")}
          className="btn bg-base-200 p-5 rounded-xl hover:bg-base-300 transition-all">
          <FaTv />
          {t.series}
        </button>

        <button onClick={() => fetchMovies("", "horror")}
          className="btn bg-base-200 p-5 rounded-xl hover:bg-base-300 transition-all">
          <FaGhost />
          {t.horror}
        </button>

        <button onClick={() => fetchMovies("", "drama")}
          className="btn bg-base-200 p-5 rounded-xl hover:bg-base-300 transition-all">
          <FaHeart />
          {t.drama}
        </button>

        <button
          onClick={() => fetchMovies("", "comedy")}
          className="btn bg-base-200 p-5 rounded-xl hover:bg-base-300 transition-all">
          <FaLaugh />
          {t.comedy}
        </button>

        <button
          onClick={() => fetchMovies("", "action")}
          className="btn bg-base-200 p-5 rounded-xl hover:bg-base-300 transition-all">
          <FaBolt />
          {t.action}
        </button>

        <button
          onClick={() => fetchMovies("", "anime")}
          className="btn bg-base-200 p-5 rounded-xl hover:bg-base-300 transition-all">
          <FaDragon />
          {t.anime}
        </button>

        <button
          onClick={() => fetchMovies("", "cartoon")}
          className="btn bg-base-200 p-5 rounded-xl hover:bg-base-300 transition-all">
          <FaChild />
          {t.cartoon}
        </button>

        <button
          onClick={() => fetchMovies("", "scifi")}
          className="btn bg-base-200 p-5 rounded-xl hover:bg-base-300 transition-all">
          <FaRocket />
          {t.scifi}
        </button>

        <button
          onClick={() => fetchMovies("", "fantasy")}
          className="btn bg-base-200 p-5 rounded-xl hover:bg-base-300 transition-all">
          <FaMagic />
          {t.fantasy}
        </button>

        <button
          onClick={() => fetchMovies("", "thriller")}
          className="btn bg-base-200 p-5 rounded-xl hover:bg-base-300 transition-all">
          <FaMask />
          {t.thriller}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center mt-10">
          <span className="loading loading-spinner"></span>
        </div>
      )}

      {!loading && movies.length === 0 && (
        <h2 className="text-center text-lg mt-30">
          {t.noMoviesFound}
        </h2>
      )}

      {!loading && movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-3">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} lang={lang} />
          ))}
        </div>
      )}

      <Footer lang={lang} />
      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </div>
  );
}