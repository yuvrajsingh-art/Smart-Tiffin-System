const Order = require("../../models/order.model");
const Subscription = require("../../models/subscription.model");
const CustomerWallet = require("../../models/customerWallet.model");
const Transaction = require("../../models/transaction.model");
const Menu = require("../../models/menu.model");
const DummyBank = require("../../models/dummyBank.model");
const logger = require("../../utils/logger");

/**
 * Book Guest Meals
 * POST /api/customer/menu/book-guest
 * 
 * Supports: Wallet, UPI (DummyBank), Pay Later
 */
exports.bookGuestMeal = async (req, res) => {
    try {
        const customerId = req.user._id;
        const {
            mealType,
            quantity,
            payNow,           // true/false
            paymentMethod,    // 'wallet' or 'upi' (optional, defaults to wallet if payNow)
            transactionId,    // Required for UPI (12-digit UTR)
            date
        } = req.body;

        // Validation
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

        // 2. Calculate Cost
        const GUEST_MEAL_PRICE = 150;
        const totalCost = GUEST_MEAL_PRICE * quantity;

        let paymentStatus = "Pending";
        let finalPaymentMethod = "Cash";
        let sourceBank = null;

        // 3. Handle Payment
        if (payNow) {
            const method = (paymentMethod || 'wallet').toLowerCase();

            if (method === 'wallet') {
                // WALLET PAYMENT
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

                finalPaymentMethod = "Wallet";
                paymentStatus = "Paid";

            } else if (method === 'upi') {
                // UPI PAYMENT (DummyBank)
                if (!transactionId || transactionId.length !== 12) {
                    return res.status(400).json({
                        success: false,
                        message: "Valid 12-digit Transaction ID (UTR) required for UPI payment"
                    });
                }

                // Find DummyBank using UTR
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
                        message: "Invalid Transaction ID. Use STB999888777 for testing."
                    });
                }

                // Check bank balance
                if (sourceBank.balance < totalCost) {
                    return res.status(400).json({
                        success: false,
                        message: `Insufficient bank balance. Need ₹${totalCost}, have ₹${sourceBank.balance}`
                    });
                }

                // Deduct from bank
                sourceBank.balance -= totalCost;
                await sourceBank.save();

                finalPaymentMethod = "UPI";
                paymentStatus = "Paid";
            }

            // Create Transaction Record
            await Transaction.create({
                customer: customerId,
                provider: subscription.provider,
                amount: totalCost,
                type: "debit",
                transactionType: "Order Payment",
                referenceId: transactionId || `GUEST-${Date.now().toString().slice(-6)}`,
                status: "Success",
                description: `Guest ${mealType} meal x${quantity} (${finalPaymentMethod})`,
                subscriptionId: subscription._id,
                bankDetails: sourceBank ? {
                    bankName: sourceBank.bankName,
                    accountNumber: sourceBank.accountNumber
                } : null
            });
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
            paymentMethod: finalPaymentMethod,
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

/**
 * Get Guest Meal Orders (for displaying in UI with cancel option)
 * GET /api/customer/menu/guest-orders
 */
exports.getGuestMealOrders = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { date } = req.query;

        const targetDate = date ? new Date(date) : new Date();
        targetDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(targetDate);
        nextDay.setDate(targetDate.getDate() + 1);

        const guestOrders = await Order.find({
            customer: customerId,
            orderDate: { $gte: targetDate, $lt: nextDay },
            orderType: "guest"
        }).sort({ createdAt: -1 });

        // Add cancellation eligibility info
        const now = new Date();
        const ordersWithCancelInfo = guestOrders.map(order => {
            const mealHour = order.mealType.toLowerCase() === 'lunch' ? 12 : 20;
            const cutoffTime = new Date(order.orderDate);
            cutoffTime.setHours(mealHour - 2, 0, 0, 0); // 2 hours before meal

            return {
                _id: order._id,
                mealType: order.mealType,
                quantity: order.quantity,
                amount: order.amount,
                paymentStatus: order.paymentStatus,
                status: order.status,
                orderDate: order.orderDate,
                canCancel: order.status !== 'cancelled' && now < cutoffTime,
                cancelDeadline: cutoffTime
            };
        });

        res.json({
            success: true,
            data: ordersWithCancelInfo
        });
    } catch (error) {
        logger.error("Get Guest Orders Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * Cancel Guest Meal with Refund
 * POST /api/customer/menu/cancel-guest
 */
exports.cancelGuestMeal = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ success: false, message: "Order ID required" });
        }

        // 1. Find the guest order
        const order = await Order.findOne({
            _id: orderId,
            customer: customerId,
            orderType: "guest"
        });

        if (!order) {
            return res.status(404).json({ success: false, message: "Guest order not found" });
        }

        if (order.status === 'cancelled') {
            return res.status(400).json({ success: false, message: "Order already cancelled" });
        }

        // 2. Check cutoff time (2 hours before meal)
        const now = new Date();
        const mealHour = order.mealType.toLowerCase() === 'lunch' ? 12 : 20;
        const cutoffTime = new Date(order.orderDate);
        cutoffTime.setHours(mealHour - 2, 0, 0, 0);

        if (now >= cutoffTime) {
            return res.status(400).json({
                success: false,
                message: `Too late to cancel. Cutoff was ${cutoffTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
            });
        }

        // 3. Process refund if paid
        let refundAmount = 0;
        if (order.paymentStatus === 'Paid' && order.amount > 0) {
            refundAmount = order.amount;

            // Add back to wallet
            let wallet = await CustomerWallet.findOne({ customer: customerId });
            if (!wallet) {
                wallet = await CustomerWallet.create({ customer: customerId, balance: 0 });
            }
            wallet.balance += refundAmount;
            await wallet.save();

            // Create refund transaction
            await Transaction.create({
                customer: customerId,
                provider: order.provider,
                amount: refundAmount,
                type: "credit",
                transactionType: "Refund",
                referenceId: `REFUND-${order._id.toString().slice(-6)}`,
                status: "Success",
                description: `Refund for cancelled guest ${order.mealType} meal`,
                subscriptionId: order.subscription
            });
        }

        // 4. Update order status
        order.status = 'cancelled';
        await order.save();

        logger.info("Guest Meal Cancelled", {
            orderId: order._id,
            refundAmount,
            customer: customerId
        });

        res.json({
            success: true,
            message: refundAmount > 0
                ? `Guest meal cancelled. ₹${refundAmount} refunded to wallet.`
                : `Guest meal cancelled successfully.`,
            data: {
                refundAmount,
                newStatus: 'cancelled'
            }
        });

    } catch (error) {
        logger.error("Cancel Guest Meal Error:", error);
        res.status(500).json({ success: false, message: "Failed to cancel guest meal" });
    }
};
