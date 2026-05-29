import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ordersData from "../data/orders.json";
import customersData from "../data/customers.json";
import dashboardData from "../data/dashboardData.json";
import { formatRupiah } from "../utils/format";
import DashboardIntroBar from "../components/DashboardIntroBar";
import DashboardHero from "../components/DashboardHero";
import DashboardMetrics from "../components/DashboardMetrics";
import DashboardChartCard from "../components/DashboardChartCard";
import DashboardRecentOrders from "../components/DashboardRecentOrders";

const { monthlyData } = dashboardData;

export default function Dashboard() {
  const totalCustomers = customersData.length;
  const totalOrders = ordersData.length;
  const pendingOrders = ordersData.filter((order) => order.status === "Pending").length;
  const completedRevenue = ordersData
    .filter((order) => order.status === "Completed")
    .reduce((sum, order) => sum + order.totalPrice, 0);

  const recentOrders = [...ordersData]
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 4);

  // 1. Calculate Membership Segmentation (Pie Chart)
  const membershipPieData = useMemo(() => {
    const counts = customersData.reduce((acc, customer) => {
      const loyalty = customer.loyalty || "Bronze";
      acc[loyalty] = (acc[loyalty] || 0) + 1;
      return acc;
    }, {});

    const colorMap = {
      Platinum: "#8B5CF6",
      Gold: "#C5A358",
      Silver: "#94A3B8",
      Bronze: "#EA580C",
    };

    return [
      { name: "Bronze", value: counts["Bronze"] || 0, color: colorMap.Bronze },
      { name: "Silver", value: counts["Silver"] || 0, color: colorMap.Silver },
      { name: "Gold", value: counts["Gold"] || 0, color: colorMap.Gold },
      { name: "Platinum", value: counts["Platinum"] || 0, color: colorMap.Platinum },
    ];
  }, []);

  // 2. Calculate Customer Source (Bar Chart)
  const sourceBarData = useMemo(() => {
    const counts = customersData.reduce((acc, customer) => {
      const source = customer.source || "Referral";
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    const colorMap = {
      Instagram: "#10B981",
      TikTok: "#34D399",
      Google: "#C5A358",
      Referral: "#065F46",
    };

    const preferredOrder = ["Instagram", "TikTok", "Google", "Referral"];
    const entries = Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      fill: colorMap[name] || "#94A3B8",
    }));

    const ordered = preferredOrder
      .map((name) => entries.find((entry) => entry.name === name))
      .filter(Boolean);

    return [
      ...ordered,
      ...entries.filter((entry) => !preferredOrder.includes(entry.name)),
    ];
  }, []);

  return (
    <div className="space-y-6 pb-12 text-gray-900 font-poppins bg-natural-bg min-h-screen w-full px-6 pt-4">
      <DashboardIntroBar />

      {/* Hero & Metrics */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <DashboardHero pendingOrders={pendingOrders} />
        <DashboardMetrics
          totalCustomers={totalCustomers}
          totalOrders={totalOrders}
          completedRevenue={formatRupiah(completedRevenue)}
          pendingOrders={pendingOrders}
        />
      </section>

      {/* Main Charts & Recent Orders */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardChartCard data={monthlyData} />
        <DashboardRecentOrders recentOrders={recentOrders} />
      </section>

<section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pie Chart: Membership Level */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.015)] flex flex-col justify-between h-96">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Segmentasi Level Membership</h3>
            <p className="text-[11px] text-gray-400 font-light mt-0.5">Proporsi pembagian loyalitas pelanggan</p>
          </div>

          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 my-2">
            <div className="w-40 h-40 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#065F46",
                      border: "none",
                      borderRadius: "12px",
                      color: "#FFF",
                      fontSize: "11px",
                    }}
                  />
                  <Pie
                    data={membershipPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {membershipPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 space-y-2 text-xs w-full">
              {membershipPieData.map((entry) => {
                const percentage = ((entry.value / totalCustomers) * 100).toFixed(1);
                return (
                  <div key={entry.name} className="flex justify-between items-center bg-gray-50/50 p-2 rounded-xl border border-gray-100/50">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                      <span className="font-semibold text-gray-700">{entry.name}</span>
                    </div>
                    <span className="text-gray-500 font-medium">
                      {entry.value} ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bar Chart: Customer Acquisition Source */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.015)] flex flex-col justify-between h-96">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Sumber Customer</h3>
            <p className="text-[11px] text-gray-400 font-light mt-0.5">Saluran pemasaran asal mula customer didapat</p>
          </div>

          <div className="flex-1 w-full h-52 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceBarData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: "bold" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 10 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(16, 185, 129, 0.02)" }}
                  contentStyle={{
                    backgroundColor: "#065F46",
                    border: "none",
                    borderRadius: "12px",
                    color: "#FFF",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={45}>
                  {sourceBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}