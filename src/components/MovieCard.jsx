import { useState } from "react";

export default function MovieCard({ movie, lang }) {
  const [showModal, setShowModal] = useState(false);

  const t = {
    EN: { more: "Details", watch: "Watch", desc: "No description" },
    UZ: { more: "Batafsil", watch: "Ko'rish", desc: "Tavsif yo‘q" },
    RU: { more: "Подробнее", watch: "Смотреть", desc: "Описание отсутствует" },
    DE: { more: "Details", watch: "Ansehen", desc: "Keine Beschreibung" },
    TR: { more: "Detay", watch: "İzle", desc: "Açıklama yok" },
  };

  return (
    <>
      <div onClick={() => setShowModal(true)}
        className="bg-base-200 rounded-lg overflow-hidden text-base-content shadow-lg hover:scale-105 duration-300 cursor-pointer group">
        <div className="relative overflow-hidden">
          <img src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/300x400"
            }
            className="w-full object-cover group-hover:scale-110 transition-transform duration-300" alt={movie.title}/>
        </div>

        <div className="p-2">
          <h3 className="text-lg font-semibold mb-2 truncate">
            {movie.title}
          </h3>
          <p className="text-sm opacity-70">📅 {movie.release_date}</p>
          <p>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "0.0"}</p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}>
          <div className="bg-base-200 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
      
            <button onClick={() => setShowModal(false)}
              className="fixed top-4 right-4 text-white text-3xl cursor-pointer">
              ×
            </button>

            <div className="relative h-80">
              <img src={
                  movie.backdrop_path
                    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                }
                className="w-full h-full object-cover"/>
            </div>

            <div className="p-6 text-base-content">
              <h2 className="text-3xl font-bold mb-3">{movie.title}</h2>

              <p className="mb-4 opacity-80">
                {movie.overview || t[lang].desc}
              </p>

              <div className="flex gap-3 flex-wrap">
                <a href={`https://www.themoviedb.org/movie/${movie.id}`}
                  target="_blank" className="btn btn-secondary">
                  ℹ️ {t[lang].more}
                </a>

                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    movie.title + " full movie"
                  )}`}
                  target="_blank"
                  className="btn btn-success">
                  🎬 {t[lang].watch}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}