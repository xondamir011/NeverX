import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Navbar from "./components/Navbar";
import MovieCard from "./components/MovieCard";
import Search from "./components/Search";
import Footer from "./components/Footer";
import Login from "./components/Login";

export default function App() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("EN");
  const [loading, setLoading] = useState(false);

  const API_KEY = "44cae21994113f58296e3b6d0db555f3";

  const langMap = {
    EN: "en-US",
    UZ: "uz-UZ",
    RU: "ru-RU",
    DE: "de-DE",
    TR: "tr-TR",
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=${langMap[lang]}`);
        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [lang, user]);

const searchMovie = async (queryText = "", filter = "") => {
  setLoading(true);
  try {
    let url = "";
    if (queryText.trim()) {
      // search uchun
      url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(queryText)}&language=${langMap[lang]}`;
    } else {
      // filter bo'yicha, default: popular / new / old
      let sortParam = "popularity.desc"; // default
      if (filter === "New Movies" || filter === "Yangi filmlar") sortParam = "release_date.desc";
      if (filter === "Old Movies" || filter === "Eski filmlar") sortParam = "release_date.asc";
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${langMap[lang]}&sort_by=${sortParam}`;
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

 const validLangs = Object.keys(langMap);
  useEffect(() => {
  const savedLang = localStorage.getItem("lang");
  if (savedLang && validLangs.includes(savedLang)) setLang(savedLang);
  else setLang("EN");
}, []);

  const t = {
    EN: { search: "Search...", no: "No movies found" },
    UZ: { search: "Qidirish...", no: "Film topilmadi" },
    RU: { search: "Поиск...", no: "Фильмы не найдены" },
    DE: { search: "Suchen...", no: "Keine Filme gefunden" },
    TR: { search: "Ara...", no: "Film bulunamadı" },
  };

  // agar foydalanuvchi login qilmagan bo'lsa
  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Navbar setLang={setLang} lang={lang} />

      <Search
        query={query}
        setQuery={setQuery}
        onSearch={searchMovie}
        currentLang={lang}
        placeholder={t[lang]?.search || "Search"}/>

      {loading && (
        <div className="flex-1 justify-center mt-10">
          <span className="loading loading-spinner loading-2xl"></span>
        </div>
      )}

      {!loading && movies.length === 0 && (
        <h2 className="text-center mt-10">{t[lang].no || t.EN.no}</h2>
      )} 

      {!loading && movies.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} lang={lang} />
          ))}
        </div>
      )}

      <Footer lang={lang}/>
    </div>
  );
}