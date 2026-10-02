import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./firebase/config";
import { saveUser } from "./firebase/userService";

import Login from "./auth/Login";
import Register from "./auth/Register";
import Navbar from "./components/Navbar";
import MovieCard from "./components/MovieCard";
import MovieDetails from "./components/MovieDetails";
import Footer from "./components/Footer";
import AdminPanel from "./admin/AdminPanel";
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
  FaRocket,
} from "react-icons/fa";

const ADMIN_UID = "N6sqvO4mcXfIB8O2rcZDvFlM59s1";
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
    watchNow: "Watch Now",
    noMoviesFound: "No movies found",
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
    watchNow: "Tomosha qilish",
    noMoviesFound: "Kinolar topilmadi",
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
    watchNow: "Смотреть",
    noMoviesFound: "Фильмы не найдены",
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
    watchNow: "Jetzt ansehen",
    noMoviesFound: "Keine Filme gefunden",
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
    watchNow: "Şimdi İzle",
    noMoviesFound: "Film bulunamadı",
  },
};

const categories = [
  { key: "series", icon: FaTv },
  { key: "horror", icon: FaGhost },
  { key: "drama", icon: FaHeart },
  { key: "comedy", icon: FaLaugh },
  { key: "action", icon: FaBolt },
  { key: "anime", icon: FaDragon },
  { key: "cartoon", icon: FaChild },
  { key: "scifi", icon: FaRocket },
  { key: "fantasy", icon: FaMagic },
  { key: "thriller", icon: FaMask },
];

const genreMap = {
  horror: 27,
  comedy: 35,
  drama: 18,
  action: 28,
  fantasy: 14,
  thriller: 53,
  cartoon: 16,
  anime: 16,
  scifi: 878,
};

