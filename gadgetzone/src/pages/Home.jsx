/* ============================================================
   src/pages/Home.jsx
   Landing page with Hero, Featured Products, Categories, etc.
   ============================================================ */
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { categories, reviews } from "../data/products";
import { productService } from "../services/api";
import ProductCard from "../components/common/ProductCard";
import "./Home.css";

// ── Hero Section ────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-orb orb-1" />
        <div className="hero-orb orb-2" />
        <div className="hero-orb orb-3" />
      </div>

      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-label">
            <span className="label-dot" />
            New Arrivals 2024
          </div>
          <h1 className="hero-title">
            Next-Gen Tech,<br />
            <span className="hero-title-accent">Delivered Fast</span>
          </h1>
          <p className="hero-subtitle">
            Explore the world's finest electronics — from powerhouse laptops to precision keyboards. Curated for professionals and enthusiasts.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg">
              Shop Now →
            </Link>
            <Link to="/products?category=Laptops" className="btn btn-outline btn-lg">
              View Laptops
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">500+</span><span className="stat-label">Products</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">50K+</span><span className="stat-label">Happy Customers</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">4.9★</span><span className="stat-label">Avg Rating</span></div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card-float main-card">
            <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80" alt="MacBook Pro" className="hero-product-img" />
            <div className="hero-card-info">
              <p className="hc-brand">Apple</p>
              <p className="hc-name">MacBook Pro M3 Max</p>
              <p className="hc-price">$3,499</p>
            </div>
          </div>
          <div className="hero-card-float side-card">
            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80" alt="Sony Headphones" className="hero-product-img-sm" />
            <div>
              <p className="hc-brand-sm">Sony</p>
              <p className="hc-name-sm">WH-1000XM5</p>
              <p className="hc-price-sm">$349</p>
            </div>
          </div>
          <div className="hero-badge-float badge-1">🔥 Trending</div>
          <div className="hero-badge-float badge-2">✓ Authentic</div>
        </div>
      </div>
    </section>
  );
}

// ── Categories Section ──────────────────────────────────────
function CategoriesSection() {
  return (
    <section className="section categories-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Browse By</span>
          <h2 className="section-title">Shop Categories</h2>
          <p className="section-subtitle">Discover our carefully curated selection of premium electronics across all categories.</p>
        </div>
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <Link key={cat.id} to={`/products?category=${encodeURIComponent(cat.name)}`} className="category-card" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="cat-image-wrapper">
                <img src={cat.image} alt={cat.name} className="cat-image" loading="lazy" />
                <div className="cat-overlay" />
              </div>
              <div className="cat-info">
                <span className="cat-icon">{cat.icon}</span>
                <div>
                  <h3 className="cat-name">{cat.name}</h3>
                  <p className="cat-count">{cat.count} Products</p>
                </div>
                <span className="cat-arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Featured Products Section ───────────────────────────────
function FeaturedSection() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const response = await productService.getAll();

        const featuredProducts = response.data
          .filter((product) => product.featured)
          .slice(0, 4);

        setFeatured(featuredProducts);
      } catch (error) {
        console.error("Error loading featured products:", error);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Handpicked</span>
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">
            Our top picks — the products our customers love most.
          </p>
        </div>

        <div className="grid-4">
          {featured.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "var(--space-2xl)" }}>
          <Link to="/products" className="btn btn-outline btn-lg">
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Trending Section ────────────────────────────────────────
function TrendingSection() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const loadTrendingProducts = async () => {
      try {
        const response = await productService.getAll();

        const trendingProducts = response.data
          .filter((product) => product.trending)
          .slice(0, 3);

        setTrending(trendingProducts);
      } catch (error) {
        console.error("Error loading trending products:", error);
      }
    };

    loadTrendingProducts();
  }, []);

  return (
    <section className="section trending-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">🔥 Hot Right Now</span>
          <h2 className="section-title">Trending Products</h2>
        </div>

        <div className="trending-grid">
          {trending.map((product, i) => (
            <div
              key={product._id}
              className={`trending-item ${
                i === 0 ? "trending-hero" : ""
              }`}
            >
              <Link
                to={`/products/${product._id}`}
                className="trending-card"
              >
                <div className="trending-img-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="trending-img"
                  />
                </div>

                <div className="trending-info">
                  <span className="trending-rank">
                    #{i + 1} Trending
                  </span>

                  <p className="trending-brand">{product.brand}</p>

                  <h3 className="trending-name">
                    {product.name}
                  </h3>

                  <div className="trending-footer">
                    <span className="trending-price">
                      ${product.price.toLocaleString()}
                    </span>

                    <span className="trending-rating">
                      ★ {product.rating}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Benefits Section ────────────────────────────────────────
function BenefitsSection() {
  const benefits = [
    { icon: "🔒", title: "100% Authentic", desc: "Every product is sourced directly from authorized dealers and verified for authenticity." },
    { icon: "🚀", title: "Express Delivery", desc: "Fast shipping to your door — most orders arrive in 1-3 business days." },
    { icon: "💳", title: "Secure Checkout", desc: "Bank-grade encryption protects your payment and personal information always." },
    { icon: "🔄", title: "Easy Returns", desc: "Not satisfied? Return within 30 days — no questions asked, full refund." },
    { icon: "🎧", title: "Expert Support", desc: "Our tech-savvy team is available 24/7 to help you make the right choice." },
    { icon: "🏷️", title: "Best Price Match", desc: "Find it cheaper elsewhere? We'll match or beat any authorized retailer's price." },
  ];

  return (
    <section className="section benefits-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Why GadgetZone</span>
          <h2 className="section-title">Shopping Made Better</h2>
          <p className="section-subtitle">We're not just an online store — we're your trusted tech partner.</p>
        </div>
        <div className="benefits-grid">
          {benefits.map((b, i) => (
            <div key={b.title} className="benefit-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="benefit-icon-wrap">{b.icon}</div>
              <h3 className="benefit-title">{b.title}</h3>
              <p className="benefit-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Reviews Section ─────────────────────────────────────────
function ReviewsSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Testimonials</span>
          <h2 className="section-title">What Our Customers Say</h2>
        </div>
        <div className="reviews-grid">
          {reviews.map((r) => (
            <div key={r.id} className="review-card">
              <div className="review-stars">{"★".repeat(r.rating)}</div>
              <p className="review-comment">"{r.comment}"</p>
              <div className="review-footer">
                <div className="review-avatar">{r.avatar}</div>
                <div>
                  <p className="review-name">{r.name}</p>
                  <p className="review-product">Purchased: {r.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Newsletter Section ──────────────────────────────────────
function NewsletterSection() {
  return (
    <section className="section newsletter-section">
      <div className="container">
        <div className="newsletter-box">
          <div className="newsletter-bg-orb" />
          <div className="newsletter-content">
            <span className="section-label">Stay Updated</span>
            <h2 className="newsletter-title">Get Exclusive Deals</h2>
            <p className="newsletter-desc">Subscribe to receive the latest product launches, exclusive offers, and tech news directly in your inbox.</p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert("Subscribed! 🎉"); }}>
              <input type="email" placeholder="Enter your email address" className="newsletter-input" required />
              <button type="submit" className="btn btn-primary">Subscribe →</button>
            </form>
            <p className="newsletter-note">No spam, ever. Unsubscribe at any time.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main Home Page ──────────────────────────────────────────
export default function Home() {
  return (
    <main className="home-page">
      <HeroSection />
      <CategoriesSection />
      <FeaturedSection />
      <TrendingSection />
      <BenefitsSection />
      <ReviewsSection />
      <NewsletterSection />
    </main>
  );
}
