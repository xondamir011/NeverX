import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
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

const ADMIN_UID = "N6sqvO4mcXfIB8O2rcZDvFlM59s1";

export default function App() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("EN");
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const API_KEY = "44cae21994113f58296e3b6d0db555f3";

  const langMap = {
    EN: "en-US",
    UZ: "en-US",
    RU: "ru-RU",
    DE: "de-DE",
    TR: "tr-TR",
  };

  const fetchMovies = async (queryText = "") => {
    setLoading(true);
    try {
      let baseUrl = "";

      if (queryText.trim()) {
        baseUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${queryText}&language=${langMap[lang]}`;
      } else {
        baseUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=${langMap[lang]}`;
      }

      const pages = [1, 2, 3, 4, 5];

      const responses = await Promise.all(
        pages.map((page) =>
          fetch(`${baseUrl}&page=${page}`).then((res) => res.json())
        )
      );

      const allMovies = responses.flatMap((data) => data.results || []);
      setMovies(allMovies);
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
          showAdmin={showAdmin}
          handleLogout={handleLogout}/>

        <AdminPanel setShowAdmin={setShowAdmin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Navbar
        user={user}
        setLang={setLang}
        lang={lang}
        theme={theme}
        setTheme={setTheme}
        isAdmin={isAdmin}
        setShowAdmin={setShowAdmin}
        showAdmin={showAdmin} />

      <div className="p-2 sm:p-4">
        <Search
          query={query}
          setQuery={setQuery}
          onSearch={fetchMovies}
          currentLang={lang}
          placeholder={
            {
              EN: "Search...",
              UZ: "Qidirish...",
              RU: "Поиск...",
              DE: "Suchen...",
              TR: "Ara..."
            }[lang]
          } />
      </div>

      {loading && (
        <div className="flex justify-center mt-10">
          <span className="loading loading-spinner"></span>
        </div>
      )}

      {!loading && movies.length === 0 && (
        <h2 className="text-center text-lg mt-30">
          {
            {
              EN: "No movies found 😔",
              UZ: "Film topilmadi 😔",
              RU: "Фильмы не найдены 😔",
              DE: "Keine Filme gefunden 😔",
              TR: "Film bulunamadı 😔"
            }[lang]
          }
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