const express = require("express");
const router = express.Router();

const {
    getWalletDetails,
    addMoneyToWallet,
    getWalletBalance
} = require("../../controllers/customer/walletController");

const { protect } = require("../../middleware/authMiddleware.middleware");

// Wallet routes
router.get("/", protect, getWalletDetails);
router.get("/balance", protect, getWalletBalance);
router.post("/add-money", protect, addMoneyToWallet);

module.exports = router;