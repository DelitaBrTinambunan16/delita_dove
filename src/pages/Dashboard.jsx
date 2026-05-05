import { FaSearch, FaBell, FaEnvelope, FaEllipsisH, FaArrowUp, FaCaretDown } from "react-icons/fa";
import orders from "../data/orders";

export default function Dashboard() {
  return (
    <div className="p-8 bg-[#F8F9FA] min-h-screen font-poppins text-gray-800">
      
      {/* 1. SALES OVERVIEW SECTION  */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Sales Overview</h2>
          <FaEllipsisH className="text-gray-400 cursor-pointer" />
        </div>
        {/* STATISTIC CARD ANATOMY */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Angka Utama */}
          <div className="min-w-[200px]">
            <p className="text-sm text-gray-400 font-medium">Total Sales</p>
            <div className="flex items-center gap-3 mt-1">
              <h1 className="text-3xl font-bold text-gray-900 font-barlow">Rp 285.000.000</h1>
              <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                <FaArrowUp size={10} /> 5,3%
              </span>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Sales
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <div className="w-3 h-3 bg-emerald-200 rounded-sm"></div> Gross Margin
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <div className="w-3 h-3 bg-lime-300 rounded-sm"></div> Net Profit
              </div>
            </div>
          </div>

          {/* Placeholder Grafik Batang */}
          <div className="flex-1 h-48 flex items-end gap-2 px-4">
             {/* Mockup Bars */}
             {[40, 70, 45, 90, 65, 80, 30, 95, 50, 75, 60, 85].map((h, i) => (
               <div key={i} className="flex-1 flex gap-1 items-end h-full">
                 <div className="w-full bg-emerald-500 rounded-t-sm" style={{height: `${h}%`}}></div>
                 <div className="w-full bg-lime-300 rounded-t-sm" style={{height: `${h*0.6}%`}}></div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* 2. MIDDLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* \ (Donut Chart) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Sales by Category</h2>
            <FaEllipsisH className="text-gray-400 cursor-pointer" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-4">
               <div>
                 <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                   <div className="w-2 h-2 rounded-full bg-emerald-600"></div> Premium (40%)
                 </div>
                 <p className="text-[10px] text-gray-400 ml-4">2,365 Products</p>
               </div>
               <div>
                 <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                   <div className="w-2 h-2 rounded-full bg-emerald-400"></div> Deluxe (35%)
                 </div>
                 <p className="text-[10px] text-gray-400 ml-4">1,980 Products</p>
               </div>
               <div>
                 <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                   <div className="w-2 h-2 rounded-full bg-lime-300"></div> Standard (15%)
                 </div>
                 <p className="text-[10px] text-gray-400 ml-4">297 Products</p>
               </div>
            </div>
            {/* Donut Placeholder */}
            <div className="w-32 h-32 rounded-full border-[16px] border-emerald-500 border-l-lime-300 border-b-emerald-200 relative">
               <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-400">TOTAL</div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Total Orders by Platform (Line Chart) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Orders by Platform</h2>
            <FaEllipsisH className="text-gray-400 cursor-pointer" />
          </div>
          <div className="flex gap-4 mb-4">
             <div className="text-xs font-bold">Tokopedia <span className="text-emerald-500 ml-1">↑ 6,9%</span></div>
             <div className="text-xs font-bold">Shopee <span className="text-red-500 ml-1">↓ 6,9%</span></div>
          </div>
          {/* Line Chart Placeholder */}
          <div className="w-full h-32 bg-[url('https://www.svgrepo.com/show/501196/line-chart.svg')] bg-center bg-no-repeat opacity-20"></div>
        </div>

      </div>

      {/* 3. BOTTOM SECTION: VISITORS (DATA TERBARU) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Recent Wedding Orders</h2>
          <div className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            Monthly <FaCaretDown />
          </div>
        </div>
        
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] text-gray-400 uppercase tracking-widest border-b border-gray-50">
              <th className="pb-4">Order ID</th>
              <th className="pb-4">Customer</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.slice(0, 4).map((order, i) => (
              <tr key={i} className="text-sm">
                <td className="py-4 font-bold text-gray-400">#{order.orderId.replace(/\D/g, '')}</td>
                <td className="py-4 font-bold text-gray-800">{order.customerName}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
                    order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {order.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 text-right font-bold font-barlow text-gray-700">Rp {order.totalPrice.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}