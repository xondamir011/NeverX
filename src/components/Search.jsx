import { useState, useEffect } from "react";
import {
  Search as SearchIcon,
  Play,
  Volume2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Search({
  query,
  setQuery,
  onSearch,
  placeholder,
  currentLang = "UZ",
}) {

  const text = {
    UZ: {
      search: "Qidirish...",
      watch: "Ko'rishni boshlash",
      premiere: "PREMYERA",
    },

    EN: {
      search: "Search...",
      watch: "Start Watching",
      premiere: "PREMIERE",
    },

    RU: {
      search: "Поиск...",
      watch: "Начать просмотр",
      premiere: "ПРЕМЬЕРА",
    },

    DE: {
      search: "Suchen...",
      watch: "Jetzt ansehen",
      premiere: "PREMIERE",
    },

    TR: {
      search: "Ara...",
      watch: "İzlemeye başla",
      premiere: "PREMIER",
    },
  };

  const banners = [
    {
      title: {
        UZ: "Masumiyat muzeyi",
        EN: "Museum of Innocence",
        RU: "Музей невинности",
        DE: "Museum der Unschuld",
        TR: "Masumiyet Müzesi",
      },

      rating: "7.6",

      year: "2026",

      country: {
        UZ: "Turkiya",
        EN: "Turkey",
        RU: "Турция",
        DE: "Türkei",
        TR: "Türkiye",
      },

      genre: {
        UZ: "Drama",
        EN: "Drama",
        RU: "Драма",
        DE: "Drama",
        TR: "Drama",
      },

      age: "+18",

      image:
        "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1600&auto=format&fit=crop",

      desc: {
        UZ: "Istanbuldagi sevgi va murakkab munosabatlar haqida ta’sirli hikoya.",
        EN: "A touching story about love and complicated relationships in Istanbul.",
        RU: "Трогательная история любви и сложных отношений.",
        DE: "Eine emotionale Geschichte über Liebe und Beziehungen.",
        TR: "İstanbul’da geçen etkileyici aşk hikayesi.",
      },
    },

    {
      title: {
        UZ: "Tungi Qochish",
        EN: "Night Escape",
        RU: "Ночной побег",
        DE: "Nachtflucht",
        TR: "Gece Kaçışı",
      },

      rating: "8.1",

      year: "2025",

      country: {
        UZ: "AQSH",
        EN: "USA",
        RU: "США",
        DE: "USA",
        TR: "ABD",
      },

      genre: {
        UZ: "Jangari",
        EN: "Action",
        RU: "Боевик",
        DE: "Action",
        TR: "Aksiyon",
      },

      age: "+16",

      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop",

      desc: {
        UZ: "Katta shahardagi xavfli qochish voqealari.",
        EN: "Dangerous escape events in a huge city.",
        RU: "Опасные побеги в большом городе.",
        DE: "Gefährliche Flucht in einer Großstadt.",
        TR: "Büyük şehirde tehlikeli kaçış hikayesi.",
      },
    },

    {
      title: {
        UZ: "Qorong'u Sukut",
        EN: "Dark Silence",
        RU: "Тёмная тишина",
        DE: "Dunkle Stille",
        TR: "Karanlık Sessizlik",
      },

      rating: "7.9",

      year: "2024",

      country: {
        UZ: "Koreya",
        EN: "Korea",
        RU: "Корея",
        DE: "Korea",
        TR: "Kore",
      },

      genre: {
        UZ: "Triller",
        EN: "Thriller",
        RU: "Триллер",
        DE: "Thriller",
        TR: "Gerilim",
      },

      age: "+18",

      image:
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1600&auto=format&fit=crop",

      desc: {
        UZ: "Sirli hodisalar va qorong‘u sarguzasht.",
        EN: "Mysterious events and dark adventure.",
        RU: "Таинственные события и мрачные приключения.",
        DE: "Mysteriöse Ereignisse und dunkles Abenteuer.",
        TR: "Gizemli olaylar ve karanlık macera.",
      },
    },
  ];

  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        onSearch(query);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((p) => (p + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const active = banners[current];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-5">
      <div className="flex items-center gap-2 mb-5">

        <input type="text"
          placeholder={placeholder || text[currentLang]?.search}
          className="flex-1 input input-bordered input-primary rounded-2xl h-14"
          value={query}
          onChange={(e) => setQuery(e.target.value)} />

        <button onClick={() => onSearch(query)}
          className="btn btn-primary rounded-2xl h-14 px-4">
          <SearchIcon size={20} />
        </button>

      </div>

      {/* BANNER */}
      <div className="relative overflow-hidden rounded-[35px] pb-85 h-[250px] sm:h-[450px] group">

        {/* IMAGE */}
        <img src={active.image} alt="banner"
          className="absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-700" />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-base-300/70" />

        {/* BLUR */}
        <div className="absolute inset-0 backdrop-blur-[1px]" />

        {/* CONTENT */}
        <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-10">

          {/* TOP */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">

              <span className="bg-base-100 text-primary text-xs sm:text-sm font-bold px-3 py-2 rounded-lg shadow-lg">
                {text[currentLang]?.premiere}
              </span>

              <span className="bg-primary text-primary-content text-xs sm:text-sm font-bold px-3 py-2 rounded-lg shadow-lg">
                {active.rating}
              </span>

            </div>

            <button onClick={() => setMuted(!muted)}
              className="w-12 h-12 rounded-full border cursor-pointer border-base-content/20 flex items-center justify-center backdrop-blur-md bg-base-100/20 text-base-content hover:scale-110 transition-all">
              <Volume2 size={20} className={muted ? "opacity-50" : "opacity-100"} />
            </button>

          </div>

          {/* CENTER */}
          <div className="max-w-2xl animate-[fadeIn_.6s_ease]">

            <h1 className="text-3xl sm:text-6xl font-bold text-base-content mb-4">
              {active.title[currentLang]}
            </h1>

            <div className="flex flex-wrap gap-2 mb-5">
              {[
                active.year,
                active.country[currentLang],
                active.genre[currentLang],
                active.age,
              ].map((i) => (
                <span key={i}
                  className="bg-base-100/20 backdrop-blur-md px-4 py-2 rounded-xl text-base-content text-sm font-semibold border border-base-content/10">
                  {i}
                </span>
              ))}
            </div>

            <p className="text-base-content/80 text-sm sm:text-lg leading-relaxed max-w-xl line-clamp-3">
              {active.desc[currentLang]}
            </p>

            <button onClick={() => {
              setQuery(active.title.EN);
              onSearch(active.title.EN);
            }}
              className="mt-6 bg-primary cursor-pointer mb-6 hover:opacity-90 transition-all text-primary-content font-bold px-8 sm:px-14 py-4 rounded-full flex items-center gap-2 hover:scale-105 shadow-xl">
              <Play size={18} fill="currentColor" />
              {text[currentLang]?.watch}
            </button>

          </div>

          {/* DOTS */}
          <div className="flex items-center justify-center none gap-3">
            {banners.map((_, i) => (
              <button key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all cursor-pointer rounded-full ${current === i
                  ? "w-5 h-5 border-2 border-primary"
                  : "w-3 h-3 bg-base-content/40"
                  }`} />
            ))}
          </div>
        </div>

        {/* LEFT */}
        <button onClick={() =>
          setCurrent((p) => (p === 0 ? banners.length - 1 : p - 1))
        }
          className="absolute bottom-6 right-24 w-14 h-14 rounded-full bg-base-100/20 backdrop-blur-md flex items-center justify-center text-base-content hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
          <ChevronLeft size={28} />
        </button>

        {/* RIGHT */}
        <button onClick={() =>
          setCurrent((p) => (p + 1) % banners.length)
        }
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-base-100/20 backdrop-blur-md flex items-center justify-center text-base-content hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
          <ChevronRight size={28} />
        </button>

      </div>

      {/* ANIMATION */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
}