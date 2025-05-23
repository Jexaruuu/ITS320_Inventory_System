const Item = require("../models/itemModel");

exports.getTodaySales = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sales = await Item.aggregate([
      { $unwind: "$sales" },
      {
        $match: {
          "sales.date": { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$sales.amount" }
        }
      }
    ]);

    res.json({ total: sales[0]?.total || 0 });
  } catch (error) {
    console.error("Error fetching today's sales:", error);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
};
