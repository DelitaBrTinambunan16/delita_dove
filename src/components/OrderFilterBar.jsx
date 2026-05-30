import { FaSearch } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OrderFilterBar({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filteredOrdersLength = 0,
}) {
  return (
    <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">

      {/* SEARCH */}
      <div className="relative w-full sm:w-80">
        <input
          type="text"
          placeholder="Cari pasangan atau ID order..."
          value={searchQuery || ""}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100 transition-all text-sm"
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
      </div>

      {/* FILTER + COUNT */}
      <div className="flex items-center gap-3 w-full sm:w-auto">

        <Select value={filterStatus || "All"} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-44 rounded-xl border-gray-200 bg-gray-50 text-sm font-medium text-gray-600">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="All">Semua Status</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:block">
          {filteredOrdersLength ?? 0} pesanan
        </span>

      </div>
    </div>
  );
}