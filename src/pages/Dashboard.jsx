import { FaRegCalendarAlt, FaRegCommentDots, FaRegImage, FaChartLine } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import orders from "../data/orders";

export default function Dashboard() {

    const getPaket = (price) => {
        if (price >= 4000000) return "Premium";
        if (price >= 2500000) return "Deluxe";
        return "Standard";
    }

    return (
        <div id="dashboard-container" className="p-8">
            <PageHeader title="Dashboard" />
            
            <div id="dashboard-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Orders Card */}
                <div id="dashboard-orders" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <div id="orders-icon" className="bg-blue-500 text-white text-xl rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                        <FaRegCalendarAlt />
                    </div>
                    <span id="orders-text" className="text-sm text-gray-500 mb-1">Total Pemesanan</span>
                    <span id="orders-count" className="text-3xl font-medium text-gray-800 mb-2">47</span>
                    <span className="text-xs text-gray-400">+12% dari bulan lalu</span>
                </div>

                {/* New Messages Card */}
                <div id="dashboard-delivered" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <div id="delivered-icon" className="bg-green-500 text-white text-xl rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                        <FaRegCommentDots />
                    </div>
                    <span id="delivered-text" className="text-sm text-gray-500 mb-1">Pesan Baru</span>
                    <span id="delivered-count" className="text-3xl font-medium text-gray-800 mb-2">23</span>
                    <span className="text-xs text-gray-400">8 belum dibaca</span>
                </div>

                {/* Portfolio Card */}
                <div id="dashboard-canceled" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <div id="canceled-icon" className="bg-purple-500 text-white text-xl rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                        <FaRegImage />
                    </div>
                    <span id="canceled-text" className="text-sm text-gray-500 mb-1">Portfolio Items</span>
                    <span id="canceled-count" className="text-3xl font-medium text-gray-800 mb-2">156</span>
                    <span className="text-xs text-gray-400">+5 minggu ini</span>
                </div>

                {/* Revenue Card */}
                <div id="dashboard-revenue" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <div id="revenue-icon" className="bg-[#fa2b56] text-white text-xl rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                        <FaChartLine />
                    </div>
                    <span id="revenue-text" className="text-sm text-gray-500 mb-1">Revenue Bulan Ini</span>
                    <span id="revenue-amount" className="text-3xl font-medium text-gray-800 mb-2">Rp 285jt</span>
                    <span className="text-xs text-gray-400">+18% dari bulan lalu</span>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-semibold text-lg text-gray-800">Pemesanan Terbaru</h2>
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
                            {orders.slice(0, 5).map((item, index) => {
                                const idNum = parseInt(item.orderId.replace(/\D/g, '')) || 1;
                                const phoneRepeated = idNum.toString().repeat(4).substring(0, 4);
                                const phoneFormatted = `+62 812-${phoneRepeated}-${phoneRepeated}`;
                                const venue = item.totalPrice >= 4000000 ? "Garden Paradise" : (item.totalPrice >= 2500000 ? "Grand Ballroom" : "Cozy Intimate");

                                return (
                                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
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
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}