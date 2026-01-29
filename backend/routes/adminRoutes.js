const express = require("express");
const router = express.Router();
const {
    getDashboardStats,
    getProviders,
    verifyProvider,
    toggleProviderStatus,
    broadcastMessage,
    globalSearch,
    getCustomers,
    getOrders
} = require("../controllers/admin/adminController");


const { protect, authorizeRoles } = require("../middleware/authMiddleware.middleware");


router.get("/stats", protect, authorizeRoles("admin"), getDashboardStats);

// Provider Management Routes
router.get("/providers", protect, authorizeRoles("admin"), getProviders);
router.put("/providers/:id/verify", protect, authorizeRoles("admin"), verifyProvider);
router.put("/providers/:id/status", protect, authorizeRoles("admin"), toggleProviderStatus);

// Broadcast
router.post("/broadcast", protect, authorizeRoles("admin"), broadcastMessage);

// Global Search
router.get("/search", protect, authorizeRoles("admin"), globalSearch);

// Customer Management
router.get("/customers", protect, authorizeRoles("admin"), getCustomers);

// Order Management
router.get("/orders", protect, authorizeRoles("admin"), getOrders);

module.exports = router;