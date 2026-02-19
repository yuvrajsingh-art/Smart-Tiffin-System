/**
 * =============================================================================
 * DASHBOARD CONTROLLER
 * =============================================================================
 * Handles dashboard statistics and global search
 * =============================================================================
 */

const User = require("../../models/user.model");
const Order = require("../../models/order.model");
const Transaction = require("../../models/transaction.model");
const Menu = require("../../models/menu.model");
const Log = require("../../models/log.model");

const { sendSuccess, sendError } = require("../../utils/responseHelper");
const { isValidObjectId } = require("../../utils/validationHelper");
const { getStartOfDay, getEndOfDay, getLastNDays } = require("../../utils/dateHelper");
const { getOrCreateSettings } = require("./helpers");
const logger = require("../../utils/logger");

/**
 * Get comprehensive dashboard statistics
 * @route GET /api/admin/stats
 * @returns Dashboard data including revenue, counts, charts, logs
 */
exports.getDashboardStats = async (req, res) => {
    const startTime = Date.now();
    logger.adminAction('DASHBOARD_STATS', `User: ${req.user?.fullName || 'Unknown'}`);

    try {
        // 1. Basic counts
        logger.db('COUNT', 'users, orders');
        const [totalCustomers, totalProviders, liveOrders] = await Promise.all([
            User.countDocuments({ role: 'customer' }),
            User.countDocuments({ role: 'provider' }),
            Order.countDocuments({
                status: { $in: ["Placed", "Accepted", "Preparing", "Ready", "Out for Delivery"] }
            })
        ]);

        // 2. Revenue calculations
        const settings = await getOrCreateSettings();
        const commissionRate = settings.baseCommission || 15;

        const transactionStats = await Transaction.aggregate([
            { $match: { status: 'Success' } },
            {
                $lookup: {
                    from: "users",
                    localField: "provider",
                    foreignField: "_id",
                    as: "providerInfo"
                }
            },
            { $unwind: "$providerInfo" },
            {
                $project: {
                    amount: 1,
                    commissionRate: {
                        $ifNull: ["$providerInfo.profile.commission_rate", commissionRate]
                    }
                }
            },
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

        // 3. Sales growth (last 7 days)
        const { startDate } = getLastNDays(7);

        const salesGrowth = await Transaction.aggregate([
            {
                $match: {
                    status: 'Success',
                    createdAt: { $gte: startDate }
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

        // 4. Recent data
        const [recentSignups, pendingApprovals, activityLogs] = await Promise.all([
            User.find({ role: 'customer' })
                .select('fullName email createdAt status')
                .sort({ createdAt: -1 })
                .limit(5),
            User.find({ role: 'provider', isVerified: false }).limit(5),
            Log.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .populate('admin', 'fullName')
        ]);

        // 5. Delivery metrics
        const [settled, transit, staged] = await Promise.all([
            Order.countDocuments({ status: "delivered" }),
            Order.countDocuments({ status: "out_for_delivery" }),
            Order.countDocuments({ status: { $in: ["confirmed", "cooking", "prepared"] } })
        ]);

        const totalProcessed = settled + transit + staged;
        const completionRate = totalProcessed > 0 ? Math.round((settled / totalProcessed) * 100) : 0;

        // 6. Today's menu
        const startOfToday = getStartOfDay();
        const endOfToday = getEndOfDay();

        const [lunchMenu, dinnerMenu] = await Promise.all([
            Menu.findOne({
                menuDate: { $gte: startOfToday, $lte: endOfToday },
                mealType: 'lunch'
            }).select('name type'),
            Menu.findOne({
                menuDate: { $gte: startOfToday, $lte: endOfToday },
                mealType: 'dinner'
            }).select('name type')
        ]);

        const menu = {
            lunch: lunchMenu ? { dish: lunchMenu.name, type: lunchMenu.type } : { dish: "Not Set", type: "N/A" },
            dinner: dinnerMenu ? { dish: dinnerMenu.name, type: dinnerMenu.type } : { dish: "Not Set", type: "N/A" }
        };

        logger.success(`Dashboard stats fetched in ${Date.now() - startTime}ms`);

        return sendSuccess(res, 200, "Dashboard stats retrieved successfully", {
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
            settings
        });
    } catch (error) {
        logger.error('Dashboard Stats Error', error);
        return sendError(res, 500, "Failed to fetch dashboard statistics", error);
    }
};

/**
 * Search across customers, providers, and orders
 * @route GET /api/admin/search
 * @query {String} query - Search query (min 2 characters)
 */
exports.globalSearch = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.length < 2) {
            return sendError(res, 400, "Search query must be at least 2 characters");
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
        if (isValidObjectId(query)) {
            orders = await Order.find({ _id: query }).limit(5);
        }

        return sendSuccess(res, 200, "Search completed", {
            customers,
            providers,
            providerProfiles: providers,
            users: [...customers, ...providers],
            orders,
            totalResults: customers.length + providers.length + orders.length
        });
    } catch (error) {
        logger.error('Global Search Error', error);
        return sendError(res, 500, "Failed to perform search", error);
    }
};
