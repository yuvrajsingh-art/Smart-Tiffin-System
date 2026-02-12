const express = require("express");
const router = express.Router();

const {
    getWalletSummary,
    getTransactionHistory,
    withdrawToBank,
    addEarnings,
    getTransactionById
} = require("../../controllers/provider/walletController");

const { protect } = require("../../middleware/authMiddleware.middleware");
const { isVerifiedProvider } = require("../../middlewares/isVerifiedProvider");

// Get wallet summary (Total Earnings, Withdrawable Balance)
router.get("/summary", protect, isVerifiedProvider, getWalletSummary);

// Get transaction history with pagination
router.get("/transactions", protect, isVerifiedProvider, getTransactionHistory);

// Get single transaction details
router.get("/transactions/:id", protect, isVerifiedProvider, getTransactionById);

// Withdraw money to bank
router.post("/withdraw", protect, isVerifiedProvider, withdrawToBank);

// Add earnings (internal use - when order completed)
router.post("/add-earnings", protect, addEarnings);

module.exports = router;