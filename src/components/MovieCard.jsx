import { useState } from "react";

export default function MovieCard({ movie, lang }) {
  const [showModal, setShowModal] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(false);

  const t = {
    EN: { more: "Details", watch: "Watch", desc: "No description" },
    UZ: { more: "Batafsil", watch: "Ko'rish", desc: "Tavsif yo‘q" },
    RU: { more: "Подробнее", watch: "Смотреть", desc: "Описание отсутствует" },
    DE: { more: "Details", watch: "Ansehen", desc: "Keine Beschreibung" },
    TR: { more: "Detay", watch: "İzle", desc: "Açıklama yok" },
  };

  // 🎬 REAL TRAILER
  const getTrailer = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${import.meta.env.VITE_TMDB_KEY}`
      );

      const data = await res.json();

      const trailer =
        data.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        ) ||
        data.results.find((v) => v.site === "YouTube");

      if (trailer) {
        setTrailerKey(trailer.key);
      } else {
        alert("Trailer topilmadi 😢");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* CARD */}
      <div
        onClick={() => setShowModal(true)}
        className="bg-base-200 rounded-lg overflow-hidden shadow-lg hover:scale-105 duration-300 cursor-pointer"
      >
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/300x400"
          }
          className="w-full object-cover"
          alt={movie.title}
        />

        <div className="p-2">
          <h3 className="text-lg font-semibold truncate">
            {movie.title}
          </h3>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowModal(false);
            setTrailerKey(null);
          }}>
          <div className="bg-base-200 rounded-2xl max-w-5xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            {/* CLOSE */}

            <button onClick={() => {
                setShowModal(false);
                setTrailerKey(null);}}
              className="absolute top-3 right-3 md:top-4 md:right-4 text-white text-2xl md:text-3xl z-50">
              ×
            </button>

            {/* 🎬 VIDEO / IMAGE */}
            <div className="relative w-full">

              {trailerKey ? (
                // VIDEO
                <div className="w-full aspect-video">
                  <iframe className="w-full h-full"
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1`} allow="autoplay"  
                    allowFullScreen/>
                </div>
              ) : (
                // IMAGE + PLAY
                <>
                  <img src={movie.backdrop_path
                        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                        : `https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    className="w-full h-52 sm:h-64 md:h-80 object-cove"/>

                  <button onClick={getTrailer} className="absolute inset-0 flex items-center justify-center">
                    <div className=" bg-black/70 text-white rounded-full cursor-pointer
                     px-5 py-3 text-lg sm:text-base md:text-lg hover:scale-110 transition">
                      {loading ? <h2 className="loading loading-sm"></h2> : "Tomosha qilish ▶️"}
                    </div>
                  </button>
                </>
              )}

            </div>

            {/* INFO */}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-3">{movie.title}</h2>

              <p className="mb-4 opacity-80">
                {movie.overview || t[lang].desc}
              </p>

              <div className="flex gap-3">
                <button onClick={getTrailer} className="btn btn-success">
                  🎬 {t[lang].watch}
                </button>

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