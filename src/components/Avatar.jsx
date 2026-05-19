export default function Avatar({ name, size = "md" }) {

  // Ambil inisial dari nama (maks 2 huruf)
  const initials = name
    ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  // Warna background berdasarkan huruf pertama
  const colors = [
    "bg-emerald-100 text-emerald-700",
    "bg-sky-100 text-sky-700",
    "bg-amber-100 text-amber-700",
    "bg-purple-100 text-purple-700",
    "bg-rose-100 text-rose-700",
    "bg-teal-100 text-teal-700",
    "bg-orange-100 text-orange-700",
    "bg-indigo-100 text-indigo-700",
  ];
  const colorIndex = (name?.charCodeAt(0) || 0) % colors.length;
  const colorClass = colors[colorIndex];

  // Ukuran
  const sizeClass = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-12 h-12 text-sm",
  }[size] || "w-9 h-9 text-xs";

  return (
    <div className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}