// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Login() {
  const { login, authError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    return e;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("1. Submit clicked");

  const errs = validate();

  if (Object.keys(errs).length) {
    console.log("2. Validation failed", errs);
    setErrors(errs);
    return;
  }

  console.log("3. Calling login...");

  setLoading(true);

  const result = await login(form.email, form.password);

  console.log("4. Login result:", result);

  setLoading(false);

  if (result.success) {
    console.log("5. Login success");

    if (result.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  }
};  

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><Link to="/">⚡ GadgetZone</Link></div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        {authError && <div className="alert alert-error" style={{marginBottom:"var(--space-lg)"}}>{authError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input className={`form-input ${errors.email ? "error" : ""}`} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input className={`form-input ${errors.password ? "error" : ""}`} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>
          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

       <div className="auth-demo-hint">
  <p>Create an account to continue shopping.</p>
</div>

        <p className="auth-switch">Don't have an account? <Link to="/register">Sign Up</Link></p>
      </div>
    </div>
  );
}
