const Subscription = require("../../models/subscription.model");
const logger = require("../../utils/logger");
const User = require("../../models/user.model");
const CustomerWallet = require("../../models/customerWallet.model");
const Transaction = require("../../models/transaction.model");
const StoreProfile = require("../../models/storeProfile.model");
const ProviderProfile = require("../../models/providerprofile.model");
const Wallet = require("../../models/wallet.model");
const DummyBank = require("../../models/dummyBank.model");
const { debitWallet } = require("./walletController");
const { createNotification } = require("../../utils/notificationService");


const {
    notifySubscriptionPurchased,
    notifySubscriptionPaused,
    notifySubscriptionCancelled
} = require("../../utils/notificationHelpers");


// Get subscription details for management
exports.getSubscriptionDetails = async (req, res) => {
    try {
        const customerId = req.user._id;

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Get active subscription
        const activeSubscription = await Subscription.findOne({
            customer: customerId,
            status: { $in: ["approved", "active"] },
            endDate: { $gte: startOfToday }
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
            daysRemaining: Math.ceil((new Date(activeSubscription.endDate) - new Date()) / (1000 * 60 * 60 * 24)),
            pausedDates: activeSubscription.pausedDates || []
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

        // Validate dates are in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const validDates = pausedDates.filter(dateStr => {
            const d = new Date(dateStr);
            d.setHours(0, 0, 0, 0);
            return d > today;
        });

        if (validDates.length !== pausedDates.length) {
            return res.status(400).json({
                success: false,
                message: 'You can only pause future dates.'
            });
        }

        // --- REAL LIFE ENHANCEMENT: PAUSE LIMITS ---

        // 1. Cut-off Time Check (8 PM)
        // If it's after 8 PM, you cannot pause for "Tomorrow"
        const currentHour = new Date().getHours();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        if (currentHour >= 20) {
            const isPausingTomorrow = validDates.some(dateStr => {
                const d = new Date(dateStr);
                d.setHours(0, 0, 0, 0);
                return d.getTime() === tomorrow.getTime();
            });

            if (isPausingTomorrow) {
                return res.status(400).json({
                    success: false,
                    message: 'Cut-off time exceeded. You cannot pause for tomorrow after 8 PM.'
                });
            }
        }

        // 2. Max Pause Limit (5 Days)
        // Check total paused days (existing + new unique ones) or just total selected
        // Since validDates REPLACES the old list, we simply check its length.
        const MAX_PAUSE_LIMIT = 5;
        if (validDates.length > MAX_PAUSE_LIMIT) {
            return res.status(400).json({
                success: false,
                message: `You can pause a maximum of ${MAX_PAUSE_LIMIT} days per month.`
            });
        }

        // -------------------------------------------

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

        // Calculate newly added paused days (to calculate refund)
        const previousPausedDates = subscription.pausedDates || [];
        
        // Separate new and existing paused dates
        const newPausedDays = validDates.filter(d => !previousPausedDates.includes(d));
        const alreadyPausedDays = validDates.filter(d => previousPausedDates.includes(d));

        // If trying to pause already paused dates, just inform but don't block
        if (alreadyPausedDays.length > 0 && newPausedDays.length === 0) {
            return res.status(400).json({
                success: false,
                message: `All selected dates are already paused: ${alreadyPausedDays.map(d => new Date(d).toLocaleDateString('en-IN')).join(', ')}`
            });
        }

        // Update paused dates (keep old + add new)
        subscription.pausedDates = [...new Set([...previousPausedDates, ...validDates])];
        await subscription.save();

        // Calculate refund amount for NEWLY paused days only
        const refundAmount = newPausedDays.length * 80;

        // Get customer name
        const customer = await User.findById(customerId).select('fullName');
        const customerName = customer?.fullName || 'Customer';

        // Send notifications with customer name and dates
        const pausedDatesStr = newPausedDays.map(d => new Date(d).toLocaleDateString('en-IN')).join(', ');
        const alreadyPausedStr = alreadyPausedDays.length > 0 
            ? ` (${alreadyPausedDays.length} already paused)` 
            : '';
        
        await createNotification(
            customerId,
            'Subscription Paused',
            `You have paused ${newPausedDays.length} day(s): ${pausedDatesStr}${alreadyPausedStr}. Refund of ₹${refundAmount} pending approval.`,
            'Info'
        );

        await createNotification(
            subscription.provider,
            'Customer Paused Subscription',
            `${customerName} has paused subscription for ${newPausedDays.length} day(s): ${pausedDatesStr}${alreadyPausedStr}.`,
            'Warning'
        );

        // Create PENDING transaction for refund (Requires Admin Approval)
        if (refundAmount > 0) {
            const transaction = new Transaction({
                customer: customerId,
                type: 'credit',
                transactionType: 'Refund',
                amount: refundAmount,
                description: `Refund for ${newPausedDays.length} days paused. Pending Approval.`,
                referenceId: `REF-PAUSE-${Date.now()}`,
                status: 'Pending', // Marked as Pending
                subscriptionId: subscription._id
            });
            await transaction.save();
        }

        res.json({
            success: true,
            data: {
                pausedDays: validDates.length,
                refundAmount,
                message: refundAmount > 0
                    ? `Paused successfully. Refund of ₹${refundAmount} will be credited after Admin approval.`
                    : 'Subscription updated successfully.'
            }
        });

    } catch (error) {
        console.error("Manage Paused Days Error:", error);
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

        // --- PAYMENT PROCESSING ---
        const method = paymentDetails?.method?.toUpperCase() || 'UPI';
        let transactionStatus = 'Success';

        if (method === 'WALLET') {
            const debitResult = await debitWallet(
                customerId,
                upgradeAmount,
                `Subscription upgraded to ${newPlan.name}`,
                `UPG-WAL-${Date.now()}`,
                'Subscription Upgrade'
            );

            if (!debitResult.success) {
                return res.status(400).json({ success: false, message: debitResult.message });
            }
        } else if (method === 'PAY_LATER') {
            transactionStatus = 'Pending';
        }
        // For UPI/CARD verify transaction ID if needed, but assuming frontend validated

        // Update subscription
        currentSubscription.planName = newPlan.name;
        currentSubscription.planType = newPlan.type;
        currentSubscription.totalAmount = newPlan.price;
        currentSubscription.upgradedAt = new Date();
        await currentSubscription.save();

        // Create transaction record ONLY for Non-Wallet payments (Wallet handled by debitWallet)
        if (method !== 'WALLET') {
            const transaction = new Transaction({
                customer: customerId,
                type: 'debit',
                transactionType: 'Subscription Upgrade', // More specific
                amount: upgradeAmount,
                description: `Subscription upgraded to ${newPlan.name} via ${method}`,
                referenceId: method === 'UPI' ? paymentDetails.transactionId : `UPG-PAYL-${Date.now()}`,
                status: transactionStatus,
                paymentMethod: method
            });
            await transaction.save();
        }

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
        const validStartDate = subscription.startDate ? new Date(subscription.startDate) : new Date();
        const validEndDate = subscription.endDate ? new Date(subscription.endDate) : new Date();
        const totalDurationDays = subscription.durationInDays || Math.ceil((validEndDate - validStartDate) / (1000 * 60 * 60 * 24)) || 30;

        // Remaining days (if today is before start date, refund full)
        let remainingDays = 0;
        if (today < startDate) {
            remainingDays = totalDurationDays;
        } else {
            remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        }

        // Clamp remaining days
        remainingDays = Math.max(0, Math.min(remainingDays, totalDurationDays));

        const amountToDivide = subscription.totalAmount || subscription.price || 0;
        const dailyRate = amountToDivide / (totalDurationDays || 30);
        const refundAmount = Math.floor(remainingDays * dailyRate); // Floor to avoid decimal issues

        // console.log(`[CANCEL REFUND] Amount: ${refundAmount}, Remaining Days: ${remainingDays}`);

        // Update subscription status using findByIdAndUpdate to avoid potential save() validation hooks issues
        await Subscription.findByIdAndUpdate(subscription._id, {
            status: "cancellation_requested",
            cancelledAt: new Date(),
            cancellationReason: reason || "User requested",
            refundAmount: isNaN(refundAmount) ? 0 : Math.floor(refundAmount)
        });

        // Update User Model - Clear Active Subscription
        await User.findByIdAndUpdate(customerId, {
            hasActiveSubscription: false,
            activeSubscription: null
        });

        // Send notifications
        await notifySubscriptionCancelled(customerId, subscription.provider, Math.floor(refundAmount));

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
        const isPayLater = paymentMethod.toUpperCase() === 'PAY_LATER';

        if (isUpi && (!transactionId || transactionId.length !== 12)) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed: A valid 12-digit Transaction ID (UTR) is required'
            });
        }

        // 1. Basic Validation
        if (!providerId || !planName) {
            logger.warn("Purchase Failed: Missing Fields", { providerId, planName });
            return res.status(400).json({
                success: false,
                message: 'Missing required subscription details'
            });
        }

        // Find the actual provider User ID from StoreProfile 
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

        // --- SECURITY HARDENING: VALIDATE PRICE SERVER-SIDE ---
        // Fetch the authoritative price from the Plan model or Store Profile
        // We prioritize the provider's specific pricing if valid, otherwise fallback to standard plan

        let validatedPrice = 0;
        let validatedDuration = durationInDays || 30;

        // Check if it matches a Standard Plan
        const Plan = require("../../models/plan.model"); // Import locally to avoid circular dep issues if any
        const standardPlan = await Plan.findOne({ name: planName, isActive: true });

        if (standardPlan) {
            // It's a standard plan, but we need to check if Provider has overridden the price
            // For now, we'll assume Provider follows standard pricing OR StoreProfile has specific plan prices
            // Simplified Logic: Standard Plan Price is the base truth
            validatedPrice = standardPlan.price;

            if (validatedDuration === 7 && standardPlan.period !== 'Weekly') {
                // Calculate prorated or specific weekly price if not defined
                // Ideally, we should have a weekly variant. For now, we trust the Store Profile's weekly price for "Weekly Trial"
            }
        }

        // Fallback/Override: Check Store Profile for simple Weekly/Monthly pricing
        // This handles the current frontend flow where planName might be generic "Monthly Complete"
        if (durationInDays <= 7) {
            validatedPrice = store.weeklyPrice;
        } else {
            validatedPrice = store.monthlyPrice;
        }

        // Final Security Check
        // Allow a small buffer for potential frontend variations or set strictly
        // For strict security: Price MUST match exactly. 
        // However, to avoid breaking existing flows (mock data mismatch), we will Log and Enforce if legitimate.

        if (!validatedPrice || validatedPrice <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Plan Configuration: Price not found for this provider.'
            });
        }

        // ENFORCEMENT: Ignore client sent totalAmount, use validatedPrice
        const finalAmount = validatedPrice;

        logger.info(`Price Validation: Client sent ${totalAmount}, Server calculated ${finalAmount}`);

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
            const debitResult = await debitWallet(
                customerId,
                finalAmount,
                `Subscription for ${planName}`,
                `SUB-${Date.now().toString().slice(-6)}`,
                'Subscription Purchase'
            );

            if (!debitResult.success) {
                return res.status(400).json({ success: false, message: debitResult.message });
            }
        } else if (isPayLater) {
            // Skip payment processing for Pay Later
            logger.info(`Pay Later selected for customer ${customerId}`);
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
            if (sourceBank.balance < finalAmount) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient balance in ${sourceBank.bankName}. Available: ₹${sourceBank.balance}`
                });
            }

            // Deduct from Source Bank
            sourceBank.balance -= finalAmount;
            await sourceBank.save();

            // Just update totalSpent statistics without touching wallet balance
            wallet.totalSpent = (wallet.totalSpent || 0) + finalAmount;
        }

        // Save wallet state (only updates totalSpent for external payments)
        await wallet.save();

        // 4. Calculate End Date
        const start = new Date(startDate || Date.now());
        const end = new Date(start);
        end.setDate(start.getDate() + (validatedDuration || 30));

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

        // Normalize planType to valid enum values
        const validPlanTypes = ["veg", "non-veg", "jain"];
        const normalizedPlanType = (planType && planType.toLowerCase()) || "veg";
        const finalPlanType = validPlanTypes.includes(normalizedPlanType) ? normalizedPlanType : "veg";

        const subscription = new Subscription({
            customer: customerId,
            provider: providerUserId,
            created_by: "customer",
            planName,
            price: finalAmount,
            totalAmount: finalAmount,
            type: validatedDuration <= 7 ? "weekly" : "monthly",
            category: finalPlanType,
            planType: finalPlanType,
            durationInDays: validatedDuration || 30,
            startDate: start,
            endDate: end,
            mealType: finalMealType,
            mealTypes: finalMealTypesArr,
            lunchTime,
            dinnerTime,
            deliveryAddress,
            paymentMethod: isWallet ? 'Wallet' : (isPayLater ? 'Pay Later' : 'UPI'),
            transactionId: isWallet || isPayLater ? null : transactionId,
            paymentStatus: isPayLater ? "Pending" : "Paid",
            status: "approved",
            adminApproval: "approved"
        });

        await subscription.save();

        // Send notifications
        await notifySubscriptionPurchased(customerId, providerUserId, planName, finalAmount);

        // Update User Model with Active Subscription & Diet Preference
        const dietMap = {
            'veg': 'Pure Veg',
            'non-veg': 'Non-Veg',
            'jain': 'Jain'
        };
        const userDietPreference = dietMap[(planType && planType.toLowerCase()) || 'veg'] || 'Pure Veg';

        await User.findByIdAndUpdate(customerId, {
            hasActiveSubscription: true,
            activeSubscription: subscription._id,
            dietPreference: userDietPreference
        });

        // 6. Create Transaction Record ONLY for Non-Wallet (Wallet handled by debitWallet)
        if (!isWallet) {
            console.log('Creating transaction with amount:', finalAmount);
            const transaction = new Transaction({
                customer: customerId,
                provider: providerUserId,
                type: 'debit',
                transactionType: 'Subscription Purchase',
                amount: finalAmount,
                description: `Subscription for ${planName} at ${store.mess_name}`,
                referenceId: transactionId || `SUB-${subscription._id.toString().slice(-6)}`,
                status: isPayLater ? 'Pending' : 'Success',
                subscriptionId: subscription._id,
                // Add Bank Details if paid via external bank
                bankDetails: (!isWallet && sourceBank) ? {
                    accountNumber: sourceBank.accountNumber,
                    bankName: sourceBank.bankName,
                    ifscCode: sourceBank.ifscCode
                } : null
            });

            await transaction.save();
            console.log('Transaction saved:', transaction._id, 'Amount:', transaction.amount);
        }

        // 7. Credit Provider Wallet & Calculate Commission
        try {
            const providerProfile = await ProviderProfile.findOne({ user: providerUserId });
            const commissionRate = providerProfile?.commission_rate || 15;
            const commissionAmount = (finalAmount * commissionRate) / 100;
            const providerEarnings = finalAmount - commissionAmount;

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