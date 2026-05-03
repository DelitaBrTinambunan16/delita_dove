import { useState, useEffect } from "react";
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
    const itemsPerPage = 10;

    const [formData, setFormData] = useState({
        customerName: "",
        email: "",
        phone: "",
        loyalty: "Bronze"
    });

    // Reset page to 1 when search or filter changes
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

    // Pagination logic
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const currentCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-8 relative">
            <PageHeader title="Daftar Pelanggan">
                <button 
                    onClick={() => setShowForm(true)}
                    className="bg-[#fa2b56] hover:bg-[#e01f46] text-white font-medium py-2 px-4 rounded-xl shadow-md shadow-pink-200 transition-all"
                >
                    + Add Customer
                </button>
            </PageHeader>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4 font-serif">Add New Customer</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pasangan</label>
                                <input required type="text" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#fa2b56] focus:border-[#fa2b56]" placeholder="e.g. Fikri & Nisa" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#fa2b56] focus:border-[#fa2b56]" placeholder="e.g. fikri@example.com" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input required type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#fa2b56] focus:border-[#fa2b56]" placeholder="e.g. 0812345678" />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Loyalty Level</label>
                                <select value={formData.loyalty} onChange={(e) => setFormData({...formData, loyalty: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#fa2b56] focus:border-[#fa2b56]">
                                    <option value="Bronze">Bronze</option>
                                    <option value="Silver">Silver</option>
                                    <option value="Gold">Gold</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#fa2b56] text-white rounded-lg hover:bg-[#e01f46] font-medium transition-colors">Save Customer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <div>
                        <h2 className="font-semibold text-lg text-gray-800">Data Pelanggan</h2>
                        <span className="text-sm text-gray-500">Menampilkan {filteredCustomers.length} pelanggan</span>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                        <input 
                            type="text" 
                            placeholder="Cari Nama atau Email..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 sm:w-64 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#fa2b56] focus:border-[#fa2b56]"
                        />
                        <select 
                            value={filterLoyalty}
                            onChange={(e) => setFilterLoyalty(e.target.value)}
                            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#fa2b56] focus:border-[#fa2b56] bg-white text-gray-700"
                        >
                            <option value="All">Semua Loyalty</option>
                            <option value="Bronze">Bronze</option>
                            <option value="Silver">Silver</option>
                            <option value="Gold">Gold</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Customer ID</th>
                                <th className="px-6 py-4 font-semibold">Nama Pasangan</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold">Telepon</th>
                                <th className="px-6 py-4 font-semibold">Loyalty</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {currentCustomers.length > 0 ? (
                                currentCustomers.map((item) => (
                                    <tr key={item.customerId} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-5 font-semibold text-gray-800">{item.customerId}</td>
                                        <td className="px-6 py-5 font-medium text-gray-800">{item.customerName}</td>
                                        <td className="px-6 py-5 text-gray-500">{item.email}</td>
                                        <td className="px-6 py-5 text-gray-500">{item.phone}</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                                                item.loyalty === 'Gold' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                : item.loyalty === 'Silver' ? 'bg-gray-100 text-gray-700 border border-gray-200'
                                                : 'bg-orange-100 text-orange-700 border border-orange-200'
                                            }`}>
                                                {item.loyalty}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        Tidak ada data pelanggan yang sesuai.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {filteredCustomers.length > 0 && (
                    <div className="p-4 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                        <span className="text-sm text-gray-500">
                            Menampilkan {(currentPage - 1) * itemsPerPage + 1} hingga {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} dari {filteredCustomers.length} pelanggan
                        </span>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 bg-pink-50 text-[#fa2b56] border border-pink-100 rounded-lg text-sm font-bold">
                                {currentPage} / {totalPages}
                            </span>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}