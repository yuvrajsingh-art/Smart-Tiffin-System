const Subscription = require("../../models/subscription.model");
const User = require("../../models/user.model");
const CustomerWallet = require("../../models/customerWallet.model");
const Transaction = require("../../models/transaction.model");
const StoreProfile = require("../../models/storeProfile.model");

// Get subscription details for management
exports.getSubscriptionDetails = async (req, res) => {
    try {
        const customerId = req.user._id;

        // Get active subscription
        const activeSubscription = await Subscription.findOne({
            customer: customerId,
            status: "approved",
            endDate: { $gte: new Date() }
        }).populate('provider', 'fullName');

        if (!activeSubscription) {
            return res.status(404).json({
                success: false,
                message: 'No active subscription found'
            });
        }

        // Calculate paused days and refund
        const pausedDays = activeSubscription.pausedDates || [];
        const refundAmount = pausedDays.length * 80; // ₹80 per day

        // Get subscription plan details
        const planDetails = {
            id: activeSubscription._id,
            name: activeSubscription.planName || "Standard Veg",
            type: activeSubscription.planType || "veg",
            price: activeSubscription.totalAmount || 2400,
            startDate: activeSubscription.startDate,
            endDate: activeSubscription.endDate,
            status: activeSubscription.status,
            provider: activeSubscription.provider?.fullName || "Provider",
            mealTypes: activeSubscription.mealTypes || ["lunch", "dinner"],
            daysRemaining: Math.ceil((new Date(activeSubscription.endDate) - new Date()) / (1000 * 60 * 60 * 24))
        };

        // Available upgrade plans
        const upgradePlans = [
            {
                id: "premium_nonveg",
                name: "Premium Non-Veg",
                price: 4500,
                features: "Chicken, Mutton, Fish",
                tag: "Popular",
                upgradePrice: 4500 - (activeSubscription.totalAmount || 2400)
            },
            {
                id: "gold_weightloss",
                name: "Gold Weight Loss",
                price: 5000,
                features: "High Protein, Low Carbs",
                tag: "Best Value",
                upgradePrice: 5000 - (activeSubscription.totalAmount || 2400)
            }
        ];

        res.json({
            success: true,
            data: {
                subscription: planDetails,
                pausedDays: pausedDays.length,
                refundAmount,
                upgradePlans,
                calendar: generateCalendarData(activeSubscription)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subscription details'
        });
    }
};

// Pause/unpause specific days
exports.managePausedDays = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { pausedDates } = req.body; // Array of dates to pause

        if (!Array.isArray(pausedDates)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid paused dates format'
            });
        }

        // Get active subscription
        const subscription = await Subscription.findOne({
            customer: customerId,
            status: "approved",
            endDate: { $gte: new Date() }
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'No active subscription found'
            });
        }

        // Update paused dates
        subscription.pausedDates = pausedDates;
        await subscription.save();

        // Calculate refund amount
        const refundAmount = pausedDates.length * 80;

        // Add refund to wallet if there are paused days
        if (refundAmount > 0) {
            let wallet = await CustomerWallet.findOne({ customer: customerId });
            if (!wallet) {
                wallet = new CustomerWallet({
                    customer: customerId,
                    balance: 0
                });
            }

            wallet.balance += refundAmount;
            await wallet.save();

            // Create transaction record
            const transaction = new Transaction({
                customer: customerId,
                type: 'credit',
                transactionType: 'Refund',
                amount: refundAmount,
                description: `Refund for ${pausedDates.length} paused days`,
                referenceId: `REF-${Date.now()}`,
                status: 'Success'
            });
            await transaction.save();
        }

        res.json({
            success: true,
            data: {
                pausedDays: pausedDates.length,
                refundAmount,
                message: 'Paused days updated successfully'
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update paused days'
        });
    }
};

