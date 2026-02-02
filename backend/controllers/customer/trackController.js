const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const Subscription = require("../../models/subscription.model");
const { Menu } = require("../../models/menu.model");

// Get live tracking details for active order
exports.getLiveTracking = async (req, res) => {
    try {
        const customerId = req.user._id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Find today's active order
        const activeOrder = await Order.findOne({
            customer: customerId,
            orderDate: { $gte: today, $lt: tomorrow },
            status: { $nin: ['delivered', 'cancelled'] }
        }).populate('menu', 'name mainDish image mealType spiceLevel')
          .populate('provider', 'fullName');

        if (!activeOrder) {
            return res.status(404).json({
                success: false,
                message: 'No active order found for today'
            });
        }

        // Calculate ETA based on order status
        const statusETA = {
            'pending': 45,
            'confirmed': 40,
            'preparing': 30,
            'cooking': 25,
            'ready': 20,
            'packed': 15,
            'out_for_delivery': 10
        };

        const eta = statusETA[activeOrder.status] || 15;

        // Generate timeline based on order status
        const timeline = generateTimeline(activeOrder);

        // Get delivery partner info (mock for now)
        const deliveryPartner = {
            name: "Rajesh Kumar",
            rating: 4.9,
            phone: "+91 98765 43210",
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200",
            isOnline: true
        };

        // Format order details
        const orderDetails = {
            id: activeOrder._id,
            orderNumber: activeOrder.orderNumber || `ST-${activeOrder._id.toString().slice(-6)}`,
            status: activeOrder.status,
            meal: {
                name: activeOrder.menu?.name || activeOrder.menu?.mainDish || "Special Thali",
                image: activeOrder.menu?.image || "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=200",
                items: formatMenuItems(activeOrder.menu),
                spiceLevel: activeOrder.menu?.spiceLevel || "Medium",
                mealType: activeOrder.menu?.mealType || "lunch"
            },
            provider: activeOrder.provider?.fullName || "Provider",
            paymentStatus: activeOrder.paymentStatus || "paid"
        };

        res.json({
            success: true,
            data: {
                order: orderDetails,
                eta,
                distance: "1.2 km",
                timeline,
                deliveryPartner,
                mapData: {
                    customerLocation: { lat: 19.0760, lng: 72.8777 }, // Mock Mumbai location
                    deliveryLocation: { lat: 19.0820, lng: 72.8850 },
                    route: [] // Can be populated with actual route data
                }
            }
        });

    } catch (error) {
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
        const { status } = req.body;
        
        const validStatuses = ['pending', 'confirmed', 'preparing', 'cooking', 'ready', 'packed', 'out_for_delivery', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order status'
            });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status, updatedAt: new Date() },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: {
                orderId: order._id,
                status: order.status,
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

// Helper function to generate timeline
const generateTimeline = (order) => {
    const now = new Date();
    const orderTime = new Date(order.createdAt);
    
    const steps = [
        {
            title: 'Order Placed',
            time: orderTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            active: true,
            done: true,
            icon: 'receipt_long'
        },
        {
            title: 'Preparing Food',
            time: new Date(orderTime.getTime() + 45 * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            active: ['preparing', 'cooking', 'ready', 'packed', 'out_for_delivery', 'delivered'].includes(order.status),
            done: ['cooking', 'ready', 'packed', 'out_for_delivery', 'delivered'].includes(order.status),
            icon: 'skillet'
        },
        {
            title: 'Out for Delivery',
            time: new Date(orderTime.getTime() + 75 * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            active: ['out_for_delivery', 'delivered'].includes(order.status),
            done: ['delivered'].includes(order.status),
            pulse: order.status === 'out_for_delivery',
            icon: 'moped'
        },
        {
            title: 'Delivered',
            time: order.status === 'delivered' 
                ? new Date(order.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                : `Est. ${new Date(orderTime.getTime() + 90 * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
            active: order.status === 'delivered',
            done: order.status === 'delivered',
            icon: 'home'
        }
    ];

    return steps;
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