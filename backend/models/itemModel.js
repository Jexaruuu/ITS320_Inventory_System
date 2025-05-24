const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  image: String,
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  sales: [
    {
      amount: Number,
      date: Date,
    },
  ],
});

module.exports = mongoose.model("Item", itemSchema);
