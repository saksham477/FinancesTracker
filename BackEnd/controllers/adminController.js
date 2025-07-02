// controllers/adminController.js
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");

exports.getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: { $ne: "admin" } });
    const transactionCount = await Transaction.countDocuments();

    const incomeResult = await Transaction.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const expenseResult = await Transaction.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      success: true,
      data: {
        users: userCount,
        transactions: transactionCount,
        income: incomeResult[0]?.total || 0,
        expenses: expenseResult[0]?.total || 0,
      },
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ success: false, message: "Failed to load stats" });
  }
};
