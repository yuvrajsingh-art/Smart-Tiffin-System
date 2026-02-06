const Order = require('../models/order.model');

const watchOrders = (io) => {
    const changeStream = Order.watch([], { fullDocument: 'updateLookup' });

    changeStream.on('change', (change) => {
        if (change.operationType === 'update') {
            const order = change.fullDocument;

            // Only emit if status changed (or relevant fields)
            const updatedFields = change.updateDescription.updatedFields;
            if (updatedFields.status || updatedFields.deliveryPartner) {

                // Helper to generate timeline (duplicated from controller for now, ideal: shared util)
                const generateTimeline = (o) => {
                    return [
                        { title: 'Order Placed', time: o.confirmedAt, active: true, done: true, icon: 'receipt_long' },
                        { title: 'Cooking Started', time: o.cookingStartedAt, active: ['cooking', 'prepared', 'out_for_delivery', 'delivered'].includes(o.status), done: ['cooking', 'prepared', 'out_for_delivery', 'delivered'].includes(o.status), icon: 'skillet' },
                        { title: 'Food Prepared', time: o.preparedAt, active: ['prepared', 'out_for_delivery', 'delivered'].includes(o.status), done: ['prepared', 'out_for_delivery', 'delivered'].includes(o.status), icon: 'soup_kitchen' },
                        { title: 'Out for Delivery', time: o.outForDeliveryAt, active: ['out_for_delivery', 'delivered'].includes(o.status), done: ['out_for_delivery', 'delivered'].includes(o.status), icon: 'moped' },
                        { title: 'Delivered', time: o.deliveredAt, active: o.status === 'delivered', done: o.status === 'delivered', icon: 'home' }
                    ];
                };

                io.emit('orderStatusUpdate', {
                    orderId: order._id,
                    status: order.status,
                    timeline: generateTimeline(order)
                });

                console.log(`[DB WATCHER] Detected manual change for Order ${order._id} -> Status: ${order.status}`);
            }
        }
    });

    console.log("👀 Watching for manual DB changes on 'orders' collection...");
};

module.exports = watchOrders;
