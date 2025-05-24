const express = require("express");
const {
  create,
  getAll,
  update,
  delete: remove,
  count,
  getCategoryDistribution, // ✅ Include only once
} = require("../controllers/categoryController");

const router = express.Router();

router.post("/", create);
router.get("/", getAll);
router.get("/count", count);
router.get("/distribution", getCategoryDistribution); // ✅ Add this only once
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
