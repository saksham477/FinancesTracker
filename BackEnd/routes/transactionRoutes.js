const express = require("express");
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const {
  authenticateJWT,
  adminCheck,
} = require("../middleware/authenticateJWT.js");

// Routes

router.get("/", adminCheck, getTransactions);
router.post("/", adminCheck, createTransaction);
router.put("/:id", adminCheck, updateTransaction);
router.delete("/:id", adminCheck, deleteTransaction);

module.exports = router;
