const express = require("express");
const router = express.Router();
const {
    getDashboardStats,
    getProviders,
    verifyProvider,
    toggleProviderStatus,
    broadcastMessage
} = require("../controllers/admin/adminController");


const { protect, authorizeRoles } = require("../middleware/authMiddleware.middleware");


router.get("/stats", protect, authorizeRoles("admin"), getDashboardStats);

// Provider Management Routes
router.get("/providers", protect, authorizeRoles("admin"), getProviders);
router.put("/providers/:id/verify", protect, authorizeRoles("admin"), verifyProvider);
router.put("/providers/:id/status", protect, authorizeRoles("admin"), toggleProviderStatus);

// Broadcast
router.post("/broadcast", protect, authorizeRoles("admin"), broadcastMessage);
module.exports = router;