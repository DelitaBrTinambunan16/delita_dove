import { FaSearch, FaBell, FaEnvelope } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import profileImg from "../assets/profile.png";

export default function Header() {
    const location = useLocation();

    return (
        <div className="flex items-center justify-between w-full py-4 bg-transparent">

            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

            <div className="flex items-center gap-6">
                {/* SEARCH - Dibuat lebih tipis & clean */}
                <div className="relative hidden md:block">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-64 pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 outline-none focus:border-[#10B981] focus:ring-1 focus:ring-emerald-100 transition text-sm"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                </div>

                {/* ICONS - Notif & Message */}
                <div className="flex items-center gap-3 text-gray-500">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition relative">
                        <FaBell size={18} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                        <FaEnvelope size={18} />
                    </button>
                </div>

                {/* PROFILE */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <img
                        src={profileImg}
                        alt="User Profile"
                        className="w-9 h-9 rounded-full object-cover border-2 border-emerald-100 shadow-sm"
                    />
                    {/*Tampilkan nama jika layar lebar */}
                    <div className="hidden lg:block">
                         <p className="text-sm font-semibold text-gray-800 leading-none">Delita Br Tinambunan</p>
                         <p className="text-[11px] text-gray-400 mt-1">Admin Manager</p>
                    </div>
                </div>
            </div>
        </div>
    );
}