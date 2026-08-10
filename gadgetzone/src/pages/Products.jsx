// src/pages/Products.jsx
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { productService } from "../services/api";import ProductCard from "../components/common/ProductCard";
import "./Products.css";


export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [brand, setBrand] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 4000]);
  const [sortBy, setSortBy] = useState("default");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);

  const BRANDS = [...new Set(products.map((p) => p.brand))];
  const CATS = [...new Set(products.map((p) => p.category))];

  useEffect(() => {
  const loadProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  loadProducts();
}, []);

useEffect(() => {
  const q = searchParams.get("search");
  const c = searchParams.get("category");

  if (q) setSearch(q);
  if (c) setCategory(c);
}, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (brand !== "All") list = list.filter((p) => p.brand === brand);
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    list = list.filter((p) => p.rating >= minRating);
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, search, category, brand, minRating, priceRange, sortBy]);

  const clearFilters = () => { setSearch(""); setCategory("All"); setBrand("All"); setMinRating(0); setPriceRange([0, 4000]); setSortBy("default"); setSearchParams({}); };

  return (
    <div className="products-page">
      <div className="page-hero">
        <div className="container">
          <h1>All Products</h1>
          <p>{filtered.length} products found</p>
        </div>
      </div>
      <div className="container products-layout">
        {/* Mobile Filter Toggle */}
        <button className="btn btn-outline filter-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰ Filters {sidebarOpen ? "▲" : "▼"}
        </button>

        {/* Sidebar */}
        <aside className={`filter-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear All</button>
          </div>

          {/* Search */}
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <div className="input-wrapper">
              <span className="input-icon">🔍</span>
              <input className="form-input" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          {/* Category */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="filter-chips">
              {["All", ...CATS].map((c) => (
                <button key={c} className={`chip ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>{c}</button>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="filter-group">
            <label className="filter-label">Brand</label>
            <select className="form-select" value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="All">All Brands</option>
              {BRANDS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>

          {/* Price */}
          <div className="filter-group">
            <label className="filter-label">Max Price: ${priceRange[1].toLocaleString()}</label>
            <input type="range" min={0} max={4000} step={50} value={priceRange[1]} onChange={(e) => setPriceRange([0, Number(e.target.value)])} className="price-slider" />
            <div className="price-labels"><span>$0</span><span>$4,000</span></div>
          </div>

          {/* Rating */}
          <div className="filter-group">
            <label className="filter-label">Min Rating</label>
            <div className="rating-filter">
              {[0, 4, 4.5, 4.7, 4.9].map((r) => (
                <button key={r} className={`chip ${minRating === r ? "active" : ""}`} onClick={() => setMinRating(r)}>
                  {r === 0 ? "All" : `★ ${r}+`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <div className="products-main">
          {/* Sort bar */}
          <div className="sort-bar">
            <span className="results-count">{filtered.length} results</span>
            <select className="form-select sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms.</p>
              <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
