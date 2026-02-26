const Order = require('../../models/order.model');

exports.getAllFeedbacks = async (req, res) => {
    try {
        const orders = await Order.find({
            rating: { $exists: true, $ne: null }
        })
        .populate('customer', 'fullName')
        .populate('provider', 'fullName businessName')
        .sort({ deliveredAt: -1 });

        const feedbacks = orders.map(order => ({
            _id: order._id,
            customer: order.customer?.fullName || 'Anonymous',
            provider: order.provider?.businessName || order.provider?.fullName || 'Provider',
            rating: order.rating,
            feedback: order.feedback || '',
            mealType: order.mealType,
            date: order.deliveredAt,
            providerReply: order.providerReply
        }));

        res.json({
            success: true,
            data: feedbacks
        });

    } catch (error) {
        console.error('Get All Feedbacks Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedbacks'
        });
    }
};
