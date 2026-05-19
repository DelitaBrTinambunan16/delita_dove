import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

export default function Alert({ type = "success", message, onClose }) {
  const styles = {
    success: {
      container: "bg-emerald-50 border border-emerald-200 text-emerald-700",
      icon: <FaCheckCircle className="text-emerald-500 flex-shrink-0" size={15} />,
    },
    error: {
      container: "bg-red-50 border border-red-200 text-red-600",
      icon: <FaExclamationCircle className="text-red-400 flex-shrink-0" size={15} />,
    },
    warning: {
      container: "bg-amber-50 border border-amber-200 text-amber-600",
      icon: <FaInfoCircle className="text-amber-400 flex-shrink-0" size={15} />,
    },
    info: {
      container: "bg-sky-50 border border-sky-200 text-sky-600",
      icon: <FaInfoCircle className="text-sky-400 flex-shrink-0" size={15} />,
    },
  };

  const { container, icon } = styles[type] || styles.info;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${container}`}>
      {icon}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 transition">
          <FaTimes size={12} />
        </button>
      )}
    </div>
  );
}