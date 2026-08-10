// src/components/ui/ProtectedRoute.jsx
// Role-based route protection
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="container" style={{ paddingTop: "120px", textAlign: "center", minHeight: "60vh" }}>
        <div className="empty-state">
          <div className="empty-icon" style={{ fontSize: "3rem" }}>🚫</div>
          <h3 style={{ marginBottom: "0.5rem" }}>Access Denied</h3>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>
            You need admin privileges to access this page.
          </p>
          <a href="/" className="btn btn-primary">Go Home</a>
        </div>
      </div>
    );
  }

  return children;
}
