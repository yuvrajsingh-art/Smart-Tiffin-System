const express = require("express");
const router = express.Router();

const {
    getWalletDetails,
    addMoneyToWallet,
    getWalletBalance,
    setTransactionPin,
    updateWalletSettings,
    getWalletStats,
    getWalletStatement
} = require("../../controllers/customer/walletController");

const { protect, customerOnly } = require("../../middleware/authMiddleware.middleware");
const { validate } = require("../../middleware/validateInput");

// Wallet routes
router.get("/", protect, customerOnly, getWalletDetails);
router.get("/balance", protect, customerOnly, getWalletBalance);
router.get("/stats", protect, customerOnly, getWalletStats);
router.get("/statement", protect, customerOnly, getWalletStatement); // Added new route
router.post("/add-money", protect, customerOnly, validate('addMoney'), addMoneyToWallet);

// PIN & Settings routes
router.post("/set-pin", protect, customerOnly, setTransactionPin);
router.post("/update-settings", protect, customerOnly, updateWalletSettings);

module.exports = router;