import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaTicketAlt } from "react-icons/fa";
import { supabase } from "../lib/supabaseClient";

const PACKAGE_OPTIONS = [
  { name: "Premium", venue: "Garden Paradise", price: 4000000 },
  { name: "Deluxe", venue: "Grand Ballroom", price: 2500000 },
  { name: "Standard", venue: "Cozy Intimate", price: 1000000 },
];

const VENUE_OPTIONS = ["Garden Paradise", "Grand Ballroom", "Cozy Intimate"];

const inputClass =
  "w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all";
const labelClass = "block text-xs font-medium text-slate-600 mb-1";

export default function GuestOrderForm({ show, onClose, prefillPackage, selectedProduct, memberData, guestEmail, promoCode: propPromoCode, onSubmitted }) {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    paket: "Premium",
    venue: "Garden Paradise",
    orderDate: "",
    guestCount: "",
    location: "",
    notes: "",
    promoCode: "",
  });

  // Validasi form order
  const validateOrderForm = (formData) => {
    const errs = {};
    
    if (!formData.name.trim()) {
      errs.name = "Nama wajib diisi";
    } else if (formData.name.trim().length < 3) {
      errs.name = "Nama minimal 3 karakter";
    }
    
    if (!formData.email.trim()) {
      errs.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Format email tidak valid";
    }
    
    if (!formData.phone.trim()) {
      errs.phone = "No HP wajib diisi";
    } else if (!/^(\+62|0)[0-9]{9,12}$/.test(formData.phone.replace(/[-\s]/g, ""))) {
      errs.phone = "Format HP tidak valid (08xxx atau +628xxx)";
    }
    
    if (!formData.orderDate.trim()) {
      errs.orderDate = "Tanggal acara wajib diisi";
    }
    
    if (!formData.guestCount) {
      errs.guestCount = "Jumlah tamu wajib diisi";
    } else if (Number(formData.guestCount) < 1) {
      errs.guestCount = "Jumlah tamu minimal 1";
    }
    
    return errs;
  };

  // Sinkronisasi form setiap kali modal dibuka atau prefillPackage berubah
  useEffect(() => {
    if (show) {
      const pkg = PACKAGE_OPTIONS.find((p) => p.name === prefillPackage) || PACKAGE_OPTIONS[0];
      setForm({
        name: memberData?.name || guestEmail?.split("@")[0] || "",
        email: memberData?.email || guestEmail || "",
        phone: memberData?.phone || "",
        paket: selectedProduct?.title || pkg.name,
        venue: pkg.venue,
        orderDate: "",
        guestCount: "",
        location: "",
        notes: "",
        promoCode: propPromoCode || "",
      });
    }
  }, [show, prefillPackage, propPromoCode, memberData, guestEmail, selectedProduct]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      // Ketika ganti paket, venue ikut menyesuaikan otomatis
      if (name === "paket") {
        const pkg = PACKAGE_OPTIONS.find((p) => p.name === value);
        return { ...prev, paket: value, venue: pkg?.venue || prev.venue };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const formErrors = validateOrderForm(form);
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length > 0) {
      setSubmitError("Silakan perbaiki error di bawah sebelum mengirim.");
      return;
    }
    
    setLoading(true);
    setSubmitError("");
    
    const pkg = PACKAGE_OPTIONS.find((p) => p.name === form.paket);
    const packageName = selectedProduct?.title || form.paket;
    const totalPrice = selectedProduct?.price || pkg?.price || 0;
    const orderData = {
      order_id: "ORD-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      product_id: selectedProduct?.id || null,
      product_code: selectedProduct?.code || null,
      customer_name: form.name.trim(),
      customer_email: form.email?.trim() || guestEmail || null,
      customer_phone: form.phone.trim(),
      package_name: packageName,
      event_date: form.orderDate,
      guest_count: form.guestCount ? Number(form.guestCount) : null,
      location: form.location?.trim() || null,
      total_price: totalPrice,
      notes: `Venue: ${form.venue}, Location: ${form.location}, Guests: ${form.guestCount}, Promo: ${form.promoCode}. ${form.notes}`,
      promo_code: form.promoCode?.trim() || null,
      status: "Pending"
    };

    try {
      const { error } = await supabase.from('orders').insert([orderData]);
      if (error) {
        if (error.message?.includes("constraint")) {
          throw new Error("Data order sudah pernah dibuat. Silakan gunakan data lain.");
        }
        throw error;
      }
      onSubmitted?.();
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        navigate("/");
      }, 2500);
    } catch (err) {
      console.error("Gagal mengirim pesanan:", err);
      setSubmitError(err.message || "Gagal mengirim pesanan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  const fmtRupiah = (v) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);

  const selectedPkg = PACKAGE_OPTIONS.find((p) => p.name === form.paket);
  const selectedPrice = selectedProduct?.price || selectedPkg?.price || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.15)] p-5 font-poppins my-8">
        {/* HEADER + BACK */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                onClose();
                navigate("/");
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 transition"
            >
              <FaArrowLeft size={10} /> Back
            </button>
            <h2 className="text-lg font-bold text-slate-900">Pesan Paket</h2>
          </div>
        </div>

        {/* SUCCESS STATE */}
        {submitted ? (
          <div className="py-8 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
              <FaCheckCircle size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Pesanan Berhasil!</h3>
            <p className="mt-1 text-xs text-slate-500">
              Paket {form.paket} ({form.venue}) - {form.orderDate || "tanggal menunggu konfirmasi"}.
            </p>
            <p className="mt-1 text-[10px] text-slate-400">Mengalihkan ke halaman utama...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Error Alert */}
            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <svg className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-red-800">{submitError}</p>
                </div>
              </div>
            )}

            {/* PROMO CODE (if provided) */}
            {form.promoCode && (
              <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 flex items-center gap-2">
                <FaTicketAlt size={12} className="text-amber-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Promo:</span>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">{form.promoCode}</span>
              </div>
            )}

            {/* PILIH PAKET + HARGA */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Pilih Paket</label>
                <select name="paket" value={form.paket} onChange={handleChange} disabled={loading} className={inputClass + (loading ? " opacity-50 cursor-not-allowed" : "")}>
                  {selectedProduct ? (
                    <option value={selectedProduct.title}>{selectedProduct.title}</option>
                  ) : PACKAGE_OPTIONS.map((p) => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Harga Paket</label>
                <div className="flex items-center h-[38px] px-3 rounded-lg bg-emerald-50 border border-emerald-100">
                  <span className="text-sm font-bold text-emerald-600">{fmtRupiah(selectedPrice)}</span>
                </div>
              </div>
            </div>

            {/* NAME */}
            <div>
              <label className={labelClass}>Nama Lengkap <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="name" 
                value={form.name} 
                onChange={(e) => {
                  handleChange(e);
                  if (errors.name) setErrors({...errors, name: ""});
                }} 
                disabled={loading}
                className={inputClass + (errors.name ? " border-red-300 bg-red-50" : "") + (loading ? " opacity-50 cursor-not-allowed" : "")} 
                placeholder="Nama Anda" 
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            {/* EMAIL */}
            <div>
              <label className={labelClass}>Email <span className="text-red-500">*</span></label>
              <input 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={(e) => {
                  handleChange(e);
                  if (errors.email) setErrors({...errors, email: ""});
                }} 
                disabled={loading}
                className={inputClass + (errors.email ? " border-red-300 bg-red-50" : "") + (loading ? " opacity-50 cursor-not-allowed" : "")} 
                placeholder="email@example.com" 
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* PHONE + GUEST COUNT */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>No. HP <span className="text-red-500">*</span></label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={form.phone} 
                  onChange={(e) => {
                    handleChange(e);
                    if (errors.phone) setErrors({...errors, phone: ""});
                  }} 
                  disabled={loading}
                  className={inputClass + (errors.phone ? " border-red-300 bg-red-50" : "") + (loading ? " opacity-50 cursor-not-allowed" : "")} 
                  placeholder="0812..." 
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className={labelClass}>Jumlah Tamu <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  name="guestCount" 
                  value={form.guestCount} 
                  onChange={(e) => {
                    handleChange(e);
                    if (errors.guestCount) setErrors({...errors, guestCount: ""});
                  }} 
                  disabled={loading}
                  className={inputClass + (errors.guestCount ? " border-red-300 bg-red-50" : "") + (loading ? " opacity-50 cursor-not-allowed" : "")} 
                  placeholder="200" 
                />
                {errors.guestCount && <p className="text-xs text-red-600 mt-1">{errors.guestCount}</p>}
              </div>
            </div>

            {/* VENUE + DATE */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Venue</label>
                <select name="venue" value={form.venue} onChange={handleChange} disabled={loading} className={inputClass + (loading ? " opacity-50 cursor-not-allowed" : "")}>
                  {VENUE_OPTIONS.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Tanggal Acara <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  name="orderDate" 
                  value={form.orderDate} 
                  onChange={(e) => {
                    handleChange(e);
                    if (errors.orderDate) setErrors({...errors, orderDate: ""});
                  }} 
                  disabled={loading}
                  className={inputClass + (errors.orderDate ? " border-red-300 bg-red-50" : "") + (loading ? " opacity-50 cursor-not-allowed" : "")} 
                />
                {errors.orderDate && <p className="text-xs text-red-600 mt-1">{errors.orderDate}</p>}
              </div>
            </div>

            {/* LOCATION */}
            <div>
              <label className={labelClass}>Lokasi / Kota</label>
              <input 
                type="text" 
                name="location" 
                value={form.location || ""} 
                onChange={handleChange} 
                disabled={loading}
                className={inputClass + (loading ? " opacity-50 cursor-not-allowed" : "")} 
                placeholder="Misal: Bandung" 
              />
            </div>

            {/* NOTES */}
            <div>
              <label className={labelClass}>Catatan (opsional)</label>
              <textarea 
                name="notes" 
                value={form.notes} 
                onChange={handleChange} 
                rows={2} 
                disabled={loading}
                className={inputClass + " resize-none" + (loading ? " opacity-50 cursor-not-allowed" : "")} 
                placeholder="Permintaan khusus..." 
              />
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setErrors({});
                  setSubmitError("");
                  onClose();
                  navigate("/");
                }}
                disabled={loading}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Mengirim...
                  </>
                ) : (
                  "Pesan Sekarang"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
