const express = require("express");
const router = express.Router();
const { getRecentSales } = require("../controllers/salesController");
const { getTodayTotalSales } = require("../controllers/salesController");
const salesController = require("../controllers/salesController");

router.get("/recent", getRecentSales); // ✅ Add this

router.get("/today-total", getTodayTotalSales); // ✅ Add this line

router.get("/categories/daily-sales", salesController.getCategorySalesOverTime);

module.exports = router;
