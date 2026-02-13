const { createNotification } = require("../../utils/notificationService");
const {
    notifySubscriptionPurchased,
    notifySubscriptionPaused,
    notifySubscriptionCancelled
} = require("../../utils/notificationHelpers");

// Add these notification calls to existing subscription controller functions

// In managePausedDays - after subscription.save()
exports.addPauseNotifications = async (customerId, providerId, pausedDays, refundAmount) => {
    await notifySubscriptionPaused(customerId, providerId, pausedDays, refundAmount);
};

// In cancelSubscription - after status update
exports.addCancelNotifications = async (customerId, providerId, refundAmount) => {
    await notifySubscriptionCancelled(customerId, providerId, refundAmount);
};

// In purchaseSubscription - after subscription.save()
exports.addPurchaseNotifications = async (customerId, providerId, planName, totalAmount) => {
    await notifySubscriptionPurchased(customerId, providerId, planName, totalAmount);
};
