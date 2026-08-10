const express = require("express");

const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

// Get user's cart
router.get("/:userId", getCart);

// Add item to cart
router.post("/", addToCart);

// Update quantity
router.put("/", updateCart);

// Remove item
router.delete("/", removeFromCart);

// Clear entire cart
router.delete("/:userId", clearCart);

module.exports = router;