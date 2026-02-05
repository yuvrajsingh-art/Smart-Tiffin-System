const Order = require("../../models/order.model");
const Subscription = require("../../models/subscription.model");
const Transaction = require("../../models/transaction.model");
const CustomerWallet = require("../../models/customerWallet.model");
const logger = require("../../utils/logger");

// Pricing Constants
const PRICING = {
    EXTRA_ROTI: 10,
    EXTRA_RICE: 30
};

/**
 * Update or Create Meal Customization
 * POST /api/customer/menu/customization
 */
exports.updateMealCustomization = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { date, mealType, spiceLevel, note, extras, paymentMethod } = req.body;

        if (!date || !mealType) {
            return res.status(400).json({ success: false, message: "Date and meal type are required" });
        }

        // 1. Get Active Subscription to ensure user is entitled to this meal
        const subscription = await Subscription.findOne({
            customer: customerId,
            status: "approved",
            endDate: { $gte: new Date(date) }
        });

        if (!subscription) {
            return res.status(404).json({ success: false, message: "No active subscription found for this date" });
        }

        // 2. Find or Create Order for this specific meal
        // Parse "YYYY-MM-DD" to Local Midnight
        const [year, month, day] = date.split('-').map(Number);
        const orderDate = new Date(year, month - 1, day, 0, 0, 0, 0);

        const startOfRequestedDay = new Date(orderDate);
        const endOfRequestedDay = new Date(orderDate);
        endOfRequestedDay.setHours(23, 59, 59, 999);

        let order = await Order.findOne({
            customer: customerId,
            orderDate: {
                $gte: startOfRequestedDay,
                $lt: endOfRequestedDay
            },
            mealType: mealType.charAt(0).toUpperCase() + mealType.slice(1).toLowerCase(),
            orderType: "subscription" // Customizing the standard subscription meal
        });

        if (!order) {
            // Create a placeholder subscription order to hold the customization
            // This is "confirmed" but linked to the subscription
            order = await Order.create({
                customer: customerId,
                provider: subscription.provider,
                subscription: subscription._id,
                orderDate: orderDate,
                mealType: mealType.charAt(0).toUpperCase() + mealType.slice(1).toLowerCase(),
                orderType: "subscription",
                amount: 0, // Already paid via subscription
                paymentStatus: "Paid",
                status: "confirmed",
                deliveryAddress: subscription.deliveryAddress
            });
        }

        // 3. Calculate Cost for new Extras vs Old Extras
        const oldRoti = order.customization?.extras?.extraRoti || 0;
        const oldRice = order.customization?.extras?.extraRice ? 1 : 0;
        const newRoti = extras?.extraRoti || 0;
        const newRice = extras?.extraRice ? 1 : 0;

        const costDiff = ((newRoti - oldRoti) * PRICING.EXTRA_ROTI) +
            ((newRice - oldRice) * PRICING.EXTRA_RICE);

        logger.info("Customization Payment Calc Details:", {
            old: { roti: oldRoti, rice: oldRice },
            new: { roti: newRoti, rice: newRice },
            costDiff,
            paymentMethod
        });

        // 4. Handle Payment if cost increases
        if (costDiff > 0) {
            const wallet = await CustomerWallet.findOne({ customer: customerId });
            if (!wallet) return res.status(404).json({ success: false, message: "Wallet not found" });

            if (paymentMethod === 'online') {
                logger.info("Online payment identified for customization", { customerId, amount: costDiff });
            } else {
                // Wallet / Debt Flow
                logger.info("Deducting from Wallet:", { currentBalance: wallet.balance, costDiff });
                if (wallet.balance - costDiff < -200) {
                    return res.status(400).json({
                        success: false,
                        message: `Debt limit exceeded (-₹200). Current balance: ₹${wallet.balance}. Please top up to add more extras.`
                    });
                }

                wallet.balance -= costDiff;
                wallet.totalSpent += costDiff;
                await wallet.save();
                logger.info("Wallet Updated:", { newBalance: wallet.balance });
            }

            // Create Transaction recorded in DB
            await Transaction.create({
                customer: customerId,
                provider: subscription.provider,
                amount: costDiff,
                type: "debit",
                transactionType: "Add-on Payment",
                referenceId: `EXTRA-${Date.now().toString().slice(-6)}`,
                status: "Success",
                description: `Payment for extras (${newRoti} Roti, ${newRice ? 'Rice' : 'No Rice'})`,
                subscriptionId: subscription._id
            });

            // Update order amount
            order.amount = (order.amount || 0) + costDiff;
        }

        // 5. Update Customization
        order.customization = {
            spiceLevel: spiceLevel || order.customization?.spiceLevel || "Medium",
            note: note !== undefined ? note : order.customization?.note,
            extras: extras || order.customization?.extras || { extraRoti: 0, extraRice: false }
        };

        // Explicitly tell mongoose that this field changed (for deep objects)
        order.markModified('customization');
        await order.save();

        res.json({
            success: true,
            message: "Meal preferences saved & paid successfully",
            data: order.customization
        });

    } catch (error) {
        console.error("Update Customization Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * Get Saved Customizations for a date range
 * GET /api/customer/menu/customization
 */
exports.getCustomizations = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate) : new Date();
        start.setHours(0, 0, 0, 0);
        const end = endDate ? new Date(endDate) : new Date(start);
        end.setDate(end.getDate() + 7); // Default 1 week

        const orders = await Order.find({
            customer: customerId,
            orderDate: { $gte: start, $lte: end },
            orderType: "subscription"
        }).select("orderDate mealType customization");

        // Format for frontend: { 'YYYY-MM-DD': { lunch: {spice, note}, dinner: {spice, note} } }
        const formatted = {};
        orders.forEach(o => {
            // Convert to Local YYYY-MM-DD to match frontend's local date expectations
            const d = new Date(o.orderDate);
            const dateStr = d.toLocaleDateString('en-CA'); // Gives YYYY-MM-DD in local time

            const mType = o.mealType.toLowerCase();
            if (!formatted[dateStr]) formatted[dateStr] = {};
            formatted[dateStr][mType] = {
                spice: o.customization?.spiceLevel || 'Medium',
                note: o.customization?.note || '',
                extras: o.customization?.extras || { extraRoti: 0, extraRice: false }
            };
        });

        res.json({
            success: true,
            data: formatted
        });
    } catch (error) {
        console.error("Get Customizations Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
