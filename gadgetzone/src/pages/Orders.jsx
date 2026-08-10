// src/pages/Orders.jsx
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { orderService } from "../services/api";
import OrderTracker, { OrderProgressBar } from "../components/orders/OrderTracker";
import "../components/orders/OrderTracker.css";
import "./Orders.css";

const STATUS_COLORS = { Delivered: "success", Processing: "warning", Shipped: "primary", "Out for Delivery": "accent", Cancelled: "danger" };

export default function Orders() {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [orders, setOrders] = useState([]);

  const userId = "6a4e86f334fd497f4c57da39";

  useEffect(() => {
  const loadOrders = async () => {
    try {
      const response = await orderService.getByUser(userId);
      setOrders(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  loadOrders();
}, []);


  const filtered = useMemo(() => {
    if (statusFilter === "All") return orders;;
    return orders.filter((o) => o.orderStatus === statusFilter);
  }, [statusFilter]);

  if (!user) {
    return (
      <div className="container" style={{ paddingTop: "120px", textAlign: "center" }}>
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <h3>Please log in</h3>
          <p>Sign in to view your order history.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="page-hero">
        <div className="container">
          <h1>Order History</h1>
          <p>{orders.length} orders placed</p>
        </div>
      </div>
      <div className="container">
        <div className="orders-filter-bar">
          {["All", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"].map((s) => (
            <button key={s} className={`chip ${statusFilter === s ? "active" : ""}`} onClick={() => setStatusFilter(s)}>{s}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No orders found</h3>
            <p>No orders match this status filter.</p>
          </div>
        ) : (
          <div className="orders-list">
            {filtered.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <p className="order-id">{order._id}</p>
                    <p className="order-date">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                  <span className={`order-status status-${STATUS_COLORS[order.orderStatus]}`}>{order.orderStatus}</span>
                </div>

                <OrderProgressBar status={order.orderStatus} />

                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item">
                      <span className="oi-name">{item.product.name}</span>
                      <span className="oi-qty">x{item.quantity}</span>
                      <span className="oi-price">
                        ${item.product.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <span className="order-total">Total: <strong>${order.totalAmount.toLocaleString()}</strong></span>
                  <button className="btn btn-outline btn-sm" onClick={() => setSelectedOrder(order)}>Track Order</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && <OrderTracker order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
}
