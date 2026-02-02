const Order = require("../../models/order.model");
const Transaction = require("../../models/transaction.model");
const Subscription = require("../../models/subscription.model");
const User = require("../../models/user.model");
const { Menu } = require("../../models/menu.model");

// Get meals history
exports.getMealsHistory = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { filter = 'All', page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        // Build filter query
        let filterQuery = { customer: customerId };
        if (filter !== 'All') {
            const statusMap = {
                'Delivered': 'delivered',
                'Skipped': 'cancelled'
            };
            filterQuery.status = statusMap[filter] || filter.toLowerCase();
        }

        // Get orders with pagination
        const orders = await Order.find(filterQuery)
            .populate('menu', 'name mainDish image mealType')
            .populate('provider', 'fullName')
            .sort({ orderDate: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalOrders = await Order.countDocuments(filterQuery);

        // Format orders for frontend
        const mealsHistory = orders.map(order => {
            const orderDate = new Date(order.orderDate);
            const isToday = orderDate.toDateString() === new Date().toDateString();
            const isYesterday = orderDate.toDateString() === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
            
            let dateString;
            if (isToday) {
                dateString = `Today, ${orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
            } else if (isYesterday) {
                dateString = `Yesterday, ${orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
            } else {
                dateString = orderDate.toLocaleDateString('en-US', { 
                    day: 'numeric', 
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }

            return {
                id: order._id,
                date: dateString,
                type: order.menu?.mealType === 'lunch' ? 'Lunch' : 'Dinner',
                item: order.menu?.name || order.menu?.mainDish || 'Special Thali',
                mess: order.provider?.fullName || 'Provider',
                status: order.status === 'delivered' ? 'Delivered' : order.status === 'cancelled' ? 'Skipped' : 'Pending',
                icon: order.status === 'cancelled' ? 'block' : (order.menu?.mealType === 'lunch' ? 'lunch_dining' : 'dinner_dining'),
                orderId: order.orderNumber || `#ST-${order._id.toString().slice(-4)}`
            };
        });

        // Get stats
        const totalMeals = await Order.countDocuments({ customer: customerId });
        const skippedMeals = await Order.countDocuments({ customer: customerId, status: 'cancelled' });
        const currentSubscription = await Subscription.findOne({
            customer: customerId,
            status: 'approved',
            endDate: { $gte: new Date() }
        }).populate('provider', 'fullName');

        const stats = [
            { label: 'Total Meals', value: totalMeals.toString(), icon: 'restaurant' },
            { label: 'Skipped', value: skippedMeals.toString(), icon: 'block', color: 'text-red-500' },
            { label: 'Current Mess', value: currentSubscription?.provider?.fullName || 'None', icon: 'location_on' }
        ];

        res.json({
            success: true,
            data: {
                mealsHistory,
                stats,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalOrders / limit),
                    totalItems: totalOrders,
                    hasNext: page < Math.ceil(totalOrders / limit),
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch meals history'
        });
    }
};

// Get wallet history
exports.getWalletHistory = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        // Get transactions
        const transactions = await Transaction.find({ customer: customerId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalTransactions = await Transaction.countDocuments({ customer: customerId });

        // Format transactions for frontend
        const walletHistory = transactions.map(transaction => {
            const transactionDate = new Date(transaction.createdAt);
            const isToday = transactionDate.toDateString() === new Date().toDateString();
            
            let dateString;
            if (isToday) {
                dateString = `Today, ${transactionDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
            } else {
                dateString = transactionDate.toLocaleDateString('en-US', { 
                    day: 'numeric', 
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }

            // Map transaction types to frontend format
            const typeMap = {
                'credit': 'Credit',
                'debit': 'Debit'
            };

            const iconMap = {
                'Money added to wallet': 'add_card',
                'Refund for': 'account_balance_wallet',
                'Subscription upgraded': 'upgrade',
                'Guest meal': 'group'
            };

            let icon = 'payments';
            for (const [key, value] of Object.entries(iconMap)) {
                if (transaction.description?.includes(key)) {
                    icon = value;
                    break;
                }
            }

            return {
                id: transaction._id,
                date: dateString,
                title: transaction.description || 'Transaction',
                amount: `${transaction.type === 'credit' ? '+' : '-'}₹${transaction.amount.toLocaleString()}`,
                type: typeMap[transaction.type] || 'Transaction',
                status: transaction.status === 'completed' ? 'Success' : 'Pending',
                icon
            };
        });

        // Calculate stats
        const creditTransactions = await Transaction.aggregate([
            { $match: { customer: customerId, type: 'credit' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const debitTransactions = await Transaction.aggregate([
            { $match: { customer: customerId, type: 'debit' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const currentBalance = (creditTransactions[0]?.total || 0) - (debitTransactions[0]?.total || 0);
        const cashback = await Transaction.countDocuments({ 
            customer: customerId, 
            type: 'credit',
            description: { $regex: /cashback|refund/i }
        }) * 20; // Approximate cashback

        const stats = [
            { label: 'Balance', value: `₹${currentBalance.toLocaleString()}`, icon: 'payments' },
            { label: 'Cashback', value: `₹${cashback}`, icon: 'redeem', color: 'text-green-600' },
            { label: 'Spent', value: `₹${(debitTransactions[0]?.total || 0).toLocaleString()}`, icon: 'analytics' }
        ];

        res.json({
            success: true,
            data: {
                walletHistory,
                stats,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalTransactions / limit),
                    totalItems: totalTransactions,
                    hasNext: page < Math.ceil(totalTransactions / limit),
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch wallet history'
        });
    }
};

// Get plans history
exports.getPlansHistory = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        // Get all subscriptions (current and past)
        const subscriptions = await Subscription.find({ customer: customerId })
            .populate('provider', 'fullName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalSubscriptions = await Subscription.countDocuments({ customer: customerId });

        // Format subscriptions for frontend
        const plansHistory = [];

        subscriptions.forEach(subscription => {
            const createdDate = new Date(subscription.createdAt);
            const dateString = createdDate.toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'short'
            });

            // Add subscription creation event
            plansHistory.push({
                id: `sub-${subscription._id}`,
                date: dateString,
                title: subscription.status === 'approved' ? 'New Subscription' : 'Subscription Created',
                detail: `${subscription.provider?.fullName || 'Provider'} (${subscription.planName || 'Standard Plan'})`,
                status: subscription.status === 'approved' ? 'Active' : subscription.status === 'cancelled' ? 'Cancelled' : 'Pending',
                icon: 'verified'
            });

            // Add upgrade events
            if (subscription.upgradedAt) {
                const upgradeDate = new Date(subscription.upgradedAt);
                plansHistory.push({
                    id: `upgrade-${subscription._id}`,
                    date: upgradeDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
                    title: 'Plan Upgraded',
                    detail: `Upgraded to ${subscription.planName}`,
                    status: 'Completed',
                    icon: 'auto_awesome'
                });
            }

            // Add pause events
            if (subscription.pausedDates && subscription.pausedDates.length > 0) {
                plansHistory.push({
                    id: `pause-${subscription._id}`,
                    date: dateString,
                    title: 'Meal Paused',
                    detail: `${subscription.pausedDates.length} days paused`,
                    status: 'Scheduled',
                    icon: 'pause_circle'
                });
            }

            // Add cancellation events
            if (subscription.cancelledAt) {
                const cancelDate = new Date(subscription.cancelledAt);
                plansHistory.push({
                    id: `cancel-${subscription._id}`,
                    date: cancelDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
                    title: 'Subscription Cancelled',
                    detail: subscription.cancellationReason || 'User requested',
                    status: 'Cancelled',
                    icon: 'cancel'
                });
            }
        });

        // Sort by date (most recent first)
        plansHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Get current subscription stats
        const currentSubscription = await Subscription.findOne({
            customer: customerId,
            status: 'approved',
            endDate: { $gte: new Date() }
        });

        let daysRemaining = 0;
        if (currentSubscription) {
            daysRemaining = Math.ceil((new Date(currentSubscription.endDate) - new Date()) / (1000 * 60 * 60 * 24));
        }

        const totalSubscriptionsCount = await Subscription.countDocuments({ customer: customerId, status: 'approved' });
        const loyaltyLevel = totalSubscriptionsCount >= 5 ? 'Gold' : totalSubscriptionsCount >= 2 ? 'Silver' : 'Bronze';

        const stats = [
            { 
                label: 'Active Plan', 
                value: currentSubscription?.planName || 'None', 
                icon: 'star', 
                color: currentSubscription ? 'text-orange-500' : 'text-gray-400' 
            },
            { 
                label: 'Expiring', 
                value: daysRemaining > 0 ? `in ${daysRemaining} days` : 'Expired', 
                icon: 'timer' 
            },
            { 
                label: 'Loyalty', 
                value: loyaltyLevel, 
                icon: 'military_tech' 
            }
        ];

        res.json({
            success: true,
            data: {
                plansHistory: plansHistory.slice(0, limit),
                stats,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(plansHistory.length / limit),
                    totalItems: plansHistory.length,
                    hasNext: page < Math.ceil(plansHistory.length / limit),
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch plans history'
        });
    }
};