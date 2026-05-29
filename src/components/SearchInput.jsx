import { FaSearch } from "react-icons/fa";

export default function SearchInput() {
  return (
    <div className="relative hidden md:block">
      <input
        type="text"
        placeholder="Search..."
        className="w-48 pl-10 pr-3 py-1.5 rounded-lg bg-white border border-gray-200 outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-emerald-100 transition text-sm"
      />
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
    </div>
  );
}
