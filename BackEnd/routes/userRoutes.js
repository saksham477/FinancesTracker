const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel.js");

// GET /api/users
router.get("/api/users", async (req, res) => {
  try {
    const users = await userModel.find({}, "_id name email");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
