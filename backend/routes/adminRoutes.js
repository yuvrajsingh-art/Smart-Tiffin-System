/**
 * =============================================================================
 * ADMIN ROUTES
 * =============================================================================
 * All API routes for admin panel operations
 * Base URL: /api/admin
 * All routes are protected and require admin role
 * =============================================================================
 */

const express = require("express");
const router = express.Router();

// Import controller functions
const {
    getDashboardStats,
    getProviders,
    verifyProvider,
    toggleProviderStatus,
    broadcastMessage,
    globalSearch,
    getCustomers,
    getOrders,
    getFinanceStats,
    getPayouts,
    processPayout
} = require("../controllers/admin/adminController");

// Import authentication middleware
const { protect, authorizeRoles } = require("../middleware/authMiddleware.middleware");

// =============================================================================
// DASHBOARD
// =============================================================================
// GET /api/admin/stats - Get dashboard statistics
router.get("/stats", protect, authorizeRoles("admin"), getDashboardStats);

// =============================================================================
// PROVIDER MANAGEMENT
// =============================================================================
// GET /api/admin/providers - Get all providers
router.get("/providers", protect, authorizeRoles("admin"), getProviders);

// PUT /api/admin/providers/:id/verify - Verify/Approve a provider
router.put("/providers/:id/verify", protect, authorizeRoles("admin"), verifyProvider);

// PUT /api/admin/providers/:id/status - Toggle provider status (suspend/activate)
router.put("/providers/:id/status", protect, authorizeRoles("admin"), toggleProviderStatus);

// =============================================================================
// CUSTOMER MANAGEMENT
// =============================================================================
// GET /api/admin/customers - Get all customers
router.get("/customers", protect, authorizeRoles("admin"), getCustomers);

// =============================================================================
// ORDER MANAGEMENT
// =============================================================================
// GET /api/admin/orders - Get all orders
router.get("/orders", protect, authorizeRoles("admin"), getOrders);

// =============================================================================
// FINANCE MANAGEMENT
// =============================================================================
// GET /api/admin/finance/stats - Get finance statistics
router.get("/finance/stats", protect, authorizeRoles("admin"), getFinanceStats);

// GET /api/admin/finance/payouts - Get pending payouts list
router.get("/finance/payouts", protect, authorizeRoles("admin"), getPayouts);

// POST /api/admin/finance/payout - Process a payout
router.post("/finance/payout", protect, authorizeRoles("admin"), processPayout);

// =============================================================================
// UTILITIES
// =============================================================================
// POST /api/admin/broadcast - Send broadcast message to all users
router.post("/broadcast", protect, authorizeRoles("admin"), broadcastMessage);

// GET /api/admin/search - Global search across entities
router.get("/search", protect, authorizeRoles("admin"), globalSearch);

module.exports = router;