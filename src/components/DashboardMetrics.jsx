import { FaArrowUp, FaUserPlus, FaBoxOpen, FaReceipt } from "react-icons/fa";

export default function DashboardMetrics({ totalCustomers, totalOrders, completedRevenue, pendingOrders }) {
  return (
    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-secondary/5 rounded-full blur-xl"></div>
        <div className="flex justify-between items-start">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-barlow">Gross Revenue</p>
          <span className="p-2 bg-secondary/10 rounded-xl text-secondary"><FaReceipt size={12} /></span>
        </div>
        <div className="mt-6">
          <p className="text-xl font-bold text-gray-900 tracking-tight font-barlow">{completedRevenue}</p>
          <div className="flex items-center gap-1 mt-1 text-[9px] text-success font-bold">
            <FaArrowUp size={8} /> +14.2% <span className="text-gray-400 font-normal">this month</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
        <div className="flex justify-between items-start">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-barlow">Active Clients</p>
          <span className="p-2 bg-primary/10 rounded-xl text-primary"><FaUserPlus size={12} /></span>
        </div>
        <div className="mt-6">
          <p className="text-3xl font-bold text-gray-900 font-barlow">{totalCustomers}</p>
          <p className="text-[10px] text-primary font-medium mt-1">Akun aktif terverifikasi</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary-dark/5 rounded-full blur-xl"></div>
        <div className="flex justify-between items-start">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-barlow">Bookings</p>
          <span className="p-2 bg-primary-dark/10 rounded-xl text-primary-dark"><FaBoxOpen size={12} /></span>
        </div>
        <div className="mt-6">
          <p className="text-3xl font-bold text-gray-900 font-barlow">{totalOrders}</p>
          <span className="inline-flex mt-1 text-[9px] text-amber-700 bg-amber-50 font-medium px-2 py-0.5 rounded-md border border-amber-100">
            {pendingOrders} Pending Action
          </span>
        </div>
      </div>
    </div>
  );
}
