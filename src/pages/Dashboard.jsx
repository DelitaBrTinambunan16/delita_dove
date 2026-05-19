import { FaArrowUp, FaCaretDown, FaUsers, FaBox, FaClipboardList, FaChartLine } from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import orders from "../data/orders";
import customers from "../data/customers";
import produkData from "../data/produkData.json";

import Card from "../components/Card";
import StatsSection from "../components/StatsSection";
import ChartLegend from "../components/ChartLegend";

import {
  monthlyData,
  categoryPie,
  platformData,
} from "../data/dashboardData";

// ── FORMATTER LOKAL ──

const fmtRupiahLokal = (value) => {
  if (!value) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const fmtShortLokal = (value) => {
  if (!value) return "0";

  if (value >= 1e6) {
    return (value / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  }

  if (value >= 1e3) {
    return (value / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  }

  return value.toString();
};

const statusStyle = {
  Completed:
    "bg-emerald-50 text-emerald-600 border border-emerald-100",

  Pending:
    "bg-amber-50 text-amber-600 border border-amber-100",

  Cancelled:
    "bg-rose-50 text-rose-600 border border-rose-100",
};

// ── MAIN COMPONENT ──

export default function Dashboard() {
  const completed = orders.filter((o) => o.status === "Completed");

  const totalRev = completed.reduce(
    (s, o) => s + o.totalPrice,
    0
  );

  const pending = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  const recentOrders = orders.slice(0, 3);

  const STATS = [
    {
      label: "Total Revenue",
      value: fmtShortLokal(totalRev),
      sub: `${completed.length} completed`,
      change: "+5.3%",
      up: true,
      icon: <FaChartLine size={16} />,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
    },

    {
      label: "Total Orders",
      value: orders.length,
      sub: `${pending} pending`,
      change: "+3.1%",
      up: true,
      icon: <FaClipboardList size={16} />,
      bg: "bg-sky-50",
      color: "text-sky-500",
    },

    {
      label: "Total Customers",
      value: customers.length,
      sub: "Gold, Silver, Bronze",
      change: "+8.2%",
      up: true,
      icon: <FaUsers size={16} />,
      bg: "bg-amber-50",
      color: "text-amber-500",
    },

    {
      label: "Total Products",
      value: produkData.length,
      sub: "10 kategori",
      change: "-1.0%",
      up: false,
      icon: <FaBox size={16} />,
      bg: "bg-purple-50",
      color: "text-purple-500",
    },
  ];

  const CHART_LEGEND_ITEMS = [
    { label: "Sales", color: "#10B981" },
    { label: "Gross Margin", color: "#34D399" },
    { label: "Net Profit", color: "#A7F3D0" },
  ];

  return (
    <div className="space-y-1">

      {/* ── STAT CARDS ── */}
      <StatsSection stats={STATS} />

      {/* ── SALES OVERVIEW ── */}
      <Card title="Sales Overview">

        <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-4">

          <div>
            <p className="text-xs text-gray-400 font-medium">
              Total Sales
            </p>

            <div className="flex items-baseline gap-2 mt-0.5">

              <h1 className="text-2xl font-extrabold text-gray-900">
                {fmtRupiahLokal(totalRev)}
              </h1>

              <span className="text-emerald-500 text-xs font-bold flex items-center gap-0.5">
                <FaArrowUp size={9} /> 5,3%
              </span>

            </div>
          </div>

          <ChartLegend items={CHART_LEGEND_ITEMS} />

        </div>

        <ResponsiveContainer width="100%" height={120}>

          <BarChart data={monthlyData} barSize={7} barGap={2}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F3F4F6"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tickFormatter={(v) => fmtShortLokal(v)}
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              width={40}
            />

            <Tooltip />

            <Bar
              dataKey="sales"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              name="Sales"
            />

            <Bar
              dataKey="gross"
              fill="#34D399"
              radius={[4, 4, 0, 0]}
              name="Gross Margin"
            />

            <Bar
              dataKey="profit"
              fill="#A7F3D0"
              radius={[4, 4, 0, 0]}
              name="Net Profit"
            />

          </BarChart>

        </ResponsiveContainer>

      </Card>

      {/* ── MIDDLE ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

        {/* Donut Chart */}
        <Card title="Sales by Category">

          <div className="flex items-center justify-between gap-4">

            <div className="space-y-3">

              {categoryPie.map((c, i) => (
                <div key={i} className="flex items-center gap-2">

                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: c.color }}
                  />

                  <span className="text-xs font-semibold text-gray-600">
                    {c.name} ({c.value}%)
                  </span>

                </div>
              ))}

            </div>

            <PieChart width={80} height={80}>

              <Pie
                data={categoryPie}
                cx={40}
                cy={40}
                innerRadius={28}
                outerRadius={36}
                paddingAngle={3}
                dataKey="value"
              >

                {categoryPie.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </div>

        </Card>

        {/* Line Chart */}
        <Card title="Orders by Platform">

          <div className="flex flex-wrap gap-4 mb-4">

            {[
              {
                label: "Website",
                val: "8.983",
                up: true,
                color: "#10B981",
              },

              {
                label: "WhatsApp",
                val: "18.112",
                up: false,
                color: "#34D399",
              },

              {
                label: "Referral",
                val: "3.645",
                up: true,
                color: "#6EE7B7",
              },
            ].map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-1.5"
              >

                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: b.color }}
                />

                <span className="text-[10px] font-bold text-gray-500">
                  {b.label}
                </span>

                <span className="text-[10px] font-extrabold text-gray-700">
                  {b.val}
                </span>

                <span
                  className={`text-[9px] font-bold ${
                    b.up
                      ? "text-emerald-500"
                      : "text-red-400"
                  }`}
                >
                  {b.up ? "↑" : "↓"} 6,9%
                </span>

              </div>
            ))}

          </div>

          <ResponsiveContainer width="100%" height={90}>

            <LineChart data={platformData}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F3F4F6"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="website"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={false}
                name="Website"
              />

              <Line
                type="monotone"
                dataKey="whatsapp"
                stroke="#34D399"
                strokeWidth={2.5}
                dot={false}
                name="WhatsApp"
              />

              <Line
                type="monotone"
                dataKey="referral"
                stroke="#6EE7B7"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#6EE7B7" }}
                name="Referral"
              />

            </LineChart>

          </ResponsiveContainer>

        </Card>

      </div>

      {/* ── RECENT ORDERS ── */}
      <Card
        title="Recent Wedding Orders"
        action={
          <div className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition font-semibold">
            Monthly <FaCaretDown size={11} />
          </div>
        }
      >

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>
              <tr className="border-b border-gray-50">

                {[
                  "Order ID",
                  "Customer",
                  "Date",
                  "Status",
                  "Amount",
                ].map((h) => (
                  <th
                    key={h}
                    className="pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400"
                  >
                    {h}
                  </th>
                ))}

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">

              {recentOrders.map((o, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50/50 transition"
                >

                  <td className="py-2 text-xs font-bold text-gray-400">
                    #{o.orderId.replace(/\D/g, "")}
                  </td>

                  <td className="py-2 text-xs font-bold text-gray-800">
                    {o.customerName}
                  </td>

                  <td className="py-2 text-xs text-gray-400">
                    {o.orderDate}
                  </td>

                  <td className="py-2">

                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${statusStyle[o.status]}`}
                    >
                      {o.status.toUpperCase()}
                    </span>

                  </td>

                  <td className="py-2 text-xs font-bold text-gray-700">
                    {fmtRupiahLokal(o.totalPrice)}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </Card>

    </div>
  );
}