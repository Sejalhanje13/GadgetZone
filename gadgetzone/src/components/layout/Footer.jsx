/* ============================================================
   src/components/layout/Footer.jsx
   Site footer with links, newsletter, and social
   ============================================================ */

import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <span>⚡</span>
                <span>Gadget<span>Zone</span></span>
              </Link>
              <p className="footer-tagline">
                Your premium destination for the latest electronics and gadgets. Curated for professionals, enthusiasts, and everyday tech lovers.
              </p>
              <div className="social-links">
                {[
                  { icon: "𝕏", label: "Twitter", href: "#" },
                  { icon: "in", label: "LinkedIn", href: "#" },
                  { icon: "ig", label: "Instagram", href: "#" },
                  { icon: "yt", label: "YouTube", href: "#" },
                ].map((s) => (
                  <a key={s.label} href={s.href} className="social-btn" aria-label={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Shop Links */}
            <div className="footer-col">
              <h4 className="footer-col-title">Shop</h4>
              <ul className="footer-links">
                <li><Link to="/products">All Products</Link></li>
                <li><Link to="/products?category=Laptops">Laptops</Link></li>
                <li><Link to="/products?category=Headphones">Headphones</Link></li>
                <li><Link to="/products?category=Keyboards">Keyboards</Link></li>
                <li><Link to="/products?category=Mice">Mice</Link></li>
                <li><Link to="/products?category=Monitors">Monitors</Link></li>
                <li><Link to="/products?category=Smart+Watches">Smart Watches</Link></li>
              </ul>
            </div>

            {/* Account Links */}
            <div className="footer-col">
              <h4 className="footer-col-title">Account</h4>
              <ul className="footer-links">
                <li><Link to="/login">Sign In</Link></li>
                <li><Link to="/register">Create Account</Link></li>
                <li><Link to="/profile">My Profile</Link></li>
                <li><Link to="/orders">Order History</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
                <li><Link to="/cart">Shopping Cart</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="footer-col">
              <h4 className="footer-col-title">Company</h4>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Return Policy</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits bar */}
      <div className="footer-benefits">
        <div className="container">
          <div className="benefits-row">
            {[
              { icon: "🚚", title: "Free Shipping", desc: "On orders over $100" },
              { icon: "🔒", title: "Secure Payment", desc: "256-bit SSL encryption" },
              { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
              { icon: "💬", title: "24/7 Support", desc: "Always here to help" },
            ].map((b) => (
              <div key={b.title} className="benefit-item">
                <span className="benefit-icon">{b.icon}</span>
                <div>
                  <p className="benefit-title">{b.title}</p>
                  <p className="benefit-desc">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container">
          <p className="copyright">© {currentYear} GadgetZone. All rights reserved. Built with React.js</p>
          <div className="payment-badges">
            {["Visa", "Mastercard", "PayPal", "Stripe"].map((p) => (
              <span key={p} className="payment-badge">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
