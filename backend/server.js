/**
 * =============================================================================
 * SMART TIFFIN SYSTEM - BACKEND SERVER
 * =============================================================================
 * Main entry point for the Express.js backend server
 * 
 * Features:
 * - RESTful API endpoints
 * - MongoDB database connection
 * - JWT authentication
 * - Role-based access control (Customer, Provider, Admin)
 * =============================================================================
 */

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// =============================================================================
// MIDDLEWARE
// =============================================================================

// CORS - Allow frontend to communicate with backend
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// =============================================================================
// ROUTES IMPORT
// =============================================================================

// Authentication routes
const authRoutes = require("./routes/authRoutes");

// Provider routes
const providerOnboardingRoutes = require("./routes/provider/providerOnboarding.routes");
const providerMenuRoutes = require("./routes/provider/providerMenuRoutes");
const providerDashboardRoutes = require("./routes/provider/providerDeshbordRoutes");
const kdsRoutes = require("./routes/provider/kdsRoutes");
const subscriptionRoutes = require("./routes/provider/subscriptionRoutes");
const walletRoutes = require("./routes/provider/walletRoutes");
const reviewTriageRoutes = require("./routes/provider/reviewTriageRoutes");
const storeProfileRoutes = require("./routes/provider/storeProfileRoutes");

// Admin routes
const adminRoutes = require("./routes/adminRoutes");

// =============================================================================
// ROUTES REGISTRATION
// =============================================================================

// Health check endpoint
app.get("/", (req, res) => {
  res.send("API running & DB connected");
});

// Auth endpoints: /api/auth/*
app.use("/api/auth", authRoutes);

// Provider endpoints: /api/provider-*
app.use("/api/provider-onboarding", providerOnboardingRoutes);
app.use("/api/provider-menus", providerMenuRoutes);
app.use("/api/provider-deshbord", providerDashboardRoutes);
app.use("/api/provider-kds", kdsRoutes);
app.use("/api/provider-subscription", subscriptionRoutes);
app.use("/api/provider-wallet", walletRoutes);
app.use("/api/provider-reviews", reviewTriageRoutes);
app.use("/api/provider-store", storeProfileRoutes);

// Admin endpoints: /api/admin/*
app.use("/api/admin", adminRoutes);

// =============================================================================
// START SERVER
// =============================================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
