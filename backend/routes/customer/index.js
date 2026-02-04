const express = require("express");
const router = express.Router();

const dashboardRoutes = require("./customerDashboardRoutes");
const walletRoutes = require("./walletRoutes");
const menuRoutes = require("./menuRoutes");
const messDiscoveryRoutes = require("./messDiscoveryRoutes");
const feedbackRoutes = require("./feedbackRoutes");
const historyRoutes = require("./historyRoutes");
const trackRoutes = require("./trackRoutes");
const subscriptionRoutes = require("./subscriptionRoutes");
const profileRoutes = require("./profileRoutes");
const notificationRoutes = require("./notificationRoutes");
const supportRoutes = require("./supportRoutes");

// Register all customer sub-routes
router.use("/dashboard", dashboardRoutes);
router.use("/wallet", walletRoutes);
router.use("/menu", menuRoutes);
router.use("/discovery", messDiscoveryRoutes); // Note: shifted under /customer for consistency
router.use("/feedback", feedbackRoutes);
router.use("/history", historyRoutes);
router.use("/track", trackRoutes);
router.use("/subscription", subscriptionRoutes);
router.use("/profile", profileRoutes);
router.use("/notifications", notificationRoutes);
router.use("/support", supportRoutes);

module.exports = router;
