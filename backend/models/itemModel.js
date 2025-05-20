const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  quantity: Number,
  price: Number,
  image: String // store image file path
});

module.exports = mongoose.model("Item", itemSchema);
