import { useState, useEffect } from "react";
import { FaSearch, FaStar, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import customersData from "../data/customers";

export default function Message() {
  const [searchTerm, setSearchTerm] = useState("");
  const [complaintFilter, setComplaintFilter] = useState("All"); // All / Ada / Tidak Ada

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, complaintFilter]);

  // Apply search & filter
  const filteredData = customersData.filter((customer) => {
    const matchesSearch =
      customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);

    const hasComplaints = customer.complaints && customer.complaints.length > 0;
    
    let matchesComplaint = true;
    if (complaintFilter === "Ada") {
      matchesComplaint = hasComplaints;
    } else if (complaintFilter === "Tidak Ada") {
      matchesComplaint = !hasComplaints;
    }

    return matchesSearch && matchesComplaint;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentMessages = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-8 relative font-poppins bg-[#F9F7F5] min-h-screen">
      {/* Header */}
      <PageHeader
        title="Inbox Pesan"
        description="Kelola inbox pesan, riwayat komplain, dan ulasan rating bintang dari customer"
      />

      {/* Table Wrapper */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
        
        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Search input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Cari berdasarkan nama, ID, atau No. HP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-emerald-100 transition-all text-sm font-poppins"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Complaint Filter */}
            <select
              value={complaintFilter}
              onChange={(e) => setComplaintFilter(e.target.value)}
              className="w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] bg-gray-50 font-medium text-gray-600 font-poppins"
            >
              <option value="All">Semua Pelanggan</option>
              <option value="Ada">Ada Komplain</option>
              <option value="Tidak Ada">Tidak Ada Komplain</option>
            </select>

            <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:block">
              {filteredData.length} pelanggan
            </span>
          </div>
        </div>

        {/* Messages Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left font-poppins">
            <thead className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
              <tr>
                <th className="px-6 py-4 font-semibold">ID Customer</th>
                <th className="px-6 py-4 font-semibold">Nama Lengkap</th>
                <th className="px-6 py-4 font-semibold">No. HP</th>
                <th className="px-6 py-4 font-semibold">Riwayat Komplain</th>
                <th className="px-6 py-4 font-semibold text-center">Rating/Review</th>
                <th className="px-6 py-4 font-semibold">Catatan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentMessages.length > 0 ? (
                currentMessages.map((customer) => {
                  const hasComplaints = customer.complaints && customer.complaints.length > 0;
                  return (
                    <tr key={customer.customerId} className="hover:bg-gray-50/50 transition-colors">
                      {/* ID Customer */}
                      <td className="px-6 py-5 font-semibold text-gray-500 font-mono text-xs">
                        {customer.customerId}
                      </td>
                      {/* Nama Lengkap */}
                      <td className="px-6 py-5 font-bold text-gray-800">
                        {customer.customerName}
                      </td>
                      {/* No. HP */}
                      <td className="px-6 py-5 text-gray-500 font-mono text-[13px]">
                        {customer.phone}
                      </td>
                      {/* Riwayat Komplain */}
                      <td className="px-6 py-5 max-w-[280px]">
                        {hasComplaints ? (
                          <div className="space-y-1.5">
                            {customer.complaints.map((c, index) => (
                              <div
                                key={index}
                                className={`text-[11px] px-2 py-1 rounded border flex items-start gap-1.5 ${
                                  c.resolved
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-100"
                                    : "bg-amber-50 text-amber-800 border-amber-100 font-medium"
                                }`}
                              >
                                {c.resolved ? (
                                  <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" size={10} />
                                ) : (
                                  <FaExclamationTriangle className="text-amber-500 mt-0.5 flex-shrink-0" size={10} />
                                )}
                                <div>
                                  <span className="font-semibold">[{c.date}]</span> {c.issue}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <FaCheckCircle className="text-emerald-500" size={10} /> Tidak ada komplain
                          </span>
                        )}
                      </td>
                      {/* Rating / Review */}
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-bold text-[11px]">
                          <FaStar className="text-amber-500" size={11} />
                          <span>{customer.rating ? customer.rating.toFixed(1) : "0.0"}</span>
                        </div>
                      </td>
                      {/* Catatan Admin */}
                      <td className="px-6 py-5 text-gray-400 font-light text-[12px] max-w-[200px] truncate">
                        {customer.adminNotes || "-"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Tidak ada pesan atau komplain yang sesuai filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {filteredData.length > 0 && (
          <div className="p-4 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 font-poppins">
            <span className="text-sm text-gray-500">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} hingga {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} pelanggan
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
