const Order = require('../../models/order.model');
const { sendSuccess, sendError } = require('../../utils/responseHelper');
const { generateTimeline } = require('../../utils/orderHelper');

exports.getOrderTracking = async (req, res) => {
    try {
        const { orderId } = req.params;
        const providerId = req.user.id;

        const order = await Order.findOne({ _id: orderId, provider: providerId })
            .populate('customer', 'fullName mobile')
            .populate('deliveryPartner', 'name phone');

        if (!order) {
            return sendError(res, 404, 'Order not found');
        }

        const trackingData = {
            orderId: order._id,
            orderNumber: order.orderNumber,
            status: order.status,
            customer: {
                name: order.customer?.fullName || 'N/A',
                phone: order.customer?.mobile || 'N/A'
            },
            deliveryAddress: order.deliveryAddress,
            deliveryPartner: order.deliveryPartner ? {
                name: order.deliveryPartner.name,
                phone: order.deliveryPartner.phone
            } : null,
            timeline: generateTimeline(order),
            estimatedDelivery: order.estimatedDeliveryTime,
            amount: order.amount,
            activityLog: order.activityLog || []
        };

        return sendSuccess(res, 200, 'Order tracking retrieved', trackingData);
    } catch (error) {
        console.error('Track Order Error:', error);
        return sendError(res, 500, 'Failed to get tracking', error.message);
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, note } = req.body;
        const providerId = req.user.id || req.user._id;

        const validStatuses = ['confirmed', 'cooking', 'prepared', 'out_for_delivery', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return sendError(res, 400, 'Invalid order status');
        }

        const order = await Order.findOne({ _id: orderId, provider: providerId });

        if (!order) {
            return sendError(res, 404, 'Order not found');
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
            updatedBy: providerId,
            updatedByRole: 'provider',
            note: note || `Provider updated status to ${status}`
        });

        await order.save();

        return sendSuccess(res, 200, 'Order status updated', {
            orderId: order._id,
            status: order.status,
            timeline: generateTimeline(order),
            activityLog: order.activityLog
        });
    } catch (error) {
        console.error('Update Order Status Error:', error);
        return sendError(res, 500, 'Failed to update status', error.message);
    }
};
