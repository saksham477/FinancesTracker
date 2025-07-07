const express = require("express");
const router = express.Router();
const {
  getUserTransactions,
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
router.get("/users", authenticateJWT, getUserTransactions);
router.get("/", authenticateJWT, adminCheck, getTransactions);
router.post("/", authenticateJWT, createTransaction);
router.put("/:id", authenticateJWT, updateTransaction);
router.delete("/:id", authenticateJWT, deleteTransaction);

module.exports = router;
