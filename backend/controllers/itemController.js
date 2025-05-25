const Item = require("../models/itemModel");
const Sale = require("../models/salesModel"); // ✅ Already imported
const Category = require("../models/categoryModel");

exports.create = async (req, res) => {
  const imagePath = req.file ? `/uploads/${req.file.filename}` : "";
  const item = new Item({ ...req.body, image: imagePath });
  await item.save();
  res.json(item);
};

exports.getAll = async (req, res) => {
  const items = await Item.find().populate("categoryId");
  res.json(items);
};

exports.update = async (req, res) => {
  try {
    const updatedFields = {
      name: req.body.name,
      categoryId: req.body.categoryId,
      quantity: req.body.quantity,
      price: req.body.price,
    };

    if (req.file) {
      updatedFields.image = `/uploads/${req.file.filename}`;
    }

    const item = await Item.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    res.json(item);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update item." });
  }
};

exports.delete = async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};

// ✅ KEEPING ORIGINAL EMBEDDED SALES FOR ITEM HISTORY
exports.sell = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.quantity <= 0) {
      return res.status(400).json({ message: "Out of stock or item not found" });
    }

    // Decrease quantity
    item.quantity -= 1;

    // ✅ Push to embedded `sales` array inside Item
    item.sales.push({
      amount: item.price,
      date: new Date(),
    });

    await item.save();

    // ✅ Record the sale in the separate `sales` collection too
    const sale = new Sale({
      itemName: item.name,
      categoryId: item.categoryId,
      categoryName: item.categoryId?.name || '', // fallback if not populated
      amount: item.price,
      date: new Date(),
    });

    await sale.save();

    res.json(item);
  } catch (error) {
    console.error("Error processing sale:", error);
    res.status(500).json({ message: "Failed to process sale" });
  }
};

// ✅ MAIN SELL FUNCTION USED IN FRONTEND SALES PAGE
exports.sellItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('categoryId');

    if (!item || item.quantity <= 0) {
      return res.status(400).json({ message: "Out of stock or item not found" });
    }

    // Get category name manually in case populate fails
    let categoryName = '';
    if (item.categoryId && item.categoryId.name) {
      categoryName = item.categoryId.name;
    } else {
      // fallback: fetch category manually
      const category = await Category.findById(item.categoryId);
      if (category) categoryName = category.name;
    }

    item.quantity -= 1;
    await item.save();

    const sale = new Sale({
      itemName: item.name,
      categoryId: item.categoryId._id || item.categoryId,
      categoryName: categoryName,
      amount: item.price,
      date: new Date()
    });

    await sale.save();

    res.json({ success: true, message: 'Item sold and sale recorded', sale });
  } catch (err) {
    console.error("Error selling item:", err);
    res.status(500).json({ error: 'Sale failed' });
  }
};

exports.countItems = async (req, res) => {
  try {
    const count = await Item.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Failed to count items:", error);
    res.status(500).json({ message: "Error counting items." });
  }
};
