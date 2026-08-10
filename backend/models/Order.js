const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    shippingAddress: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },

    orderStatus: {
      type: String,
      default: "Processing",
      enum: [
        "Processing",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);