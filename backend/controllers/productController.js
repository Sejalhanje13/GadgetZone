const Product = require("../models/Product");

// Add Product
const addProduct = async (req, res) => {
  console.log(">>> ADD PRODUCT HIT");
  console.log(req.body);

  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};
// Get All Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product Updated Successfully",
      product,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,


}