export default function OrderForm({ show, onClose, formData, setFormData, onSubmit, getPaket }) {
  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const inputClass = "w-full border border-gray-200 bg-white/95 rounded-2xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-[32px] bg-white border border-slate-200 shadow-[0_30px_80px_rgba(15,23,42,0.18)] p-6 font-poppins">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Tambah Pemesanan</h2>
            <p className="text-sm text-slate-500 mt-1">Lengkapi detail acara dan paket untuk pesanan baru.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 transition">Tutup</button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nama Pasangan</label>
            <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} className={inputClass} placeholder="e.g. Andi & Bella" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tanggal Pernikahan</label>
            <input required type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Paket</label>
            <select name="paket" value={formData.paket} onChange={handleChange} className={inputClass}>
              <option value="Premium">Premium (Garden Paradise)</option>
              <option value="Deluxe">Deluxe (Grand Ballroom)</option>
              <option value="Standard">Standard (Cozy Intimate)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status Pemesanan</label>
            <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="w-full sm:w-auto rounded-2xl border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition">Batal</button>
            <button type="submit" className="w-full sm:w-auto rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200/40 hover:bg-emerald-600 transition">Simpan Pemesanan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
