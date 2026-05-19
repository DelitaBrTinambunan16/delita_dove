import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function StatCard({ label, value, sub, change, up, icon, bg, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex flex-col gap-1.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
          <p className="text-lg font-extrabold text-gray-900 leading-none">{value}</p>
        </div>
        <div className={`p-2 rounded-xl ${bg} ${color}`}>{icon}</div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`flex items-center gap-0.5 text-[9px] font-bold ${up ? "text-emerald-500" : "text-red-400"}`}>
          {up ? <FaArrowUp size={9} /> : <FaArrowDown size={9} />} {change}
        </span>
        <span className="text-[9px] text-gray-400">{sub}</span>
      </div>
    </div>
  );
}