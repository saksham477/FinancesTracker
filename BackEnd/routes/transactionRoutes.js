const express = require("express");
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const { authenticateJWT } = require("../middleware/authenticateJWT.js");

// Routes
router.get("/", authenticateJWT, getTransactions);
router.post("/", authenticateJWT, createTransaction); // Ensure this is correct
router.put("/:id", authenticateJWT, updateTransaction);
router.delete("/:id", authenticateJWT, deleteTransaction);

module.exports = router;
