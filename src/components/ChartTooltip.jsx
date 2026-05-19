import { fmtShort } from "../utils/formatters";

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-gray-700 mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value > 1000 ? `Rp ${fmtShort(p.value)}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default ChartTooltip;
