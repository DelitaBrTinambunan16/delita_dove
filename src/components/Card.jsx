import { FaEllipsisH } from "react-icons/fa";

function Card({ title, children, action }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-bold text-gray-800">{title}</h2>
        {action || <FaEllipsisH className="text-gray-300 cursor-pointer hover:text-gray-500 transition" size={14} />}
      </div>
      {children}
    </div>
  );
}

export default Card;
