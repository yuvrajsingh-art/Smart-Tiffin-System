const express = require("express");
const router = express.Router();

const { createDelivery, updateDeliveryStatus, updateMultipleDeliveries, cancelDelivery, getCustomerDeliveries, getProviderDeliveries, getAllDeliveries, } = require("../controllers/deliverycontroller");

// auth middleware
const { protect, authorizeRoles } = require("../middleware/authMiddleware.middleware");


//ADMIN ROUTES

// Get all deliveries
router.get("/all", protect, authorizeRoles("admin"), getAllDeliveries);

// Create delivery (manual)
router.post("/create", protect, authorizeRoles("admin"), createDelivery);

// Update multiple deliveries status
router.put("/bulk-update", protect, authorizeRoles("admin"), updateMultipleDeliveries);


//  PROVIDER ROUTES

// Provider deliveries
router.get("/provider", protect, authorizeRoles("provider"), getProviderDeliveries);

// Provider update delivery status
router.put("/status/:id", protect, authorizeRoles("provider"), updateDeliveryStatus);

// Provider cancel delivery
router.put("/cancel/:id", protect, authorizeRoles("provider"), cancelDelivery);


// CUSTOMER ROUTES

// Customer deliveries (tracking)
router.get("/customer", protect, authorizeRoles("customer"), getCustomerDeliveries);

module.exports = router;
