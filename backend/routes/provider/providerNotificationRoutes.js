const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware.middleware");

const {
    getProviderNotifications,
    markAsRead,
    markAllAsRead
} = require("../../controllers/provider/providerNotificationController");

// Get all notifications for provider
router.get("/", auth.protect, getProviderNotifications);

// Mark single notification as read
router.patch("/:id/read", auth.protect, markAsRead);

// Mark all notifications as read
router.patch("/mark-all-read", auth.protect, markAllAsRead);

module.exports = router;
