const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const Product = require("./models/Product");
const products = require("./data/products"
  
);

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Delete old products
    await Product.deleteMany();

    // Convert frontend data to backend format
    const formattedProducts = products.map((product) => ({
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      images: product.images,
      stock: product.stock ?? (product.inStock ? 50 : 0),      
      rating: product.rating,
      reviews: product.reviews,
      featured: product.featured,
      trending: product.trending,
      specs: product.specs,
      tags: product.tags,
    }));

    await Product.insertMany(formattedProducts);

    console.log("🌱 Products Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();