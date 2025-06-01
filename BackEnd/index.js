require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

// Configuration
const mongoUrl =
  process.env.MONGODB_URI || "mongodb://localhost:27017/FinanceTracker";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret";
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());

// Database Connection
const connectDatabase = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};
connectDatabase();

// Schemas
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Plain text (for now)
    name: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const transactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    notes: { type: String, default: "" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, enum: ["income", "expense"], required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);

// Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired token" });
    req.user = decoded;
    next();
  });
};

const adminCheck = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }
    next();
  } catch (err) {
    console.error("Admin check error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Routes

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Register
app.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name)
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });

    const user = await User.create({ email, password, name, role: "user" });
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      success: true,
      message: "User registered",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ✅ ADD USER (Admin only)
app.post("/users", authenticateJWT, adminCheck, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });

    const newUser = await User.create({ name, email, password, role });
    res
      .status(201)
      .json({ success: true, message: "User added", data: newUser });
  } catch (err) {
    console.error("Add user error:", err);
    res.status(500).json({ success: false, message: "Failed to add user" });
  }
});

// Get Users (Admin only)
app.get("/users", authenticateJWT, adminCheck, async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: users });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

// Update User
app.put("/users/:id", authenticateJWT, adminCheck, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role)
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true, runValidators: true }
    ).select("name email role createdAt");
    if (!updatedUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User updated", data: updatedUser });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
});

// Delete User
app.delete("/api/users/:id", authenticateJWT, adminCheck, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
});

// Admin Dashboard Stats
app.get("/api/admin/stats", authenticateJWT, adminCheck, async (req, res) => {
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
});

// Add Transaction
app.post("/api/transactions", authenticateJWT, async (req, res) => {
  try {
    const { amount, category, date, notes, type } = req.body;
    const userId = req.user.userId;
    if (!amount || !category || !type)
      return res.status(400).json({
        success: false,
        message: "Amount, category, and type required",
      });

    const newTransaction = await Transaction.create({
      amount,
      category,
      date: date || new Date(),
      notes,
      userId,
      type,
    });
    res.status(201).json({
      success: true,
      message: "Transaction added",
      data: newTransaction,
    });
  } catch (err) {
    console.error("Add transaction error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to add transaction" });
  }
});

// Get Transactions
app.get("/api/transactions", authenticateJWT, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.userId,
    }).sort({ date: -1 });
    res.json({ success: true, data: transactions });
  } catch (err) {
    console.error("Fetch transactions error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch transactions" });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
