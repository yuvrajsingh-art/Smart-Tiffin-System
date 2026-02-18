const Order = require('../../models/order.model');
const { sendSuccess, sendError } = require('../../utils/responseHelper');

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
            timeline: [
                { status: 'confirmed', time: order.createdAt, completed: true },
                { status: 'preparing', time: order.preparingAt, completed: ['preparing', 'prepared', 'out_for_delivery', 'delivered'].includes(order.status) },
                { status: 'prepared', time: order.preparedAt, completed: ['prepared', 'out_for_delivery', 'delivered'].includes(order.status) },
                { status: 'out_for_delivery', time: order.dispatchedAt, completed: ['out_for_delivery', 'delivered'].includes(order.status) },
                { status: 'delivered', time: order.deliveredAt, completed: order.status === 'delivered' }
            ],
            estimatedDelivery: order.estimatedDeliveryTime,
            amount: order.amount
        };

        return sendSuccess(res, 200, 'Order tracking retrieved', trackingData);
    } catch (error) {
        console.error('Track Order Error:', error);
        return sendError(res, 500, 'Failed to get tracking', error.message);
    }
};
