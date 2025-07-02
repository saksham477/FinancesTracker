const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/adminController.js");
const {
  authenticateJWT,
  adminCheck,
} = require("../middleware/authenticateJWT");

router.get("/stats", authenticateJWT, adminCheck, getStats);

module.exports = router;
