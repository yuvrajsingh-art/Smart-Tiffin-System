/**
 * =============================================================================
 * ADMIN CONTROLLERS INDEX
 * =============================================================================
 * Re-exports all admin controllers for clean imports
 * =============================================================================
 */

// Dashboard & Search
const dashboardController = require('./dashboard.controller');

// Entity Management
const customerController = require('./customer.controller');
const orderController = require('./order.controller');
const providerController = require('./provider.controller');

// Features
const financeController = require('./finance.controller');
const menuController = require('./menu.controller');
const planController = require('./plan.controller');
const ticketController = require('./ticket.controller');
const broadcastController = require('./broadcast.controller');
const settingsController = require('./settings.controller');

// Re-export all controllers
module.exports = {
    // Dashboard
    getDashboardStats: dashboardController.getDashboardStats,
    globalSearch: dashboardController.globalSearch,

    // Customers
    getCustomers: customerController.getCustomers,
    addCustomer: customerController.addCustomer,
    updateCustomer: customerController.updateCustomer,
    deleteCustomer: customerController.deleteCustomer,
    toggleCustomerStatus: customerController.toggleCustomerStatus,

    // Orders
    getOrders: orderController.getOrders,
    updateOrderStatus: orderController.updateOrderStatus,
    cancelOrder: orderController.cancelOrder,
    assignRider: orderController.assignRider,

    // Providers
    getProviders: providerController.getProviders,
    verifyProvider: providerController.verifyProvider,
    toggleProviderStatus: providerController.toggleProviderStatus,
    updateProvider: providerController.updateProvider,
    deleteProvider: providerController.deleteProvider,

    // Finance
    getFinanceStats: financeController.getFinanceStats,
    getPayouts: financeController.getPayouts,
    processPayout: financeController.processPayout,
    getInvoices: financeController.getInvoices,

    // Menus
    getPendingMenus: menuController.getPendingMenus,
    approveMenu: menuController.approveMenu,
    rejectMenu: menuController.rejectMenu,

    // Plans
    getPlans: planController.getPlans,
    createPlan: planController.createPlan,
    updatePlan: planController.updatePlan,
    deletePlan: planController.deletePlan,

    // Tickets
    getTickets: ticketController.getTickets,
    getTicketById: ticketController.getTicketById,
    resolveTicket: ticketController.resolveTicket,
    replyToTicket: ticketController.replyToTicket,

    // Broadcast
    broadcastMessage: broadcastController.broadcastMessage,
    clearBroadcast: broadcastController.clearBroadcast,

    // Settings
    getSettings: settingsController.getSettings,
    updateSettings: settingsController.updateSettings
};
