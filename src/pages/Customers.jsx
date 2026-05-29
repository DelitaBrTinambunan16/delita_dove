import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaChevronRight, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import customersData from "../data/customers.json";

export default function Customers() {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [loyaltyFilter, setLoyaltyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, loyaltyFilter, statusFilter]);

  const getCity = (address) => {
    if (!address) return "-";
    const parts = address.split(",");
    return parts[parts.length - 1].trim();
  };

  // ✅ FIX: Tambahkan null-safe di baris nameMatch & emailMatch
  const filteredCustomers = customersData.filter((customer) => {
    const nameMatch = (customer.customerName || "").toLowerCase().includes((searchTerm || "").toLowerCase());
    const emailMatch = (customer.email || "").toLowerCase().includes((searchTerm || "").toLowerCase());
    const matchesSearch = nameMatch || emailMatch;
    const matchesLoyalty = loyaltyFilter === "All" || customer.loyalty === loyaltyFilter;
    
    let matchesStatus = true;
    if (statusFilter !== "All") {
      if (statusFilter === "Aktif") {
        matchesStatus = customer.status === "Active";
      } else if (statusFilter === "Tidak Aktif") {
        matchesStatus = customer.status === "Inactive";
      }
    }

    return matchesSearch && matchesLoyalty && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const currentCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getLoyaltyBadgeColor = (loyalty) => {
    switch (loyalty) {
      case "Platinum": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Gold": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Silver": return "bg-slate-100 text-slate-700 border-slate-200";
      case "Bronze": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status) => {
    return status === "Active"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-rose-100 text-rose-700 border-rose-200";
  };

  const getComplaintsBadge = (complaints) => {
    if (!complaints || complaints.length === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-gray-50 text-gray-500 border border-gray-100">
          <FaCheckCircle className="text-gray-400" size={10} /> Tidak ada
        </span>
      );
    }
    const pendingCount = complaints.filter(c => !c.resolved).length;
    if (pendingCount > 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">
          <FaExclamationTriangle className="text-amber-500" size={10} /> {complaints.length} Komplain ({pendingCount} pending)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
        <FaCheckCircle className="text-emerald-500" size={10} /> {complaints.length} Selesai
      </span>
    );
  };

  return (
    <div className="p-8 relative font-poppins bg-[#F9F7F5] min-h-screen">
      <PageHeader
        title="Data Customer"
        description="Kelola data operasional customer, tingkat membership, status aktif, dan catatan admin"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
        <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-emerald-100 transition-all text-sm font-poppins"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={loyaltyFilter}
              onChange={(e) => setLoyaltyFilter(e.target.value)}
              className="w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] bg-gray-50 font-medium text-gray-600 font-poppins"
            >
              <option value="All">Semua Membership</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] bg-gray-50 font-medium text-gray-600 font-poppins"
            >
              <option value="All">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>

            <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:block">
              {filteredCustomers.length} pelanggan
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left font-poppins">
            <thead className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
              <tr>
                <th className="px-6 py-4 font-semibold">ID Customer</th>
                <th className="px-6 py-4 font-semibold">Nama Lengkap</th>
                <th className="px-6 py-4 font-semibold">No. HP</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Kota</th>
                <th className="px-6 py-4 font-semibold text-center">Level Membership</th>
                <th className="px-6 py-4 font-semibold text-center">Status Aktif</th>
                <th className="px-6 py-4 font-semibold">Riwayat Komplain</th>
                <th className="px-6 py-4 font-semibold">Catatan Admin</th>
                <th className="px-6 py-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentCustomers.length > 0 ? (
                currentCustomers.map((customer) => (
                  <tr
                    key={customer.customerId}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/customers/${customer.customerId}`, { state: { customer } })}
                  >
                    <td className="px-6 py-5 font-semibold text-gray-500 font-mono text-xs">{customer.customerId}</td>
                    <td className="px-6 py-5 font-bold text-gray-800 group-hover:text-[#10B981] transition-colors">{customer.customerName}</td>
                    <td className="px-6 py-5 text-gray-500 font-mono text-[13px]">{customer.phone}</td>
                    <td className="px-6 py-5 text-gray-500 font-light truncate max-w-[160px]">{customer.email}</td>
                    <td className="px-6 py-5 text-gray-600">{getCity(customer.address)}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${getLoyaltyBadgeColor(customer.loyalty)}`}>
                        {customer.loyalty}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadgeColor(customer.status)}`}>
                        {customer.status === "Active" ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </td>
                    <td className="px-6 py-5">{getComplaintsBadge(customer.complaints)}</td>
                    <td className="px-6 py-5 max-w-[200px] truncate text-gray-400 font-light text-[12px]">{customer.adminNotes || "-"}</td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 text-gray-400 group-hover:bg-emerald-50 group-hover:text-[#10B981] group-hover:border-emerald-100 transition-all">
                        <FaChevronRight size={9} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                    Tidak ada customer yang sesuai filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length > 0 && (
          <div className="p-4 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 font-poppins">
            <span className="text-sm text-gray-500">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} hingga {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} dari {filteredCustomers.length} pelanggan
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}