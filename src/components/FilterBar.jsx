import { FaSearch } from "react-icons/fa";

export default function FilterBar({ searchQuery, setSearchQuery, filterLoyalty, setFilterLoyalty }) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-stone-100 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="relative w-full sm:w-80">
        <input 
          type="text" 
          placeholder="Cari pasangan..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-100 outline-none focus:border-emerald-500 transition-all text-sm"
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 text-xs" />
      </div>
      <select 
        value={filterLoyalty}
        onChange={(e) => setFilterLoyalty(e.target.value)}
        className="w-full sm:w-auto border border-stone-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 bg-stone-50 font-medium text-stone-600"
      >
        <option value="All">Semua Status Loyalty</option>
        <option value="Bronze">Bronze Client</option>
        <option value="Silver">Silver Client</option>
        <option value="Gold">Gold Client</option>
      </select>
    </div>
  );
}
