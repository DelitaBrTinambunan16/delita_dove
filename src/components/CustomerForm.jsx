import { FaUserPlus } from "react-icons/fa";

export default function CustomerForm({ show, onClose, formData, setFormData, onSubmit }) {
  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-stone-100">
        <h2 className="text-xl font-bold mb-6 text-stone-800 flex items-center gap-2">
          <span className="w-2 h-6 bg-[#10B981] rounded-full"></span>
          New Wedding Couple
        </h2>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Nama Pasangan</label>
              <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all" placeholder="e.g. Delita & Andre" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Email</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all" placeholder="e.g. hello@wedding.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Telepon</label>
                <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all" placeholder="0812..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Loyalty</label>
                <select name="loyalty" value={formData.loyalty} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all appearance-none">
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-stone-400 hover:text-stone-600 font-bold transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-[#10B981] text-white rounded-xl hover:bg-emerald-600 font-bold shadow-lg shadow-emerald-50 transition-all">Simpan Pasangan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
