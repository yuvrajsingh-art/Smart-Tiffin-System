const CustomerWallet = require("../../models/customerWallet.model");
const Transaction = require("../../models/transaction.model");
const User = require("../../models/user.model");

// Get wallet details with balance and transactions
exports.getWalletDetails = async (req, res) => {
    try {
        const customerId = req.user._id;

        // Get wallet balance
        const wallet = await CustomerWallet.findOne({ customer: customerId });
        const balance = wallet ? wallet.balance : 0;

        // Get recent transactions (last 10)
        const transactions = await Transaction.find({ customer: customerId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('type amount description status createdAt');

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
            type: tx.type
        }));

        res.json({
            success: true,
            data: {
                balance,
                transactions: formattedTransactions
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch wallet details'
        });
    }
};

// Add money to wallet
exports.addMoneyToWallet = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount'
            });
        }

        // Find or create wallet
        let wallet = await CustomerWallet.findOne({ customer: customerId });
        if (!wallet) {
            wallet = new CustomerWallet({
                customer: customerId,
                balance: 0
            });
        }

        // Update balance
        wallet.balance += amount;
        await wallet.save();

        // Create transaction record
        const transaction = new Transaction({
            customer: customerId,
            type: 'credit',
            transactionType: 'Wallet Topup',
            amount,
            description: 'Money added to wallet',
            referenceId: `TOP-${Date.now()}`,
            status: 'Success'
        });
        await transaction.save();

        res.json({
            success: true,
            data: {
                newBalance: wallet.balance,
                amountAdded: amount,
                message: 'Money added successfully'
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add money'
        });
    }
};

// Get wallet balance only (for dashboard)
exports.getWalletBalance = async (customerId) => {
    try {
        const wallet = await CustomerWallet.findOne({ customer: customerId });
        const balance = wallet ? wallet.balance : 0;

        // Get recent addition (last 7 days)
        const recentTransaction = await Transaction.findOne({
            customer: customerId,
            type: "credit",
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }).sort({ createdAt: -1 });

        const recentAddition = recentTransaction ? recentTransaction.amount : 0;

        return {
            data: {
                balance,
                recentAddition
            }
        };

    } catch (error) {
        return {
            data: {
                balance: 0,
                recentAddition: 0
            }
        };
    }
};