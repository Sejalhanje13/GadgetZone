// src/pages/About.jsx
import "./About.css";

const team = [
  {name:"Alex Chen",role:"CEO & Founder",avatar:"AC",bio:"10+ years in e-commerce and consumer electronics."},
  {name:"Priya Sharma",role:"CTO",avatar:"PS",bio:"Ex-Google engineer passionate about scalable systems."},
  {name:"Marcus Johnson",role:"Head of Design",avatar:"MJ",bio:"Award-winning UX designer with a love for clean interfaces."},
  {name:"Sofia Williams",role:"Head of Sales",avatar:"SW",bio:"Built partnerships with 50+ top electronics brands globally."},
];

export default function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container about-hero-content">
          <span className="section-label">Our Story</span>
          <h1 className="about-hero-title">We're on a Mission to<br/><span className="hero-title-accent">Democratize Tech</span></h1>
          <p className="about-hero-desc">GadgetZone was founded in 2019 with a simple idea: make the world's best electronics accessible to everyone, everywhere — at fair prices with exceptional service.</p>
        </div>
      </div>

      <div className="container">
        {/* Stats */}
        <div className="about-stats">
          {[{num:"50K+",label:"Happy Customers"},{num:"500+",label:"Products Listed"},{num:"50+",label:"Brand Partners"},{num:"4.9★",label:"Average Rating"}].map(s=>(
            <div key={s.label} className="about-stat"><span className="about-stat-num">{s.num}</span><span className="about-stat-label">{s.label}</span></div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="mv-grid">
          <div className="mv-card"><div className="mv-icon">🎯</div><h3>Our Mission</h3><p>To provide every customer with access to authentic, cutting-edge electronics at competitive prices, backed by world-class customer support and lightning-fast delivery.</p></div>
          <div className="mv-card"><div className="mv-icon">🔭</div><h3>Our Vision</h3><p>To become the most trusted electronics destination globally — where tech enthusiasts, professionals, and everyday users all find exactly what they need.</p></div>
          <div className="mv-card"><div className="mv-icon">💡</div><h3>Our Values</h3><p>Authenticity, transparency, and customer-first thinking guide every decision we make — from product curation to post-purchase support.</p></div>
        </div>

        {/* Team */}
        <section className="team-section">
          <div className="section-header"><span className="section-label">The People</span><h2 className="section-title">Meet Our Team</h2></div>
          <div className="team-grid">
            {team.map(m=>(
              <div key={m.name} className="team-card">
                <div className="team-avatar">{m.avatar}</div>
                <h3 className="team-name">{m.name}</h3>
                <p className="team-role">{m.role}</p>
                <p className="team-bio">{m.bio}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