// Upgrade subscription plan
exports.upgradeSubscription = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { planId, paymentDetails } = req.body;

        // Get current subscription
        const currentSubscription = await Subscription.findOne({
            customer: customerId,
            status: "approved",
            endDate: { $gte: new Date() }
        });

        if (!currentSubscription) {
            return res.status(404).json({
                success: false,
                message: 'No active subscription found'
            });
        }

        // Plan mapping
        const planMap = {
            "premium_nonveg": {
                name: "Premium Non-Veg",
                price: 4500,
                type: "non-veg"
            },
            "gold_weightloss": {
                name: "Gold Weight Loss",
                price: 5000,
                type: "veg"
            }
        };

        const newPlan = planMap[planId];
        if (!newPlan) {
            return res.status(400).json({
                success: false,
                message: 'Invalid plan selected'
            });
        }

        // Calculate upgrade amount
        const upgradeAmount = newPlan.price - (currentSubscription.totalAmount || 2400);

        // Update subscription
        currentSubscription.planName = newPlan.name;
        currentSubscription.planType = newPlan.type;
        currentSubscription.totalAmount = newPlan.price;
        currentSubscription.upgradedAt = new Date();
        await currentSubscription.save();

        // Create transaction record for upgrade payment
        const transaction = new Transaction({
            customer: customerId,
            type: 'debit',
            transactionType: 'Subscription Purchase',
            amount: upgradeAmount,
            description: `Subscription upgraded to ${newPlan.name}`,
            referenceId: `UPG-${Date.now()}`,
            status: 'Success'
        });
        await transaction.save();

        res.json({
            success: true,
            data: {
                subscription: {
                    id: currentSubscription._id,
                    name: newPlan.name,
                    type: newPlan.type,
                    price: newPlan.price
                },
                upgradeAmount,
                message: 'Subscription upgraded successfully'
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to upgrade subscription'
        });
    }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { reason } = req.body;

        // Get active subscription
        const subscription = await Subscription.findOne({
            customer: customerId,
            status: "approved",
            endDate: { $gte: new Date() }
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'No active subscription found'
            });
        }

        // Calculate refund amount (remaining days)
        const today = new Date();
        const endDate = new Date(subscription.endDate);
        const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        const dailyRate = (subscription.totalAmount || 2400) / 30; // Assuming 30 days per month
        const refundAmount = Math.max(0, remainingDays * dailyRate);

        // Update subscription status
        subscription.status = "cancelled";
        subscription.cancelledAt = new Date();
        subscription.cancellationReason = reason || "User requested";
        await subscription.save();

        // Add refund to wallet
        let wallet = await CustomerWallet.findOne({ customer: customerId });
        if (!wallet) {
            wallet = new CustomerWallet({
                customer: customerId,
                balance: 0
            });
        }

        wallet.balance += refundAmount;
        await wallet.save();

        // Create refund transaction
        const transaction = new Transaction({
            customer: customerId,
            type: 'credit',
            transactionType: 'Refund',
            amount: refundAmount,
            description: 'Subscription cancellation refund',
            referenceId: `CAN-${Date.now()}`,
            status: 'Success'
        });
        await transaction.save();

        res.json({
            success: true,
            data: {
                refundAmount: Math.round(refundAmount),
                message: 'Subscription cancelled successfully. Refund will be processed in 5-7 days.'
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to cancel subscription'
        });
    }
};

