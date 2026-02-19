# Track Order System - Dynamic Delivery Time & Activity Log

## Overview
Updated the Track Order system to calculate delivery times dynamically based on meal type and time, with full activity tracking visible to Customer, Provider, and Admin.

## Key Changes

### 1. Dynamic Delivery Time Calculation
- **Lunch Orders (9 AM - 11 AM)**: 2-hour delivery window, delivered by 11:00 AM
- **Dinner Orders (3 PM - 7 PM)**: 4-hour delivery window, delivered by 7:00 PM
- Automatically calculates based on `mealType` and order time

### 2. Activity Log System
- Every status change is logged with:
  - Status name
  - Timestamp
  - Updated by (User ID)
  - Updated by role (customer/provider/admin)
  - Optional note
- Visible to all roles (Customer, Provider, Admin)

### 3. Provider Order Status Control
- Providers can now update order status via `/api/provider-track/:orderId/status`
- Available actions:
  - Mark as Ready (`prepared`)
  - Mark as Dispatched (`out_for_delivery`)
  - Mark as Delivered (`delivered`)

## Files Modified

### Backend

1. **backend/models/order.model.js**
   - Added `activityLog` array field to track all status changes

2. **backend/utils/orderHelper.js**
   - Added `calculateDeliveryTime(mealType, orderTime)` function
   - Returns estimated delivery time based on meal type

3. **backend/controllers/customer/trackController.js**
   - Updated `getLiveTracking` to use dynamic delivery time calculation
   - Enhanced `updateOrderStatus` to add activity log entries
   - Updated test order functions to include `estimatedDeliveryTime` and `activityLog`

4. **backend/controllers/provider/track.controller.js**
   - Added `updateOrderStatus` function for providers
   - Updated `getOrderTracking` to include activity log

5. **backend/routes/provider/trackRoutes.js**
   - Added `PUT /:orderId/status` route for status updates

6. **backend/controllers/admin/order.controller.js**
   - Enhanced `updateOrderStatus` to add activity log entries
   - Updated `getOrderById` to populate and return activity log

### Frontend

1. **frontend/src/components/customer/LiveTracker.jsx**
   - Added `getDeliveryTime()` function to show 11:00 AM or 7:00 PM based on current hour

2. **frontend/src/pages/customer/Track.jsx**
   - Added `getDeliveryTimeDisplay()` to show actual delivery time
   - Added Activity Log section showing all status changes with timestamps
   - Displays who updated the status and when

3. **frontend/src/pages/Provider/DeliveryStatus.jsx**
   - Updated `updateOrderStatus` to use new `/provider-track/:orderId/status` endpoint
   - Sends status and note with each update

## API Endpoints

### Customer
- `GET /api/customer/track/live` - Get live tracking with activity log
- `PUT /api/customer/track/:orderId/status` - Update order status (testing)

### Provider
- `GET /api/provider-track/:orderId` - Get order tracking details
- `PUT /api/provider-track/:orderId/status` - Update order status
  ```json
  {
    "status": "prepared|out_for_delivery|delivered",
    "note": "Optional note"
  }
  ```

### Admin
- `GET /api/admin/orders/:id` - Get order details with activity log
- `PUT /api/admin/orders/:id/status` - Update order status
  ```json
  {
    "status": "confirmed|cooking|prepared|out_for_delivery|delivered",
    "note": "Optional note"
  }
  ```

## Delivery Time Logic

```javascript
// Lunch: 9 AM - 11 AM (2 hours)
if (mealType === 'lunch' || hour < 15) {
    deliveryTime.setHours(11, 0, 0, 0);
}
// Dinner: 3 PM - 7 PM (4 hours)
else {
    deliveryTime.setHours(19, 0, 0, 0);
}
```

## Activity Log Structure

```javascript
{
  status: "cooking",
  timestamp: "2024-01-15T10:30:00Z",
  updatedBy: "userId",
  updatedByRole: "provider",
  note: "Started cooking the order"
}
```

## Testing

1. **Create Test Order**: Use "Create Test Order" button on Track page
2. **Update Status**: 
   - Provider: Use Delivery Status page
   - Admin: Use Order Management page
   - Customer: Use "Advance Test Status" button (testing only)
3. **View Activity**: Check Track page for complete activity log

## Benefits

✅ **Realistic Delivery Times**: Shows actual delivery time (11 AM or 7 PM) instead of countdown
✅ **Full Transparency**: All status changes visible to everyone
✅ **Provider Control**: Providers can update order status in real-time
✅ **Audit Trail**: Complete history of who changed what and when
✅ **Better UX**: Customers know exactly when to expect delivery
