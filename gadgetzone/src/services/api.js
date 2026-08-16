// ============================================================
// src/services/api.js
// Centralized API service layer — backend-ready architecture
// Swap mock functions for real fetch() calls when backend is ready
// ============================================================

import axios from "axios";

const API = axios.create({
baseURL: "https://gadgetzone-backend-n5wy.onrender.com/api",
});


import { products, sampleOrders } from "../data/products";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// ── Products ─────────────────────────────────────────────────
export const productService = {
  // Get All Products
  getAll: async () => {
    const response = await API.get("/products");
    return { data: response.data };
  },

  // Get Single Product
  getById: async (id) => {
    const response = await API.get(`/products/${id}`);
    return { data: response.data };
  },

  // Add Product
  create: async (productData) => {
    const response = await API.post("/products", productData);
    return response.data;
  },

  // Update Product
  update: async (id, productData) => {
    const response = await API.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete Product
  delete: async (id) => {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  },

  // Featured
  getFeatured: async () => {
    const response = await API.get("/products");
    return {
      data: response.data.filter((p) => p.featured),
    };
  },

  // Trending
  getTrending: async () => {
    const response = await API.get("/products");
    return {
      data: response.data.filter((p) => p.trending),
    };
  },

  // Related
  getRelated: async (productId, category) => {
    const response = await API.get("/products");

    return {
      data: response.data
        .filter(
          (p) =>
            p.category === category &&
            p._id !== productId
        )
        .slice(0, 4),
    };
  },
};

// ── Cart ─────────────────────────────────────────────

export const cartService = {
  getCart: async (userId) => {
    const response = await API.get(`/cart/${userId}`);
    return response.data;
  },

  addToCart: async (data) => {
    const response = await API.post("/cart", data);
    return response.data;
  },

  updateCart: async (data) => {
    const response = await API.put("/cart", data);
    return response.data;
  },

  removeFromCart: async (data) => {
    const response = await API.delete("/cart", {
      data,
    });
    return response.data;
  },

  clearCart: async (userId) => {
    const response = await API.delete(`/cart/${userId}`);
    return response.data;
  },
};


// ── Wishlist ─────────────────────────────────────────────

export const wishlistService = {
  getWishlist: async (userId) => {
    const response = await API.get(`/wishlist/${userId}`);
    return response.data;
  },

  addToWishlist: async (data) => {
    const response = await API.post("/wishlist", data);
    return response.data;
  },

  removeFromWishlist: async (data) => {
    const response = await API.delete("/wishlist", {
      data,
    });
    return response.data;
  },
};

// ── Orders ────────────────────────────────────────────────────

export const orderService = {
  getAll: async () => {
  const response = await API.get("/orders");
  return { data: response.data };
},

  getByUser: async (userId) => {
    const response = await API.get(`/orders/${userId}`);
    return { data: response.data };
  },

  getById: async (id) => {
    const response = await API.get(`/orders/${id}`);
    return { data: response.data };
  },

  create: async (orderData) => {
    const response = await API.post("/orders", orderData);
    return { data: response.data.order };
  },

  updateStatus: async (orderId, status) => {
    const response = await API.put("/orders", {
      orderId,
      status,
    });

    return { data: response.data.order };
  },
};



// ── Upload ────────────────────────────────────────────────────

export const uploadService = {
  uploadImage: async (formData) => {
    const response = await API.post("/upload", formData);
    return response.data;
  },
};






// ── Analytics ─────────────────────────────────────────────────
export const analyticsService = {
  getDashboardStats: async () => {
    await delay(400);
    const totalRevenue = sampleOrders.reduce((s, o) => s + o.total, 0);
    const avgOrderValue = totalRevenue / sampleOrders.length;
    return {
      data: {
        totalRevenue,
        totalOrders: sampleOrders.length,
        totalProducts: products.length,
        avgRating: (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1),
        avgOrderValue: avgOrderValue.toFixed(0),
        conversionRate: "3.24",
        monthlyRevenue: [
          { month: "Jan", revenue: 18400, orders: 42 },
          { month: "Feb", revenue: 22100, orders: 51 },
          { month: "Mar", revenue: 19800, orders: 47 },
          { month: "Apr", revenue: 28600, orders: 63 },
          { month: "May", revenue: 31200, orders: 71 },
          { month: "Jun", revenue: 26800, orders: 58 },
          { month: "Jul", revenue: 34500, orders: 79 },
          { month: "Aug", revenue: 38900, orders: 88 },
          { month: "Sep", revenue: 41200, orders: 94 },
          { month: "Oct", revenue: 35600, orders: 82 },
          { month: "Nov", revenue: 52300, orders: 119 },
          { month: "Dec", revenue: totalRevenue, orders: sampleOrders.length },
        ],
        categoryBreakdown: [
          { name: "Laptops", value: 38, color: "#6c63ff" },
          { name: "Headphones", value: 22, color: "#00d4aa" },
          { name: "Smartphones", value: 18, color: "#ff6b6b" },
          { name: "Keyboards", value: 12, color: "#ffa502" },
          { name: "Other", value: 10, color: "#5a5a70" },
        ],
      },
    };
  },
};


// ── Authentication ─────────────────────────────────────────────

export const authService = {
  register: async (userData) => {
    const response = await API.post("/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  },

  getProfile: async (token) => {
    const response = await API.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};