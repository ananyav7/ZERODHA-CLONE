require("dotenv").config();
const mongoose = require("mongoose");
const crypto = require("crypto");

const { HoldingsModel } = require("./model/HoldingsModel");
const PositionsModel = require("./model/PositionsModel");
const { UserModel } = require("./model/UserModel");

const uri = process.env.MONGO_URL;

const initialHoldings = [
  {
    name: "BHARTIARTL",
    qty: 2,
    avg: 538.05,
    price: 541.15,
    net: "+0.58%",
    day: "+2.99%",
  },
  {
    name: "HDFCBANK",
    qty: 2,
    avg: 1383.4,
    price: 1522.35,
    net: "+10.04%",
    day: "+0.11%",
  },
  {
    name: "HINDUNILVR",
    qty: 1,
    avg: 2335.85,
    price: 2417.4,
    net: "+3.49%",
    day: "+0.21%",
  },
  {
    name: "INFY",
    qty: 1,
    avg: 1350.5,
    price: 1555.45,
    net: "+15.18%",
    day: "-1.60%",
    isLoss: true,
  },
  {
    name: "ITC",
    qty: 5,
    avg: 202.0,
    price: 207.9,
    net: "+2.92%",
    day: "+0.80%",
  },
  {
    name: "KPITTECH",
    qty: 5,
    avg: 250.3,
    price: 266.45,
    net: "+6.45%",
    day: "+3.54%",
  },
  {
    name: "M&M",
    qty: 2,
    avg: 809.9,
    price: 779.8,
    net: "-3.72%",
    day: "-0.01%",
    isLoss: true,
  },
  {
    name: "RELIANCE",
    qty: 1,
    avg: 2193.7,
    price: 2112.4,
    net: "-3.71%",
    day: "+1.44%",
  },
  {
    name: "SBIN",
    qty: 4,
    avg: 324.35,
    price: 430.2,
    net: "+32.63%",
    day: "-0.34%",
    isLoss: true,
  },
  {
    name: "TATAPOWER",
    qty: 5,
    avg: 104.2,
    price: 124.15,
    net: "+19.15%",
    day: "-0.24%",
    isLoss: true,
  },
  {
    name: "TCS",
    qty: 1,
    avg: 3041.7,
    price: 3194.8,
    net: "+5.03%",
    day: "-0.25%",
    isLoss: true,
  },
  {
    name: "WIPRO",
    qty: 4,
    avg: 489.3,
    price: 577.75,
    net: "+18.08%",
    day: "+0.32%",
  },
];

const initialPositions = [
  {
    product: "CNC",
    name: "EVEREADY",
    qty: 2,
    avg: 316.27,
    price: 312.35,
    net: "+0.58%",
    day: "-1.24%",
    isLoss: true,
  },
  {
    product: "CNC",
    name: "JUBLFOOD",
    qty: 1,
    avg: 3124.75,
    price: 3082.65,
    net: "+10.04%",
    day: "-1.35%",
    isLoss: true,
  },
];

async function seed() {
  if (!uri) {
    console.error("MONGO_URL not found in .env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB for seeding...");

  const holdingsCount = await HoldingsModel.countDocuments();
  if (holdingsCount === 0) {
    await HoldingsModel.insertMany(initialHoldings);
    console.log(`✅ Seeded ${initialHoldings.length} holdings.`);
  } else {
    console.log(`ℹ️ Holdings collection already has ${holdingsCount} records.`);
  }

  const positionsCount = await PositionsModel.countDocuments();
  if (positionsCount === 0) {
    await PositionsModel.insertMany(initialPositions);
    console.log(`✅ Seeded ${initialPositions.length} positions.`);
  } else {
    console.log(`ℹ️ Positions collection already has ${positionsCount} records.`);
  }

  const demoUser = await UserModel.findOne({ username: "demo_trader" });
  if (!demoUser) {
    const hashedPassword = crypto.createHash("sha256").update("demo123").digest("hex");
    await UserModel.create({
      username: "demo_trader",
      email: "demo@zerodha.clone",
      password: hashedPassword,
      mobile: "9876543210",
      funds: {
        availableMargin: 50000,
        usedMargin: 0,
        openingBalance: 50000,
      },
    });
    console.log("✅ Seeded default demo user (demo_trader / demo123).");
  }

  console.log("Seeding complete!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Error during seeding:", err);
  process.exit(1);
});
