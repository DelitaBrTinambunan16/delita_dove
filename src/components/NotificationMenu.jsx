import { FaBell, FaEnvelope } from "react-icons/fa";

export default function NotificationMenu() {
  return (
    <div className="flex items-center gap-3 text-gray-500">
      <button className="p-2 hover:bg-gray-100 rounded-full transition relative">
        <FaBell size={18} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
      <button className="p-2 hover:bg-gray-100 rounded-full transition">
        <FaEnvelope size={18} />
      </button>
    </div>
  );
}
