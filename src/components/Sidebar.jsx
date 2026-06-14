import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaChartLine,
  FaBox,
  FaUsers,
  FaClipboardList,
  FaBullhorn,
  FaEnvelope,
  FaGem,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";

export default function Sidebar() {
  // Efek hover & klik aktif memanfaatkan variabel dari @theme kamu
  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2 text-[13px] font-medium tracking-wide
    transition-all duration-150 ease-in-out active:scale-[0.97] active:bg-white/10
    ${isActive 
      ? "bg-white/10 text-secondary font-semibold border-l-4 border-secondary pl-2.5 shadow-sm" 
      : "text-emerald-100/70 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-primary-dark flex flex-col px-4 py-6 font-poppins shadow-xl select-none text-white">

      {/* ── BRAND SECTION ── */}
      <div className="mb-6 px-2">
        <div className="flex items-center gap-3 py-3 border-b border-white/10">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md shadow-inner">
            <FaGem className="h-4 w-4 text-secondary" />
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-emerald-300/60 font-bold font-barlow">SayYes</p>
            <h1 className="text-lg font-black tracking-tight text-white -mt-0.5">WeddingDay</h1>
          </div>
        </div>
      </div>

      {/* ── ADMIN CARD ── */}
      {/* <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold font-barlow text-sm shadow-md">
          AD
        </div>
        <div>
          <h2 className="text-xs font-bold text-white tracking-wide">Admin Dashboard</h2>
          <p className="text-[10px] text-emerald-300/60 font-light">SayYes WeddingDay System</p>
        </div>
      </div> */}

      {/* ── MAIN MENU SECTIONS ── */}
      <div className="flex-1 space-y-1">
        <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-emerald-400/60 font-barlow">Menu Utama</p>

        <NavLink to="/admin/dashboard" end className={menuClass}>
          <FaChartLine size={15} /> <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/customers" className={menuClass}>
          <FaUsers size={15} /> <span>Customers</span>
        </NavLink>

        <NavLink to="/admin/orders" className={menuClass}>
          <FaClipboardList size={15} /> <span>Orders</span>
        </NavLink>

        <NavLink to="/admin/products" className={menuClass}>
          <FaBox size={15} /> <span>Products</span>
        </NavLink>

        <NavLink to="/admin/campaign" className={menuClass}>
          <FaBullhorn size={15} /> <span>Campaign</span>
        </NavLink>

        <NavLink to="/admin/message" className={menuClass}>
          <FaEnvelope size={15} /> <span>Message</span>
        </NavLink>

        {/* <NavLink to="/admin/member" className={menuClass}>
          <FaUserShield size={15} /> <span>Member</span>
        </NavLink> */}

      </div>

      {/* ── FOOTER UTILITY ── */}
      <div className="pt-4 border-t border-white/10">
        <NavLink 
          to="/login" 
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-emerald-200/60 font-medium text-[13px] transition-all duration-150 active:scale-[0.97] hover:bg-red-500/20 hover:text-danger tracking-wide"
        >
          <FaSignOutAlt size={15} /> <span>Keluar</span>
        </NavLink>
      </div>
    </aside>
  );
}