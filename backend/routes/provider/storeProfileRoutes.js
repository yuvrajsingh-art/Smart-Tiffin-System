const express = require("express");
const router = express.Router();

const {
    getStoreProfile,
    updateStoreProfile,
    updateKitchenTimings,
    toggleVacationMode,
    updateDeliveryZone,
    getStoreStatus
} = require("../../controllers/provider/storeProfileController");

const { protect } = require("../../middleware/authMiddleware.middleware");

// Get store profile
router.get("/", protect, getStoreProfile);

// Update store profile (mess name, contact, cuisines, etc.)
router.put("/", protect, updateStoreProfile);

// Update kitchen timings
router.put("/timings", protect, updateKitchenTimings);

// Toggle vacation mode
router.put("/vacation", protect, toggleVacationMode);

// Update delivery zone
router.put("/delivery-zone", protect, updateDeliveryZone);

// Get store status (public route for customers)
router.get("/status/:providerId", getStoreStatus);

module.exports = router;