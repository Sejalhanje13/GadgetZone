const Order = require("../models/Order");

// Get All Orders of User
const getOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({
      user: userId,
    }).populate("items.product");

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Place Order
const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
    } = req.body;

    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    await order.save();

    res.status(200).json({
      message: "Order updated",
      order,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getOrders,
  getAllOrders,
  placeOrder,
  updateOrderStatus,
};