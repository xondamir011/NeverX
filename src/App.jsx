import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import MovieCard from "./components/MovieCard";
import Search from "./components/Search";
import Footer from "./components/Footer";

export default function App() {
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
}, [lang]);

  const searchMovie = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&language=${langMap[lang]}`);
      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLang(savedLang);
  }, []);

  const t = {
    EN: { search: "Search...", no: "No movies found" },
    UZ: { search: "Qidirish...", no: "Film topilmadi" },
    RU: { search: "Поиск...", no: "Фильмы не найдены" },
    DE: { search: "Suchen...", no: "Keine Filme gefunden" },
    TR: { search: "Ara...", no: "Film bulunamadı" },
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">

      <Navbar setLang={setLang} lang={lang} />

      <Search query={query} setQuery={setQuery} onSearch={searchMovie} currentLang={lang} placeholder={t[lang].search}/>

      {loading && (
        <div className="flex-1 justify-center mt-10">
          <span className="loading loading-spinner loading-2xl"></span>
        </div>
      )}

      {!loading && movies.length === 0 && (
        <h2 className="text-center mt-10">{t[lang].no}</h2>
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