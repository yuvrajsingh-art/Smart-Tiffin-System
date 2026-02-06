const Order = require("../../models/order.model");
const Subscription = require("../../models/subscription.model");
const CustomerWallet = require("../../models/customerWallet.model");
const Transaction = require("../../models/transaction.model");
const Menu = require("../../models/menu.model");
const logger = require("../../utils/logger");

/**
 * Book Guest Meals
 * POST /api/customer/menu/book-guest
 */
exports.bookGuestMeal = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { mealType, quantity, payNow, date } = req.body;

        if (!mealType || !quantity || quantity <= 0) {
            return res.status(400).json({ success: false, message: "Invalid meal type or quantity" });
        }

        // 1. Get Active Subscription
        const subscription = await Subscription.findOne({
            customer: customerId,
            status: "approved",
            endDate: { $gte: new Date() }
        });

        if (!subscription) {
            return res.status(404).json({ success: false, message: "Active subscription required to book guest meals" });
        }

        // 2. Calculate Cost (Hardcoded 150 for now, can be dynamic later)
        const GUEST_MEAL_PRICE = 150;
        const totalCost = GUEST_MEAL_PRICE * quantity;

        let paymentStatus = "Pending";
        let paymentMethod = "Wallet";

        // 3. Handle Payment If Pay Now
        if (payNow) {
            const wallet = await CustomerWallet.findOne({ customer: customerId });
            if (!wallet || wallet.balance < totalCost) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient wallet balance. Need ₹${totalCost}, have ₹${wallet?.balance || 0}`
                });
            }

            // Deduct from wallet
            wallet.balance -= totalCost;
            await wallet.save();

            // Create Transaction
            await Transaction.create({
                customer: customerId,
                provider: subscription.provider,
                amount: totalCost,
                type: "debit",
                transactionType: "Order Payment",
                referenceId: `GUEST-${Date.now().toString().slice(-6)}`,
                status: "Success",
                description: `Payment for ${quantity} guest ${mealType} meal(s)`,
                subscriptionId: subscription._id
            });

            paymentStatus = "Paid";
        }

        // 4. Create Guest Order
        const orderDate = date ? new Date(date) : new Date();

        // Fetch Menu Details for the order
        const menu = await Menu.findOne({
            provider: subscription.provider,
            mealType: mealType.toLowerCase(),
            menuDate: {
                $gte: new Date(orderDate).setHours(0, 0, 0, 0),
                $lt: new Date(orderDate).setHours(23, 59, 59, 999)
            }
        });

        const newOrder = await Order.create({
            customer: customerId,
            provider: subscription.provider,
            subscription: subscription._id,
            orderDate: orderDate,
            mealType: mealType.charAt(0).toUpperCase() + mealType.slice(1),
            orderType: "guest",
            quantity: quantity,
            amount: totalCost,
            paymentStatus: paymentStatus,
            paymentMethod: paymentMethod,
            status: "confirmed",
            menuItems: menu ? [{
                name: menu.name,
                description: menu.description,
                image: menu.image
            }] : [],
            deliveryAddress: subscription.deliveryAddress
        });

        logger.info("Guest Meal Booked", {
            orderId: newOrder._id,
            customer: customerId,
            quantity,
            paymentStatus
        });

        res.status(201).json({
            success: true,
            message: payNow
                ? `Successfully booked ${quantity} guest meal(s). Payment deducted from wallet.`
                : `Successfully booked ${quantity} guest meal(s). You can pay later.`,
            data: newOrder
        });

    } catch (error) {
        console.error("Book Guest Meal Error:", error.message, error.errors || "");
        res.status(500).json({ success: false, message: "Internal server error while booking guest meal", error: error.message });
    }
};

/**
 * Get Today's Guest Meals
 * GET /api/customer/menu/get-guest-meals
 */
exports.getTodayGuestMeals = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { date } = req.query; // YYYY-MM-DD

        const today = date ? new Date(date) : new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const guestOrders = await Order.find({
            customer: customerId,
            orderDate: { $gte: today, $lt: tomorrow },
            orderType: "guest",
            status: { $ne: "cancelled" }
        });

        const counts = { lunch: 0, dinner: 0 };
        guestOrders.forEach(order => {
            if (order.mealType.toLowerCase() === "lunch") counts.lunch += (order.quantity || 1);
            if (order.mealType.toLowerCase() === "dinner") counts.dinner += (order.quantity || 1);
        });

        res.json({
            success: true,
            data: counts
        });
    } catch (error) {
        console.error("Get Guest Meals Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
