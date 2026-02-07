const express = require("express");
const router = express.Router();

const {
    getWeeklyMenu,
    getTodayMenu,
    getPublicMenu
} = require("../../controllers/customer/menuController");

const { protect } = require("../../middleware/authMiddleware.middleware");
const { validate } = require("../../middleware/validateInput");

// Menu routes
router.get("/weekly", protect, getWeeklyMenu);
router.get("/today", protect, getTodayMenu);
router.get("/public/:providerId", getPublicMenu);
router.post("/toggle-skip", protect, validate('toggleMealSkip'), require("../../controllers/customer/menuController").toggleMealSkip);
router.get("/skipped-meals", protect, require("../../controllers/customer/menuController").getSkippedMeals);
router.get("/get-guest-meals", protect, require("../../controllers/customer/guestMealController").getTodayGuestMeals);
router.post("/book-guest", protect, require("../../controllers/customer/guestMealController").bookGuestMeal);

// NEW: Get all guest orders (with cancel info)
router.get("/guest-orders", protect, require("../../controllers/customer/guestMealController").getGuestMealOrders);

// NEW: Cancel guest meal with refund
router.post("/cancel-guest", protect, require("../../controllers/customer/guestMealController").cancelGuestMeal);

router.post("/customization", protect, require("../../controllers/customer/customizationController").updateMealCustomization);
router.get("/customization", protect, require("../../controllers/customer/customizationController").getCustomizations);

module.exports = router;