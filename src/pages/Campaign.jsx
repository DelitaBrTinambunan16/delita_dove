import { useState, useEffect } from "react";
import { FaSearch, FaBullhorn, FaGift, FaEnvelope } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import customersData from "../data/customers";
import { promoOffers } from "../data/promoOffers";
import { isLoggedIn } from "../lib/auth";

const campaignNameMap = {
  "1": "Diskon 20% Paket Dekorasi",
  "2": "Bonus Undangan Digital",
  "3": "Free Gift Card",
  "4": "VIP Tamu Eksklusif",
  "5": "Paket Honeymoon Spesial",
  "6": "Cashback 1 Juta",
};

function mapCampaignName(code) {
  if (!code || code === "-") return "-";
  return campaignNameMap[code] || `Promo #${code}`;
}

function getStatusPromo(campaignName, emailSub) {
  if (campaignName === "-") return "Tidak Pernah";
  return emailSub === "Ya" ? "Aktif" : "Kedaluwarsa";
}

function getPromoBadgeColor(status) {
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
}

export default function Campaign() {
  const [searchTerm, setSearchTerm] = useState("");
  const [promoFilter, setPromoFilter] = useState("All");
  const [giveawayFilter, setGiveawayFilter] = useState("All");
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, promoFilter, giveawayFilter]);

  const customerCampaigns = customersData.map((customer) => {
    const campaignName = mapCampaignName(customer.campaignDiikuti);
    return {
      customerId: customer.customerId,
      customerName: customer.customerName,
      campaignDiikuti: campaignName,
      giveaway: customer.giveaway || "Tidak",
      emailSub: customer.emailSub || "Tidak",
      email: customer.email,
      statusPromo: getStatusPromo(campaignName, customer.emailSub),
    };
  });

  const filteredData = customerCampaigns.filter((item) => {
    const matchesSearch =
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPromo = promoFilter === "All" || item.statusPromo === promoFilter;
    const matchesGiveaway = giveawayFilter === "All" || item.giveaway === giveawayFilter;

    return matchesSearch && matchesPromo && matchesGiveaway;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentCampaigns = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) {
      setPromoMessage("Masukkan kode promo terlebih dahulu.");
      return;
    }
    if (!isLoggedIn()) {
      setPromoMessage("Silakan login terlebih dahulu untuk menggunakan promo.");
      return;
    }
    setPromoMessage(`Kode promo ${promoCode.trim().toUpperCase()} berhasil diterapkan.`);
    setPromoCode("");
  };

  return (
    <div className="p-8 relative font-poppins bg-[#F9F7F5] min-h-screen">
      <PageHeader
        title="Campaign Customer"
        description="Pantau partisipasi giveaway, email subscription, dan promo bersama data customer yang sesuai admin."
      />

      <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {promoOffers.map((promo) => (
          <div key={promo.code} className="overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-sm">
            <div className="h-40 overflow-hidden">
              <img src={promo.image} alt={promo.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
            </div>
            <div className="p-4">
              <p className="text-[11px] uppercase tracking-[.24em] text-gray-500">{promo.code}</p>
              <h3 className="mt-2 text-base font-semibold text-gray-900">{promo.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{promo.description}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-50 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Cari nama atau ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-emerald-100 transition-all text-sm"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
            </div>

            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <select
                value={promoFilter}
                onChange={(e) => setPromoFilter(e.target.value)}
                className="w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] bg-gray-50 font-medium text-gray-600"
              >
                <option value="All">Semua Status Promo</option>
                <option value="Aktif">Aktif</option>
                <option value="Kedaluwarsa">Kedaluwarsa</option>
                <option value="Tidak Pernah">Tidak Pernah</option>
              </select>

              <select
                value={giveawayFilter}
                onChange={(e) => setGiveawayFilter(e.target.value)}
                className="w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] bg-gray-50 font-medium text-gray-600"
              >
                <option value="All">Semua Giveaway</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">
            <form onSubmit={handleApplyPromo} className="flex flex-col sm:flex-row items-stretch gap-3 w-full">
              <input
                type="text"
                placeholder={isLoggedIn() ? "Masukkan kode promo..." : "Login untuk menggunakan promo..."}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={!isLoggedIn()}
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-[#10B981] focus:ring-1 focus:ring-emerald-100 disabled:bg-gray-100 disabled:text-gray-400"
              />
              <button
                type="submit"
                disabled={!isLoggedIn()}
                className="rounded-xl bg-[#10B981] text-white px-4 py-2.5 text-sm font-semibold hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Terapkan Promo
              </button>
            </form>
            <div className="text-sm text-gray-500">
              {isLoggedIn()
                ? "Anda dapat menggunakan kode promo sekarang."
                : "Login terlebih dahulu untuk menggunakan promo dan mengelola langganan."}
            </div>
          </div>

          {promoMessage && (
            <p className="text-xs text-gray-600">{promoMessage}</p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
              <tr>
                <th className="px-6 py-4 font-semibold">ID Customer</th>
                <th className="px-6 py-4 font-semibold">Nama Lengkap</th>
                <th className="px-6 py-4 font-semibold">Campaign Diikuti</th>
                <th className="px-6 py-4 font-semibold text-center">Giveaway</th>
                <th className="px-6 py-4 font-semibold text-center">Email Subscription</th>
                <th className="px-6 py-4 font-semibold text-center">Status Promo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentCampaigns.length > 0 ? (
                currentCampaigns.map((item) => (
                  <tr key={item.customerId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 font-semibold text-gray-500 font-mono text-xs">{item.customerId}</td>
                    <td className="px-6 py-5 font-bold text-gray-800">{item.customerName}</td>
                    <td className="px-6 py-5 text-gray-600 flex items-center gap-2">
                      {item.campaignDiikuti !== "-" && <FaBullhorn className="text-[#10B981]" size={12} />}
                      <span>{item.campaignDiikuti}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.giveaway === "Ya" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-gray-100 text-gray-400 border-gray-200"}`}>
                        {item.giveaway === "Ya" ? (
                          <><FaGift size={10} className="text-amber-500" /> Ya</>
                        ) : (
                          "Tidak"
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {item.emailSub === "Ya" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 border border-sky-200 truncate max-w-[180px]">
                          <FaEnvelope size={10} className="text-sky-500" /> {item.email}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                          Belum terdaftar
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-block text-[11.5px] font-bold px-3 py-1 rounded-full border ${getPromoBadgeColor(item.statusPromo)}`}>{item.statusPromo}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Tidak ada data kampanye yang sesuai filter</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredData.length > 0 && (
          <div className="p-4 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-sm text-gray-500">Menampilkan {(currentPage - 1) * itemsPerPage + 1} hingga {Math.min((currentPage * itemsPerPage), filteredData.length)} dari {filteredData.length} data customer</span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Sebelumnya</button>
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Selanjutnya</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
