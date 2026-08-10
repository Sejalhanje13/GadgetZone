// src/pages/admin/AdminDashboard.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { productService, orderService } from "../../services/api";
import SalesAnalytics from "../../components/admin/SalesAnalytics";
import "../../components/admin/SalesAnalytics.css";
import "./Admin.css";


export default function AdminDashboard() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const totalRevenue = orders.reduce(
  (sum, order) => sum + Number(order.totalAmount),
  0
); 


const pendingOrders = orders.filter(
  (o) => o.orderStatus === "Pending"
).length;

  useEffect(() => {
  loadDashboard();
}, []);

const loadDashboard = async () => {
  try {
    const productsRes = await productService.getAll();
    console.log("Products:", productsRes.data); // 👈 Add this line


    const ordersRes = await orderService.getAll();
    console.log(JSON.stringify(ordersRes.data, null, 2)); 
   
    setProducts(productsRes.data);
    setOrders(ordersRes.data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  

const stats = [
  {
    icon: "📦",
    label: "Total Products",
    value: products.length,
    color: "primary",
  },
  {
    icon: "🛒",
    label: "Total Orders",
    value: orders.length,
    color: "accent",
  },
  {
    icon: "💰",
    label: "Revenue",
    value: `$${totalRevenue.toLocaleString()}`,
    color: "success",
  },
  {
    icon: "⏳",
    label: "Pending Orders",
    value: pendingOrders,
    color: "warning",
  },
];

if (loading) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px",
      }}
    >
      Loading Dashboard...
    </div>
  );
}

  return (
    <div className="admin-page">
      <div className="admin-layout">
        <AdminSidebar active="dashboard" />
        <div className="admin-content">
          <div className="admin-header"><h1 className="admin-title">Dashboard</h1><p className="admin-subtitle">Welcome back, {user.name}!</p></div>

          <div className="admin-stats-grid">
            {stats.map(s=>(
              <div key={s.label} className={`admin-stat-card color-${s.color}`}>
                <div className="asc-icon">{s.icon}</div>
                <div><p className="asc-value">{s.value}</p><p className="asc-label">{s.label}</p></div>
              </div>
            ))}
          </div>

          <SalesAnalytics />

          <div className="admin-grid-2" style={{ marginTop: "1.5rem" }}>
            <div className="admin-card">
              <h3 className="admin-card-title">Recent Orders</h3>
              <table className="admin-table">
                <thead><tr><th>Order ID</th><th>Date</th><th>Status</th><th>Total</th></tr></thead>
                <tbody>
  {orders.slice(0, 5).map((o) => (
    <tr key={o._id}>
      <td className="font-mono">
        {o._id.slice(-6)}
      </td>

      <td>
        {new Date(o.createdAt).toLocaleDateString()}
      </td>

      <td>
        <span
          className={`order-status status-${
            o.orderStatus === "Delivered"
              ? "success"
              : o.orderStatus === "Processing"
              ? "warning"
              : o.orderStatus === "Cancelled"
              ? "danger"
              : "primary"
          }`}
        >
          {o.orderStatus}
        </span>
      </td>

      <td>
        ${Number(o.totalAmount).toLocaleString()}
      </td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
            <div className="admin-card">
              <h3 className="admin-card-title">Top Products</h3>
              <div className="top-products-list">
                {products.filter(p=>p.featured).map(p=>(
                  <div key={p._id} className="top-product-item">
                    <img src={p.image} alt={p.name} className="tp-img" />
                    <div className="tp-info"><p className="tp-name">{p.name}</p><p className="tp-price">${p.price.toLocaleString()}</p></div>
                    <span className="tp-rating">★ {p.rating}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar({ active }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const links = [
    {to:"/admin",id:"dashboard",icon:"📊",label:"Dashboard"},
    {to:"/admin/products",id:"products",icon:"📦",label:"Products"},
    {to:"/admin/orders",id:"orders",icon:"🛒",label:"Orders"},
    {to:"/",id:"store",icon:"🏠",label:"View Store"},
  ];
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">⚡ <span>GadgetZone</span> <span className="admin-badge">Admin</span></div>
      <nav className="admin-nav">
        {links.map(l=>(
          <Link key={l.id} to={l.to} className={`admin-nav-link ${active===l.id?"active":""}`}><span>{l.icon}</span>{l.label}</Link>
        ))}
      </nav>
      <button className="admin-logout" onClick={()=>{logout();navigate("/");}}>🚪 Sign Out</button>
    </aside>
  );
}
