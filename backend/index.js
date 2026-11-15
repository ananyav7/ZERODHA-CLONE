require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");

const { HoldingsModel } = require("./model/HoldingsModel");
const PositionsModel = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");

const app = express();

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URL;

app.use(cors());
app.use(bodyParser.json());

// Helper to hash passwords
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Database connection helper for serverless and long-running environments
let isConnected = false;
async function connectDB() {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  if (!uri) {
    console.warn("⚠️ MONGO_URL not provided in environment variables!");
    return;
  }
  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
}

connectDB();
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Router supporting both direct and /api prefixed routes
const apiRouter = express.Router();

// Health check endpoint
apiRouter.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ================= AUTH & USER ENDPOINTS =================

// Signup route
apiRouter.post("/signup", async (req, res) => {
  try {
    const { username, email, password, mobile } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required" });
    }

    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email is already registered" });
    }

    const newUser = new UserModel({
      username,
      email,
      password: hashPassword(password),
      mobile: mobile || "",
      funds: {
        availableMargin: 25000,
        usedMargin: 0,
        openingBalance: 25000,
      },
    });

    await newUser.save();

    res.status(201).json({
      message: "Registration successful!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        funds: newUser.funds,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login route
apiRouter.post("/login", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: "Identifier and password required" });
    }

    const user = await UserModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ error: "Invalid username/email or password" });
    }

    res.json({
      message: "Login successful!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        funds: user.funds,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user profile & funds
apiRouter.get("/user/:username", async (req, res) => {
  try {
    const user = await UserModel.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      funds: user.funds,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add funds
apiRouter.post("/funds/add", async (req, res) => {
  try {
    const { username, amount } = req.body;
    const addAmt = Number(amount);
    if (!addAmt || addAmt <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    let user = await UserModel.findOne({ username });
    if (!user) {
      user = await UserModel.findOne(); // default user
    }

    if (user) {
      user.funds.availableMargin = (user.funds.availableMargin || 0) + addAmt;
      user.funds.openingBalance = (user.funds.openingBalance || 0) + addAmt;
      await user.save();
      return res.json({ message: "Funds added successfully", funds: user.funds });
    }

    res.json({ message: "Funds simulated", funds: { availableMargin: addAmt } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Withdraw funds
apiRouter.post("/funds/withdraw", async (req, res) => {
  try {
    const { username, amount } = req.body;
    const withdrawAmt = Number(amount);
    if (!withdrawAmt || withdrawAmt <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    let user = await UserModel.findOne({ username });
    if (!user) {
      user = await UserModel.findOne();
    }

    if (user) {
      if ((user.funds.availableMargin || 0) < withdrawAmt) {
        return res.status(400).json({ error: "Insufficient available margin" });
      }
      user.funds.availableMargin -= withdrawAmt;
      await user.save();
      return res.json({ message: "Funds withdrawn successfully", funds: user.funds });
    }

    res.json({ message: "Funds simulated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= PORTFOLIO & TRADING ENDPOINTS =================

// Get all holdings
apiRouter.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all positions
apiRouter.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders
apiRouter.get("/allOrders", async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({}).sort({ _id: -1 });
    res.json(allOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Execute / Place Order (BUY or SELL with Portfolio Mutation)
apiRouter.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode, username } = req.body;
    const numQty = Number(qty);
    const numPrice = Number(price);
    const orderMode = (mode || "BUY").toUpperCase();

    if (!name || !numQty || numQty <= 0 || !numPrice || numPrice <= 0) {
      return res.status(400).json({ error: "Valid stock name, qty, and price are required" });
    }

    const orderCost = numQty * numPrice;
    let user = username ? await UserModel.findOne({ username }) : await UserModel.findOne();

    if (orderMode === "BUY") {
      // Deduct from available margin if user funds exist
      if (user && user.funds) {
        if (user.funds.availableMargin < orderCost) {
          return res.status(400).json({
            error: `Insufficient margin! Required: ₹${orderCost.toFixed(2)}, Available: ₹${user.funds.availableMargin.toFixed(2)}`,
          });
        }
        user.funds.availableMargin -= orderCost;
        user.funds.usedMargin = (user.funds.usedMargin || 0) + orderCost;
        await user.save();
      }

      // Update or create in Holdings
      let holding = await HoldingsModel.findOne({ name });
      if (holding) {
        const totalOldCost = holding.qty * holding.avg;
        const totalNewCost = totalOldCost + orderCost;
        const newQty = holding.qty + numQty;
        holding.avg = Number((totalNewCost / newQty).toFixed(2));
        holding.qty = newQty;
        holding.price = numPrice;
        await holding.save();
      } else {
        await HoldingsModel.create({
          name,
          qty: numQty,
          avg: numPrice,
          price: numPrice,
          net: "+0.00%",
          day: "+0.00%",
        });
      }
    } else if (orderMode === "SELL") {
      // Validate holding exists to sell
      let holding = await HoldingsModel.findOne({ name });
      if (!holding || holding.qty < numQty) {
        return res.status(400).json({
          error: `Insufficient holdings to sell! You own ${holding ? holding.qty : 0} shares of ${name}.`,
        });
      }

      if (holding.qty === numQty) {
        await HoldingsModel.deleteOne({ _id: holding._id });
      } else {
        holding.qty -= numQty;
        holding.price = numPrice;
        await holding.save();
      }

      // Credit margin to user funds
      if (user && user.funds) {
        user.funds.availableMargin += orderCost;
        user.funds.usedMargin = Math.max(0, (user.funds.usedMargin || 0) - orderCost);
        await user.save();
      }
    } else {
      return res.status(400).json({ error: "Invalid order mode. Must be BUY or SELL" });
    }

    // Save order history
    const newOrder = new OrdersModel({
      name,
      qty: numQty,
      price: numPrice,
      mode: orderMode,
    });
    await newOrder.save();

    res.status(201).json({
      message: `${orderMode} order executed successfully!`,
      order: newOrder,
      funds: user ? user.funds : null,
    });
  } catch (err) {
    console.error("Order placement error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Mount router on both /api (when deployed behind /api rewrite) and root /
app.use("/api", apiRouter);
app.use("/", apiRouter);

// Start server if run directly
if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

module.exports = app;
