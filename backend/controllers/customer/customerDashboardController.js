const Subscription = require("../../models/subscription.model");
const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const Streak = require("../../models/streak.model");
const { getWalletBalance } = require("./walletController");
const { getTodayMenu } = require("./menuController");
const { getLiveTracking: getTrackingData } = require("./trackController");

// Get customer dashboard data
exports.getCustomerDashboard = async (req, res) => {
    try {
        const customerId = req.user._id;
        const today = new Date();
        
        // Check active subscription
        const activeSubscription = await Subscription.findOne({
            customer: customerId,
            status: "approved",
            endDate: { $gte: today }
        });

        // Get today's order
        const todayOrder = await Order.findOne({
            customer: customerId,
            orderDate: { $gte: today }
        });

        // Get wallet balance from wallet controller
        const walletData = await getWalletBalance(customerId);
        const walletBalance = walletData?.data?.balance || 0;
        const recentAddition = walletData?.data?.recentAddition || 0;

        // Get streak data
        const streakData = await Streak.findOne({ customer: customerId });
        const streak = streakData ? streakData.currentStreak : 0;

        // Get today's menu from menu controller
        const menuData = await getTodayMenuData(customerId);
        const todaysMenu = menuData || {
            lunch: {
                name: "Paneer Masala Thali",
                items: "3 Rotis, Jeera Rice, Dal Fry",
                emoji: "🍛"
            },
            dinner: {
                name: "Light Khichdi Kadhi",
                items: "With Papad & Pickle",
                emoji: "🌙"
            }
        };

        // Get user name from database
        const user = await User.findById(customerId);
        const userName = user ? user.fullName : "Student";

        // Simple response
        res.json({
            success: true,
            data: {
                hasActiveSubscription: !!activeSubscription,
                liveStatus: todayOrder ? {
                    status: todayOrder.status || "cooking",
                    currentStep: 2,
                    mealType: "Lunch"
                } : null,
                walletBalance,
                recentAddition,
                streak,
                todaysMenu,
                userName
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data'
        });
    }
};

// Get live order tracking
exports.getLiveTracking = async (req, res) => {
    try {
        // Use track controller for detailed tracking
        await getTrackingData(req, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tracking data'
        });
    }
};

// Update streak when order is placed
exports.updateStreak = async (customerId) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let streak = await Streak.findOne({ customer: customerId });
        
        if (!streak) {
            streak = new Streak({
                customer: customerId,
                currentStreak: 1,
                longestStreak: 1,
                lastOrderDate: today,
                totalOrders: 1
            });
        } else {
            const lastOrderDate = new Date(streak.lastOrderDate);
            lastOrderDate.setHours(0, 0, 0, 0);
            
            const daysDiff = Math.floor((today - lastOrderDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 1) {
                // Consecutive day
                streak.currentStreak += 1;
                if (streak.currentStreak > streak.longestStreak) {
                    streak.longestStreak = streak.currentStreak;
                }
            } else if (daysDiff > 1) {
                // Streak broken
                streak.currentStreak = 1;
            }
            // If daysDiff === 0, same day order, don't change streak
            
            streak.lastOrderDate = today;
            streak.totalOrders += 1;
        }
        
        await streak.save();
        return streak;
        
    } catch (error) {
        console.error('Error updating streak:', error);
        return null;
    }
};

// Helper function to get today's menu data
const getTodayMenuData = async (customerId) => {
    try {
        const { getTodayMenu } = require('./menuController');
        
        // Create mock req object
        const mockReq = {
            user: { _id: customerId }
        };
        
        // Create mock res object to capture response
        let responseData = null;
        const mockRes = {
            json: (data) => {
                responseData = data;
            },
            status: () => mockRes
        };
        
        await getTodayMenu(mockReq, mockRes);
        
        if (responseData?.success && responseData?.data) {
            return responseData.data;
        }
        
        return null;
    } catch (error) {
        return null;
    }
};