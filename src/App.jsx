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
import Search from "./components/Search";
import Footer from "./components/Footer";
import AdminPanel from "./admin/AdminPanel";
import { saveUser } from "./firebase/userService";
import AddMovie from "./admin/AddMovie";
import AddMovieModal from "./admin/AddMovieModal";

const ADMIN_UID = "N6sqvO4mcXfIB8O2rcZDvFlM59s1";

export default function App() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("EN");
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [showAddMovie, setShowAddMovie] = useState(false);

  const API_KEY = "44cae21994113f58296e3b6d0db555f3";

  const langMap = {
    EN: "en-US",
    UZ: "en-US",
    RU: "ru-RU",
    DE: "de-DE",
    TR: "tr-TR",
  };

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

      <div className="p-2 sm:p-4">
        <Search
          query={query}
          setQuery={setQuery}
          onSearch={fetchMovies}
          currentLang={lang}
          placeholder={{
            EN: "Search...",
            UZ: "Qidirish...",
            RU: "Поиск...",
            DE: "Suchen...",
            TR: "Ara...",
          }[lang]} />
      </div>

      {loading && (
        <div className="flex justify-center mt-10">
          <span className="loading loading-spinner"></span>
        </div>
      )}

      {!loading && movies.length === 0 && (
        <h2 className="text-center text-lg mt-30">
          {{
            EN: "No movies or series found 😔",
            UZ: "Film yoki serial topilmadi 😔",
            RU: "Фильмы или сериалы не найдены 😔",
            DE: "Keine Filme oder Serien gefunden 😔",
            TR: "Film silole dizi bulunamadı 😔",
          }[lang]}
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