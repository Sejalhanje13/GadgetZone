// ============================================================
// src/components/orders/OrderTracker.jsx
// Visual order tracking timeline + order detail drawer
// ============================================================

import "./OrderTracker.css";

const STAGES = ["Processing", "Shipped", "Out for Delivery", "Delivered"];

const STAGE_META = {
  Processing: { icon: "📦", desc: "Your order has been received and is being prepared." },
  Shipped: { icon: "🚚", desc: "Your package has left the warehouse and is on its way." },
  "Out for Delivery": { icon: "🛵", desc: "Your package is out for delivery and will arrive today." },
  Delivered: { icon: "✅", desc: "Your package has been delivered. Enjoy!" },
  Cancelled: { icon: "✕", desc: "This order was cancelled." },
};

function stageIndex(status) {
  if (status === "Cancelled") return -1;
  const idx = STAGES.indexOf(status);
  return idx === -1 ? 0 : idx;
}

export function OrderProgressBar({ status }) {
  const currentIdx = stageIndex(status);

  if (status === "Cancelled") {
    return (
      <div className="order-tracker cancelled">
        <span className="tracker-cancelled-icon">✕</span>
        <span>This order was cancelled</span>
      </div>
    );
  }

  return (
    <div className="order-tracker">
      {STAGES.map((stage, i) => {
        const isComplete = i <= currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <div key={stage} className={`tracker-step ${isComplete ? "complete" : ""} ${isCurrent ? "current" : ""}`}>
            <div className="tracker-node">
              <span className="tracker-icon">{isComplete ? STAGE_META[stage].icon : ""}</span>
            </div>
            <p className="tracker-label">{stage}</p>
            {i < STAGES.length - 1 && <div className={`tracker-line ${i < currentIdx ? "complete" : ""}`} />}
          </div>
        );
      })}
    </div>
  );
}

export default function OrderTracker({ order, onClose }) {
  if (!order) return null;
  const meta = STAGE_META[order.status] || STAGE_META.Processing;

  return (
    <div className="order-drawer-overlay" onClick={onClose}>
      <div className="order-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="order-drawer-header">
          <div>
            <p className="order-drawer-id">{order.id}</p>
            <p className="order-drawer-date">Placed on {new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <button className="order-drawer-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="order-drawer-status">
          <span className="order-drawer-status-icon">{meta.icon}</span>
          <div>
            <p className="order-drawer-status-title">{order.status}</p>
            <p className="order-drawer-status-desc">{meta.desc}</p>
          </div>
        </div>

        <OrderProgressBar status={order.status} />

        <div className="order-drawer-section">
          <h4 className="order-drawer-section-title">Items ({order.items.length})</h4>
          <div className="order-drawer-items">
            {order.items.map((item, i) => (
              <div key={i} className="order-drawer-item">
                <span className="odi-name">{item.name}</span>
                <span className="odi-qty">× {item.quantity}</span>
                <span className="odi-price">${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="order-drawer-section">
          <h4 className="order-drawer-section-title">Shipping Address</h4>
          <p className="order-drawer-address">
            {order.shippingAddress || "123 Tech Lane, San Francisco, CA 94107, United States"}
          </p>
        </div>

        <div className="order-drawer-footer">
          <span>Order Total</span>
          <strong>${order.total.toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
}
