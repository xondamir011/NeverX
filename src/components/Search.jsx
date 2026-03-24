export default function Search({ query, setQuery, onSearch }) {
  return (
    <div className="p-3 flex gap-2">

      <input type="text" placeholder="Qidirish..." className="flex-1 p-2 rounded bg-gray-800 text-white outline-none" 
       value={query} onChange={(e) => setQuery(e.target.value)}/> 

      <button onClick={onSearch} className="bg-blue-500 px-4 rounded text-white cursor-pointer">🔍</button>
    </div>
  );
}