export default function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [lang, setLang] = useState("EN");
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [banners, setBanners] = useState([]);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const t = texts[lang] || texts.EN;
  const isAdmin = user?.uid === ADMIN_UID;

  // Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await saveUser(currentUser);
      }
    });

    return unsubscribe;
  }, []);

  // Theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=${langMap[lang]}&page=1`
        );

        if (!response.ok) {
          throw new Error("Banner API error");
        }

        const data = await response.json();

        const newBanners = (data.results || [])
          .filter(
            (movie) => movie.backdrop_path && movie.poster_path
          )
          .slice(0, 10)
          .map((movie, index) => ({
            movieId: movie.id,
            img: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
            title:
              movie.title ||
              movie.original_title ||
              "Movie",
            desc: movie.overview || "",
            color:
              index % 3 === 0
                ? "from-blue-900/90"
                : index % 3 === 1
                ? "from-purple-900/90"
                : "from-red-900/90",
          }));

        setBanners(newBanners);
        setBannerIdx(0);
      } catch (error) {
        console.error("Banner loading error:", error);
      }
    };

    if (user) {
      fetchBanners();
    }
  }, [user, lang]);

  // Auto banner
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setBannerIdx((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  // Fetch movies
  const fetchMovies = async (queryText = "", category = "") => {
    setLoading(true);

    try {
      const pages = [1, 2, 3, 4, 5];

      if (category === "series") {
        const responses = await Promise.all(
          pages.map((page) =>
            fetch(
              `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=${langMap[lang]}&page=${page}`
            ).then((res) => res.json())
          )
        );

        const series = responses.flatMap(
          (data) => data.results || []
        );

        setMovies(
          Array.from(
            new Map(series.map((item) => [item.id, item])).values()
          )
        );

        return;
      }

      if (category === "anime") {
        const responses = await Promise.all(
          pages.map((page) =>
            fetch(
              `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_keywords=210024&language=${langMap[lang]}&page=${page}`
            ).then((res) => res.json())
          )
        );

        const anime = responses.flatMap(
          (data) => data.results || []
        );

        setMovies(
          Array.from(
            new Map(anime.map((item) => [item.id, item])).values()
          )
        );

        return;
      }

      if (category && genreMap[category]) {
        const responses = await Promise.all(
          pages.map((page) =>
            fetch(
              `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreMap[category]}&language=${langMap[lang]}&sort_by=popularity.desc&page=${page}`
            ).then((res) => res.json())
          )
        );

        const genreMovies = responses.flatMap(
          (data) => data.results || []
        );

        setMovies(
          Array.from(
            new Map(
              genreMovies.map((item) => [item.id, item])
            ).values()
          )
        );

        return;
      }

      const baseUrl = queryText.trim()
        ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
            queryText
          )}&language=${langMap[lang]}`
        : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=${langMap[lang]}`;

      const responses = await Promise.all(
        pages.map((page) =>
          fetch(`${baseUrl}&page=${page}`).then((res) =>
            res.json()
          )
        )
      );

      const allMovies = responses.flatMap(
        (data) => data.results || []
      );

      setMovies(
        Array.from(
          new Map(
            allMovies.map((movie) => [movie.id, movie])
          ).values()
        )
      );
    } catch (error) {
      console.error("Movies error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Default movies
  useEffect(() => {
    if (user) {
      fetchMovies("");
    }
  }, [user, lang]);

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Login / Register
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    );
  }

  // Admin
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
          onSearch={fetchMovies}
          onLogout={handleLogout}
        />

        <AdminPanel
          setShowAdmin={setShowAdmin}
          lang={lang}
          showAddMovie={showAddMovie}
          setShowAddMovie={setShowAddMovie}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {showAddMovie && (
        <AddMovieModal
          onClose={() => setShowAddMovie(false)}
          adminUid={user.uid}
        />
      )}

      <Navbar
        user={user}
        setLang={setLang}
        lang={lang}
        theme={theme}
        setTheme={setTheme}
        isAdmin={isAdmin}
        setShowAdmin={setShowAdmin}
        setShowAddMovie={setShowAddMovie}
        onSearch={fetchMovies}
        onLogout={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* Banner */}
              <div className="max-w-7xl mx-auto px-3 md:px-5 mt-3 mb-5">
                {banners.length > 0 ? (
                  <div className="h-50 sm:h-56 md:h-80 rounded-2xl md:rounded-3xl overflow-hidden relative">
                    <img
                      src={banners[bannerIdx].img}
                      alt={banners[bannerIdx].title}
                      className="w-full h-full object-cover transition-opacity duration-500"
                    />

                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${banners[bannerIdx].color} to-black/60`}
                    />

                    <div className="absolute inset-0 flex flex-col justify-center ml-10 px-4 md:px-8">
                      <h2 className="text-lg sm:text-2xl md:text-5xl font-bold text-white max-w-[80%] drop-shadow-lg">
                        {banners[bannerIdx].title}
                      </h2>

                      <p className="opacity-90 mt-2 text-xs sm:text-sm md:text-lg max-w-[75%] text-white line-clamp-2">
                        {banners[bannerIdx].desc}
                      </p>

                      <button
                        onClick={() =>
                          navigate(
                            `/details/${banners[bannerIdx].movieId}`
                          )
                        }
                        className="btn btn-primary btn-sm md:btn-md w-fit mt-6 cursor-pointer transition-all hover:scale-105"
                      >
                        {t.watchNow}
                      </button>
                    </div>

                    {/* Previous */}
                    <button
                      onClick={() =>
                        setBannerIdx(
                          (prev) =>
                            (prev - 1 + banners.length) %
                            banners.length
                        )
                      }
                      className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white text-2xl cursor-pointer flex items-center justify-center transition"
                    >
                      ‹
                    </button>

                    {/* Next */}
                    <button
                      onClick={() =>
                        setBannerIdx(
                          (prev) => (prev + 1) % banners.length
                        )
                      }
                      className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white text-2xl cursor-pointer flex items-center justify-center transition"
                    >
                      ›
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {banners.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setBannerIdx(index)}
                          className="rounded-full transition-all duration-300"
                          style={{
                            width: index === bannerIdx ? 20 : 8,
                            height: 8,
                            background:
                              index === bannerIdx
                                ? "#fff"
                                : "rgba(255,255,255,0.4)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-50 sm:h-56 md:h-80 rounded-2xl md:rounded-3xl bg-base-200 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg" />
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="max-w-7xl mx-auto justify-center py-5 gap-5 overflow-x-auto hidden md:flex">
                {categories.map(({ key, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => fetchMovies("", key)}
                    className="btn bg-base-200 p-5 rounded-xl hover:bg-base-300 transition-all"
                  >
                    <Icon />
                    {t[key]}
                  </button>
                ))}
              </div>

              {/* Loading */}
              {loading && (
                <div className="flex justify-center mt-10">
                  <span className="loading loading-spinner loading-lg" />
                </div>
              )}

              {/* No movies */}
              {!loading && movies.length === 0 && (
                <h2 className="text-center text-lg mt-30">
                  {t.noMoviesFound}
                </h2>
              )}

              {/* Movies */}
              {!loading && movies.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-3">
                  {movies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      lang={lang}
                    />
                  ))}
                </div>
              )}
            </>
          }
        />

        <Route
          path="/details/:id"
          element={<MovieDetails />}
        />

        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>

      <Footer lang={lang} />

      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="dark"
      />
    </div>
  );
}