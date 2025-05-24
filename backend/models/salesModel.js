// backend/models/saleModel.js
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);
