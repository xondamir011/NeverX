import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlay,
  FaStar,
  FaCalendar,
  FaClock,
  FaFilm,
  FaTv,
  FaLayerGroup,
  FaTimes,
} from "react-icons/fa";

const API_KEY = "44cae21994113f58296e3b6d0db555f3";

const languageMap = {
  UZ: "uz-UZ",
  EN: "en-US",
  RU: "ru-RU",
  DE: "de-DE",
  TR: "tr-TR",
};

const findTrailer = (data) =>
  data?.videos?.results?.find(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Trailer" &&
      video.official === true
  ) ||
  data?.videos?.results?.find(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Trailer"
  ) ||
  data?.videos?.results?.find(
    (video) => video.site === "YouTube"
  );

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [type, setType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailer, setTrailer] = useState(null);
  const [error, setError] = useState(false);

  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);

  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const lang = localStorage.getItem("lang") || "UZ";
  const language = languageMap[lang] || "en-US";

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(false);
      setSeasons([]);
      setEpisodes([]);
      setSelectedSeason(null);
      setSelectedEpisode(null);

      try {
        // MOVIE
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}` +
            `?api_key=${API_KEY}` +
            `&language=${language}` +
            `&append_to_response=videos`
        );

        const movieData = await movieRes.json();

        if (movieRes.ok && movieData.id && movieData.title) {
          setItem(movieData);
          setType("movie");
          setTrailer(findTrailer(movieData));
          return;
        }

        // TV
        const tvRes = await fetch(
          `https://api.themoviedb.org/3/tv/${id}` +
            `?api_key=${API_KEY}` +
            `&language=${language}` +
            `&append_to_response=videos`
        );

        const tvData = await tvRes.json();

        if (tvRes.ok && tvData.id && tvData.name) {
          setItem(tvData);
          setType("tv");
          setTrailer(findTrailer(tvData));

          setSeasons(
            (tvData.seasons || []).filter(
              (season) => season.season_number >= 0
            )
          );

          return;
        }

        setError(true);
        setItem(null);
      } catch (err) {
        console.error("Details error:", err);
        setError(true);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id, language]);

  const loadSeason = async (seasonNumber) => {
    if (!id || type !== "tv") return;

    setSelectedSeason(seasonNumber);
    setEpisodes([]);
    setSelectedEpisode(null);
    setEpisodesLoading(true);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}` +
          `?api_key=${API_KEY}` +
          `&language=${language}`
      );

      if (!response.ok) {
        throw new Error("Season not found");
      }

      const data = await response.json();
      setEpisodes(data.episodes || []);
    } catch (err) {
      console.error("Season error:", err);
      setEpisodes([]);
    } finally {
      setEpisodesLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-4 text-center">
        <h2 className="text-2xl font-bold">
          Film yoki serial topilmadi
        </h2>

        <button
          onClick={() => navigate("/")}
          className="btn btn-primary"
        >
          <FaArrowLeft />
          Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  const isTV = type === "tv";

  const title = isTV ? item.name : item.title;
  const originalTitle = isTV
    ? item.original_name
    : item.original_title;

  const releaseDate = isTV
    ? item.first_air_date
    : item.release_date;

  const releaseYear = releaseDate
    ? new Date(releaseDate).getFullYear()
    : "Noma'lum";

  const backdrop = item.backdrop_path
    ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
    : null;

  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : null;

  const runtime =
    !isTV && item.runtime
      ? `${Math.floor(item.runtime / 60)} soat ${
          item.runtime % 60
        } daqiqa`
      : null;

  const seasonsCount = isTV
    ? item.number_of_seasons || 0
    : 0;

  const episodesCount = isTV
    ? item.number_of_episodes || 0
    : 0;

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* BACK */}
      <div className="max-w-7xl mx-auto px-4 pt-5">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost gap-2"
        >
          <FaArrowLeft />
          Orqaga
        </button>
      </div>

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="relative min-h-[550px] md:min-h-[650px] rounded-3xl overflow-hidden">
          {backdrop ? (
            <img
              src={backdrop}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-base-300" />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />

          <div className="relative z-10 min-h-[550px] md:min-h-[650px] flex items-end p-5 md:p-10">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start w-full">
              {/* POSTER */}
              {poster && (
                <img
                  src={poster}
                  alt={title}
                  className="
                    w-40
                    md:w-64
                    rounded-2xl
                    shadow-2xl
                    object-cover
                    shrink-0
                  "
                />
              )}

              {/* INFO */}
              <div className="text-white max-w-3xl">
                {/* TYPE */}
                <span className="badge badge-primary gap-2 mb-3">
                  {isTV ? <FaTv /> : <FaFilm />}
                  {isTV ? "Serial" : "Film"}
                </span>

                {/* TITLE */}
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  {title}
                </h1>

                {originalTitle &&
                  originalTitle !== title && (
                    <p className="text-white/60 mb-4">
                      {originalTitle}
                    </p>
                  )}

                {/* INFO */}
                <div className="flex flex-wrap gap-3 mb-5">
                  <span className="badge badge-warning gap-2">
                    <FaStar />
                    {item.vote_average
                      ? item.vote_average.toFixed(1)
                      : "N/A"}
                  </span>

                  <span className="badge badge-neutral gap-2">
                    <FaCalendar />
                    {releaseYear}
                  </span>

                  {!isTV && runtime && (
                    <span className="badge badge-neutral gap-2">
                      <FaClock />
                      {runtime}
                    </span>
                  )}

                  {isTV && (
                    <>
                      <span className="badge badge-neutral gap-2">
                        <FaLayerGroup />
                        {seasonsCount} fasl
                      </span>

                      <span className="badge badge-neutral gap-2">
                        <FaTv />
                        {episodesCount} qism
                      </span>
                    </>
                  )}
                </div>

                {/* GENRES */}
                {item.genres?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {item.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="badge badge-primary badge-outline"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* DESCRIPTION */}
                <p className="text-sm md:text-base text-white/80 leading-7 mb-6">
                  {item.overview ||
                    "Film haqida ma'lumot mavjud emas."}
                </p>

                {/* TRAILER */}
                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary gap-2"
                  >
                    <FaPlay />
                    Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TV SEASONS */}
      {isTV && seasons.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-base-200 rounded-3xl p-5 md:p-7">
            <div className="flex items-center gap-3 mb-5">
              <FaLayerGroup />
              <h2 className="text-2xl font-bold">
                Fasllar
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {seasons.map((season) => (
                <button
                  key={season.id}
                  onClick={() =>
                    loadSeason(season.season_number)
                  }
                  className={`btn ${
                    selectedSeason === season.season_number
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                >
                  {season.season_number === 0
                    ? "Maxsus"
                    : `${season.season_number}-fasl`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EPISODES */}
      {isTV && selectedSeason !== null && (
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="bg-base-200 rounded-3xl p-5 md:p-7">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h2 className="text-2xl font-bold">
                {selectedSeason === 0
                  ? "Maxsus qismlar"
                  : `${selectedSeason}-fasl qismlari`}
              </h2>

              <span className="badge badge-primary">
                {episodes.length} qism
              </span>
            </div>

            {episodesLoading ? (
              <div className="flex justify-center py-10">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : episodes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {episodes.map((episode) => {
                  const still = episode.still_path
                    ? `https://image.tmdb.org/t/p/w500${episode.still_path}`
                    : null;

                  return (
                    <button
                      key={episode.id}
                      onClick={() =>
                        setSelectedEpisode(episode)
                      }
                      className="
                        text-left
                        bg-base-100
                        rounded-2xl
                        overflow-hidden
                        border
                        border-base-300
                        hover:border-primary
                        transition
                        group
                      "
                    >
                      <div className="relative aspect-video bg-base-300 overflow-hidden">
                        {still ? (
                          <img
                            src={still}
                            alt={episode.name}
                            className="
                              w-full
                              h-full
                              object-cover
                              group-hover:scale-105
                              transition
                            "
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaTv className="text-4xl opacity-30" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <FaPlay />
                          </div>
                        </div>

                        <span className="absolute top-3 left-3 badge badge-neutral">
                          {episode.episode_number}-qism
                        </span>
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold line-clamp-1">
                          {episode.name}
                        </h3>

                        <div className="flex items-center gap-3 mt-2 text-sm opacity-60">
                          {episode.air_date && (
                            <span>
                              {episode.air_date}
                            </span>
                          )}

                          {episode.runtime && (
                            <span>
                              {episode.runtime} daqiqa
                            </span>
                          )}
                        </div>

                        {episode.vote_average > 0 && (
                          <div className="flex items-center gap-1 mt-2 text-sm">
                            <FaStar className="text-warning" />
                            {episode.vote_average.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-center opacity-60 py-8">
                Bu faslda qism topilmadi.
              </p>
            )}
          </div>
        </div>
      )}

      {/* EPISODE PLAYER / PREVIEW */}
      {selectedEpisode && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl bg-base-100 rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedEpisode(null)}
              className="
                absolute
                right-3
                top-3
                z-20
                btn
                btn-circle
                btn-sm
                btn-neutral
              "
            >
              <FaTimes />
            </button>

            {selectedEpisode.still_path ? (
              <div className="relative aspect-video bg-black">
                <img
                  src={`https://image.tmdb.org/t/p/original${selectedEpisode.still_path}`}
                  alt={selectedEpisode.name}
                  className="w-full h-full object-contain"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white px-5">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center mb-4">
                      <FaPlay />
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold">
                      {selectedEpisode.episode_number}-qism
                    </h2>

                    <p className="mt-2 text-white/70">
                      {selectedEpisode.name}
                    </p>

                    <p className="mt-4 text-sm text-white/60 max-w-xl">
                      Bu qism uchun TMDB video fayl bermaydi.
                      Hozircha faqat qism ma'lumotlari va
                      preview rasmi mavjud.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-black text-white">
                <div className="text-center px-5">
                  <FaTv className="text-5xl mx-auto mb-4 opacity-40" />
                  <h2 className="text-xl font-bold">
                    {selectedEpisode.name}
                  </h2>
                  <p className="opacity-60 mt-2">
                    Video mavjud emas
                  </p>
                </div>
              </div>
            )}

            <div className="p-5 md:p-7">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="badge badge-primary">
                  {selectedSeason === 0
                    ? "Maxsus"
                    : `${selectedSeason}-fasl`}
                </span>

                <span className="badge badge-neutral">
                  {selectedEpisode.episode_number}-qism
                </span>

                {selectedEpisode.vote_average > 0 && (
                  <span className="badge badge-warning gap-1">
                    <FaStar />
                    {selectedEpisode.vote_average.toFixed(1)}
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold">
                {selectedEpisode.name}
              </h2>

              <p className="mt-3 leading-7 opacity-70">
                {selectedEpisode.overview ||
                  "Qism haqida ma'lumot mavjud emas."}
              </p>

              {selectedEpisode.air_date && (
                <p className="mt-4 text-sm opacity-60">
                  Chiqqan sana: {selectedEpisode.air_date}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EXTRA INFORMATION */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* RATING */}
          <div className="bg-base-200 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <FaStar className="text-warning" />
              <h3 className="font-bold">
                Reyting
              </h3>
            </div>

            <p className="text-2xl font-bold">
              {item.vote_average
                ? item.vote_average.toFixed(1)
                : "N/A"}

              <span className="text-sm opacity-50">
                /10
              </span>
            </p>

            <p className="text-sm opacity-60">
              {item.vote_count || 0} ta ovoz
            </p>
          </div>

          {/* DATE */}
          <div className="bg-base-200 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <FaCalendar />

              <h3 className="font-bold">
                {isTV
                  ? "Birinchi chiqish"
                  : "Chiqqan sana"}
              </h3>
            </div>

            <p className="text-lg font-semibold">
              {releaseDate || "Noma'lum"}
            </p>
          </div>

          {/* STATUS */}
          <div className="bg-base-200 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              {isTV ? <FaTv /> : <FaFilm />}

              <h3 className="font-bold">
                Holati
              </h3>
            </div>

            <p className="text-lg font-semibold">
              {item.status || "Noma'lum"}
            </p>
          </div>
        </div>

        {/* CREATORS */}
        {isTV && item.created_by?.length > 0 && (
          <div className="mt-6 bg-base-200 rounded-2xl p-5">
            <h3 className="font-bold mb-3">
              Yaratuvchilar
            </h3>

            <div className="flex flex-wrap gap-3">
              {item.created_by.map((creator) => (
                <span
                  key={creator.id}
                  className="badge badge-lg"
                >
                  {creator.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* NETWORKS */}
        {isTV && item.networks?.length > 0 && (
          <div className="mt-4 bg-base-200 rounded-2xl p-5">
            <h3 className="font-bold mb-3">
              Network
            </h3>

            <div className="flex flex-wrap gap-3">
              {item.networks.map((network) => (
                <span
                  key={network.id}
                  className="badge badge-outline badge-lg"
                >
                  {network.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}