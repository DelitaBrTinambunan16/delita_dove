import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaChevronRight,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import { usersAPI } from "../services/usersAPI";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

//  Helper: ambil inisial dari nama //
function getInitials(name = "") {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

//  Helper: warna avatar fallback berdasarkan loyalty //
function getAvatarColor(loyalty) {
  switch (loyalty) {
    case "Platinum": return "bg-purple-100 text-purple-700";
    case "Gold":     return "bg-amber-100 text-amber-700";
    case "Silver":   return "bg-slate-100 text-slate-600";
    case "Bronze":   return "bg-orange-100 text-orange-700";
    default:         return "bg-gray-100 text-gray-500";
  }
}

export default function Customers() {
  const navigate = useNavigate();

  // --- PERUBAHAN: state data dari Supabase ---
  const [customersData, setCustomersData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [searchTerm, setSearchTerm]       = useState("");
  const [loyaltyFilter, setLoyaltyFilter] = useState("All");
  const [statusFilter, setStatusFilter]   = useState("All");
  const [currentPage, setCurrentPage]     = useState(1);

  const itemsPerPage = 10;

  // --- PERUBAHAN: fetch dari Supabase saat pertama render ---
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingData(true);
        setFetchError("");
        const data = await usersAPI.fetchUsers();
        setCustomersData(data);
      } catch (err) {
        setFetchError("Gagal memuat data customer dari server.");
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, loyaltyFilter, statusFilter]);

  const getCity = (address) => {
    if (!address) return "-";
    const parts = address.split(",");
    return parts[parts.length - 1].trim();
  };

  const filteredCustomers = useMemo(() => {
    return customersData.filter((customer) => {
      // --- PERUBAHAN: support field name (Supabase) dan customerName (JSON lama) ---
      const name  = customer.name ?? customer.customerName ?? "";
      const email = customer.email ?? "";
      const keyword = searchTerm.toLowerCase();

      const matchesSearch =
        name.toLowerCase().includes(keyword) ||
        email.toLowerCase().includes(keyword);

      const matchesLoyalty =
        loyaltyFilter === "All" || customer.loyalty === loyaltyFilter;

      const matchesStatus =
        statusFilter === "All"
          ? true
          : statusFilter === "Aktif"
          ? customer.status === "Active"
          : customer.status === "Inactive";

      return matchesSearch && matchesLoyalty && matchesStatus;
    });
  }, [searchTerm, loyaltyFilter, statusFilter, customersData]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const currentCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const getLoyaltyBadgeColor = (loyalty) => {
    switch (loyalty) {
      case "Platinum": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Gold":     return "bg-amber-100 text-amber-700 border-amber-200";
      case "Silver":   return "bg-slate-100 text-slate-700 border-slate-200";
      case "Bronze":   return "bg-orange-100 text-orange-700 border-orange-200";
      default:         return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status) =>
    status === "Active"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-rose-100 text-rose-700 border-rose-200";

  // --- PERUBAHAN: complaint sekarang string dari Supabase, bukan array ---
  const getComplaintsBadge = (complaint) => {
    if (!complaint || complaint === "Tidak Ada" || complaint === "") {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-gray-50 text-gray-500 border border-gray-100">
          <FaCheckCircle size={10} /> Tidak ada
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
        <FaExclamationTriangle size={10} /> Ada komplain
      </span>
    );
  };

  return (
    <div className="p-8 font-poppins bg-[#F9F7F5] min-h-screen">
      <PageHeader
        title="Data Customer"
        description="Kelola data customer, membership, status, dan aktivitas"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-4 overflow-hidden">

        {/* ── FILTER ── */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-3 justify-between">

          <div className="relative w-full sm:w-80">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama atau email..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:border-emerald-500 text-sm"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-300" />
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              value={loyaltyFilter}
              onChange={(e) => setLoyaltyFilter(e.target.value)}
              className="px-4 py-2.5 border rounded-xl bg-gray-50 text-sm outline-none focus:border-emerald-500"
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
              className="px-4 py-2.5 border rounded-xl bg-gray-50 text-sm outline-none focus:border-emerald-500"
            >
              <option value="All">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>

            <span className="self-center text-xs text-gray-400 hidden sm:block">
              {filteredCustomers.length} customer
            </span>
          </div>
        </div>

        {/* ── LOADING STATE ── */}
        {loadingData && (
          <div className="py-12 text-center text-gray-400 text-sm">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto mb-3"></div>
            Memuat data customer...
          </div>
        )}

        {/* ── ERROR STATE ── */}
        {!loadingData && fetchError && (
          <div className="py-12 text-center text-red-400 text-sm">{fetchError}</div>
        )}

        {/* ── TABLE ── */}
        {!loadingData && !fetchError && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-400 uppercase border-b bg-gray-50/50">
                <tr>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">HP</th>
                  <th className="p-4 text-left">Kota</th>
                  <th className="p-4 text-left">Membership</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Komplain</th>
                  <th className="p-4 text-left">Catatan</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {currentCustomers.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/customers/${c.id}`, { state: { c } })}
                    className="hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar size="default">
                          <AvatarImage src={c.profilePhoto} alt={c.name} />
                          <AvatarFallback className={`text-xs font-bold ${getAvatarColor(c.loyalty)}`}>
                            {getInitials(c.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{c.name}</p>
                          <p className="text-xs text-gray-400">{c.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-gray-600 text-sm">{c.phone || "-"}</td>
                    <td className="p-4 text-gray-600 text-sm">{c.city || getCity(c.address)}</td>

                    <td className="p-4">
                      <span className={`px-2 py-1 rounded border text-xs font-semibold ${getLoyaltyBadgeColor(c.loyalty)}`}>
                        {c.loyalty || "Bronze"}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-1 rounded border text-xs font-semibold ${getStatusBadgeColor(c.status)}`}>
                        {c.status === "Active" ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </td>

                    <td className="p-4">{getComplaintsBadge(c.complaint)}</td>

                    <td className="p-4 text-xs text-gray-400 truncate max-w-[150px]">
                      {c.promo_code || "-"}
                    </td>

                    <td className="p-4 text-center">
                      <FaChevronRight className="mx-auto text-gray-300" />
                    </td>
                  </tr>
                ))}

                {currentCustomers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                      Tidak ada customer yang sesuai filter
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── PAGINATION ── */}
        {!loadingData && filteredCustomers.length > 0 && (
          <div className="p-4 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-sm text-gray-400">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} dari{" "}
              {filteredCustomers.length} customer
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
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