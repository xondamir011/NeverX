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

  const filters = [
    { key: "All", label: { UZ: "Hammasi", EN: "All", RU: "Все", DE: "Alle", TR: "Tümü" } },
    { key: "series", label: { UZ: "Serial", EN: "Series", RU: "Сериал", DE: "Serie", TR: "Dizi" } },
    { key: "horror", label: { UZ: "Qo'rqinchli", EN: "Horror", RU: "Ужас", DE: "Horror", TR: "Korku" } },
    { key: "drama", label: { UZ: "Sevgi", EN: "Doramma", RU: "Драма", DE: "Drama", TR: "Drama" } },
    { key: "comedy", label: { UZ: "Kulgili", EN: "Comedy", RU: "Комедия", DE: "Komödie", TR: "Komedi" } },
  ];

  const handleFilterClick = (filterkey) => {
    setActiveFilter(filterkey);
    setQuery("");
    onSearch("", filterkey);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(query, activeFilter);
    }, 500);

    return () => clearTimeout(timeout);
  }, [query, activeFilter]);

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-5 py-3">
      <div className="flex items-center gap-2 mb-3">

        <input
          type="text"
          placeholder={placeholder || "Qidirish..."}
          className="flex-1 input input-bordered input-primary rounded-xl h-11 sm:h-12"
          value={query}
          onChange={(e) => setQuery(e.target.value)}/>

        <button onClick={() => onSearch(query, activeFilter)}
          className="btn btn-primary rounded-xl h-11 sm:h-12 px-3 sm:px-4 flex items-center justify-center">
          <SearchIcon size={18} />
        </button>

      </div>

      {/* CATEGORY BUTTONS */}
      <div className="flex justify-center gap-2 overflow-x-auto sm:flex-wrap pb-2">
        {filters.map((filter) => (
          <button key={filter.key}
            onClick={() => handleFilterClick(filter.key)}
            className={`whitespace-nowrap px-2 py-3 mt-3 rounded-xl font-semibold cursor-pointer text-base-content transition-all

          ${activeFilter === filter.key
                ? "bg-base-200"
                : "bg-base-200"
              } `}>
            {filter.label[currentLang] || filter.label.EN}
          </button>
        ))}
      </div>
    </div>
  );
}