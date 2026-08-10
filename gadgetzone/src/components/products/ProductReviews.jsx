// ============================================================
// src/components/products/ProductReviews.jsx
// Review system: rating distribution, write-a-review form,
// persisted per-product via localStorage (swap for API later)
// ============================================================

import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/Toast";
import "./ProductReviews.css";

const SEED_REVIEWS = {
  default: [
    { id: 1, author: "Alex Carter", avatar: "AC", rating: 5, date: "2 weeks ago", title: "Exceeded expectations", body: "Build quality is outstanding and it performs exactly as advertised. Shipping was fast and packaging was secure.", helpful: 24, verified: true },
    { id: 2, author: "Priya Nair", avatar: "PN", rating: 4, date: "1 month ago", title: "Great value for money", body: "Does everything I need. Only minor gripe is the included cable is a bit short, but otherwise no complaints.", helpful: 11, verified: true },
    { id: 3, author: "Marcus Webb", avatar: "MW", rating: 5, date: "1 month ago", title: "Would buy again", body: "Second one I've purchased for the family. Consistent quality across both units.", helpful: 8, verified: false },
  ],
};

function getReviewsKey(productId) {
  return `gadgetzone_reviews_${productId}`;
}

function loadReviews(productId) {
  try {
    const saved = localStorage.getItem(getReviewsKey(productId));
    return saved ? JSON.parse(saved) : SEED_REVIEWS.default;
  } catch {
    return SEED_REVIEWS.default;
  }
}

function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-input" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`star-input-btn ${(hover || value) >= n ? "filled" : ""}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId, productRating, productReviewCount }) {
  const { isAuthenticated, user } = useAuth();
  const { success, warning } = useToast();
  const [reviews, setReviews] = useState(() => loadReviews(productId));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 0, title: "", body: "" });
  const [errors, setErrors] = useState({});
  const [sortBy, setSortBy] = useState("recent");
  const [filterStar, setFilterStar] = useState(0);

  const distribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach((r) => { dist[r.rating - 1]++; });
    return dist.reverse(); // [5★, 4★, 3★, 2★, 1★]
  }, [reviews]);

  const avgRating = useMemo(() => {
    if (!reviews.length) return productRating || 0;
    return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  }, [reviews, productRating]);

  const visibleReviews = useMemo(() => {
    let list = [...reviews];
    if (filterStar) list = list.filter((r) => r.rating === filterStar);
    if (sortBy === "helpful") list.sort((a, b) => b.helpful - a.helpful);
    else if (sortBy === "highest") list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "lowest") list.sort((a, b) => a.rating - b.rating);
    return list;
  }, [reviews, sortBy, filterStar]);

  const validate = () => {
    const errs = {};
    if (!form.rating) errs.rating = "Please select a star rating";
    if (!form.title.trim()) errs.title = "Title is required";
    if (form.body.trim().length < 10) errs.body = "Review must be at least 10 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      warning("Please log in to write a review", "Sign In Required");
      return;
    }
    if (!validate()) return;

    const newReview = {
      id: Date.now(),
      author: user.name,
      avatar: user.avatar,
      rating: form.rating,
      date: "Just now",
      title: form.title.trim(),
      body: form.body.trim(),
      helpful: 0,
      verified: true,
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(getReviewsKey(productId), JSON.stringify(updated));
    setForm({ rating: 0, title: "", body: "" });
    setShowForm(false);
    success("Thanks for sharing your feedback!", "Review Posted");
  };

  const markHelpful = (id) => {
    setReviews((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, helpful: r.helpful + 1 } : r));
      localStorage.setItem(getReviewsKey(productId), JSON.stringify(updated));
      return updated;
    });
  };

  const maxCount = Math.max(...distribution, 1);

  return (
    <section className="reviews-section" id="reviews">
      <div className="reviews-header">
        <h2 className="section-title" style={{ fontSize: "1.6rem", marginBottom: 0 }}>Customer Reviews</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "✎ Write a Review"}
        </button>
      </div>

      <div className="reviews-summary">
        <div className="reviews-avg">
          <p className="reviews-avg-num">{avgRating}</p>
          <div className="stars" style={{ fontSize: "1.1rem" }}>
            {"★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating))}
          </div>
          <p className="reviews-count">{(productReviewCount || reviews.length).toLocaleString()} ratings</p>
        </div>
        <div className="reviews-distribution">
          {distribution.map((count, i) => {
            const star = 5 - i;
            const pct = (count / maxCount) * 100;
            return (
              <button
                key={star}
                className={`dist-row ${filterStar === star ? "active" : ""}`}
                onClick={() => setFilterStar(filterStar === star ? 0 : star)}
              >
                <span className="dist-star">{star}★</span>
                <span className="dist-bar-track"><span className="dist-bar-fill" style={{ width: `${pct}%` }} /></span>
                <span className="dist-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {showForm && (
        <form className="review-form animate-fade-up" onSubmit={handleSubmit}>
          <h3 className="review-form-title">Share your experience</h3>
          <div className="form-group">
            <label className="form-label">Your Rating</label>
            <StarInput value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
            {errors.rating && <p className="form-error">{errors.rating}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Review Title</label>
            <input
              className="form-input"
              placeholder="Sum up your experience"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              maxLength={80}
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Your Review</label>
            <textarea
              className="form-textarea"
              placeholder="What did you like or dislike? How did you use this product?"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              maxLength={1000}
            />
            {errors.body && <p className="form-error">{errors.body}</p>}
          </div>
          <button type="submit" className="btn btn-primary">Submit Review</button>
        </form>
      )}

      <div className="reviews-toolbar">
        <span className="reviews-toolbar-count">{visibleReviews.length} review{visibleReviews.length !== 1 ? "s" : ""}</span>
        <select className="form-select" style={{ width: "auto" }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      <div className="reviews-list">
        {visibleReviews.length === 0 ? (
          <p className="text-muted" style={{ padding: "2rem 0", textAlign: "center" }}>No reviews match this filter.</p>
        ) : (
          visibleReviews.map((r) => (
            <div key={r.id} className="review-item">
              <div className="review-avatar">{r.avatar}</div>
              <div className="review-body">
                <div className="review-top">
                  <div>
                    <p className="review-author">{r.author} {r.verified && <span className="badge badge-success" style={{ marginLeft: "0.5rem", fontSize: "0.65rem" }}>Verified Purchase</span>}</p>
                    <div className="stars" style={{ fontSize: "0.85rem" }}>{"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}</div>
                  </div>
                  <span className="review-date">{r.date}</span>
                </div>
                <p className="review-title">{r.title}</p>
                <p className="review-text">{r.body}</p>
                <button className="review-helpful-btn" onClick={() => markHelpful(r.id)}>
                  👍 Helpful ({r.helpful})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
