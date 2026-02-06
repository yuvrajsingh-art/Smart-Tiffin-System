const express = require("express");
const router = express.Router();

const {
    getWalletDetails,
    addMoneyToWallet,
    getWalletBalance
} = require("../../controllers/customer/walletController");

const { protect, customerOnly } = require("../../middleware/authMiddleware.middleware");

// Wallet routes
router.get("/", protect, customerOnly, getWalletDetails);
router.get("/balance", protect, customerOnly, getWalletBalance);
router.post("/add-money", protect, customerOnly, addMoneyToWallet);

module.exports = router;