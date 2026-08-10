const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected:", mongoose.connection.host);
    console.log("Ready State:", mongoose.connection.readyState);
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    throw err;
  }
};

module.exports = connectDB;