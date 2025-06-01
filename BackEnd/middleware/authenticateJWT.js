const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};
const authenticateAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ error: "Access denied. Admin privileges required." });
    }

    next(); // Proceed if user is admin
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = { authenticateJWT, authenticateAdmin };
