/**
 * Provider Order Routes
 * Routes for provider to manage orders
 * 
 * Simple, beginner-friendly code
 */

const express = require("express");
const router = express.Router();

// Import controller functions
const {
    cancelOrderByProvider,
    getTodaysOrders
} = require("../../controllers/provider/providerOrderController");

// Import auth middleware
const { protect, providerOnly } = require("../../middleware/authMiddleware.middleware");

// All routes require provider to be logged in
// GET /api/provider/orders/today - Get today's orders
router.get("/today", protect, providerOnly, getTodaysOrders);

// POST /api/provider/orders/cancel - Cancel an order
router.post("/cancel", protect, providerOnly, cancelOrderByProvider);

module.exports = router;
