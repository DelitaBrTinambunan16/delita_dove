import { useState } from "react";
import data from "./novels.json";

export default function CreativeServiceList() {
  // 1. State untuk Manajemen Form (Object State)
  const [dataForm, setDataForm] = useState({ searchTerm: "", selectedCategory: "" });

  const handleChange = (e) => {
    setDataForm({ ...dataForm, [e.target.name]: e.target.value });
  };

  /** 2. Deklarasi Logic Search & Filter **/
  const _searchTerm = dataForm.searchTerm.toLowerCase();
  const filtered = data.filter((item) => {
    // Logic Search: Judul atau Nama Penulis
    const matchesSearch =
      item.title.toLowerCase().includes(_searchTerm) ||
      item.creator.name.toLowerCase().includes(_searchTerm);

    // Logic Filter: Kategori
    const matchesCategory =
      dataForm.selectedCategory === "" || item.category === dataForm.selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(data.map((d) => d.category))];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Input & Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            name="searchTerm"
            placeholder="Cari judul atau penulis..."
            onChange={handleChange}
            className="flex-grow p-3 rounded-xl border border-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            name="selectedCategory"
            onChange={handleChange}
            className="p-3 rounded-xl border border-slate-200 shadow-sm bg-white outline-none"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* 3. Render Data Dinamis (Grid Card) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 flex flex-col">
              <img src={item.thumbnail} className="w-full h-48 object-cover" alt="cover" />
              <div className="p-4 flex-grow">
                <p className="text-[9px] font-bold text-indigo-500 uppercase">{item.category}</p>
                <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{item.title}</h3>
                <p className="text-xs text-slate-400 mb-2">{item.creator.name}</p>

                {/* 4. Implementasi Nested Data (Dot Notation) */}
                <div className="text-[10px] text-slate-500 mb-3 border-l-2 border-indigo-200 pl-2">
                  <p>📧 {item.contact.email}</p>
                  <p>📦 Stok: {item.delivery.stock} unit</p>
                </div>

                {/* 5. Render Data Array (Mapping Tags) */}
                <div className="flex flex-wrap mb-4">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-600 px-2 py-0.5 text-[8px] rounded-full mr-1 mb-1 font-bold border border-indigo-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t flex justify-between items-center bg-slate-50/50">
                <span className="text-sm font-bold text-slate-900">Rp {item.price.toLocaleString()}</span>
                <span className="text-[10px] text-yellow-500 font-bold">★ {item.creator.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}