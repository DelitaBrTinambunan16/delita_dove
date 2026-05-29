import { FaSearch } from "react-icons/fa";

export default function OrderFilterBar({ searchQuery, setSearchQuery, filterStatus, setFilterStatus, filteredOrdersLength }) {
  return (
    <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
      <div className="relative w-full sm:w-80">
        <input
          type="text"
          placeholder="Cari pasangan atau ID order..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-emerald-100 transition-all text-sm"
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] bg-gray-50 font-medium text-gray-600"
        >
          <option value="All">Semua Status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:block">
          {filteredOrdersLength} pesanan
        </span>
      </div>
    </div>
  );
}