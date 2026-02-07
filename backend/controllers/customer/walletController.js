const CustomerWallet = require("../../models/customerWallet.model");
const Transaction = require("../../models/transaction.model");
const User = require("../../models/user.model");
const DummyBank = require("../../models/dummyBank.model");
const logger = require("../../utils/logger");

/**
 * Helper to get or create the shared Master Bank Account
 * This is the central repository for all test funds (1 Crore)
 */
const getMasterBank = async () => {
    let masterBank = await DummyBank.findOne({ isMaster: true });
    if (!masterBank) {
        masterBank = new DummyBank({
            user: "690000000000000000000000", // System Dummy ID
            bankName: "Smart Tiffin Treasury",
            accountNumber: "STB-MASTER-001",
            vpa: "treasury@stbank",
            balance: 10000000, // 1 Crore
            isMaster: true,
            isPrimary: true,
            masterUTR: "STB999888777"
        });
        await masterBank.save();
    }
    return masterBank;
};

// Utility function to get balance (used by other controllers)
const fetchBalance = async (customerId) => {
    try {
        const wallet = await CustomerWallet.findOne({ customer: customerId });
        const balance = wallet ? wallet.balance : 0;

        // Get recent addition (last 7 days)
        const recentTransaction = await Transaction.findOne({
            customer: customerId,
            type: "credit",
            transactionType: "Wallet Topup",
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }).sort({ createdAt: -1 });

        const recentAddition = recentTransaction ? recentTransaction.amount : 0;

        return {
            success: true,
            data: {
                balance,
                recentAddition
            }
        };
    } catch (error) {
        logger.error("fetchBalance Error:", error);
        return {
            success: false,
            data: { balance: 0, recentAddition: 0 }
        };
    }
};

exports.fetchBalance = fetchBalance;

// Get wallet details with balance and transactions
exports.getWalletDetails = async (req, res) => {
    try {
        const customerId = req.user._id;

        // Get wallet balance
        const balanceData = await fetchBalance(customerId);
        const balance = balanceData.data.balance;

        // Get Master Bank details for the user
        const masterBank = await getMasterBank();

        // Get recent transactions (last 10)
        const transactions = await Transaction.find({ customer: customerId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('type amount description status createdAt bankDetails');

        // Format transactions for frontend
        const formattedTransactions = transactions.map(tx => ({
            id: tx._id,
            title: tx.description || (tx.type === 'credit' ? 'Money Added' : 'Payment'),
            date: tx.createdAt.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            }),
            amount: `${tx.type === 'credit' ? '+' : '-'}₹${tx.amount.toFixed(2)}`,
            type: tx.type,
            // Show Source: Bank Name OR Wallet
            source: tx.bankDetails?.bankName
                ? `via ${tx.bankDetails.bankName}`
                : (tx.transactionType === 'Wallet Topup' ? 'via Bank Transfer' : 'via Wallet'),
            bankName: tx.bankDetails?.bankName || masterBank.bankName
        }));

        res.json({
            success: true,
            data: {
                balance,
                bank: {
                    name: masterBank.bankName,
                    accountNumber: masterBank.accountNumber,
                    balance: masterBank.balance,
                    vpa: masterBank.vpa
                },
                transactions: formattedTransactions
            }
        });

    } catch (error) {
        logger.error("getWalletDetails Error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch wallet details'
        });
    }
};

// Add money to wallet (Always pulls from Master Bank)
exports.addMoneyToWallet = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { amount, transactionId } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount'
            });
        }

        // 1. Deduct from Master Bank (Central Treasury)
        const masterBank = await getMasterBank();

        // 2. Validate UTR (Fetched from DB)
        if (transactionId !== masterBank.masterUTR) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Transaction ID. Please use the official Master UTR for testing.'
            });
        }

        if (masterBank.balance < amount) {
            return res.status(400).json({
                success: false,
                message: "Treasury balance low. Please contact admin."
            });
        }

        // Validating 12-digit UTR logic remains for realistic feel
        if (!transactionId || transactionId.length !== 12) {
            return res.status(400).json({
                success: false,
                message: 'A valid 12-digit Transaction ID (UTR) is required for verification.'
            });
        }

        // Deduct from treasury
        masterBank.balance -= amount;
        await masterBank.save();

        // 2. Find or create user wallet
        let wallet = await CustomerWallet.findOne({ customer: customerId });
        if (!wallet) {
            wallet = new CustomerWallet({
                customer: customerId,
                balance: 0
            });
        }

        // Update wallet balance and total stats
        wallet.balance += amount;
        wallet.totalAdded = (wallet.totalAdded || 0) + amount;
        await wallet.save();

        // 3. Create transaction record for wallet topup
        const transaction = new Transaction({
            customer: customerId,
            type: 'credit',
            transactionType: 'Wallet Topup',
            amount,
            description: `Top-up from ${masterBank.bankName}`,
            referenceId: transactionId || `TOP-${Date.now()}`,
            status: 'Success',
            bankDetails: {
                accountNumber: masterBank.accountNumber,
                bankName: masterBank.bankName
            }
        });
        await transaction.save();

        res.json({
            success: true,
            data: {
                newBalance: wallet.balance,
                amountAdded: amount,
                message: `Money added successfully from ${masterBank.bankName}.`
            }
        });

    } catch (error) {
        logger.error("addMoneyToWallet Error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to add money'
        });
    }
};

// Route handler for fetching balance
exports.getWalletBalance = async (req, res) => {
    const customerId = req.user._id;
    const result = await fetchBalance(customerId);

    if (result.success) {
        res.json(result);
    } else {
        res.status(500).json(result);
    }
};