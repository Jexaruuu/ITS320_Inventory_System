// backend/models/saleModel.js
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  itemName: String,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  categoryName: String, // 👈 Add this
  amount: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);
