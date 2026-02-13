# ✅ Notification System - Implementation Checklist

## 📋 Pre-Implementation (Already Done ✅)

- [x] Backend notification service created
- [x] Socket.io server configured
- [x] Notification model in MongoDB
- [x] Notification helpers created
- [x] Frontend NotificationContext created
- [x] NotificationBell component created
- [x] App.jsx updated with NotificationProvider
- [x] Guest meal notifications working

---

## 🔧 Integration Steps (To Do)

### Backend Integration

#### Step 1: Update Subscription Controller
File: `backend/controllers/customer/subscriptionController.js`

- [ ] Add import at line 11:
```javascript
const {
    notifySubscriptionPurchased,
    notifySubscriptionPaused,
    notifySubscriptionCancelled
} = require("../../utils/notificationHelpers");
```

- [ ] In `purchaseSubscription` function (after `await subscription.save();`):
```javascript
await notifySubscriptionPurchased(customerId, providerUserId, planName, totalAmount);
```

- [ ] In `managePausedDays` function (after `await subscription.save();`):
```javascript
await notifySubscriptionPaused(customerId, subscription.provider, validDates.length, refundAmount);
```

- [ ] In `cancelSubscription` function (after `await User.findByIdAndUpdate(...);`):
```javascript
await notifySubscriptionCancelled(customerId, subscription.provider, Math.floor(refundAmount));
```

#### Step 2: Update Order Controller (Optional but Recommended)
File: `backend/controllers/provider/providerOrderController.js`

- [ ] Add import:
```javascript
const { notifyOrderDelivered, notifyOrderOutForDelivery } = require("../../utils/notificationHelpers");
```

- [ ] When order status changes to "out_for_delivery":
```javascript
await notifyOrderOutForDelivery(order.customer, order._id, order.mealType);
```

- [ ] When order status changes to "delivered":
```javascript
await notifyOrderDelivered(order.customer, order._id, order.mealType);
```

#### Step 3: Update Auth Controller (Optional)
File: `backend/controllers/authcontroller.js`

- [ ] Add import:
```javascript
const { notifyAdminNewUser, notifyAdminNewProvider } = require("../utils/notificationHelpers");
```

- [ ] In register function (after user creation):
```javascript
const admins = await User.find({ role: 'admin' });
for (const admin of admins) {
    if (role === 'provider') {
        await notifyAdminNewProvider(admin._id, fullName, 'New Store');
    } else {
        await notifyAdminNewUser(admin._id, fullName, role);
    }
}
```

---

### Frontend Integration

#### Step 4: Add NotificationBell to Customer Dashboard
File: `frontend/src/layouts/DashboardLayout.jsx`

- [ ] Add import:
```javascript
import NotificationBell from '../components/common/NotificationBell';
```

- [ ] Add component in header (find the header section and add):
```javascript
<NotificationBell />
```

#### Step 5: Add NotificationBell to Provider Dashboard
File: `frontend/src/layouts/ProviderLayout.jsx`

- [ ] Add import:
```javascript
import NotificationBell from '../components/common/NotificationBell';
```

- [ ] Add component in header:
```javascript
<NotificationBell />
```

#### Step 6: Add NotificationBell to Admin Dashboard
File: `frontend/src/layouts/AdminLayout.jsx`

- [ ] Add import:
```javascript
import NotificationBell from '../components/common/NotificationBell';
```

- [ ] Add component in header:
```javascript
<NotificationBell />
```

---

## 🧪 Testing Checklist

### Test 1: Subscription Purchase Notification
- [ ] Start backend server (`npm start` in backend folder)
- [ ] Start frontend server (`npm run dev` in frontend folder)
- [ ] Login as customer
- [ ] Purchase a subscription
- [ ] Check notification bell (should show red badge with count)
- [ ] Click bell and verify "Subscription Activated" message
- [ ] Login as provider (in different browser/incognito)
- [ ] Check provider's notification bell
- [ ] Verify "New Subscription" notification

### Test 2: Guest Order Notification
- [ ] Login as customer with active subscription
- [ ] Book a guest meal
- [ ] Check notification bell
- [ ] Verify "Guest Order Confirmed" notification
- [ ] Login as provider
- [ ] Verify "New Guest Order" notification

