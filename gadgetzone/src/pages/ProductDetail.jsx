// src/pages/ProductDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { productService } from "../services/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../components/ui/Toast";
import ProductCard from "../components/common/ProductCard";
import ProductReviews from "../components/products/ProductReviews";
import "../components/products/ProductReviews.css";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { success, info } = useToast();

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  
  
  useEffect(() => {
  const loadProduct = async () => {
    try {
      const response = await productService.getById(id);

      setProduct(response.data);

      const allProducts = await productService.getAll();

      const relatedProducts = allProducts.data
        .filter(
          (p) =>
            p.category === response.data.category &&
            p._id !== response.data._id
        )
        .slice(0, 4);

      setRelated(relatedProducts);
    } catch (error) {
      console.error(error);
    }
  };

  loadProduct();
}, [id]);


  if (!product) return (
    <div className="container" style={{ paddingTop: "120px", textAlign: "center" }}>
      <div className="empty-state"><div className="empty-icon">😕</div><h3>Product Not Found</h3><p>This product doesn't exist.</p><Link to="/products" className="btn btn-primary">Back to Products</Link></div>
    </div>
  );

  const inWishlist = isInWishlist(product._id);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    success(`${qty} × ${product.name} added to cart`, "Cart Updated");
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product._id);
      info(`${product.name} removed from wishlist`, "Wishlist");
    } else {
      addToWishlist(product);
      success(`${product.name} added to wishlist`, "Wishlist");
    }
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link><span className="sep">›</span>
          <Link to="/products">Products</Link><span className="sep">›</span>
          <Link to={`/products?category=${product.category}`}>{product.category}</Link><span className="sep">›</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="pd-grid">
          {/* Images */}
          <div className="pd-images">
            <div className="pd-main-image">
              <img src={product.images?.[activeImage] || product.image} alt={product.name} />
              {discount > 0 && <span className="pd-discount-badge">-{discount}% OFF</span>}
            </div>
            <div className="pd-thumbnails">
              {(product.images || [product.image]).map((img, i) => (
                <button key={i} className={`pd-thumb ${activeImage === i ? "active" : ""}`} onClick={() => setActiveImage(i)}>
                  <img src={img} alt={`View ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="pd-info">
            <div className="pd-brand-row">
              <span className="pd-brand">{product.brand}</span>
              <span className={`stock-badge ${product.inStock ? "in-stock" : "out-stock"}`}>{product.inStock ? "In Stock" : "Out of Stock"}</span>
            </div>
            <h1 className="pd-name">{product.name}</h1>

            <div className="pd-rating-row">
              <span className="stars">{"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}</span>
              <span className="pd-rating-val">{product.rating}</span>
              <span className="pd-reviews">({product.reviews?.toLocaleString()} reviews)</span>
            </div>

            <div className="pd-price-row">
              <span className="pd-price">${product.price.toLocaleString()}</span>
              {product.originalPrice && <span className="pd-original">${product.originalPrice.toLocaleString()}</span>}
              {discount > 0 && <span className="pd-save">Save ${(product.originalPrice - product.price).toLocaleString()}</span>}
            </div>

            <p className="pd-description">{product.description}</p>

            {/* Specs */}
            {product.specs && (
              <div className="pd-specs">
                <h4 className="pd-specs-title">Key Specifications</h4>
                <div className="pd-specs-grid">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="pd-spec-item">
                      <span className="pd-spec-key">{k}</span>
                      <span className="pd-spec-val">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pd-actions">
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
              </div>
              <button className={`btn btn-primary btn-lg flex-1 ${added ? "in-cart" : ""}`} onClick={handleAddToCart} disabled={!product.inStock} style={{ flex: 1 }}>
                {added ? "✓ Added to Cart!" : isInCart(product._id) ? "🛒 Add More" : "🛒 Add to Cart"}
              </button>
              <button className={`btn-icon btn-lg ${inWishlist ? "active" : ""}`} style={{ width: 48, height: 48 }} onClick={handleWishlistToggle}>
                {inWishlist ? "❤️" : "🤍"}
              </button>
            </div>

            <button className="btn btn-accent btn-full" onClick={() => { handleAddToCart(); navigate("/cart"); }}>
              ⚡ Buy Now
            </button>

            {/* Tags */}
            <div className="pd-tags">
              {product.tags?.map((t) => <span key={t} className="chip">#{t}</span>)}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <ProductReviews productId={product._id} productRating={product.rating} productReviewCount={product.reviews} />

        {/* Related Products */}
        {related.length > 0 && (
          <section className="pd-related">
            <h2 className="section-title" style={{ marginBottom: "var(--space-xl)" }}>Related Products</h2>
            <div className="grid-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
