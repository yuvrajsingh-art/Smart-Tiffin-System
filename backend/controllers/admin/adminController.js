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
const Ticket = require("../../models/ticket.model");
const Settings = require("../../models/settings.model");
const Log = require("../../models/log.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// =============================================================================
// HELPER: AUDIT LOGGING
// =============================================================================

const createLog = async (event, detail, adminId, icon = 'info', color = 'text-indigo-500') => {
    try {
        await Log.create({
            event,
            detail,
            admin: adminId,
            icon,
            color
        });
    } catch (error) {
        console.error("Logging Error:", error.message);
    }
};

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

        // ----- 2. Revenue & Precision Analytics -----
        const settings = await Settings.findOne() || await Settings.create({});
        const commissionRate = settings.baseCommission || 15; // default 15%

        // Match only successful transactions
        const transactionStats = await Transaction.aggregate([
            { $match: { status: 'Success' } },
            // Lookup provider to get their specific commission rate
            {
                $lookup: {
                    from: "users",
                    localField: "provider",
                    foreignField: "_id",
                    as: "providerInfo"
                }
            },
            { $unwind: "$providerInfo" },
            // Project calculations
            {
                $project: {
                    amount: 1,
                    // Use provider's custom rate OR fall back to global base rate
                    commissionRate: {
                        $ifNull: ["$providerInfo.profile.commission_rate", commissionRate]
                    }
                }
            },
            // Group and sum
            {
                $group: {
                    _id: null,
                    grossRevenue: { $sum: "$amount" },
                    adminCommission: {
                        $sum: { $multiply: ["$amount", { $divide: ["$commissionRate", 100] }] }
                    }
                }
            }
        ]);

        const grossRevenue = transactionStats.length > 0 ? Math.round(transactionStats[0].grossRevenue) : 0;
        const adminCommission = transactionStats.length > 0 ? Math.round(transactionStats[0].adminCommission) : 0;
        const providerPayouts = grossRevenue - adminCommission;

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

        // ----- 7. Activity Logs (Real audit trail) -----
        const activityLogs = await Log.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('admin', 'fullName');

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
                adminCommission,
                providerPayouts,
                totalCustomers,
                totalProviders,
                liveOrders,
                salesGrowth,
                recentSignups,
                pendingApprovals,
                deliveryMetrics: { settled, transit, staged, completionRate },
                activityLogs,
                menu,
                settings // send settings for frontend metadata if needed
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
        const { date, startDate, endDate, search } = req.query;
        let query = {};

        // 1. Date Filtering
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
            };
        } else if (date === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            query.createdAt = { $gte: today };
        } else if (date === 'past') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            query.createdAt = { $lt: today };
        }

        // 2. Search Logic (Customer Name, Mobile, Business Name, or ID)
        if (search) {
            // Check if search is a valid ObjectId
            const isObjectId = mongoose.Types.ObjectId.isValid(search);

            // Find users (customers/providers) that match the search
            const userMatch = await User.find({
                $or: [
                    { fullName: { $regex: search, $options: 'i' } },
                    { mobile: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');
            const userIds = userMatch.map(u => u._id);

            query.$or = [
                { customer: { $in: userIds } },
                { provider: { $in: userIds } }
            ];

            if (isObjectId) {
                query.$or.push({ _id: search });
            }
        }

        const orders = await Order.find(query)
            .populate('customer', 'fullName mobile address')
            .populate('provider', 'businessName')
            .sort({ createdAt: -1 });

        // Format orders for frontend
        const formattedOrders = orders.map(order => ({
            rawId: order._id,
            id: order._id.toString().slice(-6).toUpperCase(),
            customer: order.customer?.fullName || 'Unknown',
            customerMobile: order.customer?.mobile || 'N/A',
            kitchen: order.provider?.businessName || 'Unknown',
            type: order.order_type === 'subscription' ? 'Subscription' : 'One-Time',
            status: order.status,
            price: order.grandTotal || 0,
            time: order.createdAt
                ? new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                : 'Pending',
            date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A',
            address: order.delivery_location?.address_text || 'Unknown',
            rider: order.rider_id ? 'Assigned' : 'Not Assigned'
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

        // Log the action
        await createLog(
            'PROVIDER_VERIFIED',
            `Provider ${provider.fullName} was approved.`,
            req.user.id,
            'verified',
            'text-emerald-500'
        );

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

        // Log the action
        await createLog(
            'PROVIDER_STATUS_TOGGLE',
            `Provider ${provider.fullName} status set to ${provider.status}.`,
            req.user.id,
            provider.status === 'active' ? 'check_circle' : 'block',
            provider.status === 'active' ? 'text-emerald-500' : 'text-rose-500'
        );

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

        // 1. Update Persistent Settings (Durable Broadcast)
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({});

        settings.activeBroadcast = {
            message,
            createdAt: new Date(),
            isActive: true
        };
        await settings.save();

        // 2. Create individual notifications for all users
        const users = await User.find({});
        const notifications = users.map(user => ({
            recipient: user._id,
            title: 'System Broadcast',
            message: message,
            type: 'Alert',
            isRead: false
        }));

        await Notification.insertMany(notifications);

        // 3. Emit real-time event
        if (req.io) {
            req.io.emit('broadcast-msg', { message });
        }

        // 4. Log the action
        await createLog('SYSTEM_BROADCAST', `Admin sent a global alert: ${message.substring(0, 30)}...`, req.user.id, 'campaign', 'text-blue-500');

        res.status(200).json({
            success: true,
            message: `Broadcast sent to ${users.length} users and saved to system.`
        });
    } catch (error) {
        console.error("Broadcast Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Clear active broadcast
 */
exports.clearBroadcast = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (settings) {
            settings.activeBroadcast.isActive = false;
            await settings.save();
        }

        res.status(200).json({
            success: true,
            message: "Broadcast cleared"
        });
    } catch (error) {
        console.error("Clear Broadcast Error:", error.message);
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
                providerProfiles: providers, // Compatibility with frontend
                users: [...customers, ...providers],
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

// =============================================================================
// CUSTOMER CRUD (ADDITIONAL)
// =============================================================================

/**
 * Add a new customer
 */
exports.addCustomer = async (req, res) => {
    try {
        const { fullName, email, mobile, password, address } = req.body;

        if (!fullName || !email || !mobile || !password) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const customer = await User.create({
            fullName,
            email,
            mobile,
            password: hashedPassword,
            role: 'customer',
            address,
            isVerified: true, // Admin created users are verified by default
            status: 'active'
        });

        // Log action
        await createLog(
            'CUSTOMER_CREATED',
            `New customer ${fullName} added by admin.`,
            req.user.id,
            'person_add',
            'text-blue-500'
        );

        res.status(201).json({
            success: true,
            message: "Customer added successfully",
            data: customer
        });
    } catch (error) {
        console.error("Add Customer Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Update customer details
 */
exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, mobile, address, status } = req.body;

        const customer = await User.findByIdAndUpdate(
            id,
            { fullName, email, mobile, address, status },
            { new: true }
        );

        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            data: customer
        });
    } catch (error) {
        console.error("Update Customer Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Delete a customer
 */
exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await User.findByIdAndDelete(id);

        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        // Log action
        await createLog(
            'CUSTOMER_DELETED',
            `Customer ${customer.fullName} was permanently deleted.`,
            req.user.id,
            'person_remove',
            'text-rose-500'
        );

        res.status(200).json({
            success: true,
            message: "Customer deleted successfully"
        });
    } catch (error) {
        console.error("Delete Customer Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Toggle customer status (ban/unban)
 */
exports.toggleCustomerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await User.findById(id);

        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        // Toggle between active and banned
        customer.status = customer.status === 'banned' ? 'active' : 'banned';
        await customer.save();

        // Log action
        await createLog(
            'CUSTOMER_STATUS_TOGGLE',
            `Customer ${customer.fullName} was ${customer.status === 'banned' ? 'banned' : 'unbanned'}.`,
            req.user.id,
            customer.status === 'banned' ? 'person_off' : 'person',
            customer.status === 'banned' ? 'text-rose-500' : 'text-emerald-500'
        );

        res.status(200).json({
            success: true,
            message: `Customer ${customer.status === 'banned' ? 'banned' : 'unbanned'} successfully`,
            data: customer
        });
    } catch (error) {
        console.error("Toggle Customer Status Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// =============================================================================
// ORDER CRUD (ADDITIONAL)
// =============================================================================

/**
 * Update order status
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Placed', 'Accepted', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            {
                status,
                ...(status === 'Delivered' && { deliveredAt: new Date() })
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Log action
        await createLog(
            'ORDER_STATUS_UPDATE',
            `Order #${order._id.toString().slice(-6)} status updated to ${status}.`,
            req.user.id,
            'edit_document',
            'text-indigo-500'
        );

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            data: order
        });
    } catch (error) {
        console.error("Update Order Status Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Cancel an order
 */
exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const order = await Order.findByIdAndUpdate(
            id,
            {
                status: 'Cancelled',
                cancellationReason: reason || 'Cancelled by admin'
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: order
        });
    } catch (error) {
        console.error("Cancel Order Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Assign rider to order
 */
exports.assignRider = async (req, res) => {
    try {
        const { id } = req.params;
        const { riderName, riderId } = req.body;

        const order = await Order.findByIdAndUpdate(
            id,
            {
                deliveryPerson: riderName,
                deliveryPersonId: riderId,
                status: 'Out for Delivery'
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({
            success: true,
            message: `Rider ${riderName} assigned successfully`,
            data: order
        });
    } catch (error) {
        console.error("Assign Rider Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// =============================================================================
// PROVIDER CRUD (ADDITIONAL)
// =============================================================================

/**
 * Update provider details
 */
exports.updateProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const provider = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (!provider) {
            return res.status(404).json({ success: false, message: "Provider not found" });
        }

        res.status(200).json({
            success: true,
            message: "Provider updated successfully",
            data: provider
        });
    } catch (error) {
        console.error("Update Provider Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Delete a provider
 */
exports.deleteProvider = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete user
        const provider = await User.findByIdAndDelete(id);

        if (!provider) {
            return res.status(404).json({ success: false, message: "Provider not found" });
        }

        // Also delete provider profile if exists
        await Provider.findOneAndDelete({ owner: id });

        res.status(200).json({
            success: true,
            message: "Provider deleted successfully"
        });
    } catch (error) {
        console.error("Delete Provider Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// =============================================================================
// MENU MANAGEMENT
// =============================================================================

/**
 * Get pending menus awaiting approval
 */
exports.getPendingMenus = async (req, res) => {
    try {
        const pendingMenus = await Menu.find({ approvalStatus: 'Pending' })
            .populate('provider', 'fullName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: pendingMenus
        });
    } catch (error) {
        console.error("Get Pending Menus Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Approve a menu
 */
exports.approveMenu = async (req, res) => {
    try {
        const { id } = req.params;

        const menu = await Menu.findByIdAndUpdate(
            id,
            {
                approvalStatus: 'Approved',
                isPublished: true,
                publishedAt: new Date()
            },
            { new: true }
        ).populate('provider', 'fullName');

        if (!menu) {
            return res.status(404).json({ success: false, message: "Menu not found" });
        }

        // Log the action
        await createLog(
            'MENU_APPROVED',
            `Menu for ${menu.provider?.fullName} was approved and published.`,
            req.user.id,
            'restaurant_menu',
            'text-emerald-500'
        );

        res.status(200).json({
            success: true,
            message: "Menu approved successfully",
            data: menu
        });
    } catch (error) {
        console.error("Approve Menu Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Reject a menu
 */
exports.rejectMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const menu = await Menu.findByIdAndUpdate(
            id,
            {
                approvalStatus: 'Rejected',
                adminRemarks: reason
            },
            { new: true }
        ).populate('provider', 'fullName');

        if (!menu) {
            return res.status(404).json({ success: false, message: "Menu not found" });
        }

        // Log the action
        await createLog(
            'MENU_REJECTED',
            `Menu for ${menu.provider?.fullName} was rejected. Reason: ${reason}`,
            req.user.id,
            'cancel_presentation',
            'text-rose-500'
        );

        res.status(200).json({
            success: true,
            message: "Menu rejected",
            data: menu
        });
    } catch (error) {
        console.error("Reject Menu Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// =============================================================================
// PLANS MANAGEMENT
// =============================================================================

/**
 * Get all subscription plans
 */
exports.getPlans = async (req, res) => {
    try {
        // Using a simple plans array stored in memory or could be from a Plans model
        const plans = [
            { id: '1', name: 'Basic', price: 2999, duration: '30 days', meals: 60, type: 'veg' },
            { id: '2', name: 'Standard', price: 4999, duration: '30 days', meals: 90, type: 'veg' },
            { id: '3', name: 'Premium', price: 7999, duration: '30 days', meals: 90, type: 'both' }
        ];

        res.status(200).json({
            success: true,
            data: plans
        });
    } catch (error) {
        console.error("Get Plans Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Create a new plan
 */
exports.createPlan = async (req, res) => {
    try {
        const { name, price, duration, meals, type } = req.body;

        // For now, just return success (in production, save to database)
        res.status(201).json({
            success: true,
            message: "Plan created successfully",
            data: { name, price, duration, meals, type, id: Date.now().toString() }
        });
    } catch (error) {
        console.error("Create Plan Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Update a plan
 */
exports.updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        res.status(200).json({
            success: true,
            message: "Plan updated successfully",
            data: { id, ...updateData }
        });
    } catch (error) {
        console.error("Update Plan Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Delete a plan
 */
exports.deletePlan = async (req, res) => {
    try {
        const { id } = req.params;

        res.status(200).json({
            success: true,
            message: "Plan deleted successfully"
        });
    } catch (error) {
        console.error("Delete Plan Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// =============================================================================
// SUPPORT TICKETS
// =============================================================================

/**
 * Get all support tickets
 */
/**
 * Get all support tickets
 */
exports.getTickets = async (req, res) => {
    try {
        const { status, startDate, endDate, search } = req.query;
        let query = {};

        // 1. Status Filter
        if (status && status !== 'All') {
            query.status = status;
        }

        // 2. Date Range Filter
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
            };
        }

        // 3. Search Logic (User Name, Email, or Issue)
        if (search) {
            // Find users matching search
            const userMatch = await User.find({
                $or: [
                    { fullName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');
            const userIds = userMatch.map(u => u._id);

            query.$or = [
                { user: { $in: userIds } },
                { issue: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];

            // Allow searching by displays ID part
            if (search.toUpperCase().startsWith('TKT')) {
                // No easy way to match the slice ID in regex directly on DB side without aggregation
                // But we can check if it's a valid ObjectId if the user pasted full ID
                if (mongoose.Types.ObjectId.isValid(search)) {
                    query.$or.push({ _id: search });
                }
            }
        }

        const tickets = await Ticket.find(query)
            .populate('user', 'fullName email')
            .populate('relatedProvider', 'businessName')
            .sort({ createdAt: -1 });

        const formattedTickets = tickets.map(t => ({
            id: t._id,
            displayId: `TKT${t._id.toString().slice(-4).toUpperCase()}`,
            user: t.user?.fullName || 'Unknown User',
            email: t.user?.email || 'N/A',
            issue: t.issue,
            priority: t.priority,
            status: t.status,
            date: t.createdAt.toLocaleDateString(), // Format date for frontend
            time: t.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            kitchen: t.relatedProvider?.businessName || 'System',
            hasUnread: false
        }));

        res.status(200).json({
            success: true,
            data: formattedTickets
        });
    } catch (error) {
        console.error("Get Tickets Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get single ticket by ID
 */
exports.getTicketById = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await Ticket.findById(id)
            .populate('user', 'fullName email mobile')
            .populate('relatedOrder')
            .populate('relatedProvider', 'fullName businessName');

        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (error) {
        console.error("Get Ticket Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Resolve a ticket
 */
exports.resolveTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { resolution } = req.body;

        const ticket = await Ticket.findByIdAndUpdate(
            id,
            {
                status: 'Resolved',
                description: resolution ? `${resolution}` : undefined // simplified for demo
            },
            { new: true }
        ).populate('user', 'fullName email')
            .populate('relatedProvider', 'businessName');

        if (req.io) {
            req.io.emit('ticket-updated', { ticket });
            req.io.emit('new-ticket', { ticket }); // Demo purpose
        }

        res.status(200).json({
            success: true,
            message: "Ticket resolved successfully",
            data: ticket
        });
    } catch (error) {
        console.error("Resolve Ticket Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Reply to a ticket
 */
exports.replyToTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;

        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        ticket.messages.push({
            sender: 'admin',
            text: message,
            time: new Date()
        });

        // Also update status if needed
        if (ticket.status === 'New') {
            ticket.status = 'In Review';
        }

        await ticket.save();

        res.status(200).json({
            success: true,
            message: "Reply sent successfully",
            data: ticket
        });
    } catch (error) {
        console.error("Reply To Ticket Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get Invoices (Derived from Success Transactions)
 */
exports.getInvoices = async (req, res) => {
    try {
        const transactions = await Transaction.find({ status: 'Success' })
            .populate('user', 'fullName')
            .sort({ createdAt: -1 })
            .limit(20);

        const invoices = transactions.map(t => ({
            id: `INV-${t._id.toString().slice(-6).toUpperCase()}`,
            rawId: t._id,
            user: t.user?.fullName || 'Unknown',
            date: new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            amount: `₹${t.amount}`,
            status: 'Paid', // Transactions usually represent paid items
            items: [{ name: t.description || 'Service', price: `₹${t.amount}` }]
        }));

        res.status(200).json({
            success: true,
            data: invoices
        });
    } catch (error) {
        console.error("Get Invoices Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// =============================================================================
// SETTINGS
// =============================================================================

/**
 * Get admin settings
 */
exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        // If no settings exist yet, create default
        if (!settings) {
            settings = await Settings.create({});
        }

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error("Get Settings Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Update admin settings
 */
exports.updateSettings = async (req, res) => {
    try {
        const updates = req.body;

        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create(updates);
        } else {
            Object.assign(settings, updates);
            await settings.save();
        }

        // Log the change
        await createLog(
            'SETTINGS_UPDATED',
            'Global configuration was modified by admin',
            req.user.id,
            'settings',
            'text-orange-500'
        );

        res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            data: settings
        });
    } catch (error) {
        console.error("Update Settings Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
