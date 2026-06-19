import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaCrown, FaStar, FaCheckCircle, FaTimesCircle, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import customersData from "../data/customers";
import Avatar from "../components/Avatar";

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
  const yes = value === "Ya" || value === "Yes";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${yes ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
      {yes ? <FaCheckCircle size={9} /> : <FaTimesCircle size={9} />} {value}
    </span>
  );
}

export default function CustomerDetail() {
  const { id } = useParams();
  const customer = customersData.find(
    (c) => c.customerId === id || c.customerId === id.toUpperCase()
  );

  if (!customer) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-red-500 font-semibold">Pelanggan tidak ditemukan.</p>
        <Link to="/customers" className="text-[#10B981] text-sm hover:underline">← Kembali</Link>
      </div>
    );
  }

  const hasComplaints = customer.complaints && customer.complaints.length > 0;

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
            {(customer.customerName || "?").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
          </div>

          {/* Info utama */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-lg font-bold text-gray-800">{customer.customerName}</h1>
            <p className="text-sm text-gray-400">@{customer.username}</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${levelStyle[customer.loyalty] || "bg-gray-100 text-gray-500"}`}>
                <FaCrown size={8} /> {customer.loyalty}
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${customer.status === "Active" ? "bg-green-50 text-green-600" : customer.status === "Inactive" ? "bg-gray-100 text-gray-400" : "bg-red-50 text-red-500"}`}>
                {customer.status}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="text-center bg-amber-50 rounded-xl px-5 py-3 shrink-0">
            <p className="text-2xl font-extrabold text-amber-600">{customer.rating}</p>
            <div className="flex justify-center gap-0.5 my-1">
              {[1,2,3,4,5].map(s => (
                <FaStar key={s} size={9} className={s <= Math.round(customer.rating) ? "text-amber-400" : "text-gray-200"} />
              ))}
            </div>
            <p className="text-[10px] text-amber-500 font-bold">Rating</p>
          </div>
        </div>
      </div>

      {/* ── GRID 2 KOLOM ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Identitas & Kontak */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Identitas & Kontak</h3>
          <InfoRow label="Jenis Kelamin"  value={customer.gender} />
          <InfoRow label="Tgl Lahir"      value={customer.dob} />
          <div className="flex items-center gap-2 py-2.5 border-b border-gray-50">
            <FaPhoneAlt size={10} className="text-gray-300 shrink-0" />
            <span className="text-xs text-gray-700 font-semibold">{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2 py-2.5 border-b border-gray-50">
            <FaEnvelope size={10} className="text-gray-300 shrink-0" />
            <span className="text-xs text-gray-700 font-semibold">{customer.email}</span>
          </div>
          <div className="flex items-start gap-2 py-2.5">
            <FaMapMarkerAlt size={10} className="text-gray-300 shrink-0 mt-0.5" />
            <span className="text-xs text-gray-700 font-semibold">{customer.address}</span>
          </div>
        </div>

        {/* Membership */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Membership</h3>
          <InfoRow label="Tgl Daftar"    value={customer.joinDate} />
          <InfoRow label="Referral Code" value={customer.referralCode || "—"} />
          <InfoRow label="Login Terakhir" value={customer.lastLogin} />
          <InfoRow label="Device"        value={customer.device} />
          <InfoRow label="Sumber User"   value={customer.source} />
        </div>

        {/* Transaksi */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Transaksi</h3>
          <InfoRow label="Total Transaksi" value={`${customer.totalTransaksi || 1}x pembelian`} />
          <InfoRow label="Total Nilai"     value={fmtRupiah(customer.totalNilai || 0)} />
          <InfoRow label="Produk Terakhir" value={customer.produkTerakhir || customer.lastProduct} />
          <InfoRow label="Metode Bayar"    value={customer.metodePembayaran || customer.paymentMethod} />
          <InfoRow label="Tgl Transaksi"   value={customer.tglTransaksiTerakhir || customer.lastTransactionDate} />
        </div>

        {/* Marketing */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Marketing & Engagement</h3>
          <InfoRow label="Campaign"       value={customer.campaignDiikuti} />
          <InfoRow label="Status Promo"   value={customer.statusPromo} />
          <div className="py-2.5 border-b border-gray-50 flex justify-between items-center">
            <span className="text-xs text-gray-400 font-medium">Giveaway</span>
            <SubBadge value={customer.giveaway || customer.giveawayParticipation} />
          </div>
          <div className="py-2.5 border-b border-gray-50 flex justify-between items-center">
            <span className="text-xs text-gray-400 font-medium">Email Sub</span>
            <SubBadge value={customer.emailSub || customer.emailSubscription} />
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-xs text-gray-400 font-medium">SMS Sub</span>
            <SubBadge value={customer.smsSub || customer.smsSubscription} />
          </div>
        </div>
      </div>

      {/* ── RIWAYAT KOMPLAIN ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
          Riwayat Komplain {hasComplaints && <span className="ml-1 bg-red-100 text-red-500 px-1.5 py-0.5 rounded text-[10px]">{customer.complaints.length}</span>}
        </h3>
        {hasComplaints ? (
          <div className="space-y-2">
            {customer.complaints.map((c, i) => (
              <div key={i} className={`rounded-xl px-4 py-3 flex items-start justify-between gap-3 ${c.resolved ? "bg-green-50" : "bg-red-50"}`}>
                <div>
                  <p className="text-xs font-semibold text-gray-700">{c.issue}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{c.date}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${c.resolved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {c.resolved ? "Resolved" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-green-50 rounded-xl px-4 py-3 text-xs font-medium text-green-700">
            ✓ Tidak ada riwayat komplain
          </div>
        )}
      </div>

      {/* ── CATATAN ADMIN ── */}
      {customer.adminNotes && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Catatan Admin</h3>
          <div className="bg-amber-50 rounded-xl px-4 py-3 text-xs font-medium text-amber-700">
            {customer.adminNotes}
          </div>
        </div>
      )}

    </div>
  );
}