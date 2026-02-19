const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const Subscription = require("../../models/subscription.model");
const Menu = require("../../models/menu.model");
const logger = require("../../utils/logger");
const { ORDER_STATUS, MAP, IMAGES } = require("../../config/constants");
const { generateTimeline, calculateDeliveryTime } = require("../../utils/orderHelper");

// Get live tracking details for active order
exports.getLiveTracking = async (req, res) => {
    try {
        const customerId = req.user._id;
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istNow = new Date(now.getTime() + istOffset);

        // Start of Today (IST)
        const today = new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate(), 0, 0, 0, 0));
        today.setTime(today.getTime() - istOffset); // Map back to UTC for query if stored as UTC

        // End of Today (IST)
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

        // DEBUG LOGGING
        logger.info(`Tracking Request for ${customerId}`, {
            rangeStart: today.toISOString(),
            rangeEnd: tomorrow.toISOString()
        });

        // Find today's active order (subscription or guest) - include delivered for completion message
        const activeOrder = await Order.findOne({
            customer: customerId,
            orderDate: { $gte: today, $lt: tomorrow },
            status: { $nin: ['cancelled'] }
        }).populate({
            path: 'subscription',
            populate: { path: 'provider', select: 'fullName' }
        }).populate('provider', 'fullName mobile').populate('deliveryPartner', 'fullName mobile');

        logger.info("Tracking Result", {
            found: !!activeOrder,
            orderId: activeOrder?._id,
            status: activeOrder?.status,
            orderDate: activeOrder?.orderDate
        });

        if (!activeOrder) {
            return res.status(404).json({
                success: false,
                message: 'No active order found for today. Orders are usually created when you customize your meal or via daily automation.'
            });
        }

        // 1. Calculate realistic ETA based on meal type and current time
        const estimatedDelivery = activeOrder.estimatedDeliveryTime || calculateDeliveryTime(activeOrder.mealType, activeOrder.orderDate);
        const etaMinutes = Math.max(0, Math.round((estimatedDelivery - now) / (1000 * 60)));
        const eta = etaMinutes;

        // 2. Generate timeline based on real Order status
        const timeline = generateTimeline(activeOrder);

        // 3. Delivery Partner Info (Real DB Data)
        let deliveryPartner = {
            name: activeOrder.provider?.fullName || "Restaurant Staff",
            rating: 4.8,
            phone: activeOrder.provider?.mobile || "",
            image: IMAGES.DELIVERY.RESTAURANT,
            isOnline: true
        };

        if (activeOrder.deliveryPartner) {
            deliveryPartner = {
                name: activeOrder.deliveryPartner.fullName,
                rating: 4.9,
                phone: activeOrder.deliveryPartner.mobile,
                image: IMAGES.DELIVERY.PARTNER,
                isOnline: true
            };
        }

        // 4. Format order details from real DB fields
        const orderDetails = {
            id: activeOrder._id,
            orderNumber: activeOrder.orderNumber,
            status: activeOrder.status,
            meal: {
                name: (activeOrder.menuItems && activeOrder.menuItems[0]?.name) || "Daily Meal Thali",
                image: (activeOrder.menuItems && activeOrder.menuItems[0]?.image) || IMAGES.MENU.LUNCH_VEG,
                items: activeOrder.menuItems?.map(i => i.name).join(", ") || "Main Dish, Roti, Dal, Rice",
                spiceLevel: activeOrder.customization?.spiceLevel || "Medium",
                mealType: activeOrder.mealType || "Lunch"
            },
            provider: activeOrder.provider?.fullName || "Provider",
            paymentStatus: activeOrder.paymentStatus || "Paid",
            amount: activeOrder.amount,
            paymentMethod: activeOrder.paymentMethod,
            orderType: activeOrder.orderType,
            quantity: activeOrder.quantity
        };

        res.json({
            success: true,
            data: {
                order: orderDetails,
                eta,
                estimatedDeliveryTime: estimatedDelivery,
                distance: activeOrder.status === 'out_for_delivery' ? "0.8 km" : "1.2 km",
                timeline,
                deliveryPartner,
                activityLog: activeOrder.activityLog || [],
                // Get coordinates from subscription delivery address or use default
                mapData: {
                    customerLocation: activeOrder.subscription?.deliveryAddress?.coordinates || MAP.DEFAULT_CENTER,
                    deliveryLocation: activeOrder.status === 'out_for_delivery'
                        ? { lat: MAP.DEFAULT_CENTER.lat + 0.003, lng: MAP.DEFAULT_CENTER.lng + 0.003 }
                        : { lat: MAP.DEFAULT_CENTER.lat + 0.006, lng: MAP.DEFAULT_CENTER.lng + 0.007 },
                    route: []
                }
            }
        });

    } catch (error) {
        logger.error("getLiveTracking Error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tracking details'
        });
    }
};

