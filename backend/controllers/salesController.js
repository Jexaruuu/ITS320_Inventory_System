const Item = require("../models/itemModel");

exports.getTodaySales = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    // Today's sales
    const todaySales = await Item.aggregate([
      { $unwind: "$sales" },
      { $match: { "sales.date": { $gte: startOfToday } } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$sales.amount" },
          totalCount: { $sum: 1 }
        }
      }
    ]);

    // Yesterday's sales (for comparison)
    const yesterdaySales = await Item.aggregate([
      { $unwind: "$sales" },
      {
        $match: {
          "sales.date": {
            $gte: startOfYesterday,
            $lt: startOfToday
          }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$sales.amount" },
          totalCount: { $sum: 1 }
        }
      }
    ]);

    const today = todaySales[0] || { totalAmount: 0, totalCount: 0 };
    const yesterday = yesterdaySales[0] || { totalAmount: 0, totalCount: 0 };

    res.json({
      totalAmount: today.totalAmount,
      totalCount: today.totalCount,
      percentAmountChange:
        yesterday.totalAmount > 0
          ? ((today.totalAmount - yesterday.totalAmount) / yesterday.totalAmount) * 100
          : null,
      percentCountChange:
        yesterday.totalCount > 0
          ? ((today.totalCount - yesterday.totalCount) / yesterday.totalCount) * 100
          : null,
    });
  } catch (error) {
    console.error("Error fetching today's sales:", error);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
};
