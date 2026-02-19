/**
 * Calculate estimated delivery time based on meal type and order time
 */
exports.calculateDeliveryTime = (mealType, orderTime = new Date()) => {
    const hour = orderTime.getHours();
    const deliveryTime = new Date(orderTime);
    
    // Lunch: 9 AM - 11 AM (2 hours)
    if (mealType.toLowerCase() === 'lunch' || hour < 15) {
        deliveryTime.setHours(11, 0, 0, 0);
    } 
    // Dinner: 3 PM - 7 PM (4 hours)
    else {
        deliveryTime.setHours(19, 0, 0, 0);
    }
    
    return deliveryTime;
};

/**
 * Shared helper to generate timeline based on real status
 */
exports.generateTimeline = (order) => {
    const steps = [
        {
            title: 'Order Placed',
            time: order.confirmedAt ? new Date(order.confirmedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending',
            active: true,
            done: true,
            icon: 'receipt_long'
        },
        {
            title: 'Cooking Started',
            time: order.cookingStartedAt ? new Date(order.cookingStartedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Wait...',
            active: ['cooking', 'prepared', 'out_for_delivery', 'delivered'].includes(order.status),
            done: ['cooking', 'prepared', 'out_for_delivery', 'delivered'].includes(order.status),
            icon: 'skillet',
            pulse: order.status === 'cooking'
        },
        {
            title: 'Food Prepared',
            time: order.preparedAt ? new Date(order.preparedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Wait...',
            active: ['prepared', 'out_for_delivery', 'delivered'].includes(order.status),
            done: ['prepared', 'out_for_delivery', 'delivered'].includes(order.status),
            icon: 'soup_kitchen',
            pulse: order.status === 'prepared'
        },
        {
            title: 'Out for Delivery',
            time: order.outForDeliveryAt ? new Date(order.outForDeliveryAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Wait...',
            active: ['out_for_delivery', 'delivered'].includes(order.status),
            done: ['out_for_delivery', 'delivered'].includes(order.status),
            pulse: order.status === 'out_for_delivery',
            icon: 'moped'
        },
        {
            title: 'Delivered',
            time: order.deliveredAt ? new Date(order.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Est. soon',
            active: order.status === 'delivered',
            done: order.status === 'delivered',
            icon: 'home'
        }
    ];

    return steps;
};
