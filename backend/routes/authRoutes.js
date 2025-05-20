const express = require("express");
const { register, login, logout, getCurrentUser } = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getCurrentUser); // ✅ new route

module.exports = router;