// Purchase new subscription
exports.purchaseSubscription = async (req, res) => {
    try {
        const customerId = req.user._id;
        const {
            providerId,
            planName,
            totalAmount,
            durationInDays,
            startDate,
            mealType,
            lunchTime,
            dinnerTime,
            deliveryAddress,
            planType
        } = req.body;

        console.log("Subscription Purchase Request:", {
            customerId,
            providerId,
            planName,
            totalAmount,
            mealType,
            planType
        });

        // 1. Basic Validation
        if (!providerId || !totalAmount || !planName) {
            console.log("Missing fields detected:", { providerId, totalAmount, planName });
            return res.status(400).json({
                success: false,
                message: 'Missing required subscription details'
            });
        }

        // Find the actual provider User ID from StoreProfile
        const store = await StoreProfile.findById(providerId);
        if (!store) {
            console.log("Store not found for ID:", providerId);
            return res.status(404).json({
                success: false,
                message: 'Provider store not found'
            });
        }
        const providerUserId = store.provider;

        // 2. Check Wallet Balance
        const wallet = await CustomerWallet.findOne({ customer: customerId });
        if (!wallet || wallet.balance < totalAmount) {
            console.log("Insufficient balance. Wallet:", wallet ? wallet.balance : "No wallet", "Required:", totalAmount);
            return res.status(400).json({
                success: false,
                message: `Insufficient wallet balance (Current: ₹${wallet ? wallet.balance : 0}). Please top up your wallet.`
            });
        }

        // 3. Deduct Balance
        wallet.balance -= totalAmount;
        wallet.totalSpent = (wallet.totalSpent || 0) + totalAmount;
        await wallet.save();

        // 4. Calculate End Date
        const start = new Date(startDate || Date.now());
        const end = new Date(start);
        end.setDate(start.getDate() + (durationInDays || 30));

        // Create Subscription
        // Robust mapping for mealType enum ["Lunch", "Dinner", "Both"]
        const normalizedMealType = mealType && mealType.toLowerCase();
        let finalMealType = "Both";
        let finalMealTypesArr = ["lunch", "dinner"];

        if (normalizedMealType === 'lunch') {
            finalMealType = "Lunch";
            finalMealTypesArr = ["lunch"];
        } else if (normalizedMealType === 'dinner') {
            finalMealType = "Dinner";
            finalMealTypesArr = ["dinner"];
        }

        const subscription = new Subscription({
            customer: customerId,
            provider: providerUserId,
            created_by: "customer",
            planName,
            price: totalAmount,
            totalAmount,
            type: durationInDays <= 7 ? "weekly" : "monthly",
            category: (planType && planType.toLowerCase()) || "veg",
            planType: (planType && planType.toLowerCase()) || "veg",
            durationInDays: durationInDays || 30,
            startDate: start,
            endDate: end,
            mealType: finalMealType,
            mealTypes: finalMealTypesArr,
            lunchTime,
            dinnerTime,
            paymentStatus: "Paid",
            status: "approved",
            adminApproval: "approved"
        });

        await subscription.save();

        // 6. Create Transaction Record
        const transaction = new Transaction({
            customer: customerId,
            provider: providerUserId,
            type: 'debit',
            transactionType: 'Subscription Purchase',
            amount: totalAmount,
            description: `Subscription for ${planName} at ${store.mess_name}`,
            referenceId: `SUB-${subscription._id.toString().slice(-6)}`,
            status: 'Success',
            subscriptionId: subscription._id
        });

        await transaction.save();

        res.json({
            success: true,
            data: {
                subscriptionId: subscription._id,
                newBalance: wallet.balance,
                message: 'Subscription purchased successfully! Welcome aboard.'
            }
        });

    } catch (error) {
        console.error("Purchase Subscription Error Details:");
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            console.error("Mongoose Validation Error:", messages);
            return res.status(400).json({
                success: false,
                message: `Validation Error: ${messages.join(', ')}`
            });
        }
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to process subscription purchase. ' + (error.message || '')
        });
    }
};

// Helper function to generate calendar data
const generateCalendarData = (subscription) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const calendar = [];
    const pausedDates = subscription.pausedDates || [];

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dateString = date.toISOString().split('T')[0];

        calendar.push({
            day,
            date: dateString,
            isPaused: pausedDates.includes(dateString),
            isPast: date < today,
            isToday: date.toDateString() === today.toDateString()
        });
    }

    return {
        month: today.toLocaleString('default', { month: 'long' }),
        year: currentYear,
        days: calendar
    };
};