# ⚡ GadgetZone — Premium Electronics E-Commerce

A full-featured, production-grade React e-commerce app built for portfolios, resumes, and GitHub showcases.

## 🚀 Quick Start

```bash
cd gadgetzone
npm install
npm run dev
```
Open http://localhost:5173

## 🔑 Demo Credentials
- **User:** demo@gadgetzone.com / demo123
- **Admin:** admin@gadgetzone.com / admin123

## 📁 Folder Structure
```
src/
├── components/
│   ├── common/         # ProductCard
│   └── layout/         # Navbar, Footer
├── context/            # CartContext, WishlistContext, AuthContext
├── data/               # products.js (12 products)
├── pages/
│   ├── Home.jsx        # Landing page
│   ├── Products.jsx    # Grid + filters
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Wishlist.jsx
│   ├── Login.jsx / Register.jsx
│   ├── Profile.jsx
│   ├── Orders.jsx
│   ├── Contact.jsx
│   ├── About.jsx
│   ├── Payment.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── AdminProducts.jsx
│       └── AdminOrders.jsx
└── styles/             # global.css, components.css
```

## 🛠 Tech Stack
- **React 18** + Vite
- **React Router DOM v6**
- **Context API** (Cart, Wishlist, Auth)
- **CSS Custom Properties** (design tokens)
- **Fully Responsive** (mobile/tablet/desktop)

## 📦 npm Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## 🔮 Future Backend Integration Plan
1. Replace `src/data/products.js` with API calls (Axios/Fetch)
2. Replace `AuthContext` mock with JWT authentication (Node.js + Express)
3. Add MongoDB/PostgreSQL for products, orders, users
4. Connect payment to Stripe/Razorpay API
5. Add image upload with Cloudinary
6. Deploy backend to Railway/Render, frontend to Vercel

## 📝 Resume Bullet Points
- Built a full-stack-ready React 18 e-commerce platform (GadgetZone) with 12+ pages, Context API state management, and a responsive dark-theme UI serving 12 product categories
- Implemented advanced features including multi-filter product search, persistent cart/wishlist (localStorage), role-based admin dashboard, and animated hero components
- Architected a scalable component library with reusable ProductCard, Navbar, and layout components following industry-standard folder structure and modern CSS design tokens
