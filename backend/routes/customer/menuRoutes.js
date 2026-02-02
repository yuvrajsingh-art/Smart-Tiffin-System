const express = require("express");
const router = express.Router();

const {
    getWeeklyMenu,
    getTodayMenu
} = require("../../controllers/customer/menuController");

const { protect } = require("../../middleware/authMiddleware.middleware");

// Menu routes
router.get("/weekly", protect, getWeeklyMenu);
router.get("/today", protect, getTodayMenu);

module.exports = router;