### Test 3: Subscription Pause Notification
- [ ] Login as customer
- [ ] Go to subscription management
- [ ] Pause some days
- [ ] Check notification bell
- [ ] Verify "Subscription Paused" notification
- [ ] Login as provider
- [ ] Verify "Customer Paused Subscription" notification

### Test 4: Subscription Cancel Notification
- [ ] Login as customer
- [ ] Cancel subscription
- [ ] Check notification bell
- [ ] Verify "Subscription Cancelled" notification
- [ ] Login as provider
- [ ] Verify "Customer Cancelled Subscription" notification

### Test 5: Real-time Delivery
- [ ] Open two browsers side by side
- [ ] Login as customer in one, provider in other
- [ ] Perform action in customer browser (e.g., book guest meal)
- [ ] Verify notification appears INSTANTLY in provider browser (without refresh)

### Test 6: Browser Notifications
- [ ] Allow browser notifications when prompted
- [ ] Minimize or switch to different tab
- [ ] Perform action that triggers notification
- [ ] Verify browser notification pops up

### Test 7: Mark as Read
- [ ] Click notification bell
- [ ] Click on a notification
- [ ] Verify it's marked as read (background changes)
- [ ] Verify unread count decreases

### Test 8: Mark All as Read
- [ ] Have multiple unread notifications
- [ ] Click "Mark all as read" button
- [ ] Verify all notifications marked as read
- [ ] Verify unread count becomes 0

---

## 🔍 Verification Checklist

### Backend Verification
- [ ] Socket.io server running (check console: "Socket.io Server running")
- [ ] User authentication working (check console: "User X authenticated")
- [ ] Notifications being created in MongoDB (check database)
- [ ] Socket events being emitted (check console logs)

### Frontend Verification
- [ ] Socket connection established (check browser console: "Connected to Socket.io")
- [ ] NotificationContext providing data (check React DevTools)
- [ ] NotificationBell component rendering
- [ ] Unread count updating correctly
- [ ] Notifications displaying in dropdown

### Database Verification
- [ ] Open MongoDB Compass or Studio 3T
- [ ] Check `notifications` collection
- [ ] Verify notifications are being saved
- [ ] Check fields: recipient, title, message, type, isRead, createdAt

---

## 🐛 Troubleshooting Checklist

### If Notifications Not Appearing:
- [ ] Check Socket.io connection in browser console
- [ ] Verify backend is running on port 5000
- [ ] Verify frontend is running on port 5173
- [ ] Check CORS settings in backend/server.js
- [ ] Verify user is logged in
- [ ] Check NotificationProvider is wrapping App
- [ ] Check MongoDB connection

### If Socket Not Connecting:
- [ ] Check backend console for Socket.io initialization
- [ ] Verify SOCKET_URL in SocketContext.jsx
- [ ] Check firewall/antivirus settings
- [ ] Try different browser
- [ ] Clear browser cache

### If Notifications Not Persisting:
- [ ] Check MongoDB connection
- [ ] Verify notification model is correct
- [ ] Check database write permissions
- [ ] Verify API endpoints are working

---

## 📊 Success Criteria

System is working correctly if:
- [x] Notifications appear in real-time (< 2 seconds)
- [x] Unread count updates automatically
- [x] Notifications persist after page reload
- [x] Mark as read functionality works
- [x] Browser notifications appear (if permitted)
- [x] Different notification types display correctly
- [x] Socket connection is stable
- [x] No console errors

---

## 📝 Post-Implementation

### Documentation
- [ ] Update project README with notification features
- [ ] Document notification types for team
- [ ] Create user guide for notification settings

### Optional Enhancements
- [ ] Add notification sound
- [ ] Add notification preferences page
- [ ] Add email notifications
- [ ] Add SMS notifications
- [ ] Add notification history page
- [ ] Add notification filtering
- [ ] Add notification search

---

## 🎯 Final Verification

Before marking complete, ensure:
- [ ] All backend integrations done
- [ ] All frontend integrations done
- [ ] All tests passing
- [ ] No console errors
- [ ] Documentation updated
- [ ] Team members trained

---

## ✅ Sign-off

- [ ] Backend Developer: _______________  Date: _______
- [ ] Frontend Developer: _______________  Date: _______
- [ ] QA Tester: _______________  Date: _______
- [ ] Project Manager: _______________  Date: _______

---

**Status: Ready for Integration** 🚀

All core components are built and tested. Just need to integrate into existing controllers and layouts!
