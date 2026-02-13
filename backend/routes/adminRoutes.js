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
    // Dashboard
    getDashboardStats,
    globalSearch,
    broadcastMessage,
    clearBroadcast,

    // Customer Management
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    toggleCustomerStatus,

    // Order Management
    getOrders,
    updateOrderStatus,
    cancelOrder,
    assignRider,

    // Provider Management
    getProviders,
    addProvider,
    verifyProvider,
    toggleProviderStatus,
    updateProvider,
    deleteProvider,

    // Finance Management
    getFinanceStats,
    getPayouts,
    processPayout,
    getInvoices,
    approveCancellation,
    getRefundRequests,

    // Menu Management
    getPendingMenus,
    approveMenu,
    rejectMenu,
    getAllMenus,
    updateMenu,
    deleteMenu,

    // Plans Management
    getPlans,
    createPlan,
    updatePlan,
    deletePlan,

    // Support Tickets
    getTickets,
    getTicketById,
    resolveTicket,
    replyToTicket,

    // Settings
    getSettings,
    updateSettings
} = require("../controllers/admin");  // Now imports from modular index.js

const {
    generateInvoicePDF,
    exportSalesCSV,
    exportCustomersCSV
} = require("../controllers/admin/reportController");

// Import authentication middleware
const { protect, authorizeRoles } = require("../middleware/authMiddleware.middleware");

// =============================================================================
// DASHBOARD
// =============================================================================

// GET /api/admin/stats - Get dashboard statistics
router.get("/stats", protect, authorizeRoles("admin"), getDashboardStats);

// GET /api/admin/search - Global search
router.get("/search", protect, authorizeRoles("admin"), globalSearch);

// POST /api/admin/broadcast - Send broadcast message
router.post("/broadcast", protect, authorizeRoles("admin"), broadcastMessage);

// DELETE /api/admin/broadcast - Clear broadcast message [NEW]
router.delete("/broadcast", protect, authorizeRoles("admin"), clearBroadcast);

// =============================================================================
// CUSTOMER MANAGEMENT
// =============================================================================

// GET /api/admin/customers - Get all customers
router.get("/customers", protect, authorizeRoles("admin"), getCustomers);

// POST /api/admin/customers - Add a new customer
router.post("/customers", protect, authorizeRoles("admin"), addCustomer);

// PUT /api/admin/customers/:id - Update customer
router.put("/customers/:id", protect, authorizeRoles("admin"), updateCustomer);

// DELETE /api/admin/customers/:id - Delete customer
router.delete("/customers/:id", protect, authorizeRoles("admin"), deleteCustomer);

// PUT /api/admin/customers/:id/status - Toggle customer ban status
router.put("/customers/:id/status", protect, authorizeRoles("admin"), toggleCustomerStatus);

// =============================================================================
// ORDER MANAGEMENT
// =============================================================================

// GET /api/admin/orders - Get all orders
router.get("/orders", protect, authorizeRoles("admin"), getOrders);

// PUT /api/admin/orders/:id/status - Update order status
router.put("/orders/:id/status", protect, authorizeRoles("admin"), updateOrderStatus);

// PUT /api/admin/orders/:id/cancel - Cancel order
router.put("/orders/:id/cancel", protect, authorizeRoles("admin"), cancelOrder);

// PUT /api/admin/orders/:id/rider - Assign rider to order
router.put("/orders/:id/rider", protect, authorizeRoles("admin"), assignRider);

// =============================================================================
// PROVIDER MANAGEMENT
// =============================================================================

// GET /api/admin/providers - Get all providers
router.get("/providers", protect, authorizeRoles("admin"), getProviders);

// POST /api/admin/providers - Add new provider
router.post("/providers", protect, authorizeRoles("admin"), addProvider);

// PUT /api/admin/providers/:id - Update provider
router.put("/providers/:id", protect, authorizeRoles("admin"), updateProvider);

// DELETE /api/admin/providers/:id - Delete provider
router.delete("/providers/:id", protect, authorizeRoles("admin"), deleteProvider);

// PUT /api/admin/providers/:id/verify - Verify provider
router.put("/providers/:id/verify", protect, authorizeRoles("admin"), verifyProvider);

