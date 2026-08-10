// src/pages/Profile.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: "", address: "123 Tech Street, Silicon Valley, CA 94025" });
  const [saved, setSaved] = useState(false);

  if (!user) return <div className="container" style={{paddingTop:"120px",textAlign:"center"}}><div className="empty-state"><div className="empty-icon">🔒</div><h3>Please log in</h3><Link to="/login" className="btn btn-primary">Login</Link></div></div>;

  const handleSave = (e) => { e.preventDefault(); updateProfile({ name: form.name }); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="profile-page">
      <div className="page-hero"><div className="container"><h1>My Profile</h1><p>Manage your account settings</p></div></div>
      <div className="container profile-layout">
        {/* Sidebar nav */}
        <aside className="profile-sidebar">
          <div className="profile-avatar-big">{user.avatar}</div>
          <h3 className="profile-user-name">{user.name}</h3>
          <p className="profile-user-email">{user.email}</p>
          <nav className="profile-nav">
            {[{to:"/profile",label:"👤 Profile",active:true},{to:"/orders",label:"📦 Orders"},{to:"/wishlist",label:"🤍 Wishlist"},{to:"/cart",label:"🛒 Cart"}].map(l=>(
              <Link key={l.to} to={l.to} className={`profile-nav-link ${l.active?"active":""}`}>{l.label}</Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <div className="profile-main">
          <div className="profile-section">
            <h2 className="profile-section-title">Personal Information</h2>
            {saved && <div className="alert alert-success" style={{marginBottom:"var(--space-lg)"}}>✓ Profile updated successfully!</div>}
            <form onSubmit={handleSave}>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={form.email} disabled style={{opacity:0.6}} /></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Role</label><input className="form-input" value={user.role} disabled style={{opacity:0.6,textTransform:"capitalize"}} /></div>
              </div>
              <div className="form-group"><label className="form-label">Saved Address</label><input className="form-input" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} /></div>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
          </div>

          <div className="profile-section">
            <h2 className="profile-section-title">Account Settings</h2>
            <div className="settings-list">
              {[{icon:"🔔",title:"Email Notifications",desc:"Receive order updates and promotions"},{icon:"🔒",title:"Two-Factor Auth",desc:"Extra security for your account"},{icon:"🎨",title:"Theme Preference",desc:"Dark mode enabled"}].map(s=>(
                <div key={s.title} className="setting-item">
                  <span className="setting-icon">{s.icon}</span>
                  <div className="setting-info"><p className="setting-title">{s.title}</p><p className="setting-desc">{s.desc}</p></div>
                  <div className="toggle-switch"><div className="toggle-thumb" /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
