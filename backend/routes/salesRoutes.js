const express = require("express");
const router = express.Router();
const { getTodaySales } = require("../controllers/salesController");

router.get("/today-total", getTodaySales); // 👈 Add this route

module.exports = router;
