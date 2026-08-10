// ============================================================
// src/components/admin/SalesAnalytics.jsx
// Charts and statistics for the admin dashboard
// Uses recharts — install with: npm install recharts
// ============================================================

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { useAnalytics } from "../../hooks/useProducts";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import "./SalesAnalytics.css";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="chart-tooltip-row">
          <span className="chart-tooltip-dot" style={{ background: p.color }} />
          {p.name}: <strong>{p.name === "revenue" ? `$${p.value.toLocaleString()}` : p.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function SalesAnalytics() {
  const { data, loading, error } = useAnalytics();

  if (loading) return <div style={{ padding: "3rem 0" }}><LoadingSpinner size="lg" text="Crunching the numbers..." /></div>;
  if (error) return <p className="text-danger">Failed to load analytics: {error}</p>;
  if (!data) return null;

  return (
    <div className="sales-analytics">
      <div className="chart-grid">
        {/* Revenue trend */}
        <div className="admin-card chart-card chart-card-wide">
          <div className="chart-card-header">
            <h3 className="admin-card-title">Revenue Trend</h3>
            <span className="badge badge-success">+18.4% YoY</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.monthlyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6c63ff" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="#5a5a70" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#5a5a70" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#6c63ff" strokeWidth={2.5} fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="admin-card chart-card">
          <h3 className="admin-card-title">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data.categoryBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {data.categoryBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            {data.categoryBreakdown.map((c) => (
              <div key={c.name} className="chart-legend-item">
                <span className="chart-legend-dot" style={{ background: c.color }} />
                <span>{c.name}</span>
                <span className="chart-legend-val">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders per month */}
        <div className="admin-card chart-card chart-card-wide">
          <h3 className="admin-card-title">Order Volume</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.monthlyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="#5a5a70" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#5a5a70" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" fill="#00d4aa" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* KPI summary */}
        <div className="admin-card chart-card">
          <h3 className="admin-card-title">Key Metrics</h3>
          <div className="kpi-list">
            <div className="kpi-row"><span>Avg. Order Value</span><strong>${data.avgOrderValue}</strong></div>
            <div className="kpi-row"><span>Conversion Rate</span><strong>{data.conversionRate}%</strong></div>
            <div className="kpi-row"><span>Avg. Product Rating</span><strong>★ {data.avgRating}</strong></div>
            <div className="kpi-row"><span>Total Revenue</span><strong>${data.totalRevenue.toLocaleString()}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
