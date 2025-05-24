const Item = require("../models/itemModel");

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

exports.sell = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.quantity <= 0) {
      return res.status(400).json({ message: "Out of stock or item not found" });
    }

    // Decrease quantity
    item.quantity -= 1;

    // ✅ Record the sale
    item.sales.push({
      amount: item.price,
      date: new Date(), // Make sure this is recorded for dashboard aggregation
    });

    await item.save();
    res.json(item);
  } catch (error) {
    console.error("Error processing sale:", error);
    res.status(500).json({ message: "Failed to process sale" });
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
