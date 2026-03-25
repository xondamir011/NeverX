import { useState, useEffect } from "react";

export default function Search({ query, setQuery, onSearch, placeholder, currentLang = "UZ" }) {

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
    setQuery(filter);              
    onSearch(filter);      
  };

   useEffect(() => {
    const timeout = setTimeout (() => {
      if(query.trim()) {
        onSearch(query, activeFilter);
      }
    }, 500)
     return () => clearTimeout(timeout);
   }, [query, activeFilter, onSearch])


  return (
    <div className="w-full p-3">
      <div className="flex gap-3 mb-3">
     
        <input type="text" placeholder={placeholder || "Qidirish..."} className="flex-1 text-xl font-semibold input input-primary p-6 rounded outline-none" 
          value={query} onChange={(e) => setQuery(e.target.value)}/> 

        <button onClick={() => onSearch(query, activeFilter)} className="btn btn-primary p-6 rounded text-white cursor-pointer">🔍</button>
     </div>

      <div className="flex gap-8 p-3 justify-center flex-wrap">
        {filters.map((filter) => (
          <button key={filter} onClick={() => handleFilterClick(filter)}
            className={`px-4 py-2 rounded-full cursor-pointer btn btn-primary ${
              activeFilter === filter
                ? "bg-primary text-white"
                : "bg-gray-800 text-base-content hover:badge-ghost"
            }`}>
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}