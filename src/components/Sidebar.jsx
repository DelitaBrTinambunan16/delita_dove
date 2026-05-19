import { NavLink } from "react-router-dom"
import {
  FaChartLine, FaBox, FaUsers, FaClipboardList,
  FaBullhorn, FaEnvelope, FaSignOutAlt
} from "react-icons/fa"

export default function Sidebar() {

  const menuClass = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-xl mb-1 transition-all duration-300 font-semibold text-[13px] tracking-tight
    ${isActive
      ? "bg-emerald-50 text-[#10B981]"
      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
    }`

  return (
    <div className="w-[220px] min-h-screen bg-white border-r border-gray-100 flex flex-col px-4 py-6 flex-shrink-0">

      {/* ADMIN BADGE */}
      <div className="mb-6 px-1">
        <div className="inline-flex items-center gap-3 px-3 py-2 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm w-full">
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-400 leading-none">
              Admin
            </span>
            <span className="text-[12px] font-bold text-gray-800 leading-tight">
              Dashboard
            </span>
          </div>
        </div>
      </div>

      {/* LOGO */}
      <div className="flex items-center gap-3 mb-6 px-3">
        <span className="text-lg font-extrabold text-gray-900 tracking-tighter">
          Wedding<span className="text-[#10B981]">Day</span>
        </span>
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest px-4 mb-4">
          Main Menu
        </p>

        <NavLink to="/" end className={menuClass}>
          <FaChartLine size={18} /> Overview
        </NavLink>

        <NavLink to="/customers" className={menuClass}>
          <FaUsers size={18} /> Customer
        </NavLink>

        <NavLink to="/orders" className={menuClass}>
          <FaClipboardList size={18} /> Order
        </NavLink>

        <NavLink to="/products" className={menuClass}>
          <FaBox size={18} /> Produk
        </NavLink>

        <NavLink to="/campaign" className={menuClass}>
          <FaBullhorn size={18} /> Campaign
        </NavLink>

        <NavLink to="/message" className={menuClass}>
          <FaEnvelope size={18} /> Message
        </NavLink>
      </div>

      {/* LOGOUT */}
      <div className="pt-6 border-t border-gray-100">
        <NavLink
          to="/login"
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 font-semibold text-[13px] hover:text-red-500 hover:bg-red-50 transition-all duration-300"
        >
          <FaSignOutAlt size={18} /> Logout
        </NavLink>
      </div>
    </div>
  )
}