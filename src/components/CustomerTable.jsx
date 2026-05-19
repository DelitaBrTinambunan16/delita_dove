import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Avatar from "./Avatar";

export default function CustomerTable({ currentCustomers, currentPage, totalPages, onPrevPage, onNextPage }) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-stone-100 overflow-hidden mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] text-stone-400 uppercase tracking-widest border-b border-stone-50">
              <th className="px-8 py-5 font-bold">ID Pelanggan</th>
              <th className="px-8 py-5 font-bold">Nama Pasangan</th>
              <th className="px-8 py-5 font-bold">Kontak</th>
              <th className="px-8 py-5 font-bold text-center">Loyalty Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {currentCustomers.map((item) => (
              <tr key={item.customerId} className="hover:bg-stone-50/50 transition-colors group">
                <td className="px-8 py-5 font-bold text-stone-300 text-xs tracking-wider">#{item.customerId}</td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <Avatar name={item.customerName} size="md" />
                    <div>
                      <div className="font-bold text-stone-800">{item.customerName}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5 uppercase tracking-tighter">Verified Couple</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="text-sm font-medium text-stone-600">{item.email}</div>
                  <div className="text-xs text-stone-400">{item.phone}</div>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className={`px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase ${
                    item.loyalty === 'Gold' ? 'bg-amber-50 text-amber-600'
                    : item.loyalty === 'Silver' ? 'bg-stone-100 text-stone-600'
                    : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {item.loyalty}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="p-6 bg-stone-50/30 border-t border-stone-50 flex justify-between items-center">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={onPrevPage}
            disabled={currentPage === 1}
            className="p-2 border border-stone-200 rounded-lg bg-white hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <FaChevronLeft className="text-stone-400 text-xs" />
          </button>
          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="p-2 border border-stone-200 rounded-lg bg-white hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <FaChevronRight className="text-stone-400 text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}