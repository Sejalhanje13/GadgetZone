// src/pages/Payment.jsx
import { useState } from "react";
import { orderService } from "../services/api";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Payment.css";

export default function Payment() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const userId = "6a4e86f334fd497f4c57da39";

  const [method, setMethod] = useState("card");
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({name:"",email:"",address:"",city:"",zip:"",cardNum:"",expiry:"",cvv:""});
  const set = k => e => setForm({...form,[k]:e.target.value});
  const shipping = totalPrice > 100 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const grand = totalPrice + shipping + tax;

  const handleOrder = async (e) => {
  e.preventDefault();

  try {
    setPlacing(true);

    await orderService.create({
      userId,

      items: cart.items.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      })),

      totalAmount: grand,

      shippingAddress: `${form.address}, ${form.city}, ${form.zip}`,

      paymentMethod:
        method === "card"
          ? "Card"
          : method === "paypal"
          ? "PayPal"
          : "UPI",
    });

    clearCart();

    navigate("/orders");

  } catch (err) {
    console.error(err);
  } finally {
    setPlacing(false);
  }
};
  return (
    <div className="payment-page">
      <div className="page-hero"><div className="container"><h1>Checkout</h1><p>Complete your order</p></div></div>
      <div className="container payment-layout">
        <form onSubmit={handleOrder} className="payment-form">
          {/* Billing */}
          <div className="pay-section"><h2 className="pay-section-title">📍 Billing Details</h2>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Full Name</label><input required className="form-input" value={form.name} onChange={set("name")} placeholder="John Doe" /></div>
              <div className="form-group"><label className="form-label">Email</label><input required type="email" className="form-input" value={form.email} onChange={set("email")} placeholder="john@email.com" /></div>
            </div>
            <div className="form-group"><label className="form-label">Address</label><input required className="form-input" value={form.address} onChange={set("address")} placeholder="123 Main St" /></div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">City</label><input required className="form-input" value={form.city} onChange={set("city")} placeholder="New York" /></div>
              <div className="form-group"><label className="form-label">ZIP Code</label><input required className="form-input" value={form.zip} onChange={set("zip")} placeholder="10001" /></div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="pay-section"><h2 className="pay-section-title">💳 Payment Method</h2>
            <div className="method-tabs">
              {[{id:"card",label:"💳 Credit Card"},{id:"paypal",label:"🅿️ PayPal"},{id:"upi",label:"📱 UPI"}].map(m=>(
                <button type="button" key={m.id} className={`method-tab ${method===m.id?"active":""}`} onClick={()=>setMethod(m.id)}>{m.label}</button>
              ))}
            </div>
            {method==="card" && (
              <div className="card-fields">
                <div className="form-group"><label className="form-label">Card Number</label><input required className="form-input" value={form.cardNum} onChange={set("cardNum")} placeholder="1234 5678 9012 3456" maxLength={19} /></div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Expiry</label><input required className="form-input" value={form.expiry} onChange={set("expiry")} placeholder="MM/YY" /></div>
                  <div className="form-group"><label className="form-label">CVV</label><input required className="form-input" value={form.cvv} onChange={set("cvv")} placeholder="•••" maxLength={3} /></div>
                </div>
              </div>
            )}
            {method==="paypal" && <div className="pay-placeholder"><p>You will be redirected to PayPal to complete the payment securely.</p></div>}
            {method==="upi" && <div className="form-group"><label className="form-label">UPI ID</label><input className="form-input" placeholder="yourname@upi" /></div>}
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={placing || cart.items.length===0}>
            {placing ? "Placing Order..." : `Place Order — $${grand.toFixed(2)}`}
          </button>
          <p className="pay-secure">🔒 Secured by 256-bit SSL encryption</p>
        </form>

        {/* Summary */}
        <div className="pay-summary">
          <h2 className="pay-section-title">Order Summary</h2>
          <div className="pay-items">
            {cart.items.map(item=>(
              <div key={item.id} className="pay-item">
                <img src={item.image} alt={item.name} className="pay-item-img" />
                <div className="pay-item-info"><p className="pay-item-name">{item.name}</p><p className="pay-item-qty">Qty: {item.quantity}</p></div>
                <span className="pay-item-price">${(item.price*item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="pay-totals">
            <div className="pay-row"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
            <div className="pay-row"><span>Shipping</span><span>{shipping===0?"FREE":`$${shipping.toFixed(2)}`}</span></div>
            <div className="pay-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="pay-divider"/>
            <div className="pay-row pay-grand"><span>Total</span><span>${grand.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
