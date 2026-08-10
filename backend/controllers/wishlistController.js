const Wishlist = require("../models/Wishlist");

// Get Wishlist
const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    let wishlist = await Wishlist.findOne({
      user: userId,
    }).populate("products");

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        products: [],
      });
    }

    res.status(200).json(wishlist);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add Product
const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let wishlist = await Wishlist.findOne({
      user: userId,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        products: [],
      });
    }

    const exists = wishlist.products.find(
      (id) => id.toString() === productId
    );

    if (!exists) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    res.status(200).json({
      message: "Added to wishlist",
      wishlist,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove Product
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const wishlist = await Wishlist.findOne({
      user: userId,
    });

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();

    res.status(200).json({
      message: "Removed from wishlist",
      wishlist,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};