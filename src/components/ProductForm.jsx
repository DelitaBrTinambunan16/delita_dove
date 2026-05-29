export default function ProductForm({ show, onClose, form, setForm, onSubmit }) {
  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const inputClass = "w-full border border-gray-200 bg-white/90 rounded-2xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-[28px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.16)] border border-slate-100 p-6 font-poppins">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Tambah Produk</h2>
            <p className="text-sm text-slate-500 mt-1">Isi detail paket produk pernikahan dengan rapi.</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">Batal</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Judul Produk"
            value={form.title}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            type="text"
            name="code"
            placeholder="Kode Produk"
            value={form.code}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            type="text"
            name="category"
            placeholder="Kategori"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            type="text"
            name="brand"
            placeholder="Merek"
            value={form.brand}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            type="number"
            name="price"
            placeholder="Harga"
            value={form.price}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            type="number"
            name="stock"
            placeholder="Stok"
            value={form.stock}
            onChange={handleChange}
            className={inputClass}
          />

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto rounded-2xl border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200/40 hover:bg-emerald-600 transition"
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
