import { NavLink } from "react-router-dom"
import { FaHeart, FaHome, FaCalendarAlt, FaCommentAlt, FaImage, FaCog, FaSignOutAlt } from "react-icons/fa"

export default function Sidebar() {

    const menuClass = ({ isActive }) =>
        `flex cursor-pointer items-center rounded-xl p-4 space-x-4 mb-2 transition-all duration-300
        ${isActive ?
            "text-white bg-[#fa2b56] font-semibold" :
            "text-gray-600 hover:text-[#fa2b56] hover:bg-pink-50"
        }`

    return (
        <div id="sidebar" className="hidden md:flex min-h-screen w-72 flex-col bg-white border-r border-gray-100 px-6 py-8 z-20">
            {/* Logo */}
            <div id="sidebar-logo" className="flex items-center space-x-3 mb-10 pl-2">
                <FaHeart className="w-6 h-6 text-[#fa2b56]" />
                <span id="logo-title" className="font-serif text-xl font-bold text-gray-900">
                    Admin Blush Moments Wedding
                </span>
            </div>

            {/* List Menu */}
            <div id="sidebar-menu" className="flex-1">
                <ul id="menu-list" className="space-y-1">
                    <li>
                        <NavLink to="/" className={menuClass}>
                            <FaHome className="text-xl" />
                            <div id="menu-1">Dashboard</div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/orders" className={menuClass}>
                            <FaCalendarAlt className="text-xl" />
                            <div id="menu-2">Pemesanan</div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/portfolio" className={menuClass}>
                            <FaImage className="text-xl" />
                            <div id="menu-4">Portfolio</div>
                        </NavLink>
                    </li>
                    {/* <li>
                        <NavLink to="/settings" className={menuClass}>
                            <FaCog className="text-xl"/>
                            <div id="menu-5">Pengaturan</div>
                        </NavLink>
                    </li> */}
                </ul>
            </div>

            {/* Footer */}
            <div id="sidebar-footer" className="mt-auto">
                <NavLink to="/login" className="flex cursor-pointer items-center rounded-xl p-4 space-x-4 text-gray-600 hover:text-[#fa2b56] hover:bg-pink-50 transition-all duration-300 font-semibold mb-4">
                    <FaSignOutAlt className="text-xl" />
                    <span>Logout</span>
                </NavLink>
            </div>
        </div>
    );
}