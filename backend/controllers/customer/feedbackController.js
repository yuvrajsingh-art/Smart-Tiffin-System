const Order = require("../../models/order.model");
const Review = require("../../models/review.model");
const User = require("../../models/user.model");
const Subscription = require("../../models/subscription.model");
const Menu = require("../../models/menu.model");

// Get feedback stats and recent meal for feedback
exports.getFeedbackData = async (req, res) => {
    try {
        const customerId = req.user._id;

        // Check active subscription
        const activeSubscription = await Subscription.findOne({
            customer: customerId,
            status: "approved",
            endDate: { $gte: new Date() }
        });

        if (!activeSubscription) {
            return res.status(404).json({
                success: false,
                message: 'No active subscription found'
            });
        }

        // Get today's latest meal for feedback
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const todayOrder = await Order.findOne({
            customer: customerId,
            orderDate: { $gte: today, $lt: tomorrow },
            status: 'delivered'
        }).populate('menu', 'name mainDish mealType')
            .populate('provider', 'fullName')
            .sort({ orderDate: -1 });

        // Get feedback stats
        const totalReviews = await Review.countDocuments({ customer: customerId });

        const avgRatingResult = await Review.aggregate([
            { $match: { customer: customerId } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);

        const avgRating = avgRatingResult[0]?.avgRating || 0;

        // Count badges (reviews with rating >= 4)
        const badges = await Review.countDocuments({
            customer: customerId,
            rating: { $gte: 4 }
        });

        const stats = [
            { label: 'Total Reviews', value: totalReviews.toString(), icon: 'reviews' },
            { label: 'Avg Rating', value: avgRating.toFixed(1), icon: 'star', color: 'text-amber-500' },
            { label: 'Badges', value: badges.toString(), icon: 'military_tech', color: 'text-primary' }
        ];

        // Current meal for feedback
        let currentMeal = null;
        if (todayOrder) {
            const mealTime = todayOrder.menu?.mealType === 'lunch' ? 'Lunch' : 'Dinner';
            currentMeal = {
                orderId: todayOrder._id,
                mealType: mealTime,
                mealName: todayOrder.menu?.name || todayOrder.menu?.mainDish || 'Special Thali',
                date: 'Today',
                provider: todayOrder.provider?.fullName || 'Provider'
            };
        }

        res.json({
            success: true,
            data: {
                stats,
                currentMeal,
                hasActiveSubscription: true
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback data'
        });
    }
};

// Submit feedback for a meal
exports.submitFeedback = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { orderId, rating, comment, tags } = req.body;

        // Validate input
        if (!orderId || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Invalid feedback data'
            });
        }

        // Check if order exists and belongs to customer
        const order = await Order.findOne({
            _id: orderId,
            customer: customerId,
            status: 'delivered'
        }).populate('provider', 'fullName')
            .populate('menu', 'name mainDish');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or not eligible for feedback'
            });
        }

        // Check if feedback already exists
        const existingReview = await Review.findOne({
            customer: customerId,
            order: orderId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'Feedback already submitted for this meal'
            });
        }

        // Create new review
        const review = new Review({
            customer: customerId,
            provider: order.provider._id,
            order: orderId,
            menu: order.menu?._id,
            rating,
            comment: comment || '',
            tags: tags || [],
            mealType: order.menu?.mealType || 'lunch',
            reviewDate: new Date()
        });

        await review.save();

        res.json({
            success: true,
            data: {
                reviewId: review._id,
                message: 'Feedback submitted successfully'
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to submit feedback'
        });
    }
};

// Get feedback history
exports.getFeedbackHistory = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        // Get reviews with order and menu details
        const reviews = await Review.find({ customer: customerId })
            .populate('order', 'orderDate')
            .populate('menu', 'name mainDish mealType')
            .sort({ reviewDate: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalReviews = await Review.countDocuments({ customer: customerId });

        // Format reviews for frontend
        const feedbackHistory = reviews.map(review => {
            const reviewDate = new Date(review.reviewDate);
            const dateString = reviewDate.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short'
            });

            return {
                id: review._id,
                date: dateString,
                meal: review.mealType === 'lunch' ? 'Lunch' : 'Dinner',
                rating: review.rating,
                comment: review.comment || 'No comment provided',
                tags: review.tags || [],
                response: review.response?.message || null
            };
        });

        res.json({
            success: true,
            data: {
                feedbackHistory,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalReviews / limit),
                    totalItems: totalReviews,
                    hasNext: page < Math.ceil(totalReviews / limit),
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback history'
        });
    }
};

// Get available feedback tags
exports.getFeedbackTags = async (req, res) => {
    try {
        // Predefined tags for consistency
        const tags = [
            'Fresh', 'Tasty', 'On Time', 'Great Portion',
            'Hot Food', 'Healthy', 'Good Packaging', 'Authentic',
            'Well Cooked', 'Good Value', 'Clean', 'Spicy'
        ];

        res.json({
            success: true,
            data: { tags }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback tags'
        });
    }
};

// Update existing feedback
exports.updateFeedback = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { reviewId } = req.params;
        const { rating, comment, tags } = req.body;

        // Find and update review
        const review = await Review.findOne({
            _id: reviewId,
            customer: customerId
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Update fields
        if (rating && rating >= 1 && rating <= 5) {
            review.rating = rating;
        }
        if (comment !== undefined) {
            review.comment = comment;
        }
        if (tags) {
            review.tags = tags;
        }

        review.updatedAt = new Date();
        await review.save();

        res.json({
            success: true,
            data: {
                reviewId: review._id,
                message: 'Feedback updated successfully'
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update feedback'
        });
    }
};