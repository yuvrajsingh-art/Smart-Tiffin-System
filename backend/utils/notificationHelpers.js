const { createNotification } = require('./notificationService');

// Customer Notifications
exports.notifySubscriptionPurchased = async (customerId, providerId, planName, amount) => {
    await createNotification(
        customerId,
        "Subscription Activated",
        `Your ${planName} subscription is now active! Enjoy your meals.`,
        "Success",
        { type: 'subscription_purchased', amount }
    );
    
    await createNotification(
        providerId,
        "New Subscription",
        `New customer subscribed to ${planName} plan for ₹${amount}`,
        "Success",
        { type: 'new_subscription', amount }
    );
};

exports.notifySubscriptionPaused = async (customerId, providerId, pausedDays, refundAmount) => {
    await createNotification(
        customerId,
        "Subscription Paused",
        `You have paused ${pausedDays} day(s). ${refundAmount > 0 ? `Refund of ₹${refundAmount} pending approval.` : ''}`,
        "Info",
        { type: 'subscription_paused', pausedDays, refundAmount }
    );
    
    await createNotification(
        providerId,
        "Customer Paused Subscription",
        `A customer has paused their subscription for ${pausedDays} day(s).`,
        "Warning",
        { type: 'subscription_paused', pausedDays }
    );
};

exports.notifySubscriptionCancelled = async (customerId, providerId, refundAmount) => {
    await createNotification(
        customerId,
        "Subscription Cancelled",
        `Your subscription has been cancelled. ${refundAmount > 0 ? `Refund of ₹${refundAmount} will be processed within 24-48 hours.` : ''}`,
        "Warning",
        { type: 'subscription_cancelled', refundAmount }
    );
    
    await createNotification(
        providerId,
        "Customer Cancelled Subscription",
        `A customer has cancelled their subscription.`,
        "Alert",
        { type: 'subscription_cancelled' }
    );
};

exports.notifyGuestOrderPlaced = async (customerId, providerId, mealType, quantity, amount) => {
    await createNotification(
        customerId,
        "Guest Order Confirmed",
        `Your guest order for ${quantity} ${mealType} meal(s) has been placed successfully!`,
        "Success",
        { type: 'guest_order_placed', mealType, quantity, amount }
    );
    
    await createNotification(
        providerId,
        "New Guest Order",
        `New guest order: ${quantity} ${mealType} meal(s) for ₹${amount}`,
        "Info",
        { type: 'new_guest_order', mealType, quantity, amount }
    );
};

exports.notifyGuestOrderCancelled = async (customerId, providerId, mealType, quantity, refundAmount) => {
    await createNotification(
        customerId,
        "Guest Order Cancelled",
        `Your guest order for ${quantity} ${mealType} meal(s) has been cancelled. ${refundAmount > 0 ? `₹${refundAmount} refunded to wallet.` : ''}`,
        "Info",
        { type: 'guest_order_cancelled', mealType, quantity, refundAmount }
    );
    
    await createNotification(
        providerId,
        "Guest Order Cancelled",
        `Customer cancelled guest order: ${quantity} ${mealType} meal(s)`,
        "Warning",
        { type: 'guest_order_cancelled', mealType, quantity }
    );
};

exports.notifyOrderDelivered = async (customerId, orderId, mealType) => {
    await createNotification(
        customerId,
        "Order Delivered",
        `Your ${mealType} has been delivered successfully! Enjoy your meal.`,
        "Success",
        { type: 'order_delivered', orderId, mealType }
    );
};

exports.notifyOrderOutForDelivery = async (customerId, orderId, mealType) => {
    await createNotification(
        customerId,
        "Order Out for Delivery",
        `Your ${mealType} is out for delivery and will reach you soon!`,
        "Info",
        { type: 'order_out_for_delivery', orderId, mealType }
    );
};

// Provider Notifications
exports.notifyProviderOrderReady = async (providerId, orderId, customerName) => {
    await createNotification(
        providerId,
        "Order Ready for Pickup",
        `Order for ${customerName} is ready for delivery`,
        "Info",
        { type: 'order_ready', orderId }
    );
};

exports.notifyProviderNewCustomer = async (providerId, customerName, planName) => {
    await createNotification(
        providerId,
        "New Customer",
        `${customerName} subscribed to your ${planName} plan`,
        "Success",
        { type: 'new_customer', customerName, planName }
    );
};

// Admin Notifications
exports.notifyAdminNewUser = async (adminId, userName, userRole) => {
    await createNotification(
        adminId,
        "New User Registered",
        `${userName} registered as ${userRole}`,
        "Info",
        { type: 'new_user', userName, userRole }
    );
};

exports.notifyAdminNewProvider = async (adminId, providerName, storeName) => {
    await createNotification(
        adminId,
        "New Provider Registration",
        `${providerName} registered with store: ${storeName}`,
        "Info",
        { type: 'new_provider', providerName, storeName }
    );
};

exports.notifyAdminCancellationRequest = async (adminId, customerName, refundAmount) => {
    await createNotification(
        adminId,
        "Cancellation Request",
        `${customerName} requested subscription cancellation. Refund: ₹${refundAmount}`,
        "Alert",
        { type: 'cancellation_request', customerName, refundAmount }
    );
};

exports.notifyProviderMessage = async (providerId, title, message) => {
    await createNotification(
        providerId,
        title,
        message,
        "Info",
        { type: 'admin_message' }
    );
};
