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
            .populate('provider', 'businessName')
            .sort({ createdAt: -1 });

        // Format orders for frontend
        const formattedOrders = orders.map(order => ({
            rawId: order._id,
            id: order._id.toString().slice(-6).toUpperCase(),
            customer: order.customer?.fullName || 'Unknown',
            customerMobile: order.customer?.mobile || 'N/A',
            kitchen: order.provider?.businessName || 'Unknown',
            type: order.order_type === 'subscription' ? 'Subscription' : 'One-Time',
            status: order.status,
            price: order.grandTotal || 0,
            time: formatTime(order.createdAt),
            date: formatDate(order.createdAt),
            address: order.delivery_location?.address_text || 'Unknown',
            rider: order.rider_id ? 'Assigned' : 'Not Assigned'
        }));

        return sendSuccess(res, 200, "Orders retrieved successfully", formattedOrders);
    } catch (error) {
        console.error("Get Orders Error:", error.message);
        return sendError(res, 500, "Failed to fetch orders", error);
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

        const validStatuses = ['Placed', 'Accepted', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return sendError(res, 400, "Invalid status");
        }

        const updateData = { status };
        if (status === 'Delivered') {
            updateData.deliveredAt = new Date();
        }

        const order = await Order.findByIdAndUpdate(id, updateData, { new: true });

        if (!order) {
            return sendError(res, 404, "Order not found");
        }

        // Log action
        await createLog(
            'ORDER_STATUS_UPDATE',
            `Order #${order._id.toString().slice(-6)} status updated to ${status}.`,
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
