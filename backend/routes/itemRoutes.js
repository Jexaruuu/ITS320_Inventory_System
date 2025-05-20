const express = require("express");
const multer = require("multer");
const { create, getAll, update, delete: remove, sell, countItems } = require("../controllers/itemController");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/", upload.single("image"), create);
router.get("/", getAll);

// ✅ Make sure this route also uses multer
router.put("/:id", upload.single("image"), update);

router.delete("/:id", remove);
router.patch("/sell/:id", sell);

router.get("/count", countItems); // 👈 Add this line at the top with other routes


module.exports = router;
