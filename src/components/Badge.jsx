export default function Badge({ type, value }) {

  // LOYALTY BADGE (Gold / Silver / Bronze)
  if (type === "loyalty") {
    const styles = {
      Gold:   "bg-amber-50 text-amber-600",
      Silver: "bg-stone-100 text-stone-600",
      Bronze: "bg-emerald-50 text-emerald-600",
    };
    return (
      <span className={`px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase ${styles[value] || "bg-gray-100 text-gray-500"}`}>
        {value}
      </span>
    );
  }

  // STATUS BADGE (Completed / Pending / Cancelled)
  if (type === "status") {
    const styles = {
      Completed: "bg-green-100 text-green-600",
      Pending:   "bg-yellow-100 text-yellow-600",
      Cancelled: "bg-red-100 text-red-500",
    };
    const label = value === "Completed" ? "Confirmed" : value;
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${styles[value] || "bg-gray-100 text-gray-500"}`}>
        {label}
      </span>
    );
  }

  // DEFAULT
  return (
    <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-500">
      {value}
    </span>
  );
}