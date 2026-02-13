# Real-Time Notification System - Implementation Guide

## ✅ Completed Setup

### Backend Files Created/Modified:
1. **`backend/utils/notificationService.js`** - Enhanced with Socket.io integration
2. **`backend/utils/notificationHelpers.js`** - Helper functions for all notification scenarios
3. **`backend/server.js`** - Added user authentication and room management for Socket.io
4. **`backend/controllers/customer/subscriptionNotifications.js`** - Notification wrappers

### Frontend Files Created/Modified:
1. **`frontend/src/context/NotificationContext.jsx`** - Real-time notification management
2. **`frontend/src/App.jsx`** - Added NotificationProvider
3. **`frontend/src/components/common/NotificationBell.jsx`** - Notification UI component

## 🔧 Integration Steps

### Step 1: Add Notifications to Subscription Controller

Open `backend/controllers/customer/subscriptionController.js` and add these imports at the top:

```javascript
const {
    notifySubscriptionPurchased,
    notifySubscriptionPaused,
    notifySubscriptionCancelled
} = require("../../utils/notificationHelpers");
```

Then add notification calls:

**In `purchaseSubscription` function** (after subscription.save() and before response):
```javascript
// Send notifications
await notifySubscriptionPurchased(customerId, providerUserId, planName, totalAmount);
```

**In `managePausedDays` function** (after subscription.save()):
```javascript
// Send notifications
await notifySubscriptionPaused(customerId, subscription.provider, validDates.length, refundAmount);
```

**In `cancelSubscription` function** (after status update):
```javascript
// Send notifications
await notifySubscriptionCancelled(customerId, subscription.provider, refundAmount);
```

### Step 2: Add NotificationBell to Headers

**For Customer Dashboard** (`frontend/src/layouts/DashboardLayout.jsx`):
```javascript
import NotificationBell from '../components/common/NotificationBell';

// In the header section, add:
<NotificationBell />
```

**For Provider Dashboard** (`frontend/src/layouts/ProviderLayout.jsx`):
```javascript
import NotificationBell from '../components/common/NotificationBell';

// In the header section, add:
<NotificationBell />
```

**For Admin Dashboard** (`frontend/src/layouts/AdminLayout.jsx`):
```javascript
import NotificationBell from '../components/common/NotificationBell';

// In the header section, add:
<NotificationBell />
```

### Step 3: Add Notifications to Order Delivery

Open `backend/controllers/provider/providerOrderController.js` and add:

```javascript
const { notifyOrderDelivered, notifyOrderOutForDelivery } = require("../../utils/notificationHelpers");

// When order status changes to "out_for_delivery":
await notifyOrderOutForDelivery(order.customer, order._id, order.mealType);

// When order status changes to "delivered":
await notifyOrderDelivered(order.customer, order._id, order.mealType);
```

### Step 4: Add Admin Notifications

Open `backend/controllers/authcontroller.js` and add:

```javascript
const { notifyAdminNewUser, notifyAdminNewProvider } = require("../utils/notificationHelpers");
const User = require("../models/user.model");

// In register function, after user creation:
// Get all admins
const admins = await User.find({ role: 'admin' });

// Notify all admins
for (const admin of admins) {
    if (role === 'provider') {
        await notifyAdminNewProvider(admin._id, fullName, 'New Store');
    } else {
        await notifyAdminNewUser(admin._id, fullName, role);
    }
}
```

## 📋 Notification Scenarios Covered

### Customer Notifications:
- ✅ Subscription purchased
- ✅ Subscription paused
- ✅ Subscription cancelled
- ✅ Guest order placed
- ✅ Guest order cancelled
- ✅ Order out for delivery
- ✅ Order delivered

### Provider Notifications:
- ✅ New subscription from customer
- ✅ Customer paused subscription
- ✅ Customer cancelled subscription
- ✅ New guest order
- ✅ Guest order cancelled
- ✅ Admin messages

### Admin Notifications:
- ✅ New user registered
- ✅ New provider registered
- ✅ Cancellation requests

## 🚀 Testing the System

### 1. Start Backend:
```bash
cd backend
npm start
```

### 2. Start Frontend:
```bash
cd frontend
npm run dev
```

### 3. Test Scenarios:

**Test 1: Subscription Purchase**
1. Login as customer
2. Purchase a subscription
3. Check notification bell (should show "Subscription Activated")
4. Login as provider
5. Check notification bell (should show "New Subscription")

**Test 2: Guest Order**
1. Login as customer with active subscription
2. Book a guest meal
3. Check notification (should show "Guest Order Confirmed")
4. Login as provider
5. Check notification (should show "New Guest Order")

**Test 3: Subscription Pause**
1. Login as customer
2. Pause subscription days
3. Check notification (should show "Subscription Paused")
4. Login as provider
5. Check notification (should show "Customer Paused Subscription")

## 🔔 Browser Notifications

The system also supports browser notifications. Users will be prompted to allow notifications on first login. Make sure to:
1. Allow notifications in browser
2. Keep the tab open or in background
3. Notifications will appear even when tab is not active

## 🎨 Customization

### Change Notification Styles:
Edit `frontend/src/components/common/NotificationBell.jsx`

### Add New Notification Types:
1. Add function in `backend/utils/notificationHelpers.js`
2. Call it from relevant controller
3. Notification will automatically appear in real-time

### Modify Notification Icons:
In `NotificationBell.jsx`, update the `getNotificationIcon` function:
```javascript
const getNotificationIcon = (type) => {
    const icons = {
        Success: '✅',
        Info: 'ℹ️',
        Warning: '⚠️',
        Alert: '🚨'
    };
    return icons[type] || 'ℹ️';
};
```

## 🐛 Troubleshooting

### Notifications not appearing?
1. Check Socket.io connection in browser console
2. Verify user is authenticated
3. Check backend logs for notification creation
4. Ensure NotificationProvider is wrapping the app

### Socket connection issues?
1. Check CORS settings in `backend/server.js`
2. Verify Socket.io URL in `frontend/src/context/SocketContext.jsx`
3. Check firewall/network settings

### Notifications not persisting?
1. Check MongoDB connection
2. Verify notification model is saving correctly
3. Check API endpoints are working

## 📝 Notes

- Notifications are stored in MongoDB for persistence
- Real-time delivery via Socket.io
- Browser notifications require user permission
- Unread count updates automatically
- Mark as read functionality included
- Supports multiple notification types (Success, Info, Warning, Alert)

## 🎯 Next Steps

1. Add email notifications for important events
2. Add SMS notifications for critical alerts
3. Implement notification preferences
4. Add notification history page
5. Implement notification filtering
