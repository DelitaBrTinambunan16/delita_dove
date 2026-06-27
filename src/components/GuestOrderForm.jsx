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
    const pkg = PACKAGE_OPTIONS.find((p) => p.name === form.paket);
    const packageName = selectedProduct?.title || form.paket;
    const totalPrice = selectedProduct?.price || pkg?.price || 0;
    const orderData = {
      order_id: "ORD-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      product_id: selectedProduct?.id || null,
      product_code: selectedProduct?.code || null,
      customer_name: form.name,
      customer_email: form.email || guestEmail || null,
      customer_phone: form.phone,
      package_name: packageName,
      event_date: form.orderDate,
      guest_count: form.guestCount ? Number(form.guestCount) : null,
      location: form.location || null,
      total_price: totalPrice,
      notes: `Venue: ${form.venue}, Location: ${form.location}, Guests: ${form.guestCount}, Promo: ${form.promoCode}. ${form.notes}`,
      promo_code: form.promoCode || null,
      status: "Pending"
    };

    try {
      const { error } = await supabase.from('orders').insert([orderData]);
      if (error) {
        const legacyOrderData = {
          order_id: orderData.order_id,
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone,
          package_name: orderData.package_name,
          event_date: orderData.event_date,
          total_price: orderData.total_price,
          notes: orderData.notes,
          status: orderData.status,
        };
        const { error: legacyError } = await supabase.from('orders').insert([legacyOrderData]);
        if (legacyError) throw legacyError;
      }
      onSubmitted?.();
    } catch (err) {
      console.error("Gagal mengirim pesanan:", err);
      alert("Gagal mengirim pesanan. Coba lagi.");
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      navigate("/guest");
    }, 2500);
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
                navigate("/guest");
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
                <select name="paket" value={form.paket} onChange={handleChange} className={inputClass}>
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

            {/* NAME + EMAIL */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className={labelClass}>Nama Lengkap</label>
                <input required type="text" name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="Nama Anda" />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="email@example.com" />
              </div>
            </div>

            {/* PHONE + GUEST COUNT */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>No. HP</label>
                <input required type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="0812..." />
              </div>
              <div>
                <label className={labelClass}>Jumlah Tamu</label>
                <input type="number" name="guestCount" value={form.guestCount} onChange={handleChange} className={inputClass} placeholder="200" />
              </div>
            </div>

            {/* VENUE + DATE */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Venue</label>
                <select name="venue" value={form.venue} onChange={handleChange} className={inputClass}>
                  {VENUE_OPTIONS.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Tanggal Acara</label>
                <input required type="date" name="orderDate" value={form.orderDate} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            {/* LOCATION */}
            <div>
              <label className={labelClass}>Lokasi / Kota</label>
              <input type="text" name="location" value={form.location || ""} onChange={handleChange} className={inputClass} placeholder="Misal: Bandung" />
            </div>

            {/* NOTES */}
            <div>
              <label className={labelClass}>Catatan (opsional)</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className={inputClass + " resize-none"} placeholder="Permintaan khusus..." />
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/guest");
                }}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
              >
                Kirim Pesanan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
