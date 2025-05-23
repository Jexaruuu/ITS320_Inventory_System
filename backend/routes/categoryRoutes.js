const express = require("express");
const {create,getAll,update,delete: remove,count} = require("../controllers/categoryController");

const router = express.Router();

router.post("/", create);
router.get("/", getAll);
router.get("/count", count); // 👈 Add this line
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