// PUT /api/admin/providers/:id/status - Toggle provider status
router.put("/providers/:id/status", protect, authorizeRoles("admin"), toggleProviderStatus);

// =============================================================================
// FINANCE MANAGEMENT
// =============================================================================

// GET /api/admin/finance/stats - Get finance statistics
router.get("/finance/stats", protect, authorizeRoles("admin"), getFinanceStats);

// GET /api/admin/finance/payouts - Get pending payouts
router.get("/finance/payouts", protect, authorizeRoles("admin"), getPayouts);

// GET /api/admin/finance/invoices - Get invoices
router.get("/finance/invoices", protect, authorizeRoles("admin"), getInvoices);

// POST /api/admin/finance/payout/:id - Process payout
router.post("/finance/payout/:id", protect, authorizeRoles("admin"), processPayout);

// GET /api/admin/finance/refunds - Get refund requests [NEW]
router.get("/finance/refunds", protect, authorizeRoles("admin"), getRefundRequests);

// POST /api/admin/finance/refund/:id/approve - Approve cancellation refund [NEW]
router.post("/finance/refund/:id/approve", protect, authorizeRoles("admin"), approveCancellation);

// GET /api/admin/finance/invoice/:id/download - Download invoice PDF [NEW]
router.get("/finance/invoice/:id/download", protect, authorizeRoles("admin"), generateInvoicePDF);

// GET /api/admin/reports/sales/download - Download sales CSV [NEW]
router.get("/reports/sales/download", protect, authorizeRoles("admin"), exportSalesCSV);

// GET /api/admin/reports/customers/download - Download customers CSV [NEW]
router.get("/reports/customers/download", protect, authorizeRoles("admin"), exportCustomersCSV);

// =============================================================================
// MENU MANAGEMENT
// =============================================================================

// GET /api/admin/menus - Get all menus
router.get("/menus", protect, authorizeRoles("admin"), getAllMenus);

// GET /api/admin/menus/pending - Get pending menus
router.get("/menus/pending", protect, authorizeRoles("admin"), getPendingMenus);

// PUT /api/admin/menus/:id - Update menu
router.put("/menus/:id", protect, authorizeRoles("admin"), updateMenu);

// DELETE /api/admin/menus/:id - Delete menu
router.delete("/menus/:id", protect, authorizeRoles("admin"), deleteMenu);

// PUT /api/admin/menus/:id/approve - Approve menu
router.put("/menus/:id/approve", protect, authorizeRoles("admin"), approveMenu);

// PUT /api/admin/menus/:id/reject - Reject menu
router.put("/menus/:id/reject", protect, authorizeRoles("admin"), rejectMenu);

// =============================================================================
// PLANS MANAGEMENT
// =============================================================================

// GET /api/admin/plans - Get all plans
router.get("/plans", protect, authorizeRoles("admin"), getPlans);

// POST /api/admin/plans - Create new plan
router.post("/plans", protect, authorizeRoles("admin"), createPlan);

// PUT /api/admin/plans/:id - Update plan
router.put("/plans/:id", protect, authorizeRoles("admin"), updatePlan);

// DELETE /api/admin/plans/:id - Delete plan
router.delete("/plans/:id", protect, authorizeRoles("admin"), deletePlan);

// =============================================================================
// SUPPORT TICKETS
// =============================================================================

// GET /api/admin/tickets - Get all tickets
router.get("/tickets", protect, authorizeRoles("admin"), getTickets);

// GET /api/admin/tickets/:id - Get single ticket
router.get("/tickets/:id", protect, authorizeRoles("admin"), getTicketById);

// PUT /api/admin/tickets/:id/resolve - Resolve ticket
router.put("/tickets/:id/resolve", protect, authorizeRoles("admin"), resolveTicket);

// POST /api/admin/tickets/:id/reply - Reply to ticket
router.post("/tickets/:id/reply", protect, authorizeRoles("admin"), replyToTicket);

// =============================================================================
// SETTINGS
// =============================================================================

// GET /api/admin/settings - Get settings
router.get("/settings", protect, authorizeRoles("admin"), getSettings);

// PUT /api/admin/settings - Update settings
router.put("/settings", protect, authorizeRoles("admin"), updateSettings);

module.exports = router;