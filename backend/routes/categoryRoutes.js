const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");

// All category routes are protected
router.use(protect);

router.route("/").post(createCategory).get(getCategories);

router.route("/:id").delete(deleteCategory);

module.exports = router;
