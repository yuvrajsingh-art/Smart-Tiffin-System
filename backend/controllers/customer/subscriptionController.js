const Subscription = require("../../models/subscription.model");
const logger = require("../../utils/logger");
const User = require("../../models/user.model");
const CustomerWallet = require("../../models/customerWallet.model");
const Transaction = require("../../models/transaction.model");
const StoreProfile = require("../../models/storeProfile.model");
const ProviderProfile = require("../../models/providerprofile.model");
const Wallet = require("../../models/wallet.model");
const DummyBank = require("../../models/dummyBank.model");

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
            return res.json({
                success: true,
                data: null,
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
        // console.log(`[CANCEL START] Customer: ${customerId}, Reason: ${reason}`);

        // Get active subscription
        const subscription = await Subscription.findOne({
            customer: customerId,
            status: "approved",
            endDate: { $gte: new Date() }
        });

        if (!subscription) {
            // console.log("[CANCEL ERROR] No active subscription found");
            return res.status(404).json({
                success: false,
                message: 'No active subscription found'
            });
        }

        // console.log(`[CANCEL FOUND] Subscription ID: ${subscription._id}`);

        // Calculate refund amount (remaining days)
        const today = new Date();
        const startDate = new Date(subscription.startDate);
        const endDate = new Date(subscription.endDate);

        // Accurate duration calculation
        const totalDurationDays = subscription.durationInDays || Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 30;

        // Remaining days (if today is before start date, refund full)
        let remainingDays = 0;
        if (today < startDate) {
            remainingDays = totalDurationDays;
        } else {
            remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        }

        // Clamp remaining days
        remainingDays = Math.max(0, Math.min(remainingDays, totalDurationDays));

        const dailyRate = (subscription.totalAmount) / totalDurationDays;
        const refundAmount = Math.floor(remainingDays * dailyRate); // Floor to avoid decimal issues

        // console.log(`[CANCEL REFUND] Amount: ${refundAmount}, Remaining Days: ${remainingDays}`);

        // Update subscription status using findByIdAndUpdate to avoid potential save() validation hooks issues
        await Subscription.findByIdAndUpdate(subscription._id, {
            status: "cancellation_requested",
            cancelledAt: new Date(),
            cancellationReason: reason || "User requested",
            refundAmount: Math.floor(refundAmount)
        });

        // Update User Model - Clear Active Subscription
        await User.findByIdAndUpdate(customerId, {
            hasActiveSubscription: false,
            activeSubscription: null
        });

        res.json({
            success: true,
            data: {
                refundAmount: Math.floor(refundAmount),
                message: 'Cancellation requested. Refund will be processed after Admin approval (24-48 hrs).'
            }
        });

    } catch (error) {
        console.error("Cancellation Request Error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to request cancellation. Please contact support.'
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
            planType,
            paymentMethod = 'upi',

            transactionId
        } = req.body;

        logger.info("Subscription Purchase Initiated", {
            customer: customerId,
            providerId,
            plan: planName,
            amount: totalAmount,
            method: paymentMethod
        });

        const fs = require('fs');
        const logData = {
            time: new Date().toISOString(),
            customerId,
            body: req.body
        };
        fs.appendFileSync('purchase_debug.log', JSON.stringify(logData, null, 2) + '\n');



        // 0. Check for existing active subscription
        const existingSubscription = await Subscription.findOne({
            customer: customerId,
            status: "approved",
            endDate: { $gte: new Date() }
        });

        if (existingSubscription) {
            return res.status(400).json({
                success: false,
                message: 'You already have an active subscription. Please cancel it before purchasing a new one.'
            });
        }

        // 0. UPI UTR Validation
        // Normalizing payment method check to be case insensitive if needed, but current frontend sends 'UPI' or 'wallet'
        const isUpi = paymentMethod.toLowerCase() === 'upi';
        const isWallet = paymentMethod.toLowerCase() === 'wallet';

        if (isUpi && (!transactionId || transactionId.length !== 12)) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed: A valid 12-digit Transaction ID (UTR) is required'
            });
        }

        // 1. Basic Validation
        if (!providerId || !totalAmount || !planName) {
            logger.warn("Purchase Failed: Missing Fields", { providerId, totalAmount, planName });
            console.log("Missing fields detected:", { providerId, totalAmount, planName });
            return res.status(400).json({
                success: false,
                message: 'Missing required subscription details'
            });
        }

        // Find the actual provider User ID from StoreProfile 
        // Support both provider (User ID) and _id (Store ID) to prevent 404 from frontend
        const store = await StoreProfile.findOne({
            $or: [
                { provider: providerId },
                { _id: providerId }
            ]
        });

        if (!store) {
            logger.warn("Purchase Failed: Store Not Found", { providerId });
            return res.status(404).json({
                success: false,
                message: 'Provider store not found'
            });
        }
        const providerUserId = store.provider;

        // 2. Handle Wallet 
        let wallet = await CustomerWallet.findOne({ customer: customerId });
        if (!wallet) {
            wallet = new CustomerWallet({
                customer: customerId,
                balance: 0
            });
        }

        let sourceBank = null;

        if (isWallet) {
            // Check if sufficient balance
            if (wallet.balance < totalAmount) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient wallet balance. You need ₹${totalAmount - wallet.balance} more.`
                });
            }
            wallet.balance -= totalAmount;
            wallet.totalSpent = (wallet.totalSpent || 0) + totalAmount;
        } else {
            // 1. UPI / External flow (Direct Purchase) -- RESTRICTED TO DUMMY BANK

            // Validate Transaction ID presence
            if (!transactionId) {
                return res.status(400).json({
                    success: false,
                    message: 'Payment verification failed: Missing Transaction ID'
                });
            }

            // Find the source bank using the provided Transaction ID (matches masterUTR or accountNumber)
            sourceBank = await DummyBank.findOne({
                $or: [
                    { masterUTR: transactionId },
                    { accountNumber: transactionId },
                    { vpa: transactionId }
                ]
            });

            if (!sourceBank) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid Transaction ID. No matching Bank Account found. Use STB999888777 for checks.'
                });
            }

            // Check Bank Balance
            if (sourceBank.balance < totalAmount) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient balance in ${sourceBank.bankName}. Available: ₹${sourceBank.balance}`
                });
            }

            // Deduct from Source Bank
            sourceBank.balance -= totalAmount;
            await sourceBank.save();

            // Just update totalSpent statistics without touching wallet balance
            wallet.totalSpent = (wallet.totalSpent || 0) + totalAmount;
        }

        // Save wallet state (only updates totalSpent for external payments)
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
            deliveryAddress,
            paymentMethod: isWallet ? 'Wallet' : 'UPI',
            transactionId: isWallet ? null : transactionId,
            paymentStatus: "Paid",
            status: "approved",
            adminApproval: "approved"
        });

        await subscription.save();

        // Update User Model with Active Subscription
        await User.findByIdAndUpdate(customerId, {
            hasActiveSubscription: true,
            activeSubscription: subscription._id
        });

        // 6. Create Transaction Record (Debit for the purchase)
        // 6. Create Transaction Record (Debit for the purchase)
        const transaction = new Transaction({
            customer: customerId,
            provider: providerUserId,
            type: 'debit',
            transactionType: 'Subscription Purchase',
            amount: totalAmount,
            description: `Subscription for ${planName} at ${store.mess_name}`,
            referenceId: transactionId || `SUB-${subscription._id.toString().slice(-6)}`,
            status: 'Success',
            subscriptionId: subscription._id,
            // Add Bank Details if paid via external bank
            bankDetails: (!isWallet && sourceBank) ? {
                accountNumber: sourceBank.accountNumber,
                bankName: sourceBank.bankName,
                ifscCode: sourceBank.ifscCode
            } : null
        });

        await transaction.save();

        // 7. Credit Provider Wallet & Calculate Commission
        try {
            const providerProfile = await ProviderProfile.findOne({ user: providerUserId });
            const commissionRate = providerProfile?.commission_rate || 15;
            const commissionAmount = (totalAmount * commissionRate) / 100;
            const providerEarnings = totalAmount - commissionAmount;

            let providerWallet = await Wallet.findOne({ provider: providerUserId });
            if (!providerWallet) {
                providerWallet = new Wallet({
                    provider: providerUserId,
                    totalEarnings: 0,
                    withdrawableBalance: 0,
                    lockedAmount: 0 // Starting with 0 or a fixed hold if required
                });
            }

            providerWallet.totalEarnings = (providerWallet.totalEarnings || 0) + providerEarnings;
            providerWallet.withdrawableBalance = (providerWallet.withdrawableBalance || 0) + providerEarnings;
            await providerWallet.save();

            // 8. Create Provider Earning Transaction
            const customerUser = await User.findById(customerId);
            await Transaction.create({
                provider: providerUserId,
                customer: customerId,
                type: 'credit',
                transactionType: 'Subscription Earning',
                amount: providerEarnings,
                description: `Earning from ${customerUser?.fullName || 'Customer'} - ${planName}`,
                referenceId: `ERN-${subscription._id.toString().slice(-6).toUpperCase()}`,
                status: 'Success',
                subscriptionId: subscription._id
            });



            logger.info(`Provider Earnings Credited: ₹${providerEarnings} (Rate: ${commissionRate}%)`);
        } catch (walletError) {
            logger.error("Error crediting provider wallet:", walletError);
            // Continue flow as subscription is already active
        }

        logger.success("Subscription Purchased Successfully", {
            subscriptionId: subscription._id,
            customer: customerId
        });

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
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            console.error("Mongoose Validation Error:", messages);
            return res.status(400).json({
                success: false,
                message: `Validation Error: ${messages.join(', ')}`
            });
        }
        if (error.kind === 'ObjectId') {
            console.error("Invalid ObjectId detected for field:", error.path);
            return res.status(400).json({
                success: false,
                message: `Invalid ID format for ${error.path}`
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