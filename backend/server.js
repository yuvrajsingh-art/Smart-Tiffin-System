const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB(); // 👈 DB CONNECT HERE

const app = express();

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running & DB connected");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


const authRoutes = require("./routes/authRoutes");
const providerOnboardingRoutes = require("./routes/provider/providerOnboarding.routes")
const providerMenuRoutes = require("./routes/provider/providerMenuRoutes")
const providerDeshbordRoutes = require("./routes/provider/providerDeshbordRoutes")
const kdsRoutes = require("./routes/provider/kdsRoutes")
const subscriptionRoutes = require("./routes/provider/subscriptionRoutes")
const walletRoutes = require("./routes/provider/walletRoutes")
const reviewTriageRoutes = require("./routes/provider/reviewTriageRoutes")
const storeProfileRoutes = require("./routes/provider/storeProfileRoutes")
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/provider-onboarding", providerOnboardingRoutes);
app.use("/api/provider-menus", providerMenuRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/provider-deshbord", providerDeshbordRoutes)
app.use("/api/provider-kds", kdsRoutes)
app.use("/api/provider-subscription", subscriptionRoutes)
app.use("/api/provider-wallet", walletRoutes)
app.use("/api/provider-reviews", reviewTriageRoutes)
app.use("/api/provider-store", storeProfileRoutes)
app.use("/api/admin", adminRoutes);

