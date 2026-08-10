// src/pages/Cart.jsx
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const shipping = totalPrice > 100 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const grand = totalPrice + shipping + tax;

  if (cart.items.length === 0) return (
    <div className="cart-page"><div className="container">
      <div className="page-hero"><h1>Shopping Cart</h1><p>0 items</p></div>
      <div className="empty-state"><div className="empty-icon">🛒</div><h3>Your cart is empty</h3><p>Add some products to get started.</p><Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link></div>
    </div></div>
  );

  return (
    <div className="cart-page">
      <div className="page-hero"><div className="container"><h1>Shopping Cart</h1><p>{cart.items.length} item{cart.items.length !== 1 ? "s" : ""}</p></div></div>
      <div className="container cart-layout">
        {/* Items */}
        <div className="cart-items">
          <div className="cart-items-header">
            <h2 className="cart-section-title">Cart Items</h2>
            <button className="btn btn-ghost btn-sm" onClick={clearCart}>Clear All</button>
          </div>
          {cart.items.map((item) => (
            <div key={item._id} className="cart-item">
              <Link to={`/products/${item._id}`} className="cart-item-img">
                <img src={item.image} alt={item.name} />
              </Link>
              <div className="cart-item-info">
                <p className="ci-brand">{item.brand}</p>
                <Link to={`/products/${item._id}`} className="ci-name">{item.name}</Link>
                <p className="ci-price">${item.price.toLocaleString()}</p>
              </div>
              <div className="cart-item-controls">
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>
                <p className="ci-total">${(item.price * item.quantity).toLocaleString()}</p>
                <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item._id)}>✕ Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h2 className="cart-section-title">Order Summary</h2>
          <div className="summary-rows">
            <div className="summary-row"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span className="free-badge">FREE</span> : `$${shipping.toFixed(2)}`}</span></div>
            <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="summary-divider" />
            <div className="summary-row total-row"><span>Total</span><span>${grand.toFixed(2)}</span></div>
          </div>
          {shipping > 0 && <p className="free-shipping-note">Add ${(100 - totalPrice).toFixed(2)} more for free shipping!</p>}
          <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate("/payment")}>Proceed to Checkout →</button>
          <Link to="/products" className="btn btn-outline btn-full" style={{ marginTop: "var(--space-sm)" }}>← Continue Shopping</Link>
          <div className="secure-badge"><span>🔒</span><span>Secure 256-bit SSL checkout</span></div>
        </div>
      </div>
    </div>
  );
}
