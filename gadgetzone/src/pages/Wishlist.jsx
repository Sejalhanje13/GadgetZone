// src/pages/Wishlist.jsx
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import "./Wishlist.css";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();

  if (wishlist.items.length === 0) return (
    <div className="wishlist-page"><div className="container">
      <div className="page-hero"><h1>Wishlist</h1></div>
      <div className="empty-state"><div className="empty-icon">🤍</div><h3>Your wishlist is empty</h3><p>Save products you love to buy later.</p><Link to="/products" className="btn btn-primary btn-lg">Discover Products</Link></div>
    </div></div>
  );

  return (
    <div className="wishlist-page">
      <div className="page-hero"><div className="container"><h1>My Wishlist</h1><p>{wishlist.items.length} saved item{wishlist.items.length !== 1 ? "s" : ""}</p></div></div>
      <div className="container">
        <div className="wishlist-header">
          <span />
          <button className="btn btn-ghost btn-sm" onClick={clearWishlist}>Clear Wishlist</button>
        </div>
        <div className="wishlist-grid">
          {wishlist.items.map((item) => (
            <div key={item.id} className="wishlist-card">
              <Link to={`/products/${item.id}`} className="wc-image"><img src={item.image} alt={item.name} /></Link>
              <div className="wc-info">
                <p className="wc-brand">{item.brand}</p>
                <Link to={`/products/${item.id}`} className="wc-name">{item.name}</Link>
                <div className="wc-rating"><span className="stars">{"★".repeat(Math.floor(item.rating))}</span><span>{item.rating}</span></div>
                <p className="wc-price">${item.price.toLocaleString()}</p>
              </div>
              <div className="wc-actions">
                <button className={`btn ${isInCart(item.id) ? "btn-outline" : "btn-primary"} btn-full`} onClick={() => addToCart(item)} disabled={!item.inStock}>
                  {isInCart(item.id) ? "✓ In Cart" : item.inStock ? "🛒 Move to Cart" : "Out of Stock"}
                </button>
                <button className="btn btn-danger btn-full btn-sm" onClick={() => removeFromWishlist(item.id)}>✕ Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
