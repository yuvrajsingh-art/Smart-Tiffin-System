/**
 * Provider Order Controller
 * Handles provider-side order management
 * 
 * Simple, beginner-friendly code with comments
 */

const Order = require("../../models/order.model");
const CustomerWallet = require("../../models/customerWallet.model");
const Transaction = require("../../models/transaction.model");
const { createNotification } = require("../../utils/notificationService");
const logger = require("../../utils/logger");

/**
 * Cancel Order by Provider
 * When provider can't deliver (emergency, no supplies, etc.)
 * POST /api/provider/orders/cancel
 * 
 * What happens:
 * 1. Provider cancels the order
 * 2. Customer gets FULL refund in wallet
 * 3. Customer gets notification
 */
exports.cancelOrderByProvider = async (req, res) => {
    try {
        // Get provider ID from logged-in user
        const providerId = req.user._id;

        // Get order ID and reason from request
        const { orderId, reason } = req.body;

        // Validate input
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        // Step 1: Find the order
        const order = await Order.findOne({
            _id: orderId,
            provider: providerId
        });

        // Check if order exists
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if already cancelled
        if (order.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: "Order is already cancelled"
            });
        }

        // Step 2: Process refund if customer paid
        let refundAmount = 0;

        if (order.paymentStatus === 'Paid' && order.amount > 0) {
            refundAmount = order.amount;

            // Find customer wallet (or create one)
            let wallet = await CustomerWallet.findOne({
                customer: order.customer
            });

            if (!wallet) {
                wallet = await CustomerWallet.create({
                    customer: order.customer,
                    balance: 0
                });
            }

            // Add money back to wallet
            wallet.balance = wallet.balance + refundAmount;
            await wallet.save();

            // Create refund transaction record
            await Transaction.create({
                customer: order.customer,
                provider: providerId,
                amount: refundAmount,
                type: "credit",
                transactionType: "Refund",
                referenceId: `PROV-CANCEL-${orderId.toString().slice(-6)}`,
                status: "Success",
                description: `Refund: Provider cancelled ${order.mealType} order. Reason: ${reason || 'Not specified'}`
            });

            logger.info("Refund processed", { orderId, refundAmount });
        }

        // Step 3: Update order status
        order.status = 'cancelled';
        order.cancelledBy = 'provider';
        order.cancelledAt = new Date();
        order.cancellationReason = reason || 'Provider unable to deliver';
        await order.save();

        // Step 4: Send notification to customer
        try {
            await createNotification({
                userId: order.customer,
                title: "Order Cancelled",
                message: refundAmount > 0
                    ? `Your ${order.mealType} order was cancelled by provider. ₹${refundAmount} refunded to wallet.`
                    : `Your ${order.mealType} order was cancelled by provider.`,
                type: "order_cancelled"
            });
        } catch (notifError) {
            // Log but don't fail if notification fails
            logger.warn("Failed to send cancellation notification", notifError);
        }

        // Step 5: Send success response
        logger.info("Provider cancelled order", { orderId, providerId, refundAmount });

        res.json({
            success: true,
            message: refundAmount > 0
                ? `Order cancelled. ₹${refundAmount} refunded to customer.`
                : `Order cancelled successfully.`,
            data: {
                orderId: order._id,
                refundAmount: refundAmount,
                newStatus: 'cancelled'
            }
        });

    } catch (error) {
        // Log error and send error response
        logger.error("Cancel Order Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to cancel order"
        });
    }
};

/**
 * Get Today's Orders for Provider
 * GET /api/provider/orders/today
 */
exports.getTodaysOrders = async (req, res) => {
    try {
        const providerId = req.user._id;

        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Find all orders for today
        const orders = await Order.find({
            provider: providerId,
            orderDate: { $gte: today, $lt: tomorrow }
        })
            .populate('customer', 'fullName mobile address email')
            .populate('deliveryPartner', 'name phone')
            .sort({ mealType: 1, createdAt: -1 });

        // Separate by meal type
        const lunchOrders = orders.filter(o => (o.mealType || '').toLowerCase() === 'lunch');
        const dinnerOrders = orders.filter(o => (o.mealType || '').toLowerCase() === 'dinner');

        res.json({
            success: true,
            data: {
                lunch: lunchOrders,
                dinner: dinnerOrders,
                summary: {
                    totalLunch: lunchOrders.length,
                    totalDinner: dinnerOrders.length,
                    cancelledCount: orders.filter(o => o.status === 'cancelled').length
                }
            }
        });

    } catch (error) {
        logger.error("Get Today's Orders Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
};
