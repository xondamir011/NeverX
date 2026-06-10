import { useState } from "react";
import { addMovie } from "../firebase/movieService";
import { toast } from "react-toastify";

const TMDB_KEY = "44cae21994113f58296e3b6d0db555f3";

export default function AddMovieModal({
  onClose,
  adminUid
}) {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchMovie = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${query}`);

      const data = await res.json();

      setMovies(data.results || []);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const saveMovie = async (movie) => {
    try {
      await addMovie(movie, adminUid);

      toast.success("Movie qo'shildi ✅");
    } catch {
      toast.error("Xatolik ❌");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-3">
      <div className="bg-base-100 w-full max-w-4xl rounded-2xl p-4">

        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">
            Add Movie
          </h2>

          <button onClick={onClose}
            className="btn btn-sm">
            ✕
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Movie search..."
            className="input input-bordered flex-1"/>

          <button onClick={searchMovie}
            className="btn btn-primary">
            Search
          </button>
        </div>

        {loading && (
          <div className="text-center py-5">
            Loading...
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {movies.map((movie) => (
            <div key={movie.id}
              className="bg-base-200 rounded-xl overflow-hidden">

              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title} className="w-full h-64 object-cover"/>

              <div className="p-2">
                <h3 className="font-semibold text-sm truncate">
                  {movie.title}
                </h3>

                <button onClick={() => saveMovie(movie)}
                  className="btn btn-success btn-sm w-full mt-2">
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}