export default function Button({ children, type = "primary" }) {
  const types = {
    primary:   "bg-[#10B981] hover:bg-emerald-600 text-white",
    secondary: "bg-stone-500 hover:bg-stone-600 text-white",
    success:   "bg-emerald-500 hover:bg-emerald-600 text-white",
    danger:    "bg-red-500 hover:bg-red-600 text-white",
    warning:   "bg-amber-500 hover:bg-amber-600 text-white",
  };

  return (
    <button className={`${types[type]} px-4 py-2 rounded-lg font-semibold text-sm transition-colors`}>
      {children}
    </button>
  );
}