// Get order history with tracking
exports.getOrderHistory = async (req, res) => {
    try {
        const customerId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ customer: customerId })
            .populate('menu', 'name mainDish image mealType')
            .populate('provider', 'fullName')
            .sort({ orderDate: -1 })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments({ customer: customerId });

        const formattedOrders = orders.map(order => ({
            id: order._id,
            orderNumber: order.orderNumber || `ST-${order._id.toString().slice(-6)}`,
            date: order.orderDate,
            status: order.status,
            meal: {
                name: order.menu?.name || order.menu?.mainDish || "Special Thali",
                image: order.menu?.image || "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=200",
                mealType: order.menu?.mealType || "lunch"
            },
            provider: order.provider?.fullName || "Provider",
            amount: order.totalAmount || 0,
            paymentStatus: order.paymentStatus || "paid",
            canTrack: ['preparing', 'cooking', 'ready', 'packed', 'out_for_delivery'].includes(order.status)
        }));

        res.json({
            success: true,
            data: {
                orders: formattedOrders,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalOrders / limit),
                    totalOrders,
                    hasNext: page < Math.ceil(totalOrders / limit),
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order history'
        });
    }
};

// Update order status (for testing/admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, note } = req.body;

        const validStatuses = ['pending', 'confirmed', 'preparing', 'cooking', 'ready', 'packed', 'out_for_delivery', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order status'
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update status
        order.status = status;
        
        // Update timestamps
        const tsMap = {
            'confirmed': 'confirmedAt',
            'cooking': 'cookingStartedAt',
            'prepared': 'preparedAt',
            'out_for_delivery': 'outForDeliveryAt',
            'delivered': 'deliveredAt'
        };
        if (tsMap[status] && !order[tsMap[status]]) {
            order[tsMap[status]] = new Date();
        }

        // Add to activity log
        order.activityLog.push({
            status,
            timestamp: new Date(),
            updatedBy: req.user._id,
            updatedByRole: req.user.role,
            note: note || `Status updated to ${status}`
        });

        await order.save();

        // Emit socket event
        if (req.app.get('io')) {
            const io = req.app.get('io');
            io.emit('orderStatusUpdate', {
                orderId: order._id,
                status,
                timeline: generateTimeline(order),
                activityLog: order.activityLog
            });
        }

        res.json({
            success: true,
            data: {
                orderId: order._id,
                status: order.status,
                activityLog: order.activityLog,
                message: `Order status updated to ${status}`
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update order status'
        });
    }
};

/**
 * Initialize a test order for the customer to track
 * POST /api/customer/track/initialize-test
 */
