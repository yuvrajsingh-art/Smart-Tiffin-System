const Order = require("../../models/order.model");
const Subscription = require("../../models/subscription.model");
const Review = require("../../models/review.model");
const logger = require("../../utils/logger");

/**
 * Get Customer Activities (Last 24 Hours)
 * GET /api/provider/activities
 */
exports.getCustomerActivities = async (req, res) => {
    try {
        const providerId = req.user._id;
        
        // Last 24 hours
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        // Fetch all activities in parallel
        const [orders, subscriptions, reviews] = await Promise.all([
            // All Orders (including cancelled) from last 24 hours
            Order.find({
                provider: providerId,
                $or: [
                    { createdAt: { $gte: last24Hours } },
                    { orderDate: { $gte: last24Hours } },
                    { cancelledAt: { $gte: last24Hours } }
                ]
            })
            .populate('customer', 'fullName')
            .sort({ createdAt: -1 })
            .limit(30),
            
            // New Subscriptions
            Subscription.find({
                provider: providerId,
                createdAt: { $gte: last24Hours },
                status: { $in: ['approved', 'cancelled'] }
            })
            .populate('customer', 'fullName')
            .sort({ createdAt: -1 })
            .limit(10),
            
            // Reviews
            Review.find({
                provider: providerId,
                createdAt: { $gte: last24Hours }
            })
            .populate('customer', 'fullName')
            .sort({ createdAt: -1 })
            .limit(10)
        ]);

        // Format activities
        const activities = [];
        
        // Debug logs
        console.log('📊 Activity Debug:');
        console.log('Total Orders:', orders.length);
        console.log('Subscriptions:', subscriptions.length);
        console.log('Reviews:', reviews.length);

        // Add order activities
        orders.forEach(order => {
            let activityType = 'order_placed';
            let message = `ordered ${order.mealType}`;
            let icon = 'order';
            let activityTime = order.createdAt;
            
            if (order.orderType === 'guest') {
                activityType = 'guest_order';
                message = `booked ${order.quantity} guest meal(s) for ${order.mealType}`;
                icon = 'guest';
            }
            
            if (order.status === 'cancelled') {
                activityType = 'order_cancelled';
                const cancelledBy = order.cancelledBy === 'customer' ? 'Customer' : 'Provider';
                message = `${order.mealType} order cancelled by ${cancelledBy}`;
                icon = 'cancelled';
                // Priority: cancelledAt > updatedAt > createdAt
                activityTime = order.cancelledAt || order.updatedAt || order.createdAt;
                
                // Debug log for cancelled orders
                console.log('Cancelled Order Time:', {
                    orderId: order._id,
                    cancelledAt: order.cancelledAt,
                    updatedAt: order.updatedAt,
                    createdAt: order.createdAt,
                    usingTime: activityTime
                });
            }

            activities.push({
                id: order._id,
                type: activityType,
                customer: order.customer?.fullName || 'Customer',
                message: message,
                time: activityTime,
                icon: icon,
                amount: order.amount
            });
        });

        // Add subscription activities
        subscriptions.forEach(sub => {
            let activityType = 'new_subscription';
            let message = `subscribed to ${sub.planName}`;
            let icon = 'new';
            
            if (sub.status === 'cancelled') {
                activityType = 'cancelled_subscription';
                message = `cancelled subscription`;
                icon = 'cancelled';
            }

            activities.push({
                id: sub._id,
                type: activityType,
                customer: sub.customer?.fullName || 'Customer',
                message: message,
                time: sub.createdAt,
                icon: icon,
                amount: sub.price
            });
        });

        // Add review activities
        reviews.forEach(review => {
            const activityType = review.rating >= 4 ? 'positive_feedback' : 'negative_feedback';
            const icon = review.rating >= 4 ? 'feedback' : 'complaint';

            activities.push({
                id: review._id,
                type: activityType,
                customer: review.customer?.fullName || 'Customer',
                message: `rated ${review.rating} stars`,
                time: review.createdAt,
                icon: icon,
                rating: review.rating
            });
        });

        // Sort by time (most recent first) and limit to 15
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        const recentActivities = activities.slice(0, 15);

        res.json({
            success: true,
            data: recentActivities,
            summary: {
                totalActivities: activities.length,
                newOrders: orders.filter(o => o.status !== 'cancelled').length,
                cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
                guestOrders: orders.filter(o => o.orderType === 'guest').length,
                newSubscriptions: subscriptions.filter(s => s.status === 'approved').length,
                reviews: reviews.length
            }
        });

    } catch (error) {
        logger.error("Get Customer Activities Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch customer activities"
        });
    }
};
