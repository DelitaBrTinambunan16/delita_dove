import { useState, useEffect } from "react";
import { FaSearch, FaBullhorn, FaGift, FaEnvelope } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import customersData from "../data/customers";

export default function Campaign() {
  const [searchTerm, setSearchTerm] = useState("");
  const [promoFilter, setPromoFilter] = useState("All");
  const [giveawayFilter, setGiveawayFilter] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, promoFilter, giveawayFilter]);

  // Deterministically generate campaign participation per customer
  const customerCampaigns = customersData.map((customer, idx) => {
    let campaignDiikuti = "-";
    let giveaway = "Tidak";
    let emailSub = "Tidak";
    let statusPromo = "Tidak Pernah"; // Aktif / Kedaluwarsa / Tidak Pernah

    if (idx % 5 === 0) {
      campaignDiikuti = "Wedding Promo H-1 Hari";
      giveaway = "Ya";
      emailSub = "Ya";
      statusPromo = "Aktif";
    } else if (idx % 5 === 1) {
      campaignDiikuti = "Summer Wedding Giveaway";
      giveaway = "Ya";
      emailSub = "Ya";
      statusPromo = "Aktif";
    } else if (idx % 5 === 2) {
      campaignDiikuti = "Flash Sale Decoration Bundle";
      giveaway = "Tidak";
      emailSub = "Tidak";
      statusPromo = "Kedaluwarsa";
    } else if (idx % 5 === 3) {
      campaignDiikuti = "Referral Program Launch";
      giveaway = "Tidak";
      emailSub = "Ya";
      statusPromo = "Aktif";
    } else {
      if (idx === 4) {
        campaignDiikuti = "Loyalty Program Update";
        giveaway = "Tidak";
        emailSub = "Ya";
        statusPromo = "Aktif";
      } else if (idx === 9) {
        campaignDiikuti = "VIP Member Exclusive";
        giveaway = "Tidak";
        emailSub = "Ya";
        statusPromo = "Aktif";
      } else if (idx === 14) {
        campaignDiikuti = "Birthday Month Discount";
        giveaway = "Tidak";
        emailSub = "Ya";
        statusPromo = "Aktif";
      } else {
        campaignDiikuti = "-";
        giveaway = "Tidak";
        emailSub = "Tidak";
        statusPromo = "Tidak Pernah";
      }
    }

    return {
      customerId: customer.customerId,
      customerName: customer.customerName,
      campaignDiikuti,
      giveaway,
      emailSub,
      statusPromo,
    };
  });

  // Apply search & filters
  const filteredData = customerCampaigns.filter((item) => {
    const matchesSearch =
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPromo = promoFilter === "All" || item.statusPromo === promoFilter;
    const matchesGiveaway = giveawayFilter === "All" || item.giveaway === giveawayFilter;

    return matchesSearch && matchesPromo && matchesGiveaway;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentCampaigns = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPromoBadgeColor = (status) => {
    switch (status) {
      case "Aktif":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Kedaluwarsa":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "Tidak Pernah":
        return "bg-gray-100 text-gray-500 border-gray-200";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  return (
    <div className="p-8 relative font-poppins bg-[#F9F7F5] min-h-screen">
      {/* Header */}
      <PageHeader
        title="Campaign Customer"
        description="Pantau partisipasi giveaway, subskripsi email, dan status promosi per customer"
      />

      {/* Table Wrapper */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
        
        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Search input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Cari nama atau ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-emerald-100 transition-all text-sm font-poppins"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Status Promo Filter */}
            <select
              value={promoFilter}
              onChange={(e) => setPromoFilter(e.target.value)}
              className="w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] bg-gray-50 font-medium text-gray-600 font-poppins"
            >
              <option value="All">Semua Status Promo</option>
              <option value="Aktif">Aktif</option>
              <option value="Kedaluwarsa">Kedaluwarsa</option>
              <option value="Tidak Pernah">Tidak Pernah</option>
            </select>

            {/* Giveaway Filter */}
            <select
              value={giveawayFilter}
              onChange={(e) => setGiveawayFilter(e.target.value)}
              className="w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] bg-gray-50 font-medium text-gray-600 font-poppins"
            >
              <option value="All">Semua Giveaway</option>
              <option value="Ya">Ya</option>
              <option value="Tidak">Tidak</option>
            </select>

            <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:block">
              {filteredData.length} data customer
            </span>
          </div>
        </div>

        {/* Campaign Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left font-poppins">
            <thead className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
              <tr>
                <th className="px-6 py-4 font-semibold">ID Customer</th>
                <th className="px-6 py-4 font-semibold">Nama Lengkap</th>
                <th className="px-6 py-4 font-semibold">Campaign Diikuti</th>
                <th className="px-6 py-4 font-semibold text-center">Giveaway Participation</th>
                <th className="px-6 py-4 font-semibold text-center">Email Subscription</th>
                <th className="px-6 py-4 font-semibold text-center">Status Promo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentCampaigns.length > 0 ? (
                currentCampaigns.map((item) => (
                  <tr key={item.customerId} className="hover:bg-gray-50/50 transition-colors">
                    {/* ID Customer */}
                    <td className="px-6 py-5 font-semibold text-gray-500 font-mono text-xs">
                      {item.customerId}
                    </td>
                    {/* Nama Lengkap */}
                    <td className="px-6 py-5 font-bold text-gray-800">
                      {item.customerName}
                    </td>
                    {/* Campaign Diikuti */}
                    <td className="px-6 py-5 text-gray-600">
                      <div className="flex items-center gap-2">
                        {item.campaignDiikuti !== "-" && (
                          <FaBullhorn className="text-primary-dark/40" size={12} />
                        )}
                        <span>{item.campaignDiikuti}</span>
                      </div>
                    </td>
                    {/* Giveaway Participation */}
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                          item.giveaway === "Ya"
                            ? "bg-amber-100 text-amber-700 border-amber-200"
                            : "bg-gray-100 text-gray-400 border-gray-200"
                        }`}
                      >
                        {item.giveaway === "Ya" ? (
                          <>
                            <FaGift size={10} className="text-amber-500" /> Ya
                          </>
                        ) : (
                          "Tidak"
                        )}
                      </span>
                    </td>
                    {/* Email Subscription */}
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                          item.emailSub === "Ya"
                            ? "bg-sky-100 text-sky-700 border-sky-200"
                            : "bg-gray-100 text-gray-400 border-gray-200"
                        }`}
                      >
                        {item.emailSub === "Ya" ? (
                          <>
                            <FaEnvelope size={10} className="text-sky-500" /> Ya
                          </>
                        ) : (
                          "Tidak"
                        )}
                      </span>
                    </td>
                    {/* Status Promo */}
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-block text-[11.5px] font-bold px-3 py-1 rounded-full border ${getPromoBadgeColor(
                          item.statusPromo
                        )}`}
                      >
                        {item.statusPromo}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data kampanye yang sesuai filter
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
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} hingga {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} data customer
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
