export default function OrderForm({ show, onClose, formData, setFormData, onSubmit, getPaket }) {
  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 font-serif">Tambah Pemesanan</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pasangan</label>
            <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#fa2b56] focus:border-[#fa2b56]" placeholder="e.g. Andi & Bella" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pernikahan</label>
            <input required type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#fa2b56] focus:border-[#fa2b56]" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Paket</label>
            <select name="paket" value={formData.paket} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#fa2b56] focus:border-[#fa2b56]">
              <option value="Premium">Premium (Garden Paradise)</option>
              <option value="Deluxe">Deluxe (Grand Ballroom)</option>
              <option value="Standard">Standard (Cozy Intimate)</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Pemesanan</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#fa2b56] focus:border-[#fa2b56]">
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium transition-colors">Batal</button>
            <button type="submit" className="px-4 py-2 bg-[#fa2b56] text-white rounded-lg hover:bg-[#e01f46] font-medium transition-colors">Simpan Pemesanan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
