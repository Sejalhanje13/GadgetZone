
console.log("Order Routes Loaded");
const express = require("express");

const router = express.Router();

const {
  getOrders,
  getAllOrders,
  placeOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

router.get("/", getAllOrders);
router.get("/:userId", getOrders);

router.post("/", (req, res, next) => {
  console.log("POST /api/orders hit");
  next();
}, placeOrder);


router.put("/", updateOrderStatus);

module.exports = router;