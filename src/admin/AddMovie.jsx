import React, { useState } from "react";
import { addAdminMovie } from "../firebase/movieAdminService";

const API_KEY = "44cae21994113f58296e3b6d0db555f3";

export default function AddMovie({ onMovieAdded }) {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchMovies = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
      );

      const data = await res.json();

      setMovies(data.results || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const addMovieToFirebase = async (movie) => {
    try {
      await addAdminMovie(movie.id);

      alert("Movie added successfully");

      if (onMovieAdded) {
        onMovieAdded();
      }
    } catch (err) {
      console.log(err);
      alert("Error adding movie");
    }
  };

  return (
    <div className="bg-base-200 rounded-2xl p-5">
      <h2 className="text-2xl font-bold mb-4">
        Add Movie From TMDB
      </h2>

      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movie..."
          className="input input-bordered flex-1"/>

        <button onClick={searchMovies}
          className="btn btn-primary">
          Search
        </button>
      </div>

      {loading && (
        <div className="text-center">
          <span className="loading loading-spinner"></span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div key={movie.id}
            className="bg-base-100 rounded-xl overflow-hidden">
            <img src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/300x450"
              }
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover"/>

            <div className="p-3">
              <p className="font-semibold truncate">
                {movie.title}
              </p>

              <p className="text-sm opacity-60">
                ⭐ {movie.vote_average?.toFixed(1)}
              </p>

              <button onClick={() => addMovieToFirebase(movie)}
                className="btn btn-primary btn-sm w-full mt-3">
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}