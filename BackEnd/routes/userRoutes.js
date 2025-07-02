const express = require("express");
const router = express.Router();
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const {
  authenticateJWT,
  adminCheck,
} = require("../middleware/authenticateJWT");

router.get("/", authenticateJWT, adminCheck, getUsers);
router.post("/", authenticateJWT, adminCheck, addUser);
router.put("/:id", authenticateJWT, adminCheck, updateUser);
router.delete("/:id", authenticateJWT, adminCheck, deleteUser);

module.exports = router;
