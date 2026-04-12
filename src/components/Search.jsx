import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";

export default function Search({
  query,
  setQuery,
  onSearch,
  placeholder,
  currentLang = "UZ"
}) {
  const [activeFilter, setActiveFilter] = useState("");

  const filterLabels = {
    EN: ["New Movies", "Popular", "Old Movies"],
    UZ: ["Yangi filmlar", "Mashhur", "Eski filmlar"],
    RU: ["Новые фильмы", "Популярные", "Старые фильмы"],
    DE: ["Neue Filme", "Beliebt", "Alte Filme"],
    TR: ["Yeni Filmler", "Popüler", "Eski Filmler"],
  };

  const filters = filterLabels[currentLang] || filterLabels.UZ;

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setQuery("");
    onSearch("", filter);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim() || activeFilter) {
        onSearch(query, activeFilter);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [query, activeFilter]);

  return (
    <div className="w-full p-3">
      <div className="flex gap-2 mb-3">

        <input type="text"
          placeholder={placeholder || "Qidirish..."}
          className="flex-1 input input-bordered input-primary mb-3 rounded-xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}/>

        <button onClick={() => onSearch(query, activeFilter)}
          className="btn btn-primary w-12 flex items-center justify-center">
          <SearchIcon size={18}/>
        </button>

      </div>

      <div className="flex gap-2 justify-center overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`whitespace-nowrap btn :btn
              ${activeFilter === filter ? "btn-primary" : "btn-outline"}`}>
            {filter}
          </button>
        ))}

      </div>

    </div>
  );
}