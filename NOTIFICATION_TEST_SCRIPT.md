# 🧪 Notification System - Quick Test Script

## Test Karne Ka Tarika (Step by Step)

### Pre-requisites:
- ✅ Backend running on port 5000
- ✅ Frontend running on port 5173
- ✅ MongoDB connected
- ✅ At least 1 customer account
- ✅ At least 1 provider account

---

## Test 1: Basic Notification Display ✅

### Steps:
1. Open browser: `http://localhost:5173`
2. Login as customer
3. Look at top-right corner
4. **Expected:** Bell icon visible in header

### Success Criteria:
- [ ] Bell icon is visible
- [ ] No console errors
- [ ] Bell is clickable

---

## Test 2: Subscription Purchase Notification ✅

### Steps:
1. Login as customer
2. Go to "Find Mess"
3. Select a provider
4. Purchase a subscription
5. Wait 2 seconds
6. Look at bell icon

### Expected Results:
- [ ] Red badge appears on bell (showing "1")
- [ ] Click bell → Dropdown opens
- [ ] Notification shows: "Subscription Activated!"
- [ ] Notification has green success icon
- [ ] Time shows "Just now"

### Provider Side:
1. Open incognito/different browser
2. Login as provider
3. Look at bell icon

### Expected Results:
- [ ] Red badge appears (showing "1")
- [ ] Notification shows: "New Subscription"
- [ ] Shows customer name and plan details

---

## Test 3: Real-time Delivery ✅

### Setup:
1. Browser 1: Login as customer
2. Browser 2: Login as provider
3. Position browsers side by side

### Steps:
1. In Browser 1 (Customer): Purchase subscription
2. Watch Browser 2 (Provider) immediately

### Expected Results:
- [ ] Provider's bell badge updates INSTANTLY (< 2 seconds)
- [ ] No page refresh needed
- [ ] Notification appears in real-time

---

## Test 4: Guest Order Notification ✅

### Steps:
1. Login as customer (with active subscription)
2. Go to "Today's Menu"
3. Book a guest meal
4. Check bell icon

### Expected Results:
- [ ] New notification appears
- [ ] Shows "Guest Order Confirmed"
- [ ] Shows quantity and meal type
- [ ] Provider also gets notification

---

## Test 5: Mark as Read ✅

### Steps:
1. Have at least 1 unread notification
2. Click bell icon
3. Click on the notification

### Expected Results:
- [ ] Notification background changes (blue → white)
- [ ] Red badge count decreases by 1
- [ ] Blue dot disappears from notification

---

## Test 6: Mark All as Read ✅

### Steps:
1. Have multiple unread notifications
2. Click bell icon
3. Click "Mark all as read" button (checkmark icon)

### Expected Results:
- [ ] All notifications marked as read
- [ ] Red badge disappears
- [ ] All blue backgrounds change to white

---

## Test 7: Notification Persistence ✅

### Steps:
1. Have some notifications
2. Logout
3. Login again
4. Check bell icon

### Expected Results:
- [ ] Notifications still visible
- [ ] Unread count preserved
- [ ] Read/unread status maintained

---

## Test 8: Browser Notification ✅

### Steps:
1. Allow browser notifications when prompted
2. Minimize browser or switch to different tab
3. Have someone trigger a notification (e.g., purchase subscription)

### Expected Results:
- [ ] Browser notification pops up
- [ ] Shows notification title
- [ ] Shows notification message
- [ ] Clicking it opens the app

---

## Test 9: Socket Connection ✅

### Steps:
1. Open browser console (F12)
2. Login as customer
3. Look at console logs

### Expected Results:
- [ ] See: "✅ Connected to Socket.io Server"
- [ ] See: "📡 Transport: websocket" or "polling"
- [ ] No connection errors

---

## Test 10: Subscription Pause Notification ✅

### Steps:
1. Login as customer (with active subscription)
2. Go to "Manage Subscription"
3. Pause some days
4. Check bell icon

### Expected Results:
- [ ] New notification appears
- [ ] Shows "Subscription Paused"
- [ ] Shows number of days paused
- [ ] Provider gets notification too

---

## Test 11: Subscription Cancel Notification ✅

### Steps:
1. Login as customer (with active subscription)
2. Go to "Manage Subscription"
3. Cancel subscription
4. Check bell icon

### Expected Results:
- [ ] New notification appears
- [ ] Shows "Subscription Cancelled"
- [ ] Shows refund amount (if any)
- [ ] Provider gets notification

---

## Test 12: Mobile Responsiveness ✅

### Steps:
1. Open browser
2. Press F12 → Toggle device toolbar
3. Select mobile device (e.g., iPhone 12)
4. Login and check notifications

### Expected Results:
- [ ] Bell icon visible on mobile
- [ ] Dropdown opens properly
- [ ] Notifications readable
- [ ] Touch interactions work

---

## 🐛 Common Issues & Solutions:

### Issue 1: Bell Icon Not Visible
**Solution:**
- Check import statement in layout file
- Refresh browser (Ctrl + Shift + R)
- Check console for errors

### Issue 2: Notifications Not Appearing
**Solution:**
- Check Socket.io connection in console
- Verify backend is running
- Check MongoDB connection
- Restart both servers

### Issue 3: Socket Connection Error
**Solution:**
- Check CORS settings in backend
- Verify Socket.io URL in SocketContext
- Clear browser cache
- Try different browser

### Issue 4: Red Badge Not Updating
**Solution:**
- Check NotificationContext is wrapping App
- Verify Socket.io events are emitting
- Check browser console for errors

### Issue 5: Browser Notifications Not Working
**Solution:**
- Check browser notification permissions
- Allow notifications when prompted
- Check browser settings
- Try different browser

---

## ✅ Final Checklist:

Before marking complete, verify:
- [ ] All 12 tests passing
- [ ] No console errors
- [ ] Socket connection stable
- [ ] Notifications persist after reload
- [ ] Real-time delivery working
- [ ] Mobile responsive
- [ ] Browser notifications working
- [ ] Mark as read working
- [ ] Unread count accurate

---

## 📊 Performance Benchmarks:

Expected Performance:
- Notification delivery: < 1 second
- Socket connection: < 500ms
- UI update: < 100ms
- Database write: < 50ms

---

## 🎯 Success Criteria:

System is working if:
- ✅ All tests pass
- ✅ No errors in console
- ✅ Real-time delivery < 2 seconds
- ✅ UI is responsive
- ✅ Notifications persist
- ✅ Socket connection stable

---

## 📝 Test Results Template:

```
Date: _______________
Tester: _______________

Test 1: Basic Display          [ ] Pass [ ] Fail
Test 2: Purchase Notification  [ ] Pass [ ] Fail
Test 3: Real-time Delivery     [ ] Pass [ ] Fail
Test 4: Guest Order            [ ] Pass [ ] Fail
Test 5: Mark as Read           [ ] Pass [ ] Fail
Test 6: Mark All as Read       [ ] Pass [ ] Fail
Test 7: Persistence            [ ] Pass [ ] Fail
Test 8: Browser Notification   [ ] Pass [ ] Fail
Test 9: Socket Connection      [ ] Pass [ ] Fail
Test 10: Pause Notification    [ ] Pass [ ] Fail
Test 11: Cancel Notification   [ ] Pass [ ] Fail
Test 12: Mobile Responsive     [ ] Pass [ ] Fail

Overall Status: [ ] All Pass [ ] Some Fail

Notes:
_________________________________
_________________________________
_________________________________
```

---

**Happy Testing! 🚀**

Made with ❤️ for Smart Tiffin System
