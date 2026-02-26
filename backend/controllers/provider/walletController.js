const Wallet = require("../../models/wallet.model");
const Transaction = require("../../models/transaction.model");

// Get wallet summary (Total Earnings, Withdrawable Balance, etc.)
exports.getWalletSummary = async (req, res) => {
    try {
        const providerId = req.user._id;
        
        let wallet = await Wallet.findOne({ provider: providerId });
        
        // Create wallet if doesn't exist
        if (!wallet) {
            wallet = new Wallet({ 
                provider: providerId,
                totalEarnings: 0,
                withdrawableBalance: 0,
                lockedAmount: 0,
                monthlyChange: 0
            });
            await wallet.save();
        }
        
        // Calculate today's revenue from transactions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todayTransactions = await Transaction.find({
            provider: providerId,
            status: { $in: ['Success', 'Completed'] },
            createdAt: { $gte: today, $lt: tomorrow }
        });
        
        const todayRevenue = todayTransactions.reduce((sum, txn) => sum + Math.abs(txn.amount), 0);
        
        res.json({
            success: true,
            data: {
                totalEarnings: wallet.totalEarnings,
                withdrawableBalance: wallet.withdrawableBalance,
                lockedAmount: wallet.lockedAmount,
                monthlyChange: wallet.monthlyChange,
                todayRevenue: todayRevenue
            }
        });
        
    } catch (error) {
        console.error('Error in getWalletSummary:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch wallet summary',
            error: error.message
        });
    }
};

// Get transaction history with pagination
exports.getTransactionHistory = async (req, res) => {
    try {
        const providerId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const transactions = await Transaction.find({ provider: providerId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('orderId', 'orderNumber')
            .populate('subscriptionId', 'planName');
            
        const totalTransactions = await Transaction.countDocuments({ provider: providerId });
        
        const formattedTransactions = transactions.map(transaction => ({
            _id: transaction._id,
            transactionType: transaction.transactionType,
            referenceId: transaction.referenceId,
            amount: transaction.amount,
            status: transaction.status,
            description: transaction.description,
            date: transaction.createdAt,
            orderId: transaction.orderId,
            subscriptionId: transaction.subscriptionId
        }));
        
        res.json({
            success: true,
            data: formattedTransactions,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalTransactions / limit),
                totalTransactions,
                hasNext: page < Math.ceil(totalTransactions / limit),
                hasPrev: page > 1
            }
        });
        
    } catch (error) {
        console.error('Error in getTransactionHistory:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transaction history',
            error: error.message
        });
    }
};

// Withdraw money to bank
exports.withdrawToBank = async (req, res) => {
    try {
        const providerId = req.user._id;
        const { amount, bankDetails } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid withdrawal amount'
            });
        }
        
        const wallet = await Wallet.findOne({ provider: providerId });
        
        if (!wallet || wallet.withdrawableBalance < amount) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient withdrawable balance'
            });
        }
        
        // Create withdrawal transaction
        const transaction = new Transaction({
            provider: providerId,
            transactionType: "Payout to Bank",
            referenceId: `WD_${Date.now()}`,
            amount: -amount, // negative for withdrawal
            status: "Processed",
            description: `Withdrawal to ${bankDetails.bankName}`,
            bankDetails
        });
        
        await transaction.save();
        
        // Update wallet balance
        wallet.withdrawableBalance -= amount;
        await wallet.save();
        
        res.json({
            success: true,
            message: 'Withdrawal request processed successfully',
            data: {
                transactionId: transaction._id,
                amount: amount,
                newBalance: wallet.withdrawableBalance
            }
        });
        
    } catch (error) {
        console.error('Error in withdrawToBank:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process withdrawal',
            error: error.message
        });
    }
};

// Add earnings (called when order is completed)
exports.addEarnings = async (req, res) => {
    try {
        const providerId = req.user._id;
        const { amount, orderId, subscriptionId, description } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid earning amount'
            });
        }
        
        let wallet = await Wallet.findOne({ provider: providerId });
        
        if (!wallet) {
            wallet = new Wallet({ 
                provider: providerId,
                totalEarnings: 0,
                withdrawableBalance: 0,
                lockedAmount: 5000
            });
        }
        
        // Create earning transaction
        const transaction = new Transaction({
            provider: providerId,
            transactionType: "Order Payment",
            referenceId: orderId ? `Order #ST-${orderId.toString().slice(-5)}` : `REF_${Date.now()}`,
            amount: amount,
            status: "Success",
            description: description || "Order payment received",
            orderId,
            subscriptionId
        });
        
        await transaction.save();
        
        // Update wallet
        wallet.totalEarnings += amount;
        wallet.withdrawableBalance += amount;
        await wallet.save();
        
        res.json({
            success: true,
            message: 'Earnings added successfully',
            data: {
                transactionId: transaction._id,
                newTotalEarnings: wallet.totalEarnings,
                newWithdrawableBalance: wallet.withdrawableBalance
            }
        });
        
    } catch (error) {
        console.error('Error in addEarnings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add earnings',
            error: error.message
        });
    }
};

// Get single transaction details
exports.getTransactionById = async (req, res) => {
    try {
        const providerId = req.user._id;
        const transactionId = req.params.id;
        
        const transaction = await Transaction.findOne({
            _id: transactionId,
            provider: providerId
        }).populate('orderId').populate('subscriptionId');
        
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }
        
        res.json({
            success: true,
            data: transaction
        });
        
    } catch (error) {
        console.error('Error in getTransactionById:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transaction details',
            error: error.message
        });
    }
};