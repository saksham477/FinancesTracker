const express = require("express");
const router = express.Router();
const {
  authenticateJWT,
  adminCheck,
} = require("../middleware/authenticateJWT");
const { getAdminStats } = require("../controllers/adminController");

// Admin Dashboard Stats
router.get("/stats", authenticateJWT, adminCheck, getAdminStats);

module.exports = router;
