// src/pages/admin/AdminOrders.jsx
import { useState, useEffect } from "react";
import { orderService } from "../../services/api";
import { AdminSidebar } from "./AdminDashboard";
import "./Admin.css";

const STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminOrders() {
const [orders, setOrders] = useState([]);

const loadOrders = async () => {
  try {
    const response = await orderService.getAll();

    setOrders(response.data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  loadOrders();
}, []);

const updateStatus = async (orderId, status) => {
  try {
    await orderService.updateStatus(orderId, status);

    await loadOrders();
  } catch (err) {
    console.error(err);
  }
};



  return (
    <div className="admin-page">
      <div className="admin-layout">
        <AdminSidebar active="orders" />
        <div className="admin-content">
          <div className="admin-header"><h1 className="admin-title">Orders</h1><p className="admin-subtitle">{orders.length} orders</p></div>
          <div className="admin-card">
            <table className="admin-table">
              <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {orders.map(o=>(
                  <tr key={o._id}>
                    <td className="font-mono">{o._id}</td>
                    <td>
                        {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td>{o.items.length} item{o.items.length!==1?"s":""}</td>
                    <td>${Number(o.total).toLocaleString()}</td>                    <td><span className={`order-status status-${o.status==="Delivered"?"success":o.status==="Processing"?"warning":o.status==="Cancelled"?"danger":"primary"}`}>{o.status}</span></td>
                    <td>
                      <select className="form-select" style={{padding:"4px 8px",fontSize:"0.8rem",width:"130px"}} value={o.status} onChange={e=>updateStatus(o._id,e.target.value)}>
                        {STATUSES.map(s=><option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
