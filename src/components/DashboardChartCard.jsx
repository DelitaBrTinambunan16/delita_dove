import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardChartCard({ data }) {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.015)] space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Performa Aliran Finansial</h3>
          <p className="text-[11px] text-gray-400 font-light">Analisis komparasi omzet kotor dan laba bersih</p>
        </div>
        <div className="flex gap-2 text-[9px] font-bold text-gray-400 font-barlow tracking-wider bg-gray-50 p-1.5 rounded-lg border border-gray-100">
          <span className="flex items-center gap-1 px-1.5"><span className="w-1.5 h-1.5 bg-primary-dark/20 rounded-full"></span> GROSS</span>
          <span className="flex items-center gap-1 bg-white shadow-xs px-2 py-0.5 rounded-md text-primary-dark"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> PROFIT</span>
        </div>
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 0, right: -5, left: -25, bottom: 0 }}>
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 'bold' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94A3B8", fontSize: 10 }} />
            <Tooltip
              cursor={{ fill: 'rgba(16, 185, 129, 0.04)' }}
              contentStyle={{ backgroundColor: '#065F46', border: 'none', borderRadius: '16px', color: '#FFF', fontSize: '11px' }}
            />
            <Bar dataKey="sales" fill="#E6F4EA" radius={[6, 6, 0, 0]} maxBarSize={14} />
            <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', stroke: '#FFF', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
