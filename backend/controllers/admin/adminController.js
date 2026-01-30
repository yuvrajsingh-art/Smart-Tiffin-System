/**
 * =============================================================================
 * ADMIN CONTROLLER
 * =============================================================================
 * This controller handles all admin-related operations including:
 * - Dashboard statistics
 * - Customer management (CRUD)
 * - Order management
 * - Provider management
 * - Finance/Payout management
 * - Global search
 * - Broadcast messaging
 * =============================================================================
 */

const User = require("../../models/user.model");
const Order = require("../../models/order.model");
const Transaction = require("../../models/transaction.model");
const Provider = require("../../models/providerprofile.model");
const Notification = require("../../models/notification.model");
const Menu = require("../../models/menu.model");
const mongoose = require("mongoose");

// =============================================================================
// DASHBOARD STATS
// =============================================================================

/**
 * Get comprehensive dashboard statistics
 * Returns: revenue, customer count, order count, charts data, activity logs
 */
exports.getDashboardStats = async (req, res) => {
    try {
        // ----- 1. Basic Counts -----
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const totalProviders = await User.countDocuments({ role: 'provider' });

        // Count orders that are currently active (not delivered/cancelled)
        const liveOrders = await Order.countDocuments({
            status: { $in: ["Placed", "Accepted", "Preparing", "Ready", "Out for Delivery"] }
        });

        // ----- 2. Revenue Calculation -----
        // Sum all successful transactions
        const revenueData = await Transaction.aggregate([
            { $match: { status: 'Success' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const grossRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        // ----- 3. Sales Growth (Last 7 Days Chart Data) -----
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const salesGrowth = await Transaction.aggregate([
            {
                $match: {
                    status: 'Success',
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: "$amount" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // ----- 4. Recent Signups (Last 5 customers) -----
        const recentSignups = await User.find({ role: 'customer' })
            .select('fullName email createdAt status')
            .sort({ createdAt: -1 })
            .limit(5);

        // ----- 5. Pending Approvals (Unverified providers) -----
        const pendingApprovals = await User.find({
            role: 'provider',
            isVerified: false
        }).limit(5);

        // ----- 6. Delivery Metrics -----
        const settled = await Order.countDocuments({ status: "Delivered" });
        const transit = await Order.countDocuments({ status: "Out for Delivery" });
        const staged = await Order.countDocuments({ status: "Ready" });

        // Calculate completion percentage
        const totalProcessed = settled + transit + staged;
        const completionRate = totalProcessed > 0
            ? Math.round((settled / totalProcessed) * 100)
            : 0;

        // ----- 7. Activity Logs (Recent events) -----
        const latestUsers = await User.find().sort({ createdAt: -1 }).limit(3);
        const latestTransactions = await Transaction.find({ status: 'Success' })
            .sort({ createdAt: -1 })
            .limit(3);

        // Combine and sort by time
        const activityLogs = [
            ...latestUsers.map(u => ({
                time: u.createdAt,
                event: `New ${u.role} joined: ${u.fullName}`,
                icon: u.role === 'provider' ? 'storefront' : 'person_add',
                color: u.role === 'provider' ? 'text-violet-500' : 'text-blue-500'
            })),
            ...latestTransactions.map(t => ({
                time: t.createdAt,
                event: `Payment of ₹${t.amount} received`,
                icon: 'payments',
                color: 'text-emerald-500'
            }))
        ].sort((a, b) => b.time - a.time).slice(0, 5);

        // ----- 8. Today's Menu -----
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const lunchMenu = await Menu.findOne({
            menuDate: { $gte: startOfDay, $lte: endOfDay },
            mealType: 'lunch'
        }).select('mainDish type');

        const dinnerMenu = await Menu.findOne({
            menuDate: { $gte: startOfDay, $lte: endOfDay },
            mealType: 'dinner'
        }).select('mainDish type');

        const menu = {
            lunch: lunchMenu
                ? { dish: lunchMenu.mainDish, type: lunchMenu.type }
                : { dish: "Not Set", type: "N/A" },
            dinner: dinnerMenu
                ? { dish: dinnerMenu.mainDish, type: dinnerMenu.type }
                : { dish: "Not Set", type: "N/A" }
        };

        // ----- Send Response -----
        res.status(200).json({
            success: true,
            data: {
                grossRevenue,
                totalCustomers,
                totalProviders,
                liveOrders,
                salesGrowth,
                recentSignups,
                pendingApprovals,
                deliveryMetrics: { settled, transit, staged, completionRate },
                activityLogs,
                menu
            }
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// =============================================================================
// CUSTOMER MANAGEMENT
// =============================================================================

/**
 * Get all customers with optional filters
 * Query params: status, search
 */
exports.getCustomers = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = { role: 'customer' };

        // Apply status filter
        if (status && status !== 'All') {
            query.status = status.toLowerCase();
        }

        // Apply search filter (name, email, phone)
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } }
            ];
        }

        const customers = await User.find(query).sort({ createdAt: -1 });

        // Calculate stats for the page
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const activeCustomers = await User.countDocuments({ role: 'customer', status: 'active' });

        // Get total wallet balance
        const balanceData = await User.aggregate([
            { $match: { role: 'customer' } },
            { $group: { _id: null, total: { $sum: { $ifNull: ["$walletBalance", 0] } } } }
        ]);
        const totalBalance = balanceData.length > 0 ? balanceData[0].total : 0;

        // Count new customers today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newToday = await User.countDocuments({
            role: 'customer',
            createdAt: { $gte: today }
        });

        res.status(200).json({
            success: true,
            data: customers,
            stats: {
                totalCustomers,
                activeCustomers,
                totalBalance,
                newToday
            }
        });
    } catch (error) {
        console.error("Get Customers Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// =============================================================================
// ORDER MANAGEMENT
// =============================================================================

/**
 * Get all orders with optional filters
 * Query params: date (today/past), search
 */
exports.getOrders = async (req, res) => {
    try {
        const { date, search } = req.query;
        let query = {};

        // Filter by date
        if (date === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            query.createdAt = { $gte: today };
        } else if (date === 'past') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            query.createdAt = { $lt: today };
        }

        // Search by order ID
        if (search) {
            query.$or = [
                { _id: mongoose.Types.ObjectId.isValid(search) ? search : null }
            ].filter(f => f._id !== null);
        }

        const orders = await Order.find(query)
            .populate('customer', 'fullName mobile address')
            .populate('provider', 'businessName')
            .sort({ createdAt: -1 });

        // Format orders for frontend
        const formattedOrders = orders.map(order => ({
            id: order._id.toString().slice(-6).toUpperCase(),
            customer: order.customer?.fullName || 'Unknown',
            kitchen: order.provider?.businessName || 'Unknown',
            type: order.planType || 'Single Order',
            status: order.status,
            time: order.deliveredAt
                ? new Date(order.deliveredAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                : 'Pending',
            zone: order.customer?.address?.area || 'Unknown',
            rider: order.deliveryPerson || 'Not Assigned'
        }));

        res.status(200).json({
            success: true,
            data: formattedOrders
        });
    } catch (error) {
        console.error("Get Orders Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// =============================================================================
// PROVIDER MANAGEMENT
// =============================================================================

/**
 * Get all providers with optional filters
 * Query params: status, search
 */
exports.getProviders = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = { role: 'provider' };

        // Apply status filter
        if (status && status !== 'All') {
            if (status === 'Active') query.isVerified = true;
            else if (status === 'Pending') query.isVerified = false;
        }

        // Apply search filter
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const providers = await User.find(query).sort({ createdAt: -1 });

        // Get provider profiles for extra details
        const providerIds = providers.map(p => p._id);
        const profiles = await Provider.find({ owner: { $in: providerIds } });

        // Merge profile data with user data
        const mergedData = providers.map(provider => {
            const profile = profiles.find(p => p.owner.toString() === provider._id.toString());
            return {
                ...provider.toObject(),
                profile: profile || null
            };
        });

        res.status(200).json({
            success: true,
            data: mergedData
        });
    } catch (error) {
        console.error("Get Providers Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Verify/Approve a provider
 */
exports.verifyProvider = async (req, res) => {
    try {
        const { id } = req.params;

        const provider = await User.findByIdAndUpdate(
            id,
            { isVerified: true },
            { new: true }
        );

        if (!provider) {
            return res.status(404).json({ success: false, message: "Provider not found" });
        }

        res.status(200).json({
            success: true,
            message: "Provider verified successfully",
            data: provider
        });
    } catch (error) {
        console.error("Verify Provider Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Toggle provider status (suspend/activate)
 */
exports.toggleProviderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const provider = await User.findById(id);

        if (!provider) {
            return res.status(404).json({ success: false, message: "Provider not found" });
        }

        // Toggle status
        provider.status = provider.status === 'active' ? 'suspended' : 'active';
        await provider.save();

        res.status(200).json({
            success: true,
            message: `Provider ${provider.status === 'active' ? 'activated' : 'suspended'}`,
            data: provider
        });
    } catch (error) {
        console.error("Toggle Provider Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// =============================================================================
// BROADCAST MESSAGE
// =============================================================================

/**
 * Send a broadcast notification to all users
 */
exports.broadcastMessage = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        // Get all users
        const users = await User.find({});

        // Create notification for each user
        const notifications = users.map(user => ({
            user: user._id,
            type: 'broadcast',
            message: message,
            isRead: false
        }));

        await Notification.insertMany(notifications);

        res.status(200).json({
            success: true,
            message: `Broadcast sent to ${users.length} users`
        });
    } catch (error) {
        console.error("Broadcast Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// =============================================================================
// GLOBAL SEARCH
// =============================================================================

/**
 * Search across customers, providers, and orders
 */
exports.globalSearch = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Search query must be at least 2 characters"
            });
        }

        // Search customers
        const customers = await User.find({
            role: 'customer',
            $or: [
                { fullName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).limit(5);

        // Search providers
        const providers = await User.find({
            role: 'provider',
            $or: [
                { fullName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).limit(5);

        // Search orders by ID
        let orders = [];
        if (mongoose.Types.ObjectId.isValid(query)) {
            orders = await Order.find({ _id: query }).limit(5);
        }

        res.status(200).json({
            success: true,
            data: {
                customers,
                providers,
                orders,
                totalResults: customers.length + providers.length + orders.length
            }
        });
    } catch (error) {
        console.error("Global Search Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// =============================================================================
// FINANCE MANAGEMENT
// =============================================================================

/**
 * Get finance statistics
 */
exports.getFinanceStats = async (req, res) => {
    try {
        // Total revenue
        const revenueData = await Transaction.aggregate([
            { $match: { status: 'Success' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        // Pending payouts (sum of unpaid provider earnings)
        const pendingPayouts = await Provider.aggregate([
            { $group: { _id: null, total: { $sum: { $ifNull: ["$pendingBalance", 0] } } } }
        ]);
        const pendingTotal = pendingPayouts.length > 0 ? pendingPayouts[0].total : 0;

        // Transaction count this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyTransactions = await Transaction.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                pendingPayouts: pendingTotal,
                monthlyTransactions,
                platformFees: Math.round(totalRevenue * 0.15) // 15% platform fee
            }
        });
    } catch (error) {
        console.error("Finance Stats Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get pending payouts list
 */
exports.getPayouts = async (req, res) => {
    try {
        const providers = await Provider.find({
            pendingBalance: { $gt: 0 }
        }).populate('owner', 'fullName email');

        const payouts = providers.map(p => ({
            id: p._id,
            name: p.owner?.fullName || p.businessName,
            email: p.owner?.email,
            amount: p.pendingBalance,
            status: 'Pending'
        }));

        res.status(200).json({
            success: true,
            data: payouts
        });
    } catch (error) {
        console.error("Get Payouts Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Process a payout to provider
 */
exports.processPayout = async (req, res) => {
    try {
        const { id } = req.params;

        const provider = await Provider.findById(id);
        if (!provider) {
            return res.status(404).json({ success: false, message: "Provider not found" });
        }

        const amount = provider.pendingBalance;

        // Clear pending balance
        provider.pendingBalance = 0;
        provider.lastPayout = new Date();
        await provider.save();

        // Create transaction record
        await Transaction.create({
            type: 'payout',
            amount: amount,
            status: 'Success',
            provider: provider._id,
            description: `Payout to ${provider.businessName}`
        });

        res.status(200).json({
            success: true,
            message: `Payout of ₹${amount} processed successfully`
        });
    } catch (error) {
        console.error("Process Payout Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};