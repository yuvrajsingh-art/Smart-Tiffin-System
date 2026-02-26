const Order = require('../../models/order.model');
const ProviderProfile = require('../../models/providerprofile.model');

// Get all feedback for provider (categorized)
exports.getProviderFeedback = async (req, res) => {
    try {
        const providerId = req.user._id;
        console.log('Provider ID:', providerId);

        // First check all orders for this provider
        const allOrders = await Order.find({ provider: providerId });
        console.log('Total orders for provider:', allOrders.length);

        // Check orders with rating
        const ordersWithRating = await Order.find({
            provider: providerId,
            rating: { $exists: true, $ne: null }
        });
        console.log('Orders with rating:', ordersWithRating.length);
        console.log('Sample order:', ordersWithRating[0]);

        const orders = await Order.find({
            provider: providerId,
            rating: { $exists: true, $ne: null },
            status: 'delivered'
        })
        .populate('customer', 'fullName')
        .sort({ deliveredAt: -1 });

        console.log('Delivered orders with ratings:', orders.length);

        const allReviews = orders.map(order => ({
            _id: order._id,
            orderNumber: order.orderNumber,
            customer: { fullName: order.customer?.fullName || 'Anonymous' },
            rating: order.rating,
            reviewText: order.feedback || '',
            comment: order.feedback || '',
            mealType: order.mealType,
            order: order._id,
            createdAt: order.deliveredAt,
            response: order.providerReply || null,
            repliedAt: order.repliedAt
        }));

        // Categorize reviews
        const positive = allReviews.filter(r => r.rating >= 4);
        const neutral = allReviews.filter(r => r.rating === 3);
        const negative = allReviews.filter(r => r.rating <= 2);

        res.json({
            success: true,
            data: {
                positive: { count: positive.length, reviews: positive },
                neutral: { count: neutral.length, reviews: neutral },
                negative: { count: negative.length, reviews: negative }
            }
        });

    } catch (error) {
        console.error('Get Provider Feedback Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback'
        });
    }
};

// Get feedback statistics
exports.getFeedbackStats = async (req, res) => {
    try {
        const providerId = req.user._id;

        const providerProfile = await ProviderProfile.findOne({ user: providerId });
        const orders = await Order.find({
            provider: providerId,
            rating: { $exists: true, $ne: null }
        });

        const stats = {
            averageRating: providerProfile?.rating || 0,
            totalReviews: providerProfile?.totalReviews || 0,
            ratingBreakdown: {
                5: orders.filter(o => o.rating === 5).length,
                4: orders.filter(o => o.rating === 4).length,
                3: orders.filter(o => o.rating === 3).length,
                2: orders.filter(o => o.rating === 2).length,
                1: orders.filter(o => o.rating === 1).length
            }
        };

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Get Feedback Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stats'
        });
    }
};

// Reply to customer feedback
exports.replyToFeedback = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { replyText } = req.body;
        const providerId = req.user._id;

        if (!replyText || !replyText.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Reply text is required'
            });
        }

        const order = await Order.findOne({
            _id: orderId,
            provider: providerId,
            rating: { $exists: true, $ne: null }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or no feedback exists'
            });
        }

        order.providerReply = replyText.trim();
        order.repliedAt = new Date();
        await order.save();

        res.json({
            success: true,
            message: 'Reply sent successfully',
            data: {
                orderId: order._id,
                providerReply: order.providerReply,
                repliedAt: order.repliedAt
            }
        });

    } catch (error) {
        console.error('Reply to Feedback Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send reply'
        });
    }
};
