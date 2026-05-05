import { useState, useEffect } from "react";
import { FaSearch, FaUserPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import customersData from "../data/customers";

export default function Customers() {
    const [customers, setCustomers] = useState(customersData);
    const [showForm, setShowForm] = useState(false);
    
    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [filterLoyalty, setFilterLoyalty] = useState("All");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [formData, setFormData] = useState({
        customerName: "",
        email: "",
        phone: "",
        loyalty: "Bronze"
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterLoyalty]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newCustomer = {
            customerId: `CUST0${customers.length + 1}`,
            customerName: formData.customerName,
            email: formData.email,
            phone: formData.phone,
            loyalty: formData.loyalty
        };
        setCustomers([newCustomer, ...customers]);
        setShowForm(false);
        setFormData({ customerName: "", email: "", phone: "", loyalty: "Bronze" });
    }

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              customer.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterLoyalty === "All" || customer.loyalty === filterLoyalty;
        return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const currentCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-8 bg-[#F9F7F5] min-h-screen font-poppins">
            {/* HEADER SECTION */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800">Daftar Pelanggan</h1>
                    <p className="text-sm text-stone-400 font-medium">Manajemen data pasangan pengantin</p>
                </div>
                <button 
                    onClick={() => setShowForm(true)}
                    className="bg-[#10B981] hover:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-md shadow-emerald-100 transition-all flex items-center gap-2 text-sm"
                >
                    <FaUserPlus /> Tambah Pelanggan
                </button>
            </div>

            {/* FORM MODAL */}
            {showForm && (
                <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-stone-100">
                        <h2 className="text-xl font-bold mb-6 text-stone-800 flex items-center gap-2">
                            <span className="w-2 h-6 bg-[#10B981] rounded-full"></span>
                            New Wedding Couple
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Nama Pasangan</label>
                                    <input required type="text" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all" placeholder="e.g. Delita & Andre" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Email</label>
                                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all" placeholder="e.g. hello@wedding.com" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Telepon</label>
                                        <input required type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all" placeholder="0812..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Loyalty</label>
                                        <select value={formData.loyalty} onChange={(e) => setFormData({...formData, loyalty: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all appearance-none">
                                            <option value="Bronze">Bronze</option>
                                            <option value="Silver">Silver</option>
                                            <option value="Gold">Gold</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-8">
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 text-stone-400 hover:text-stone-600 font-bold transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-[#10B981] text-white rounded-xl hover:bg-emerald-600 font-bold shadow-lg shadow-emerald-50 transition-all">Simpan Pasangan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TABLE & FILTER CARD */}
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-stone-100 overflow-hidden">
                <div className="p-6 border-b border-stone-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
                    <div className="relative w-full sm:w-80">
                        <input 
                            type="text" 
                            placeholder="Cari pasangan..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-100 outline-none focus:border-emerald-500 transition-all text-sm"
                        />
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 text-xs" />
                    </div>
                    <select 
                        value={filterLoyalty}
                        onChange={(e) => setFilterLoyalty(e.target.value)}
                        className="w-full sm:w-auto border border-stone-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 bg-stone-50 font-medium text-stone-600"
                    >
                        <option value="All">Semua Status Loyalty</option>
                        <option value="Bronze">Bronze Client</option>
                        <option value="Silver">Silver Client</option>
                        <option value="Gold">Gold Client</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[11px] text-stone-400 uppercase tracking-widest border-b border-stone-50">
                                <th className="px-8 py-5 font-bold">ID Pelanggan</th>
                                <th className="px-8 py-5 font-bold">Nama Pasangan</th>
                                <th className="px-8 py-5 font-bold">Kontak</th>
                                <th className="px-8 py-5 font-bold text-center">Loyalty Level</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {currentCustomers.map((item) => (
                                <tr key={item.customerId} className="hover:bg-stone-50/50 transition-colors group">
                                    <td className="px-8 py-5 font-bold text-stone-300 text-xs tracking-wider">#{item.customerId}</td>
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-stone-800">{item.customerName}</div>
                                        <div className="text-[10px] text-stone-400 mt-0.5 uppercase tracking-tighter">Verified Couple</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-sm font-medium text-stone-600">{item.email}</div>
                                        <div className="text-xs text-stone-400">{item.phone}</div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase ${
                                            item.loyalty === 'Gold' ? 'bg-amber-50 text-amber-600'
                                            : item.loyalty === 'Silver' ? 'bg-stone-100 text-stone-600'
                                            : 'bg-emerald-50 text-emerald-600'
                                        }`}>
                                            {item.loyalty}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="p-6 bg-stone-50/30 border-t border-stone-50 flex justify-between items-center">
                    <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-stone-200 rounded-lg bg-white hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <FaChevronLeft className="text-stone-400 text-xs" />
                        </button>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-stone-200 rounded-lg bg-white hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <FaChevronRight className="text-stone-400 text-xs" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}