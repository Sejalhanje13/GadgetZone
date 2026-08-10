const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    originalPrice: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    stock: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    trending: {
      type: Boolean,
      default: false,
    },

    specs: {
      type: Object,
      default: {},
    },

    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);