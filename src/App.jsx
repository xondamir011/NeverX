import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import MovieCard from "./components/MovieCard";
import Search from "./components/Search";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("Dark");
  const [lang, setLang] = useState("EN");

  const API_KEY = "44cae21994113f58296e3b6d0db555f3";

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setMovies(data.results))
      .catch(err => console.log(err));
  }, []);

  const searchMovie = async () => {
    if (!query.trim()) return;

    try {
     const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
     const data = await res.json();
     setMovies(data.results);
    } catch{
      console.log("Xatolik", error);
    }
  };

  useEffect(() => {
  const savedLang = localStorage.getItem("lang");
  if (savedLang) {
    setLang(savedLang);
  }
}, []);

  function getTheme(theme) {
  switch (theme) {
    case "Light":
      return "bg-white text-black";
    case "Neon":
      return "bg-black text-cyan-400";
    case "Sunset":
      return "bg-gradient-to-br from-orange-400 to-pink-600 text-white";
    case "Aqua":
      return "bg-gradient-to-br from-cyan-400 to-blue-600 text-white";
    case "Amethyst":
      return "bg-gradient-to-br from-purple-500 to-indigo-700 text-white";
    default:
      return "bg-gray-900 text-white";
  }
}

const t = {
  EN: {
    search: "Search...",
    noResult: "No movies found",
  },
  UZ: {
    search: "Qidirish...",
    noResult: "Film topilmadi",
  },
  RU: {
    search: "Поиск...",
    noResult: "Фильмы не найдены",
  },
  DE: {
    search: "Suchen...",
    noResult: "Keine Filme gefunden",
  },
  TR: {
    search: "Ara...",
    noResult: "Film bulunamadı",
  },
};

  return (
    <div className={`min-h-screen ${getTheme(theme)}`}>
      <Navbar setTheme={setTheme}/>
    
      <Search query={query} setQuery={setQuery} onSearch={searchMovie} placeholder={t[lang].search}/>

      {movies.length === 0 && (
        <h2 className="text-center mt-5">{t[lang].noResult}</h2>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 cursor-pointer">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
        {/* {movies.length === 0 && (
          <h2 className="text-center mt-5">{t[lang].noResult}</h2>
         )} */}
     
      </div>
    </div>
  );
}