# 🐛 Notification System - Debugging Guide

## Problem: Notifications nahi aa rahe hain

### Step 1: Check Backend Logs

**Backend start karo aur ye logs dhundo:**

```bash
cd backend
npm start
```

**Expected logs:**
```
✅ MongoDB Connected
🔌 New Client Connected: [socket-id]
✅ User [user-id] authenticated and joined room user_[user-id]
```

**Agar ye nahi dikhe to:**
- MongoDB running hai?
- Socket.io properly initialized hai?

---

### Step 2: Check Frontend Console

**Browser console (F12) me ye logs dhundo:**

```
✅ Connected to Socket.io Server
🔌 Socket connected, authenticating user: [user-id]
🔔 Fetching notifications for user: [user-object]
🔔 Endpoint: /api/customer/notifications
🔔 Response: {success: true, data: {...}}
```

**Agar ye nahi dikhe to:**
- Socket connection fail ho raha hai
- User login nahi hai
- API endpoint wrong hai

---

### Step 3: Test Database Directly

**Backend folder me ye command run karo:**

```bash
node testNotification.js
```

**Expected output:**
```
✅ MongoDB Connected
✅ Found customer: [name] [id]
✅ Test notification created: [notification-id]
📊 Total notifications for [name]: 1
```

**Agar error aaye:**
- MongoDB connection check karo
- User model check karo
- Notification model check karo

---

### Step 4: Check API Endpoint

**Browser me ya Postman me test karo:**

```
GET http://localhost:5000/api/customer/notifications
Headers: Authorization: Bearer [your-token]
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "...",
        "title": "Test",
        "message": "...",
        "type": "Info",
        "isRead": false,
        "createdAt": "..."
      }
    ]
  }
}
```

**Agar 401 error:**
- Token expired hai
- User login nahi hai

**Agar empty array:**
- Database me notifications nahi hain
- User ID wrong hai

---

### Step 5: Test Real-time Notification

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Test Script):**
```bash
cd backend
node testNotification.js
```

**Browser Console:**
- Dekho kya `🔔 NEW NOTIFICATION RECEIVED` log aata hai
- Agar nahi aata to Socket.io emit nahi ho raha

---

### Step 6: Check Subscription Controller

**File:** `backend/controllers/customer/subscriptionController.js`

**Line 650 ke aas paas dhundo:**
```javascript
// Send notifications
await notifySubscriptionPurchased(customerId, providerUserId, planName, totalAmount);
```

**Agar ye line nahi hai:**
- Notification call add nahi kiya gaya
- Import statement missing hai

---

### Step 7: Check NotificationContext

**File:** `frontend/src/App.jsx`

**Ye line honi chahiye:**
```javascript
<NotificationProvider>
  <BrowserRouter>
    ...
  </BrowserRouter>
</NotificationProvider>
```

**Agar nahi hai:**
- NotificationProvider wrap nahi kiya
- Context available nahi hai

---

## Common Issues & Solutions:

### Issue 1: "Cannot read property 'notifications' of undefined"
**Solution:**
- NotificationProvider App.jsx me add karo
- Import statement check karo

### Issue 2: Socket not connecting
**Solution:**
- Backend running hai? (Port 5000)
- CORS settings check karo
- Socket URL check karo in SocketContext.jsx

### Issue 3: Notifications fetch ho rahe but display nahi ho rahe
**Solution:**
- NotificationBell component import kiya?
- Header me add kiya?
- Console me notifications array check karo

### Issue 4: Real-time notifications nahi aa rahe
**Solution:**
- Socket authentication check karo
- User room join ho raha hai?
- Backend logs me "Emitting notification" dikhe?

### Issue 5: Old/dummy notifications dikh rahe hain
**Solution:**
- Database clear karo:
```javascript
// MongoDB shell
use smart-tiffin
db.notifications.deleteMany({})
```

---

## Quick Fix Commands:

### Clear all notifications:
```bash
# MongoDB shell
mongosh
use smart-tiffin
db.notifications.deleteMany({})
```

### Restart everything:
```bash
# Terminal 1
cd backend
npm start

# Terminal 2
cd frontend
npm run dev
```

### Check MongoDB:
```bash
mongosh
use smart-tiffin
db.notifications.find().pretty()
db.users.find({role: 'customer'}).pretty()
```

---

## Debug Checklist:

- [ ] Backend running (Port 5000)
- [ ] Frontend running (Port 5173)
- [ ] MongoDB connected
- [ ] Socket.io initialized
- [ ] User logged in
- [ ] NotificationProvider in App.jsx
- [ ] NotificationBell in header
- [ ] Notification calls in controllers
- [ ] Socket authentication working
- [ ] API endpoint responding

---

## Still Not Working?

### Run this complete test:

1. **Clear database:**
```bash
mongosh
use smart-tiffin
db.notifications.deleteMany({})
exit
```

2. **Restart backend:**
```bash
cd backend
npm start
```

3. **Create test notification:**
```bash
cd backend
node testNotification.js
```

4. **Check frontend:**
- Open browser
- Login as customer
- Open console (F12)
- Look for logs starting with 🔔
- Check if notification appears in bell

5. **If still not working, check:**
- Browser console for errors
- Backend console for errors
- Network tab for failed requests
- MongoDB for data

---

## Contact for Help:

If nothing works, provide these details:
1. Backend console logs
2. Frontend console logs
3. MongoDB data: `db.notifications.find()`
4. User data: `db.users.findOne({role: 'customer'})`
5. Error messages (if any)

---

Made with ❤️ for Smart Tiffin System
