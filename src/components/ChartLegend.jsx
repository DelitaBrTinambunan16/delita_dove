export default function ChartLegend({ items }) {
  return (
    <div className="flex items-center gap-5 pb-0.5">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span 
            className="w-2.5 h-2.5 rounded-sm" 
            style={{ background: item.color }} 
          />
          <span className="text-[10px] font-semibold text-gray-500">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}