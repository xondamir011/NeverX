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
  { key: "all", label: { UZ: "hammasi", EN: "all", RU: "все", DE: "alle", TR: "tümü" } },
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
  <div className="flex flex-row gap-2 mb-3">
    
    <input
      type="text"
      placeholder={placeholder || "Qidirish..."}
      className="flex-1 input input-bordered input-primary rounded-xl h-9 sm:h-11"
      value={query}
      onChange={(e) => setQuery(e.target.value)}/>

    <button onClick={() => onSearch(query, activeFilter)}
      className="btn btn-primary w-9 sm:w-11 h-9 sm:h-11 flex items-center justify-center p-0">
      <SearchIcon size={16} />
    </button>

  </div>

  {/* CATEGORY BUTTONS */}
  <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2">

    {filters.map((filter) => (
      <button
        key={filter.key}
        onClick={() => handleFilterClick(filter.key)}
        className={`whitespace-nowrap btn btn-lg sm:btn-md lg:btn-lg btn-primary
          ${activeFilter === filter.key ? "btn-primary text-white" : "btn-outline"}`}>
        {filter.label[currentLang] || filter.label.EN}
      </button>
    ))}

  </div>

</div>
  );
}