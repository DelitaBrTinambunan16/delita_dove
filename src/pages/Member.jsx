import { useMemo, useState } from "react";
import { FaSearch, FaUsers, FaStar, FaUserShield } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import customersData from "../data/customers.json";

function getMembershipBadge(loyalty) {
  const base = "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold";
  switch (loyalty) {
    case "Platinum":
      return <span className={`${base} bg-purple-100 text-purple-700 border border-purple-200`}>Platinum</span>;
    case "Gold":
      return <span className={`${base} bg-amber-100 text-amber-700 border border-amber-200`}>Gold</span>;
    case "Silver":
      return <span className={`${base} bg-slate-100 text-slate-700 border border-slate-200`}>Silver</span>;
    case "Bronze":
      return <span className={`${base} bg-orange-100 text-orange-700 border border-orange-200`}>Bronze</span>;
    default:
      return <span className={`${base} bg-gray-100 text-gray-500 border border-gray-200`}>{loyalty || "Tidak Aktif"}</span>;
  }
}

export default function Member() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return customersData.filter((customer) => {
      return (
        customer.customerName.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.customerId.toLowerCase().includes(query)
      );
    });
  }, [searchTerm]);

  return (
    <div className="p-8 relative font-poppins bg-[#F9F7F5] min-h-screen">
      <PageHeader
        title="Halaman Member"
        description="Lihat daftar member wedding, status loyalty, promo, dan email subscription yang sesuai data admin."
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
        <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Cari member berdasarkan nama, email, atau ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-emerald-100 transition-all text-sm"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:block">
            {filteredMembers.length} member tersedia
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
              <tr>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Nama</th>
                <th className="px-6 py-4 font-semibold">Membership</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Promo</th>
                <th className="px-6 py-4 font-semibold">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((customer) => (
                  <tr key={customer.customerId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 text-gray-600 font-mono text-xs">{customer.customerId}</td>
                    <td className="px-6 py-5 font-semibold text-gray-800">{customer.customerName}</td>
                    <td className="px-6 py-5">{getMembershipBadge(customer.loyalty)}</td>
                    <td className="px-6 py-5 text-gray-600 text-sm">{customer.email}</td>
                    <td className="px-6 py-5 text-gray-600 text-sm">{customer.campaignDiikuti === "-" ? "Tidak ada promo" : `Promo #${customer.campaignDiikuti}`}</td>
                    <td className="px-6 py-5 text-gray-600 text-sm inline-flex items-center gap-2">
                      <FaStar className="text-amber-500" size={12} /> {customer.rating?.toFixed(1) ?? "0.0"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Tidak ada member yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
