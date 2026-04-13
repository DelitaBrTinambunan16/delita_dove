import { useState } from "react";
import data from "./novels.json";

export default function CreativeAdmin() {
    const [dataForm, setDataForm] = useState({ searchTerm: "", selectedCategory: "" });
    const handleChange = (e) => setDataForm({ ...dataForm, [e.target.name]: e.target.value });

    //DEKLARASI LOGIC SEARCH & FILTER //
    // Kita buat variabel antara agar proses pencarian lebih efisien 
    const _searchTerm = dataForm.searchTerm.toLowerCase();

    const filtered = data.filter((item) => {
        // Logika Search Judul
        const matchesSearch = item.title.toLowerCase().includes(_searchTerm);
        
        // Logika Filter Kategori
        const matchesCategory = 
            dataForm.selectedCategory === "" || 
            item.category === dataForm.selectedCategory;

        return matchesSearch && matchesCategory;
    });
    // Mendapatkan daftar kategori unik untuk dropdown
    const categories = [...new Set(data.map(d => d.category))];

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h1 className="text-lg font-bold text-slate-800">Admin Dashboard</h1>
                        <p className="text-xs text-slate-500 font-medium">Monitoring {filtered.length} Koleksi</p>
                    </div>
                    <div className="flex gap-2">
                        <input name="searchTerm" placeholder="Filter judul..." onChange={handleChange} className="p-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
                        <select name="selectedCategory" onChange={handleChange} className="p-2 text-xs border border-slate-300 rounded-lg outline-none bg-white">
                            <option value="">Semua Genre</option>
                            {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
                            <tr>
                                <th className="p-4">Detail Buku</th>
                                <th className="p-4">Tags</th>
                                <th className="p-4">Harga</th>
                                <th className="p-4">Stok</th>
                                <th className="p-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {filtered.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 flex items-center gap-3">
                                        <img src={item.thumbnail} className="w-8 h-12 object-cover rounded shadow-sm" alt="cover" />
                                        <div>
                                            <p className="font-bold text-slate-700">{item.title}</p>
                                            <p className="text-[10px] text-indigo-500 font-bold uppercase">{item.category}</p>
                                        </div>
                                    </td>
                                    
                                    //*  MATERI 2: RENDER DATA ARRAY (MAPPING TAGS) *//
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1 w-32">
                                            {item.tags.map((tag, index) => (
                                                <span key={index} className="bg-slate-100 text-slate-500 px-1.5 py-0.5 text-[8px] rounded border border-slate-200">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </td>

                                    <td className="p-4 font-medium text-slate-600">
                                        Rp {item.price.toLocaleString()}
                                    </td>

                                    //*MATERI 3: IMPLEMENTASI NESTED DATA (DOT NOTATION) *//
                                    <td className="p-4 text-slate-500">
                                        {item.delivery.stock} unit
                                    </td>

                                    <td className="p-4 text-center space-x-4">
                                        <button className="text-indigo-600 font-bold hover:underline">Update</button>
                                        <button className="text-red-400 font-bold hover:underline">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}