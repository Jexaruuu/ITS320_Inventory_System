const mongoose = require("mongoose");

const connectDB = async () => {
  try {
 await mongoose.connect("mongodb://localhost:27017/inventory_system");
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
