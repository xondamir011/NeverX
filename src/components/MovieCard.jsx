import { useState, useEffect } from 'react';

export default function MovieCard({ movie }) {
  const [showModal, setShowModal] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = '44cae21994113f58296e3b6d0db555f3'; 

  useEffect(() => {
    if (showModal && !trailerKey) {
      fetchTrailer();
    }
  }, [showModal]);

  const fetchTrailer = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`
      );
      const data = await response.json();
      
      const trailer = data.results?.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );
      
      if (trailer) {
        setTrailerKey(trailer.key);
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={() => setShowModal(true)}
       className="bg-gray-800 rounded-lg overflow-hidden mb-50 text-white shadow-lg hover:scale-105 duration-300 cursor-pointer group">
        <div className="relative overflow-hidden">
         <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/300x400"} 
          className="w-full h-130 object-cover group-hover:scale-110 transition-transform duration-300" alt={movie.title}/>
        </div>

        <div className="p-2"> 
          <h3 className="text-lg font-semibold mb-2 truncate">{movie.title}</h3>
          <p className="text-gray-400">📅 {movie.release_date}</p>
          <p>⭐ {movie.vote_average.toFixed(1)}</p>
        </div>
      </div>

      {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => {
              setShowModal(false);
              setShowTrailer(false);
            }}>
          <div className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
           onClick={(e) => e.stopPropagation()}>
            <button onClick={() => {
             setShowModal(false);
             setShowTrailer(false);
             }}
              className="fixed top-4 right-4 text-white text-4xl hover:text-red-500 z-10 w-12 h-12 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all">
              ×
            </button>

            <div className="relative h-96 bg-gradient-to-b from-transparent to-gray-900">
              <img src={movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : `https://image.tmdb.org/t/p/w500${movie.poster_path}`}
               alt={movie.title} className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            </div>

            <div className="p-8 -mt-32 relative">
              <div className="flex flex-col md:flex-row gap-6">
                <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/300x400"}
                 alt={movie.title} className="w-48 rounded-lg shadow-2xl mx-auto md:mx-0"/>

                <div className="flex-1 text-white">
                  <h2 className="text-4xl font-bold mb-4">{movie.title}</h2>
                  
                  {movie.original_title !== movie.title && (
                    <p className="text-gray-400 text-lg mb-2 italic">{movie.original_title}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="bg-yellow-600 px-3 py-1 rounded-full text-sm font-semibold">
                      ⭐ {movie.vote_average.toFixed(1)}/10
                    </span>
                    <span className="text-gray-400">📅 {movie.release_date}</span>
                    <span className="text-gray-400">🗣️ {movie.original_language.toUpperCase()}</span>
                    {movie.adult && (
                      <span className="bg-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                        18+
                      </span>
                    )}
                  </div>

                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    {movie.overview || 'Hech qanday tavsif mavjud emas.'}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    {trailerKey && (
                      <button onClick={() => setShowTrailer(!showTrailer)}
                       className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all flex items-center gap-2">
                        {showTrailer ? '⏸ To\'xtatish' : '▶ Treyler'}
                      </button>
                    )}
                    
                    {loading && (
                      <div className="text-gray-400">Loading trailer...</div>
                    )}
                    
                    <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer"
                      className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all">
                      ℹ️ Batafsil
                    </a>

                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' full movie')}`} target="_blank"
                     rel="noopener noreferrer"
                     className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all flex items-center gap-2">
                      🎬 Kinoni Ko'rish
                    </a>
                  </div>
                </div>
              </div>

              {showTrailer && trailerKey && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Treyler</h3>
                  <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-2xl">
                    <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                      title={`${movie.title} Trailer`}
                      frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen/>
                  </div>
                </div>
              )}

              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-gray-400 text-sm mb-2">Mashhurlik</h4>
                  <p className="text-white text-xl font-bold">{movie.popularity.toFixed(0)}</p>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-gray-400 text-sm mb-2">Ovozlar</h4>
                  <p className="text-white text-xl font-bold">{movie.vote_count.toLocaleString()}</p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-gray-400 text-sm mb-2">Til</h4>
                  <p className="text-white text-xl font-bold uppercase">{movie.original_language}</p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-gray-400 text-sm mb-2">Reyting</h4>
                  <p className="text-white text-xl font-bold">⭐ {movie.vote_average.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
            from {
                opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </>
  );
}