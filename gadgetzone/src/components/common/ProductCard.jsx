/* ============================================================
   src/components/common/ProductCard.jsx
   Reusable product card used in grids throughout the site
   ============================================================ */

import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../ui/Toast";
import "./ProductCard.css";

// Utility: render star rating
function StarRating({ rating, reviews }) {
  const stars = "★".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "½" : "") + "☆".repeat(5 - Math.ceil(rating));
  return (
    <div className="pc-rating">
      <span className="pc-stars">{stars}</span>
      <span className="pc-reviews">({reviews?.toLocaleString()})</span>
    </div>
  );
}

export default function ProductCard({ product, compact = false }) {
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { success, info } = useToast();

  const inCart = isInCart(product._id);
  const inWishlist = isInWishlist(product._id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWishlist = (e) => {
    e.preventDefault(); // prevent navigating to detail
    if (inWishlist) {
      removeFromWishlist(product._id);
      info(`${product.name} removed from wishlist`, "Wishlist");
    } else {
      addToWishlist(product);
      success(`${product.name} added to wishlist`, "Wishlist");
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock > 0) {
      addToCart(product);
      success(`${product.name} added to cart`, "Cart Updated");
    }
  };

  return (
<Link
  to={`/products/${product._id}`}
  className={`product-card ${compact ? "compact" : ""} ${product.stock <= 0 ? "out-of-stock" : ""}`}
>
        {/* Image area */}
      <div className="pc-image-wrapper">
  <img
    src={product.image}
    alt={product.name}
    className="pc-image"
    loading="lazy"
  />

  {/* Badges */}
  <div className="pc-badges">
    {discount > 0 && (
      <span className="pc-badge sale">-{discount}%</span>
    )}

    {product.trending && (
      <span className="pc-badge trending">🔥 Hot</span>
    )}

    {product.stock <= 0 && (
      <span className="pc-badge oos">Out of Stock</span>
    )}
  </div>

  {/* Wishlist heart */}
  <button
    className={`pc-wishlist-btn ${inWishlist ? "active" : ""}`}
    onClick={handleWishlist}
    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
  >
    {inWishlist ? "❤️" : "🤍"}
  </button>

  {/* Quick add overlay */}
  <div className="pc-overlay">
    <button
      className={`btn btn-primary btn-sm ${inCart ? "in-cart" : ""}`}
      onClick={handleAddToCart}
      disabled={product.stock <= 0}
    >
      {inCart
        ? "✓ In Cart"
        : product.stock > 0
        ? "Add to Cart"
        : "Out of Stock"}
    </button>
  </div>
</div>      

      {/* Info area */}
      <div className="pc-info">
        <p className="pc-brand">{product.brand}</p>
        <h3 className="pc-name">{product.name}</h3>
        <StarRating rating={product.rating} reviews={product.reviews} />

        <div className="pc-price-row">
          <div className="pc-prices">
            <span className="pc-price">${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="pc-original-price">${product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <span className={`pc-stock ${product.stock > 0 ? "in-stock" : "oos"}`}>
  {product.stock > 0 ? "● In Stock" : "● Out of Stock"}
</span>
        </div>
      </div>
    </Link>
  );
}
