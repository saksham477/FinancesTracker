const express = require("express");
const router = require("express").Router();
const { authenticateAdmin } = require("../middleware/authenticateJWT");
router.get("/admin/stats", authenticateAdmin, async (req, res) => {
  try {
    const stats = await getAdminStats(); // Your logic here
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;
