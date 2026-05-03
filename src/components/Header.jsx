import { FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import profileImg from "../assets/profile.png";

export default function Header() {
    const location = useLocation();

    return (
        <div id="header-container" className="flex justify-between items-center p-4 bg-white shadow-sm z-10 relative h-[72px]">
            {/* Search Bar */}
            {location.pathname === "/" ? (
                <div id="search-bar" className="relative w-full max-w-lg hidden md:block">
                    <input
                        id="search-input"
                        type="text"
                        placeholder="Search Here..."
                        className="border border-pink-100 p-2 pr-10 bg-pink-50/30 w-full max-w-lg rounded-xl outline-none focus:ring-1 focus:ring-[#fa2b56]"
                    />
                    <FaSearch id="search-icon" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300" />
                </div>
            ) : (
                <div></div>
            )}

            {/* Icon & Profile Section */}
            <div id="icons-container" className="flex items-center space-x-4 w-full md:w-auto justify-end">
                {/* Profile Section */}
                <div id="profile-container" className="flex items-center space-x-4 border-l pl-4 border-gray-200">
                    <span id="profile-text" className="text-gray-800 text-sm hidden sm:block">
                        Hello, <b className="text-black">Delita Br Tinambunan</b>
                    </span>
                    <img
                        id="profile-avatar"
                        src={profileImg}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                </div>
            </div>
        </div>
    );
}