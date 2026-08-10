// src/pages/Contact.jsx
import { useState } from "react";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);
  const set = k => e => setForm({...form,[k]:e.target.value});
  const handleSubmit = e => { e.preventDefault(); setSent(true); setForm({name:"",email:"",subject:"",message:""}); };

  return (
    <div className="contact-page">
      <div className="page-hero"><div className="container"><h1>Contact Us</h1><p>We'd love to hear from you</p></div></div>
      <div className="container contact-layout">
        <div className="contact-info">
          <h2 className="contact-info-title">Get in Touch</h2>
          <p className="contact-info-desc">Our support team is available 24/7 to help you with any questions about products, orders, or anything else.</p>
          {[{icon:"📧",title:"Email",val:"support@gadgetzone.com"},{icon:"📞",title:"Phone",val:"+1 (555) 123-4567"},{icon:"📍",title:"Address",val:"123 Tech Street, Silicon Valley, CA 94025"},{icon:"🕐",title:"Hours",val:"24/7 Customer Support"}].map(c=>(
            <div key={c.title} className="contact-detail">
              <span className="cd-icon">{c.icon}</span>
              <div><p className="cd-title">{c.title}</p><p className="cd-val">{c.val}</p></div>
            </div>
          ))}
          <div className="contact-socials">
            {["𝕏 Twitter","in LinkedIn","ig Instagram","yt YouTube"].map(s=>(
              <a key={s} href="#" className="social-btn">{s.split(" ")[0]}</a>
            ))}
          </div>
        </div>
        <div className="contact-form-card">
          {sent ? (
            <div className="contact-success"><div style={{fontSize:"3rem",marginBottom:"var(--space-lg)"}}>✅</div><h3>Message Sent!</h3><p>We'll get back to you within 24 hours.</p><button className="btn btn-primary" onClick={()=>setSent(false)}>Send Another</button></div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="form-title">Send a Message</h2>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Name</label><input className="form-input" required value={form.name} onChange={set("name")} placeholder="Your name" /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" required type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" /></div>
              </div>
              <div className="form-group"><label className="form-label">Subject</label><input className="form-input" required value={form.subject} onChange={set("subject")} placeholder="How can we help?" /></div>
              <div className="form-group"><label className="form-label">Message</label><textarea className="form-textarea" required value={form.message} onChange={set("message")} placeholder="Tell us more..." style={{minHeight:"150px"}} /></div>
              <button type="submit" className="btn btn-primary btn-full btn-lg">Send Message →</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
