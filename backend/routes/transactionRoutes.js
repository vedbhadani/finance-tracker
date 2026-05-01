const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  uploadReceipt,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// All transaction routes are protected
router.use(protect);

router.route("/:id/receipt").post(upload.single("receipt"), uploadReceipt);

router.route("/").post(createTransaction).get(getTransactions);

router.route("/:id").put(updateTransaction).delete(deleteTransaction);

module.exports = router;
