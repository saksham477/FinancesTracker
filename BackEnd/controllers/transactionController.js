const { default: mongoose } = require("mongoose");
const transactionModel = require("../models/transactionModel.js");

const getTransactions = async (req, res) => {
  try {
    const { type } = req.query;

    const query = { userId: req.user.userId };
    console.log(query);

    if (type && type !== "all") {
      query.type = type;
    }

    const transactions = await transactionModel
      .find()
      .populate("userId", "name")
      .sort({ date: -1 });

    res.json({ success: true, data: transactions });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { amount, category, date, notes, type } = req.body;

    if (!amount || !category || !date || !type) {
      return res.status(400).json({
        success: false,
        message: "Amount, category, date, and type are required.",
      });
    }

    // Create the transaction
    const transaction = new transactionModel({
      amount,
      category,
      date,
      notes,
      type,
      userId: req.user.userId,
    });

    await transaction.save();
    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const updated = await transactionModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating transaction:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    await transactionModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Transaction deleted" });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
