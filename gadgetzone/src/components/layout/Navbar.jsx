/* ============================================================
   src/components/layout/Navbar.jsx
   Top navigation bar with search, cart, wishlist, auth links
   ============================================================ */

import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  // Detect scroll for navbar style change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Gadget<span className="logo-accent">Zone</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-nav">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              {link.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link admin-link ${isActive ? "active" : ""}`}>
              Admin
            </NavLink>
          )}
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Search toggle */}
          <button className="action-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
            🔍
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className="action-btn" aria-label="Wishlist">
            🤍
            {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="action-btn" aria-label="Cart">
            🛒
            {itemCount > 0 && <span className="action-badge">{itemCount}</span>}
          </Link>

          {/* Profile / Auth */}
          {user ? (
            <div className="profile-dropdown-wrapper">
              <button className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                <span className="profile-avatar">{user.avatar}</span>
                <span className="profile-name">{user.name.split(" ")[0]}</span>
                <span className="profile-arrow">▾</span>
              </button>
              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <span className="dropdown-avatar">{user.avatar}</span>
                    <div>
                      <p className="dropdown-name">{user.name}</p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>👤 Profile</Link>
                  <Link to="/orders" className="dropdown-item" onClick={() => setProfileOpen(false)}>📦 Orders</Link>
                  <Link to="/wishlist" className="dropdown-item" onClick={() => setProfileOpen(false)}>🤍 Wishlist</Link>
                  {isAdmin && <Link to="/admin" className="dropdown-item" onClick={() => setProfileOpen(false)}>⚙️ Admin Panel</Link>}
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout}>🚪 Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Search Bar (expands) */}
      {searchOpen && (
        <div className="search-overlay">
          <form className="search-form" onSubmit={handleSearch}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search laptops, headphones, keyboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="search-input"
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
            <button type="button" className="btn-icon" onClick={() => setSearchOpen(false)} style={{ background: "transparent", border: "none", color: "var(--color-text-muted)" }}>✕</button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === "/"} className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            {isAdmin && <Link to="/admin" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
          </nav>
          <div className="mobile-auth">
            {user ? (
              <>
                <Link to="/profile" className="btn btn-outline btn-full" onClick={() => setMenuOpen(false)}>My Profile</Link>
                <button className="btn btn-danger btn-full" onClick={() => { handleLogout(); setMenuOpen(false); }}>Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-full" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary btn-full" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
