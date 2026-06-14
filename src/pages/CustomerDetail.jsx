import { useParams, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { FaArrowLeft, FaCrown, FaStar, FaCheckCircle, FaTimesCircle, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { usersAPI } from "../services/usersAPI";

const fmtRupiah = (v) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);

const levelStyle = {
  Platinum: "bg-purple-100 text-purple-700",
  Gold:     "bg-amber-100 text-amber-700",
  Silver:   "bg-stone-100 text-stone-600",
  Bronze:   "bg-emerald-100 text-emerald-700",
};

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 font-medium w-36 shrink-0">{label}</span>
      <span className="text-xs text-gray-700 font-semibold text-right">{value || "—"}</span>
    </div>
  );
}

function SubBadge({ value }) {
  const isEmail = typeof value === "string" && value.includes("@");
  const yes = isEmail || value === "Ya" || value === "Yes";
  const label = isEmail ? value : yes ? "Ya" : "Belum terdaftar";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${yes ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
      {yes ? <FaCheckCircle size={9} /> : <FaTimesCircle size={9} />} {label}
    </span>
  );
}

export default function CustomerDetail() {
  const { id } = useParams();
  const location = useLocation();

  // --- PERUBAHAN: ambil data dari state navigate (dikirim dari Customers.jsx) ---
  const customer = location.state?.c;

  // --- PERUBAHAN: state untuk edit & simpan komplain ke Supabase ---
  const [complaint, setComplaint] = useState(customer?.complaint || "");
  const [savingComplaint, setSavingComplaint] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const handleSaveComplaint = async () => {
    setSavingComplaint(true);
    setSaveMsg("");
    try {
      await usersAPI.updateUser(customer.id, { complaint });
      setSaveMsg("Komplain berhasil disimpan! Sudah sinkron ke halaman guest.");
      setTimeout(() => setSaveMsg(""), 4000);
    } catch (err) {
      setSaveMsg("Gagal menyimpan: " + err.message);
    } finally {
      setSavingComplaint(false);
    }
  };

  if (!customer) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-red-500 font-semibold">Pelanggan tidak ditemukan.</p>
        <Link to="/customers" className="text-[#10B981] text-sm hover:underline">← Kembali</Link>
      </div>
    );
  }

  const hasComplaint = customer.complaint && customer.complaint !== "Tidak Ada" && customer.complaint !== "";

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">

      {/* BACK */}
      <Link to="/customers" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-[#10B981] font-bold transition">
        <FaArrowLeft size={10} /> Kembali ke Daftar Pelanggan
      </Link>

      {/* ── PROFILE CARD ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-xl font-extrabold text-emerald-700 shrink-0">
            {(customer.name || "?").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
          </div>

          {/* Info utama */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-lg font-bold text-gray-800">{customer.name}</h1>
            <p className="text-sm text-gray-400">{customer.email}</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${levelStyle[customer.loyalty] || "bg-gray-100 text-gray-500"}`}>
                <FaCrown size={8} /> {customer.loyalty || "Bronze"}
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${customer.status === "Active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                {customer.status || "Active"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── GRID 2 KOLOM ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Identitas & Kontak */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Identitas & Kontak</h3>
          <div className="flex items-center gap-2 py-2.5 border-b border-gray-50">
            <FaPhoneAlt size={10} className="text-gray-300 shrink-0" />
            <span className="text-xs text-gray-700 font-semibold">{customer.phone || "-"}</span>
          </div>
          <div className="flex items-center gap-2 py-2.5 border-b border-gray-50">
            <FaEnvelope size={10} className="text-gray-300 shrink-0" />
            <span className="text-xs text-gray-700 font-semibold">{customer.email}</span>
          </div>
          <div className="flex items-start gap-2 py-2.5">
            <FaMapMarkerAlt size={10} className="text-gray-300 shrink-0 mt-0.5" />
            <span className="text-xs text-gray-700 font-semibold">{customer.city || "-"}</span>
          </div>
        </div>

        {/* Membership */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Membership</h3>
          <InfoRow label="Loyalty"       value={customer.loyalty} />
          <InfoRow label="Status"        value={customer.status} />
          <InfoRow label="Kode Promo"    value={customer.promo_code || "-"} />
          <div className="py-2.5 border-b border-gray-50 flex justify-between items-center">
            <span className="text-xs text-gray-400 font-medium">Email Sub</span>
            <SubBadge value={customer.email_subscription || customer.email} />
          </div>
        </div>
      </div>

      {/* ── KOMPLAIN CUSTOMER — isi oleh admin, sinkron ke guest ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
          Komplain Customer
        </h3>
        <p className="text-[11px] text-gray-400 mb-3">
          Komplain yang diisi di sini akan langsung tampil di halaman guest customer ini.
        </p>

        {/* Tampilkan komplain yang sudah ada */}
        {hasComplaint && (
          <div className="mb-3 bg-amber-50 rounded-xl px-4 py-3 border border-amber-100">
            <p className="text-xs font-semibold text-amber-700">Komplain aktif:</p>
            <p className="text-xs text-amber-600 mt-1">{customer.complaint}</p>
          </div>
        )}

        {!hasComplaint && (
          <div className="mb-3 bg-green-50 rounded-xl px-4 py-3 text-xs font-medium text-green-700">
            ✓ Belum ada komplain dari customer ini
          </div>
        )}

        {/* Form isi/update komplain */}
        <textarea
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder="Isi detail komplain customer di sini..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 resize-none"
        />

        {saveMsg && (
          <p className={`text-xs mt-1 font-medium ${saveMsg.includes("Gagal") ? "text-red-500" : "text-emerald-600"}`}>
            {saveMsg}
          </p>
        )}

        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSaveComplaint}
            disabled={savingComplaint}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
          >
            {savingComplaint ? "Menyimpan..." : "Simpan Komplain"}
          </button>
          {complaint && (
            <button
              onClick={() => { setComplaint("Tidak Ada"); }}
              className="px-4 py-2 border border-gray-200 text-gray-400 text-xs font-bold rounded-lg transition hover:bg-gray-50"
            >
              Reset (Tidak Ada)
            </button>
          )}
        </div>
      </div>

    </div>
  );
}