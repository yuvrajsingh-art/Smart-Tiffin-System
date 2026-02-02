const express = require("express");
const router = express.Router();

const {
    getWeeklyMenu,
    getTodayMenu,
    getPublicMenu
} = require("../../controllers/customer/menuController");

const { protect } = require("../../middleware/authMiddleware.middleware");

// Menu routes
router.get("/weekly", protect, getWeeklyMenu);
router.get("/today", protect, getTodayMenu);
router.get("/public/:providerId", getPublicMenu);

module.exports = router;