// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Register() {
  const { register, authError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const errs = validate();

  if (Object.keys(errs).length) {
    setErrors(errs);
    return;
  }

  setLoading(true);

  const result = await register(
    form.name,
    form.email,
    form.password
  );

  setLoading(false);

  if (result.success) {
    navigate("/login");
  }
};
  

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><Link to="/">⚡ GadgetZone</Link></div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join thousands of happy customers</p>
        {authError && <div className="alert alert-error" style={{marginBottom:"var(--space-lg)"}}>{authError}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          {[
            { key: "name", label: "Full Name", type: "text", icon: "👤", ph: "John Doe" },
            { key: "email", label: "Email", type: "email", icon: "✉️", ph: "you@example.com" },
            { key: "password", label: "Password", type: "password", icon: "🔒", ph: "Min 6 characters" },
            { key: "confirm", label: "Confirm Password", type: "password", icon: "🔒", ph: "Re-enter password" },
          ].map(f => (
            <div className="form-group" key={f.key}>
              <label className="form-label">{f.label}</label>
              <div className="input-wrapper">
                <span className="input-icon">{f.icon}</span>
                <input className={`form-input ${errors[f.key] ? "error" : ""}`} type={f.type} placeholder={f.ph} value={form[f.key]} onChange={set(f.key)} />
              </div>
              {errors[f.key] && <p className="form-error">{errors[f.key]}</p>}
            </div>
          ))}
          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}
