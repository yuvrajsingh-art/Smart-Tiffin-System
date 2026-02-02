const express = require("express");
const router = express.Router();

const {
    getMealsHistory,
    getWalletHistory,
    getPlansHistory
} = require("../../controllers/customer/historyController");

const { protect } = require("../../middleware/authMiddleware.middleware");

// History routes
router.get("/meals", protect, getMealsHistory);
router.get("/wallet", protect, getWalletHistory);
router.get("/plans", protect, getPlansHistory);

module.exports = router;