exports.initializeTestOrder = async (req, res) => {
    try {
        const customerId = req.user._id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Check if order already exists for today
        let order = await Order.findOne({
            customer: customerId,
            orderDate: { $gte: today }
        });

        if (order) {
            // Just reset status to 'confirmed' for fresh test
            order.status = 'confirmed';
            order.confirmedAt = new Date();
            order.cookingStartedAt = null;
            order.preparedAt = null;
            order.outForDeliveryAt = null;
            order.deliveredAt = null;
            order.estimatedDeliveryTime = calculateDeliveryTime(order.mealType, new Date());
            order.activityLog = [{
                status: 'confirmed',
                timestamp: new Date(),
                updatedBy: customerId,
                updatedByRole: 'customer',
                note: 'Order reset for testing'
            }];
            await order.save();
            return res.json({ success: true, message: "Today's order reset to 'confirmed' status", order });
        }

        // 2. Find any active subscription to get provider info
        const subscription = await Subscription.findOne({
            customer: customerId,
            status: "approved"
        });

        if (!subscription) {
            return res.status(400).json({ success: false, message: "No active subscription found to link order" });
        }

        // 3. Create a real trackable order
        order = await Order.create({
            customer: customerId,
            provider: subscription.provider,
            subscription: subscription._id,
            orderDate: today,
            mealType: "Lunch",
            orderType: "subscription",
            amount: 0,
            paymentStatus: "Paid",
            status: "confirmed",
            confirmedAt: new Date(),
            estimatedDeliveryTime: calculateDeliveryTime("Lunch", new Date()),
            menuItems: [{
                name: "Standard Veg Thali",
                description: "Roti, Dal, Sabji, Rice",
                image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=200"
            }],
            deliveryAddress: subscription.deliveryAddress,
            activityLog: [{
                status: 'confirmed',
                timestamp: new Date(),
                updatedBy: customerId,
                updatedByRole: 'customer',
                note: 'Test order initialized'
            }]
        });

        res.json({
            success: true,
            message: "Test order initialized! You can now track it.",
            order
        });

    } catch (error) {
        console.error("Initialize Test Order Error:", error);
        res.status(500).json({ success: false, message: "Failed to initialize test order" });
    }
};

/**
 * DEBUG: Advance status to next step
 * POST /api/customer/track/advance-test
 */
exports.advanceTestStatus = async (req, res) => {
    try {
        const customerId = req.user._id;
        // Find latest order for this user
        const order = await Order.findOne({ customer: customerId }).sort({ orderDate: -1 });

        if (!order) return res.status(404).json({ success: false, message: "No order found" });

        const statusFlow = ['confirmed', 'cooking', 'prepared', 'out_for_delivery', 'delivered'];
        const currentIndex = statusFlow.indexOf(order.status);

        if (currentIndex < statusFlow.length - 1) {
            const nextStatus = statusFlow[currentIndex + 1];
            order.status = nextStatus;

            // Set timestamp
            const tsMap = {
                'cooking': 'cookingStartedAt',
                'prepared': 'preparedAt',
                'out_for_delivery': 'outForDeliveryAt',
                'delivered': 'deliveredAt'
            };
            if (tsMap[nextStatus]) order[tsMap[nextStatus]] = new Date();

            // Add to activity log
            order.activityLog.push({
                status: nextStatus,
                timestamp: new Date(),
                updatedBy: customerId,
                updatedByRole: 'customer',
                note: `Status advanced to ${nextStatus}`
            });

            await order.save();

            // Emit socket event if req.io is available
            if (req.app.get('io')) {
                const io = req.app.get('io');
                io.emit('orderStatusUpdate', {
                    orderId: order._id,
                    status: nextStatus,
                    timeline: generateTimeline(order)
                });
                console.log(`[SOCKET] Emitted status update: ${nextStatus}`);
            }

            return res.json({ success: true, nextStatus, timestamp: new Date() });
        }

        res.json({ success: false, message: "Already delivered" });
    } catch (error) {
        console.error("Advance Test Status Error:", error);
        res.status(500).json({ success: false, message: "Failed to advance" });
    }
};

// Helper function to format menu items
const formatMenuItems = (menu) => {
    if (!menu) return "Delicious meal";

    const items = [];
    if (menu.bread?.count && menu.bread?.type) {
        items.push(`${menu.bread.count} ${menu.bread.type}`);
    }
    if (menu.dal) items.push(menu.dal);
    if (menu.rice) items.push(menu.rice);
    if (menu.accompaniments?.salad) items.push("Salad");
    if (menu.accompaniments?.pickle) items.push("Pickle");

    return items.length > 0 ? items.join(", ") : "Delicious meal";
};