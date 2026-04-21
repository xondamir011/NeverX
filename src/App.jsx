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

export default function App() {
  const [user, setUser] = useState(null);

  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("EN");
  const [loading, setLoading] = useState(false);

  // 🌙 THEME STATE (QAYTARILDI)
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const API_KEY = "44cae21994113f58296e3b6d0db555f3";

  const langMap = {
    EN: "en-US",
    UZ: "uz-UZ",
    RU: "ru-RU",
    DE: "de-DE",
    TR: "tr-TR",
  };

  // 🔐 AUTH
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  // 🌙 APPLY THEME
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🎬 MOVIES
  useEffect(() => {
    if (!user) return;

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=${langMap[lang]}`
        );
        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [user, lang]);

  // 🔍 SEARCH
  const searchMovie = async (queryText = "") => {
    setLoading(true);
    try {
      let url = "";

      if (queryText.trim()) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${queryText}&language=${langMap[lang]}`;
      } else {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=${langMap[lang]}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const t = {
    EN: { search: "Search...", no: "No movies found" },
    UZ: { search: "Qidirish...", no: "Film topilmadi" },
    RU: { search: "Поиск...", no: "Фильмы не найдены" },
    DE: { search: "Suchen...", no: "Keine Filme gefunden" },
    TR: { search: "Ara...", no: "Film bulunamadı" },
  };

  // 🔐 LOGIN YO‘Q
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

  // 🎬 MAIN APP
  return (
    <div className="min-h-screen bg-base-100 text-base-content">

      {/* NAVBAR */}
      <Navbar
        user={user}
        setLang={setLang}
        lang={lang}
        theme={theme}
        setTheme={setTheme}
      />

      {/* SEARCH */}
      <div className="p-2 sm:p-4">
        <Search
          query={query}
          setQuery={setQuery}
          onSearch={searchMovie}
          currentLang={lang}
          placeholder={t[lang]?.search}
        />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center mt-10">
          <span className="loading loading-spinner"></span>
        </div>
      )}

      {/* EMPTY */}
      {!loading && movies.length === 0 && (
        <h2 className="text-center mt-10">{t[lang].no}</h2>
      )}

      {!loading && movies.length > 0 && (
        <div className="
          grid 
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          lg:grid-cols-5 
          gap-3 
          p-3">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} lang={lang} />
          ))}
        </div>
      )}

      {/* FOOTER */}
      <Footer lang={lang} />
      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </div>
  );
}