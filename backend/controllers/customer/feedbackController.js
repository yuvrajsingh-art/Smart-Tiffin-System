const Order = require('../../models/order.model');
const User = require('../../models/user.model');
const ProviderProfile = require('../../models/providerprofile.model');

// Submit feedback and rating for an order
exports.submitFeedback = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { rating, feedback } = req.body;
        const customerId = req.user._id;

        console.log('Submit Feedback - Order ID:', orderId);
        console.log('Submit Feedback - Customer ID:', customerId);
        console.log('Submit Feedback - Rating:', rating);
        console.log('Submit Feedback - Feedback:', feedback);

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const order = await Order.findOne({
            _id: orderId,
            customer: customerId,
            status: 'delivered'
        });

        console.log('Order found:', order ? 'Yes' : 'No');
        if (order) {
            console.log('Order provider:', order.provider);
            console.log('Order status:', order.status);
            console.log('Existing rating:', order.rating);
        }

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or not delivered yet'
            });
        }

        if (order.rating) {
            return res.status(400).json({
                success: false,
                message: 'Feedback already submitted for this order'
            });
        }

        // Update order with rating and feedback
        order.rating = rating;
        order.feedback = feedback || '';
        await order.save();

        console.log('Order updated with rating:', order.rating);
        console.log('Order updated with feedback:', order.feedback);

        // Update provider's average rating
        const provider = await User.findById(order.provider);
        if (provider) {
            const providerProfile = await ProviderProfile.findOne({ user: provider._id });
            
            if (providerProfile) {
                const totalReviews = (providerProfile.totalReviews || 0) + 1;
                const currentRating = providerProfile.rating || 0;
                const newRating = ((currentRating * (totalReviews - 1)) + rating) / totalReviews;
                
                providerProfile.rating = parseFloat(newRating.toFixed(1));
                providerProfile.totalReviews = totalReviews;
                await providerProfile.save();
                
                console.log('Provider profile updated - Rating:', providerProfile.rating, 'Total Reviews:', providerProfile.totalReviews);
            }
        }

        res.json({
            success: true,
            message: 'Feedback submitted successfully',
            data: {
                orderId: order._id,
                rating: order.rating,
                feedback: order.feedback
            }
        });

    } catch (error) {
        console.error('Submit Feedback Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit feedback'
        });
    }
};

// Get delivered orders that need feedback
exports.getOrdersForFeedback = async (req, res) => {
    try {
        const customerId = req.user._id;

        const orders = await Order.find({
            customer: customerId,
            status: 'delivered',
            rating: { $exists: false }
        })
        .populate('provider', 'fullName businessName')
        .sort({ deliveredAt: -1 })
        .limit(10);

        const formattedOrders = orders.map(order => ({
            _id: order._id,
            orderNumber: order.orderNumber,
            provider: order.provider?.fullName || order.provider?.businessName || 'Provider',
            mealType: order.mealType,
            deliveredAt: order.deliveredAt,
            amount: order.amount
        }));

        res.json({
            success: true,
            data: formattedOrders
        });

    } catch (error) {
        console.error('Get Orders For Feedback Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
};

// Get customer's feedback history
exports.getFeedbackHistory = async (req, res) => {
    try {
        const customerId = req.user._id;

        const orders = await Order.find({
            customer: customerId,
            rating: { $exists: true }
        })
        .populate('provider', 'fullName businessName')
        .sort({ deliveredAt: -1 });

        const feedbackHistory = orders.map(order => ({
            _id: order._id,
            orderNumber: order.orderNumber,
            provider: order.provider?.fullName || order.provider?.businessName || 'Provider',
            mealType: order.mealType,
            rating: order.rating,
            feedback: order.feedback,
            providerReply: order.providerReply,
            repliedAt: order.repliedAt,
            deliveredAt: order.deliveredAt
        }));

        res.json({
            success: true,
            data: feedbackHistory
        });

    } catch (error) {
        console.error('Get Feedback History Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback history'
        });
    }
};
