import { useState, useEffect, useMemo } from "react";
import {
  FaSearch,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPen,
  FaTrash,
} from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import customersData from "../data/customers.json";
import { supabase } from "../lib/supabaseClient";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

const emptyForm = {
  customerName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  loyalty: "Bronze",
  status: "Active",
  joinDate: "",
  adminNotes: "",
};

function getInitials(name = "") {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0]?.[0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(loyalty) {
  switch (loyalty) {
    case "Platinum": return "bg-purple-100 text-purple-700";
    case "Gold": return "bg-amber-100 text-amber-700";
    case "Silver": return "bg-slate-100 text-slate-600";
    case "Bronze": return "bg-orange-100 text-orange-700";
    default: return "bg-gray-100 text-gray-500";
  }
}

function normalizeCustomer(row) {
  return {
    id: row.id,
    customerId: row.customer_id || row.customerId,
    customerName: row.customer_name || row.customerName,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    loyalty: row.loyalty || "Bronze",
    status: row.status || "Active",
    joinDate: row.join_date || row.joinDate,
    adminNotes: row.admin_notes || row.adminNotes || "",
    complaints: row.complaints || [],
    profilePhoto: row.profilePhoto,
  };
}

function toPayload(form) {
  return {
    customer_name: form.customerName,
    email: form.email || null,
    phone: form.phone || null,
    address: form.address || null,
    city: form.city || null,
    loyalty: form.loyalty,
    status: form.status,
    join_date: form.joinDate || null,
    admin_notes: form.adminNotes || null,
  };
}

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loyaltyFilter, setLoyaltyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const itemsPerPage = 10;

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      const rows = data && data.length > 0 ? data.map(normalizeCustomer) : customersData.map(normalizeCustomer);
      setCustomers(rows);
      if (!data || data.length === 0) {
        setMessage("Tabel customers kosong, menampilkan data contoh lokal.");
      }
    } catch (error) {
      console.error("Gagal memuat customers Supabase:", error);
      setCustomers(customersData.map(normalizeCustomer));
      setMessage("Tabel customers belum siap, menampilkan data contoh lokal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, loyaltyFilter, statusFilter]);

  const getCity = (customer) => {
    if (customer.city) return customer.city;
    if (!customer.address) return "-";
    const parts = customer.address.split(",");
    return parts[parts.length - 1].trim();
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const keyword = searchTerm.toLowerCase();
      const matchesSearch =
        (customer.customerName || "").toLowerCase().includes(keyword) ||
        (customer.email || "").toLowerCase().includes(keyword) ||
        (customer.phone || "").includes(searchTerm);

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
  }, [customers, searchTerm, loyaltyFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage));

  const currentCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const getLoyaltyBadgeColor = (loyalty) => {
    switch (loyalty) {
      case "Platinum": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Gold": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Silver": return "bg-slate-100 text-slate-700 border-slate-200";
      case "Bronze": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status) =>
    status === "Active"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-rose-100 text-rose-700 border-rose-200";

  const getComplaintsBadge = (complaints) => {
    if (!Array.isArray(complaints) || complaints.length === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-gray-50 text-gray-500 border border-gray-100">
          <FaCheckCircle size={10} /> Tidak ada
        </span>
      );
    }
    const pending = complaints.filter((c) => !c?.resolved).length;
    if (pending > 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
          <FaExclamationTriangle size={10} />
          {complaints.length} ({pending} pending)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
        <FaCheckCircle size={10} />
        {complaints.length} selesai
      </span>
    );
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingCustomer(null);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (customer) => {
    setEditingCustomer(customer);
    setForm({
      customerName: customer.customerName || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      city: getCity(customer) === "-" ? "" : getCity(customer),
      loyalty: customer.loyalty || "Bronze",
      status: customer.status || "Active",
      joinDate: customer.joinDate ? customer.joinDate.split('T')[0] : "",
      adminNotes: customer.adminNotes || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = toPayload(form);

    try {
      if (editingCustomer?.id) {
        const { data, error } = await supabase
          .from("customers")
          .update(payload)
          .eq("id", editingCustomer.id)
          .select()
          .single();
        if (error) throw error;
        setCustomers(customers.map((customer) => customer.id === editingCustomer.id ? normalizeCustomer(data) : customer));
        setMessage("Customer berhasil diupdate.");
      } else {
        const { data, error } = await supabase
          .from("customers")
          .insert({
            ...payload,
            customer_id: `CUST-${Date.now().toString().slice(-6)}`,
            complaints: [],
          })
          .select()
          .single();
        if (error) throw error;
        setCustomers([normalizeCustomer(data), ...customers]);
        setMessage("Customer berhasil ditambahkan.");
      }
    } catch (error) {
      console.error("Gagal menyimpan customer:", error);
      const localCustomer = normalizeCustomer({
        ...payload,
        customer_id: editingCustomer?.customerId || `LOCAL-${Date.now().toString().slice(-5)}`,
        complaints: editingCustomer?.complaints || [],
      });
      if (editingCustomer) {
        setCustomers(customers.map((customer) => customer.customerId === editingCustomer.customerId ? localCustomer : customer));
      } else {
        setCustomers([localCustomer, ...customers]);
      }
      setMessage("Supabase belum siap, perubahan hanya tersimpan sementara di browser.");
    }

    setShowForm(false);
    resetForm();
  };

  const handleDelete = async (customer) => {
    if (!window.confirm(`Hapus customer ${customer.customerName}?`)) return;
    try {
      if (customer.id) {
        const { error } = await supabase.from("customers").delete().eq("id", customer.id);
        if (error) throw error;
      }
      setCustomers(customers.filter((item) => item.customerId !== customer.customerId));
      setMessage("Customer berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus customer:", error);
      setMessage("Gagal menghapus customer dari Supabase.");
    }
  };

  return (
    <div className="p-8 font-poppins bg-[#F9F7F5] min-h-screen">
      <PageHeader
        title="Data Customer"
        description="Kelola data customer, membership, status, dan aktivitas"
      >
        <button
          onClick={openCreateForm}
          className="rounded-2xl bg-[#10B981] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-100 transition hover:bg-emerald-600"
        >
          Tambah Customer
        </button>
      </PageHeader>

      {message && (
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-4 overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative w-full sm:w-80">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama, email, atau HP..."
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

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-400 uppercase border-b bg-gray-50/50">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">HP</th>
                <th className="p-4 text-left">Alamat</th>
                <th className="p-4 text-left">Kota</th>
                <th className="p-4 text-left">Membership</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Join Date</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                    Memuat customer...
                  </td>
                </tr>
              ) : currentCustomers.length > 0 ? currentCustomers.map((customer) => (
                <tr key={customer.customerId} className="hover:bg-gray-50 border-b border-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar size="default">
                        <AvatarImage src={customer.profilePhoto} alt={customer.customerName} />
                        <AvatarFallback className={`text-xs font-bold ${getAvatarColor(customer.loyalty)}`}>
                          {getInitials(customer.customerName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{customer.customerName}</p>
                        <p className="text-xs text-gray-400">{customer.email || "-"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">{customer.phone || "-"}</td>
                  <td className="p-4 text-gray-600 text-sm truncate max-w-[120px]" title={customer.address}>{customer.address || "-"}</td>
                  <td className="p-4 text-gray-600 text-sm">{getCity(customer)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded border text-xs font-semibold ${getLoyaltyBadgeColor(customer.loyalty)}`}>
                      {customer.loyalty}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded border text-xs font-semibold ${getStatusBadgeColor(customer.status)}`}>
                      {customer.status === "Active" ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">{customer.joinDate ? customer.joinDate.split('T')[0] : "-"}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(customer)}
                        className="rounded-xl p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-500"
                        title="Edit customer"
                      >
                        <FaPen size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(customer)}
                        className="rounded-xl p-2 text-gray-400 transition hover:bg-rose-50 hover:text-rose-500"
                        title="Hapus customer"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                    Tidak ada customer yang sesuai filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length > 0 && (
          <div className="p-4 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-sm text-gray-400">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1}-
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.16)]">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{editingCustomer ? "Edit Customer" : "Tambah Customer"}</h2>
                <p className="mt-1 text-sm text-slate-500">Isi data customer/prospek dengan ringkas.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-sm font-semibold text-slate-400 hover:text-slate-600"
              >
                Batal
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Nama customer" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Nomor HP" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Kota" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Alamat" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 md:col-span-2" />
              <input type="date" value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} placeholder="Tanggal Join" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
              <select value={form.loyalty} onChange={(e) => setForm({ ...form, loyalty: e.target.value })} className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500">
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500">
                <option value="Active">Aktif</option>
                <option value="Inactive">Tidak Aktif</option>
              </select>
              <input value={form.adminNotes} onChange={(e) => setForm({ ...form, adminNotes: e.target.value })} placeholder="Catatan admin" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 md:col-span-2" />
              <div className="flex justify-end gap-3 md:col-span-2">
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">
                  Batal
                </button>
                <button type="submit" className="rounded-2xl bg-[#10B981] px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-600">
                  {editingCustomer ? "Update Customer" : "Simpan Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
