/**
 * =============================================================================
 * ORDER CONTROLLER
 * =============================================================================
 * Handles order management operations
 * =============================================================================
 */

const User = require("../../models/user.model");
const Order = require("../../models/order.model");

const { sendSuccess, sendError } = require("../../utils/responseHelper");
const { isValidObjectId } = require("../../utils/validationHelper");
const { formatDate, formatTime, getStartOfDay, getEndOfDay } = require("../../utils/dateHelper");
const { createLog } = require("./helpers");

// Helper to format status for frontend
const formatStatus = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
        case 'confirmed': return 'Preparing';
        case 'cooking': return 'Preparing';
        case 'prepared': return 'Out for Delivery';
        case 'out_for_delivery': return 'In Transit';
        case 'delivered': return 'Delivered';
        case 'cancelled': return 'Cancelled';
        default: return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    }
};

/**
 * Get all orders with filters
 * @route GET /api/admin/orders
 * @query {String} date - Filter: 'today' or 'past'
 * @query {String} startDate - Start date for range
 * @query {String} endDate - End date for range
 * @query {String} search - Search by customer name, mobile, order ID
 */
exports.getOrders = async (req, res) => {
    try {
        const { date, startDate, endDate, search } = req.query;
        let query = {};

        // Date filtering
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: getEndOfDay(new Date(endDate))
            };
        } else if (date === 'today') {
            query.createdAt = { $gte: getStartOfDay() };
        } else if (date === 'past') {
            query.createdAt = { $lt: getStartOfDay() };
        }

        // Search logic
        if (search) {
            const isObjectId = isValidObjectId(search);
            const userMatch = await User.find({
                $or: [
                    { fullName: { $regex: search, $options: 'i' } },
                    { mobile: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');

            const userIds = userMatch.map(u => u._id);
            query.$or = [
                { customer: { $in: userIds } },
                { provider: { $in: userIds } }
            ];

            if (isObjectId) {
                query.$or.push({ _id: search });
            }
        }

        const orders = await Order.find(query)
            .populate('customer', 'fullName mobile address')
            .populate('provider', 'fullName businessName')
            .sort({ createdAt: -1 });

        // Format orders for frontend
        const formattedOrders = orders.map(order => ({
            id: order.orderNumber || order._id.toString().slice(-6).toUpperCase(),
            _id: order._id,
            rawId: order._id,
            displayId: order.orderNumber,
            customer: order.customer?.fullName || 'Unknown',
            customerMobile: order.customer?.mobile || 'N/A',
            kitchen: order.provider?.businessName || order.provider?.fullName || 'Unknown',
            type: order.orderType === 'subscription' ? 'Subscription' : 'One-Time',
            status: formatStatus(order.status),
            price: order.amount || 0,
            time: formatTime(order.createdAt),
            date: formatDate(order.createdAt),
            address: order.deliveryAddress?.address_text || `${order.deliveryAddress?.street}, ${order.deliveryAddress?.city}` || 'Unknown',
            zone: order.deliveryAddress?.city || 'Zone A',
            rider: order.deliveryPerson || (order.status === 'out_for_delivery' ? 'Searching...' : '-'),
            items: order.menuItems || [],
            customization: order.customization || {},
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            timeline: {
                confirmed: order.confirmedAt,
                cooking: order.cookingStartedAt,
                prepared: order.preparedAt,
                outForDelivery: order.outForDeliveryAt,
                delivered: order.deliveredAt
            }
        }));

        return sendSuccess(res, 200, "Orders retrieved successfully", formattedOrders);
    } catch (error) {
        console.error("Get Orders Error:", error.message);
        return sendError(res, 500, "Failed to fetch orders", error);
    }
};

/**
 * Get single order details
 * @route GET /api/admin/orders/:id
 */
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return sendError(res, 400, "Invalid ID");

        const order = await Order.findById(id)
            .populate('customer', 'fullName mobile email address')
            .populate('provider', 'businessName fullName mobile address');

        if (!order) return sendError(res, 404, "Order not found");

        return sendSuccess(res, 200, "Order details retrieved", order);
    } catch (error) {
        return sendError(res, 500, "Failed to fetch order", error);
    }
};

/**
 * Update order status
 * @route PUT /api/admin/orders/:id/status
 * @param {String} id - Order ID
 * @body {String} status - New order status
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid order ID");
        }

        const validStatuses = ['confirmed', 'cooking', 'prepared', 'out_for_delivery', 'delivered', 'cancelled'];
        let normalizedStatus = status.toLowerCase().replace(/ /g, '_');
        
        // Map frontend status to backend status
        if (status === 'Preparing') normalizedStatus = 'prepared';
        if (status === 'In Transit') normalizedStatus = 'out_for_delivery';
        
        if (!validStatuses.includes(normalizedStatus)) {
            return sendError(res, 400, "Invalid status");
        }

        const updateData = { status: normalizedStatus };
        if (normalizedStatus === 'cooking') updateData.cookingStartedAt = new Date();
        if (normalizedStatus === 'prepared') updateData.preparedAt = new Date();
        if (normalizedStatus === 'out_for_delivery') updateData.outForDeliveryAt = new Date();
        if (normalizedStatus === 'delivered') updateData.deliveredAt = new Date();

        const order = await Order.findByIdAndUpdate(id, updateData, { new: true });

        if (!order) {
            return sendError(res, 404, "Order not found");
        }

        // Log action
        await createLog(
            'ORDER_STATUS_UPDATE',
            `Order #${order.orderNumber} status updated to ${status}.`,
            req.user.id,
            'edit_document',
            'text-indigo-500'
        );

        return sendSuccess(res, 200, `Order status updated to ${status}`, order);
    } catch (error) {
        console.error("Update Order Status Error:", error.message);
        return sendError(res, 500, "Failed to update order status", error);
    }
};

/**
 * Cancel order
 * @route PUT /api/admin/orders/:id/cancel
 * @param {String} id - Order ID
 * @body {String} reason - Cancellation reason
 */
exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid order ID");
        }

        const order = await Order.findByIdAndUpdate(
            id,
            {
                status: 'Cancelled',
                cancellationReason: reason || 'Cancelled by admin'
            },
            { new: true }
        );

        if (!order) {
            return sendError(res, 404, "Order not found");
        }

        return sendSuccess(res, 200, "Order cancelled successfully", order);
    } catch (error) {
        console.error("Cancel Order Error:", error.message);
        return sendError(res, 500, "Failed to cancel order", error);
    }
};

/**
 * Assign rider to order
 * @route PUT /api/admin/orders/:id/rider
 * @param {String} id - Order ID
 * @body {String} riderName - Rider name
 * @body {String} riderId - Rider ID
 */
exports.assignRider = async (req, res) => {
    try {
        const { id } = req.params;
        const { riderName, riderId } = req.body;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid order ID");
        }

        if (!riderName || !riderId) {
            return sendError(res, 400, "Rider name and ID are required");
        }

        const order = await Order.findByIdAndUpdate(
            id,
            {
                deliveryPerson: riderName,
                deliveryPersonId: riderId,
                status: 'Out for Delivery'
            },
            { new: true }
        );

        if (!order) {
            return sendError(res, 404, "Order not found");
        }

        return sendSuccess(res, 200, `Rider ${riderName} assigned successfully`, order);
    } catch (error) {
        console.error("Assign Rider Error:", error.message);
        return sendError(res, 500, "Failed to assign rider", error);
    }
};
