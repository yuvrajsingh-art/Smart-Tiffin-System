const Order = require("../../models/order.model");
const Subscription = require("../../models/subscription.model");

exports.generateTestOrders = async (req, res) => {
    try {
        const providerId = req.user.id;

        // Find active subscription for this provider
        const subscription = await Subscription.findOne({
            provider: providerId,
            status: { $in: ["active", "approved"] }
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "No active subscription found to generate orders"
            });
        }

        const orders = [];
        const today = new Date();

        // Generate 10 sample orders (5 lunch, 5 dinner) for last 10 days
        for (let i = 0; i < 10; i++) {
            const orderDate = new Date(today);
            orderDate.setDate(today.getDate() - i);
            orderDate.setHours(0, 0, 0, 0);

            // Lunch order
            const lunchOrder = await Order.create({
                customer: subscription.customer,
                provider: providerId,
                subscription: subscription._id,
                orderNumber: `ST-TEST-L-${Date.now()}-${i}`,
                orderType: "subscription",
                orderDate: orderDate,
                mealType: "Lunch",
                status: "delivered",
                deliveredAt: new Date(orderDate.getTime() + 13 * 60 * 60 * 1000), // 1 PM
                amount: 80,
                paymentStatus: "Paid",
                paymentMethod: "Wallet",
                deliveryAddress: subscription.deliveryAddress
            });
            orders.push(lunchOrder);

            // Dinner order
            const dinnerOrder = await Order.create({
                customer: subscription.customer,
                provider: providerId,
                subscription: subscription._id,
                orderNumber: `ST-TEST-D-${Date.now()}-${i}`,
                orderType: "subscription",
                orderDate: orderDate,
                mealType: "Dinner",
                status: "delivered",
                deliveredAt: new Date(orderDate.getTime() + 21 * 60 * 60 * 1000), // 9 PM
                amount: 80,
                paymentStatus: "Paid",
                paymentMethod: "Wallet",
                deliveryAddress: subscription.deliveryAddress
            });
            orders.push(dinnerOrder);
        }

        res.json({
            success: true,
            message: `Generated ${orders.length} test orders`,
            data: {
                ordersCreated: orders.length,
                totalRevenue: orders.length * 80
            }
        });

    } catch (error) {
        console.error("Generate Test Orders Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate test orders"
        });
    }
};
