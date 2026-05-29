import { formatRupiah } from "../utils/format";

export default function DashboardRecentOrders({ recentOrders }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.015)] flex flex-col justify-between">
      <div>
        <div className="pb-3 mb-4 flex justify-between items-center border-b border-gray-50">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Recent Inquiries</h3>
            <p className="text-[11px] text-gray-400 font-light">Aktivitas pesanan real-time</p>
          </div>
          <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">LIVE</span>
        </div>
        <div className="space-y-2.5">
          {recentOrders.map((order) => (
            <div key={order.orderId} className="flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all group">
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${order.status === "Completed" ? "bg-success" : "bg-amber-500"}`} />
                <div>
                  <p className="font-bold text-xs text-gray-800 group-hover:text-primary transition-colors">{order.customerName}</p>
                  <p className="text-[10px] text-gray-400 font-light">{order.orderDate}</p>
                </div>
              </div>
              <span className="font-barlow text-xs text-gray-900 font-bold">{formatRupiah(order.totalPrice)}</span>
            </div>
          ))}
        </div>
      </div>
      <button className="w-full mt-4 bg-primary-dark hover:bg-primary text-white font-bold text-[11px] py-2.5 rounded-xl transition-all shadow-sm active:scale-95 duration-150 cursor-pointer">
        Lihat Semua Log
      </button>
    </div>
  );
}
