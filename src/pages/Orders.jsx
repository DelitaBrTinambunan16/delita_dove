import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import ordersData from "../data/orders";

export default function Orders() {
    const [orders, setOrders] = useState(ordersData);
    const [showForm, setShowForm] = useState(false);
    
    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [formData, setFormData] = useState({
        customerName: "",
        status: "Pending",
        paket: "Premium",
        orderDate: ""
    });

    // Reset page to 1 when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterStatus]);

    const getPaket = (price) => {
        if (price >= 4000000) return "Premium";
        if (price >= 2500000) return "Deluxe";
        return "Standard";
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let price = 1000000;
        if (formData.paket === "Premium") price = 4000000;
        if (formData.paket === "Deluxe") price = 2500000;

        const newOrder = {
            orderId: `ORD0${orders.length + 1}`,
            customerName: formData.customerName,
            status: formData.status,
            totalPrice: price,
            orderDate: formData.orderDate || new Date().toISOString().split('T')[0]
        };
        setOrders([newOrder, ...orders]);
        setShowForm(false);
        setFormData({ customerName: "", status: "Pending", paket: "Premium", orderDate: "" });
    }

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              order.orderId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "All" || order.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-8 relative">
            <PageHeader title="Pemesanan">
                <button 
                    onClick={() => setShowForm(true)}
                    className="bg-[#fa2b56] hover:bg-[#e01f46] text-white font-medium py-2 px-4 rounded-xl shadow-md shadow-pink-200 transition-all"
                >
                    + Add Pemesanan
                </button>
            </PageHeader>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4 font-serif">Tambah Pemesanan</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pasangan</label>
                                <input required type="text" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#fa2b56] focus:border-[#fa2b56]" placeholder="e.g. Andi & Bella" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pernikahan</label>
                                <input required type="date" value={formData.orderDate} onChange={(e) => setFormData({...formData, orderDate: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#fa2b56] focus:border-[#fa2b56]" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Paket</label>
                                <select value={formData.paket} onChange={(e) => setFormData({...formData, paket: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#fa2b56] focus:border-[#fa2b56]">
                                    <option value="Premium">Premium (Garden Paradise)</option>
                                    <option value="Deluxe">Deluxe (Grand Ballroom)</option>
                                    <option value="Standard">Standard (Cozy Intimate)</option>
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status Pemesanan</label>
                                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#fa2b56] focus:border-[#fa2b56]">
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium transition-colors">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-[#fa2b56] text-white rounded-lg hover:bg-[#e01f46] font-medium transition-colors">Simpan Pemesanan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <div>
                        <h2 className="font-semibold text-lg text-gray-800">Daftar Pemesanan</h2>
                        <span className="text-sm text-gray-500">Menampilkan {filteredOrders.length} pesanan</span>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                        <input 
                            type="text" 
                            placeholder="Cari ID atau Nama..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 sm:w-64 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#fa2b56] focus:border-[#fa2b56]"
                        />
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#fa2b56] focus:border-[#fa2b56] bg-white text-gray-700"
                        >
                            <option value="All">Semua Status</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
                            <tr>
                                <th className="px-6 py-4 font-semibold">ID</th>
                                <th className="px-6 py-4 font-semibold">Pasangan</th>
                                <th className="px-6 py-4 font-semibold">Tanggal</th>
                                <th className="px-6 py-4 font-semibold">Venue</th>
                                <th className="px-6 py-4 font-semibold">Paket</th>
                                <th className="px-6 py-4 font-semibold">Telepon</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {currentOrders.length > 0 ? (
                                currentOrders.map((item) => {
                                    // Helper values
                                    const idNum = parseInt(item.orderId.replace(/\D/g, '')) || 1;
                                    const phoneRepeated = idNum.toString().repeat(4).substring(0, 4);
                                    const phoneFormatted = `+62 812-${phoneRepeated}-${phoneRepeated}`;
                                    const venue = item.totalPrice >= 4000000 ? "Garden Paradise" : (item.totalPrice >= 2500000 ? "Grand Ballroom" : "Cozy Intimate");

                                    return (
                                    <tr key={item.orderId} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-5 font-semibold text-gray-500">#{idNum}</td>
                                        <td className="px-6 py-5 font-medium text-gray-800">{item.customerName}</td>
                                        <td className="px-6 py-5 text-gray-500">{item.orderDate}</td>
                                        <td className="px-6 py-5 text-gray-500">{venue}</td>
                                        <td className="px-6 py-5 text-gray-500">{getPaket(item.totalPrice)}</td>
                                        <td className="px-6 py-5 font-medium text-gray-500">{phoneFormatted}</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                                                item.status === 'Completed' ? 'bg-green-100 text-green-600'
                                                : item.status === 'Pending' ? 'bg-yellow-100 text-yellow-600'
                                                : 'bg-red-100 text-red-600'
                                            }`}>
                                                {item.status === 'Completed' ? 'Confirmed' : item.status}
                                            </span>
                                        </td>
                                    </tr>
                                )})
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        Tidak ada data pesanan yang sesuai.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Controls */}
                {filteredOrders.length > 0 && (
                    <div className="p-4 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                        <span className="text-sm text-gray-500">
                            Menampilkan {(currentPage - 1) * itemsPerPage + 1} hingga {Math.min(currentPage * itemsPerPage, filteredOrders.length)} dari {filteredOrders.length} pesanan
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