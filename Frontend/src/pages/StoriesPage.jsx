import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaTimes,
  FaShare,
  FaPause,
  FaRandom,
  FaClock,
} from "react-icons/fa";

const API_KEY = "44cae21994113f58296e3b6d0db555f3";
const IMG = "https://image.tmdb.org/t/p";
const STORY_DURATION = 5000;

const langMap = {
  EN: "en-US",
  UZ: "en-US",
  RU: "ru-RU",
  DE: "de-DE",
  TR: "tr-TR",
};

const T = {
  title: {
    EN: "Stories",
    UZ: "Storylar",
    RU: "Истории",
    DE: "Stories",
    TR: "Hikayeler",
  },

  back: {
    EN: "Back",
    UZ: "Orqaga",
    RU: "Назад",
    DE: "Zurück",
    TR: "Geri",
  },

  random: {
    EN: "Random",
    UZ: "Tasodifiy",
    RU: "Случайные",
    DE: "Zufällig",
    TR: "Rastgele",
  },

  newest: {
    EN: "New",
    UZ: "Yangi",
    RU: "Новые",
    DE: "Neu",
    TR: "Yeni",
  },

  liked: {
    EN: "Most liked",
    UZ: "Ko'p layk olganlar",
    RU: "Популярные",
    DE: "Beliebteste",
    TR: "Çok beğenilenler",
  },

  watch: {
    EN: "Watch",
    UZ: "Ko'rish",
    RU: "Смотреть",
    DE: "Ansehen",
    TR: "İzle",
  },

  empty: {
    EN: "No stories found",
    UZ: "Storylar topilmadi",
    RU: "Истории не найдены",
    DE: "Keine Stories gefunden",
    TR: "Hikaye bulunamadı",
  },

  copied: {
    EN: "Link copied!",
    UZ: "Havola nusxalandi!",
    RU: "Ссылка скопирована!",
    DE: "Link kopiert!",
    TR: "Bağlantı kopyalandı!",
  },
};

const getTitle = (m) =>
  m.title || m.name || m.original_title || "";

const getDate = (m) =>
  new Date(
    m.release_date || m.first_air_date || 0
  ).getTime() || 0;

const loadSeen = () => {
  try {
    return JSON.parse(
      localStorage.getItem("seenStories")
    ) || [];
  } catch {
    return [];
  }
};

const loadLikes = () => {
  try {
    return JSON.parse(
      localStorage.getItem("storyLikes")
    ) || {};
  } catch {
    return {};
  }
};

function shuffle(arr) {
  const a = [...arr];

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
}

