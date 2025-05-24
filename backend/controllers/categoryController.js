const Category = require("../models/categoryModel");
const Sale = require("../models/salesModel");

exports.create = async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.json(category);
};

exports.getAll = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

exports.update = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(category);
};

exports.delete = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};

exports.count = async (req, res) => {
  try {
    const count = await Category.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to count categories' });
  }
};

// ✅ Category Distribution with Lookup (Recommended if using categoryId in sales)
exports.getCategoryDistribution = async (req, res) => {
  try {
    const distribution = await Sale.aggregate([
      {
        $group: {
          _id: "$categoryName",
          totalSold: { $sum: 1 },
        },
      },
      { $sort: { totalSold: -1 } },
    ]);
    res.json(distribution); // ✅ Ensure this is an array
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch category distribution" });
  }
};

