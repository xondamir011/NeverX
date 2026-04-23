import { useState } from "react";

export default function MovieCard({ movie, lang }) {
  const [showModal, setShowModal] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);

  const t = {
    EN: { more: "Details", desc: "No description" },
    UZ: { more: "Batafsil", desc: "Tavsif yo‘q" },
    RU: { more: "Подробнее", desc: "Описание отсутствует" },
    DE: { more: "Details", desc: "Keine Beschreibung" },
    TR: { more: "Detay", desc: "Açıklama yok" },
  };

  const openTrailer = () => {
    const query = encodeURIComponent(movie.title + " trailer");
    setTrailerUrl(`https://www.youtube.com/embed?listType=search&list=${query}`);
  };

  return (
    <>
      {/* CARD */}
      <div onClick={() => setShowModal(true)}
        className="bg-base-200 rounded-lg overflow-hidden text-base-content shadow-lg hover:scale-105 duration-300 cursor-pointer group">
        <div className="relative overflow-hidden">
          <img src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/300x400"
            }
            className="w-full object-cover group-hover:scale-110 transition-transform duration-300"
            alt={movie.title}/>
        </div>

        <div className="p-2">
          <h3 className="text-lg font-semibold mb-2 truncate">
            {movie.title}
          </h3>
          <p className="text-sm opacity-70">📅 {movie.release_date}</p>
          <p>⭐️ {movie.vote_average ? movie.vote_average.toFixed(1) : "0.0"}</p>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowModal(false);
            setTrailerUrl(null); 
          }}>
          <div className="bg-base-200 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            {/* CLOSE */}
            <button onClick={() => {
                setShowModal(false);
                setTrailerUrl(null);
              }}
              className="fixed top-4 right-4 text-white text-3xl cursor-pointer">
              ×
            </button>

            {/* 🎬 VIDEO */}
            {trailerUrl ? (
              <div className="w-full aspect-video">
                <iframe className="w-full h-full rounded-t-2xl"
                  src={trailerUrl} title="Trailer" allowFullScreen/>
              </div>
            ) : (
              <div className="relative h-80">
                <img src={
                    movie.backdrop_path
                      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                      : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  }
                  className="w-full h-full object-cover rounded-t-2xl"/>

                {/* PLAY BUTTON */}
                <button onClick={openTrailer}
                  className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/60 p-4 rounded-full text-xl hover:scale-110 transition">
                    Tomosha qilish ▶️
                  </div>
                </button>
              </div>
            )}

            {/* CONTENT */}
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
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}