export default function StoriesPage({ lang = "EN" }) {
  const navigate = useNavigate();

  const L = lang?.toUpperCase();

  const tr = (key) =>
    T[key]?.[L] || T[key]?.EN || "";

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] =
    useState("random");

  const [shuffleKey, setShuffleKey] =
    useState(0);

  const [seen, setSeen] =
    useState(loadSeen);

  const [likes, setLikes] =
    useState(loadLikes);

  const [viewer, setViewer] =
    useState(null);

  const [paused, setPaused] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const timerRef = useRef(null);

  const touchStartX =
    useRef(0);

  const pressTimer =
    useRef(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      try {
        const responses =
          await Promise.all(
            [1, 2, 3].map((page) =>
              fetch(
                `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=${langMap[L] || "en-US"
                }&page=${page}`
              ).then((r) => r.json())
            )
          );

        const all =
          responses.flatMap(
            (d) => d.results || []
          );

        const unique = Array.from(
          new Map(
            all.map((m) => [
              m.id,
              m,
            ])
          ).values()
        );

        if (!cancelled) {
          setMovies(
            unique.filter(
              (m) => m.poster_path
            )
          );
        }
      } catch (error) {
        console.error(
          "Stories error:",
          error
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [L]);

  const list = useMemo(() => {
    if (filter === "newest") {
      return [...movies].sort(
        (a, b) =>
          getDate(b) -
          getDate(a)
      );
    }

    if (filter === "liked") {
      return [...movies].sort(
        (a, b) =>
          (likes[b.id] || 0) -
          (likes[a.id] || 0)
      );
    }

    return shuffle(movies);

  }, [
    movies,
    filter,
    shuffleKey,
    likes,
  ]);


  const changeFilter = (value) => {
    setFilter(value);

    if (value === "random") {
      setShuffleKey(
        (key) => key + 1
      );
    }
  };

  const markSeen = useCallback(
    (id) => {
      setSeen((previous) => {
        if (
          previous.includes(id)
        ) {
          return previous;
        }

        const next = [
          ...previous,
          id,
        ];

        localStorage.setItem(
          "seenStories",
          JSON.stringify(next)
        );

        return next;
      });
    },
    []
  );

  // ==================================================
  // OPEN STORY
  // ==================================================

  const openStory = (index) => {
    markSeen(list[index].id);

    setViewer(index);
    setProgress(0);
    setPaused(false);
  };

  // ==================================================
  // NEXT
  // ==================================================

  const next = useCallback(() => {
    setViewer((index) => {
      if (index === null) {
        return null;
      }

      if (
        index + 1 >=
        list.length
      ) {
        return null;
      }

      markSeen(
        list[index + 1].id
      );

      return index + 1;
    });

    setProgress(0);
    setPaused(false);
  }, [list, markSeen]);

  // ==================================================
  // PREVIOUS
  // ==================================================

  const prev = useCallback(() => {
    setViewer((index) => {
      if (
        index === null ||
        index === 0
      ) {
        return index;
      }

      markSeen(
        list[index - 1].id
      );

      return index - 1;
    });

    setProgress(0);
    setPaused(false);
  }, [list, markSeen]);

  const closeViewer = () => {
    setViewer(null);
    setProgress(0);
    setPaused(false);
  };

  useEffect(() => {
    if (
      viewer === null ||
      paused
    ) {
      return;
    }

    const start =
      Date.now();

    timerRef.current =
      setInterval(() => {
        const elapsed =
          Date.now() - start;

        const percent =
          Math.min(
            100,
            (elapsed /
              STORY_DURATION) *
            100
          );

        setProgress(percent);

        if (percent >= 100) {
          clearInterval(
            timerRef.current
          );

          next();
        }
      }, 40);

    return () => {
      clearInterval(
        timerRef.current
      );
    };
  }, [
    viewer,
    paused,
    next,
  ]);

  useEffect(() => {
    if (viewer === null) {
      return;
    }

    const handleKey = (e) => {
      if (e.key === "Escape") {
        closeViewer();
      }

      if (e.key === "ArrowRight") {
        next();
      }

      if (e.key === "ArrowLeft") {
        prev();
      }

      if (e.key === " ") {
        e.preventDefault();
        setPaused(
          (value) => !value
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKey
    );

    const oldOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      window.removeEventListener(
        "keydown",
        handleKey
      );

      document.body.style.overflow =
        oldOverflow;
    };
  }, [
    viewer,
    next,
    prev,
  ]);

  // ==================================================
  // LIKE
  // ==================================================

  const toggleLike = (id) => {
    setLikes((previous) => {
      const nextLikes = {
        ...previous,
      };

      if (nextLikes[id]) {
        nextLikes[id] -= 1;
      } else {
        nextLikes[id] = 1;
      }

      if (
        nextLikes[id] <= 0
      ) {
        delete nextLikes[id];
      }

      localStorage.setItem(
        "storyLikes",
        JSON.stringify(
          nextLikes
        )
      );

      return nextLikes;
    });
  };

  // ==================================================
  // SHARE
  // ==================================================

  const shareStory = async () => {
    if (viewer === null) {
      return;
    }

    const movie =
      list[viewer];

    const title =
      getTitle(movie);

    const url =
      `${window.location.origin}/details/${movie.id}`;

    try {
      if (
        navigator.share
      ) {
        await navigator.share({
          title,
          text: `🎬 ${title}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(
          url
        );

        alert(
          tr("copied")
        );
      }
    } catch {
      // Share cancelled
    }
  };

  // ==================================================
  // TOUCH SWIPE
  // ==================================================

  const handleTouchStart =
    (e) => {
      touchStartX.current =
        e.touches[0].clientX;

      setPaused(true);
    };

  const handleTouchEnd =
    (e) => {
      const endX =
        e.changedTouches[0]
          .clientX;

      const diff =
        touchStartX.current -
        endX;

      setPaused(false);

      if (
        Math.abs(diff) <
        50
      ) {
        return;
      }

      if (diff > 0) {
        next();
      } else {
        prev();
      }
    };

  // ==================================================
  // HOLD TO PAUSE
  // ==================================================

  const handlePointerDown =
    () => {
      pressTimer.current =
        setTimeout(() => {
          setPaused(true);
        }, 120);
    };

  const handlePointerUp =
    () => {
      clearTimeout(
        pressTimer.current
      );

      setPaused(false);
    };

  const current =
    viewer !== null
      ? list[viewer]
      : null;

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-5 py-5 min-h-[30vh]">
      <div className="flex justify-center items-center gap-7 p-3 mb-8 rounded-xl overflow-x-auto">
        {[
          {
            key: "random",
            label: tr("random"),
            icon: <FaRandom />,
          },
          {
            key: "newest",
            label: tr("newest"),
            icon: <FaClock />,
          },
          {
            key: "liked",
            label: tr("liked"),
            icon: <FaHeart />,
          },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() =>
              changeFilter(
                f.key
              )
            }
            className={`
                flex items-center
                gap-1.5
                px-3 py-3
                rounded-lg
                text-xs sm:text-sm
                font-semibold
                whitespace-nowrap
                cursor-pointer
                transition-all
                ${filter ===
                f.key
                ? "bg-success text-success-content"
                : "hover:bg-base-300 opacity-80"
              }
              `}>
                
              {f.icon}
              {f.label}
          </button>
        ))}

      </div>

      {loading && (
        <div className="flex justify-center mt-20">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {!loading &&
        list.length === 0 && (
          <h2 className="text-center text-lg mt-20">
            {tr("empty")}
          </h2>
        )}

      {/* ================================================= */}
      {/* STORIES HORIZONTAL */}
      {/* ================================================= */}

      {!loading &&
        list.length > 0 && (
          <div
            className="
              flex
              gap-3
              overflow-x-auto
              pb-4
              scrollbar-hide
              snap-x
              snap-mandatory
              touch-pan-x
            "
          >
            {list.map(
              (movie, index) => {
                const isSeen =
                  seen.includes(
                    movie.id
                  );

                const title =
                  getTitle(
                    movie
                  );

                return (
                  <button
                    key={movie.id}
                    onClick={() =>
                      openStory(
                        index
                      )
                    }
                    className="
                      flex
                      flex-col
                      items-center
                      gap-2
                      flex-shrink-0
                      w-[82px]
                      sm:w-[100px]
                      snap-start
                      cursor-pointer
                      group
                    ">
                    {/* CIRCLE */}

                    <div className="relative w-[74px] h-[74px] sm:w-[92px] sm:h-[92px]">
                      <div
                        className={`
                          w-full
                          h-full
                          rounded-full
                          p-[3px]
                          transition-transform
                          duration-200
                          group-hover:scale-105
                          ${isSeen
                            ? "bg-base-300"
                            : "bg-gradient-to-tr from-red-600 via-cyan-400 to-blue-900"
                          }
                        `}>

                        <div className="w-full h-full rounded-full p-[2px] bg-base-100">
                          <img src={`${IMG}/w185${movie.poster_path}`}
                            alt={title}
                            loading="lazy"
                            className="w-full h-full rounded-full object-cover"
                          />

                        </div>
                      </div>

                      {!isSeen && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-success border-2 border-base-100" />
                      )}

                    </div>

                    {/* TITLE */}

                    <span
                      className={`
                        w-full
                        text-xs
                        text-center
                        truncate
                        ${isSeen
                          ? "opacity-50 font-medium"
                          : "font-bold"
                        }
                      `}
                    >
                      {title}
                    </span>

                  </button>
                );
              }
            )}
          </div>
        )}

      {/* ================================================= */}
      {/* STORY VIEWER */}
      {/* ================================================= */}

      {current && (
        <div
          className="
            fixed
            inset-0
            z-[200]
            bg-black/95
            flex
            items-center
            justify-center
          "
        >

          <div
            ref={null}
            onTouchStart={
              handleTouchStart
            }
            onTouchEnd={
              handleTouchEnd
            }
            onPointerDown={
              handlePointerDown
            }
            onPointerUp={
              handlePointerUp
            }
            onPointerCancel={
              handlePointerUp
            }
            className="
              relative
              w-full
              h-[100dvh]
              sm:w-[430px]
              sm:h-[90vh]
              sm:rounded-2xl
              overflow-hidden
              bg-black
              select-none
              touch-pan-y
            "
          >

            {/* ========================================= */}
            {/* PROGRESS */}
            {/* ========================================= */}

            <div className="absolute top-0 left-0 right-0 z-40 px-2 pt-2">

              <div className="flex gap-1">

                {list.map(
                  (_, index) => (
                    <div
                      key={index}
                      className="
                        h-1
                        flex-1
                        rounded-full
                        bg-white/30
                        overflow-hidden
                      "
                    >

                      <div
                        className={`
                          h-full
                          bg-white
                          rounded-full
                          ${index <
                            viewer
                            ? "w-full"
                            : index >
                              viewer
                              ? "w-0"
                              : ""
                          }
                        `}
                        style={
                          index ===
                            viewer
                            ? {
                              width: `${progress}%`,
                            }
                            : undefined
                        }
                      />

                    </div>
                  )
                )}

              </div>

            </div>

            {/* ========================================= */}
            {/* HEADER */}
            {/* ========================================= */}

            <div className="absolute top-5 left-0 right-0 z-40 px-4 flex items-center justify-between">

              <div className="flex items-center gap-2 min-w-0">

                <img
                  src={`${IMG}/w185${current.poster_path}`}
                  alt=""
                  className="
                    w-9
                    h-9
                    rounded-full
                    object-cover
                    border-2
                    border-white
                  "
                />

                <span className="text-white font-bold text-sm truncate max-w-[230px]">
                  {getTitle(
                    current
                  )}
                </span>

              </div>

              <button
                onClick={
                  closeViewer
                }
                className="
                  w-9
                  h-9
                  rounded-full
                  bg-black/50
                  text-white
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  hover:bg-black/70
                "
              >
                <FaTimes />
              </button>

            </div>

            {/* ========================================= */}
            {/* POSTER */}
            {/* ========================================= */}

            <img
              src={`${IMG}/w780${current.poster_path}`}
              alt={getTitle(
                current
              )}
              draggable="false"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
              "
            />

            {/* DARK GRADIENT */}

            <div className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/95
              via-transparent
              to-black/50
              pointer-events-none
            " />

            {/* ========================================= */}
            {/* PAUSED */}
            {/* ========================================= */}

            {paused && (
              <div className="
                absolute
                inset-0
                z-30
                flex
                items-center
                justify-center
                pointer-events-none
              ">
                <div className="
                  w-14
                  h-14
                  rounded-full
                  bg-black/60
                  backdrop-blur-sm
                  flex
                  items-center
                  justify-center
                  text-white
                  text-xl
                ">
                  <FaPause />
                </div>
              </div>
            )}

            {/* ========================================= */}
            {/* LEFT / RIGHT TAP */}
            {/* ========================================= */}

            <button
              aria-label="Previous story"
              onClick={prev}
              className="
                absolute
                left-0
                top-16
                bottom-32
                w-[30%]
                z-20
                cursor-pointer
              "
            />

            <button
              aria-label="Next story"
              onClick={next}
              className="
                absolute
                right-0
                top-16
                bottom-32
                w-[30%]
                z-20
                cursor-pointer
              "
            />

            {/* ========================================= */}
            {/* BOTTOM */}
            {/* ========================================= */}

            <div className="
              absolute
              bottom-0
              left-0
              right-0
              z-40
              p-4
              pb-6
              flex
              flex-col
              gap-3
            ">

              <h3 className="
                text-white
                text-xl
                font-bold
                drop-shadow-lg
              ">
                {getTitle(
                  current
                )}
              </h3>

              {current.overview && (
                <p className="
                  text-white/80
                  text-xs
                  line-clamp-3
                ">
                  {
                    current.overview
                  }
                </p>
              )}

              {/* ACTIONS */}

              <div className="flex items-center gap-2">

                {/* LIKE */}

                <button
                  onClick={() =>
                    toggleLike(
                      current.id
                    )
                  }
                  className="
                    w-11
                    h-11
                    rounded-full
                    bg-black/50
                    backdrop-blur-sm
                    text-white
                    flex
                    items-center
                    justify-center
                    cursor-pointer
                    hover:bg-black/70
                    transition
                  "
                >
                  {likes[
                    current.id
                  ] ? (
                    <FaHeart
                      className="text-red-500"
                    />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>

                {/* SHARE */}

                <button
                  onClick={
                    shareStory
                  }
                  className="
                    w-11
                    h-11
                    rounded-full
                    bg-black/50
                    backdrop-blur-sm
                    text-white
                    flex
                    items-center
                    justify-center
                    cursor-pointer
                    hover:bg-black/70
                    transition
                  "
                >
                  <FaShare />
                </button>

                {/* WATCH */}

                <button
                  onClick={() => {
                    closeViewer();

                    navigate(
                      `/details/${current.id}`
                    );
                  }}
                  className="
                    btn
                    btn-success
                    flex-1
                    rounded-full
                    cursor-pointer
                  "
                >
                  {tr("watch")}
                </button>

              </div>

            </div>

          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}