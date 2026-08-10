const Cart = require("../models/Cart");

// Get User Cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate("items.product");

    if (!cart) {
      return res.status(200).json({
        items: [],
      });
    }

    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add Item to Cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    res.status(200).json({
      message: "Product added to cart",
      cart,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const updateCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
     console.log({
  userId,
  productId,
  quantity,
});
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json({
      message: "Cart updated",
      cart,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
      message: "Product removed",
      cart,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.params.userId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      message: "Cart cleared",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
};