// src/components/ui/LoadingSpinner.jsx

import "./LoadingSpinner.css";

export function LoadingSpinner({ size = "md", text = "" }) {
  return (
    <div className={`spinner-wrapper spinner-${size}`}>
      <div className="spinner">
        <div className="spinner-ring" />
        <div className="spinner-core" />
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}

export function PageLoader({ text = "Loading..." }) {
  return (
    <div className="page-loader">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line w-60" />
        <div className="skeleton skeleton-line w-80" />
        <div className="skeleton skeleton-line w-40" />
        <div className="skeleton skeleton-btn" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }, (_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
