const CustomerWallet = require("../../models/customerWallet.model");
const Transaction = require("../../models/transaction.model");
const User = require("../../models/user.model");
const DummyBank = require("../../models/dummyBank.model");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const logger = require("../../utils/logger");
const bcrypt = require("bcryptjs");

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
            .select('type transactionType amount description status createdAt bankDetails referenceId');

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

        // Get or create wallet to ensure it exists
        let wallet = await CustomerWallet.findOne({ customer: customerId });
        if (!wallet) {
            wallet = await CustomerWallet.create({ customer: customerId, balance: 0 });
        }

        res.json({
            success: true,
            data: {
                balance: wallet.balance,
                isPinSet: !!wallet.transactionPin,
                settings: wallet.settings || {
                    autoRecharge: false,
                    thresholdAmount: 200,
                    rechargeAmount: 500,
                    lowBalanceAlert: true
                },
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
        if (!transactionId || transactionId !== masterBank.masterUTR) {
            return res.status(400).json({
                success: false,
                message: `Invalid Transaction ID. Use ${masterBank.masterUTR} for testing.`
            });
        }

        if (masterBank.balance < amount) {
            return res.status(400).json({
                success: false,
                message: "Treasury balance low. Please contact admin."
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

        // Sync with User model walletBalance
        await User.findByIdAndUpdate(customerId, { walletBalance: wallet.balance });

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

// Set or Update Transaction PIN
exports.setTransactionPin = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { pin, oldPin } = req.body;

        if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
            return res.status(400).json({
                success: false,
                message: 'PIN must be 4 digits'
            });
        }

        let wallet = await CustomerWallet.findOne({ customer: customerId });
        if (!wallet) {
            wallet = new CustomerWallet({ customer: customerId, balance: 0 });
        }

        // If PIN already exists, require old PIN
        if (wallet.transactionPin && !oldPin) {
            return res.status(400).json({
                success: false,
                message: 'Old PIN is required to change PIN'
            });
        }

        if (wallet.transactionPin && oldPin) {
            const isMatch = await bcrypt.compare(oldPin, wallet.transactionPin);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Incorrect old PIN'
                });
            }
        }

        // Hash and save new PIN
        const salt = await bcrypt.genSalt(10);
        wallet.transactionPin = await bcrypt.hash(pin, salt);
        await wallet.save();

        res.json({
            success: true,
            message: wallet.transactionPin ? 'PIN updated successfully' : 'PIN set successfully'
        });

    } catch (error) {
        logger.error("setTransactionPin Error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to set PIN'
        });
    }
};

// Update Wallet Settings
exports.updateWalletSettings = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { autoRecharge, thresholdAmount, rechargeAmount, lowBalanceAlert } = req.body;

        const wallet = await CustomerWallet.findOneAndUpdate(
            { customer: customerId },
            {
                $set: {
                    'settings.autoRecharge': autoRecharge,
                    'settings.thresholdAmount': thresholdAmount,
                    'settings.rechargeAmount': rechargeAmount,
                    'settings.lowBalanceAlert': lowBalanceAlert
                }
            },
            { new: true, upsert: true }
        );

        res.json({
            success: true,
            data: wallet.settings,
            message: 'Settings updated successfully'
        });

    } catch (error) {
        logger.error("updateWalletSettings Error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to update settings'
        });
    }
};

// Verify PIN (Internal or for specific actions)
exports.verifyPin = async (customerId, pin) => {
    try {
        const wallet = await CustomerWallet.findOne({ customer: customerId });
        if (!wallet || !wallet.transactionPin) {
            return { success: false, message: 'PIN not set' };
        }

        const isMatch = await bcrypt.compare(pin, wallet.transactionPin);
        return { success: isMatch, message: isMatch ? 'PIN verified' : 'Incorrect PIN' };
    } catch (error) {
        logger.error("verifyPin Error:", error);
        return { success: false, message: 'Verification failed' };
    }
};

// Get Wallet Stats for Analytics
exports.getWalletStats = async (req, res) => {
    try {
        const customerId = req.user._id;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // Aggregate debit transactions by date
        const stats = await Transaction.aggregate([
            {
                $match: {
                    customer: customerId,
                    type: 'debit',
                    status: 'Success',
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalSpent: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Calculate total savings (Mock logic: 10% of total debit is saved via subscriptions)
        const totalDebit = stats.reduce((acc, curr) => acc + curr.totalSpent, 0);
        const estimatedSavings = Math.round(totalDebit * 0.1);

        // Map to ensure all 7 days are present even with 0 spending
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const stat = stats.find(s => s._id === dateStr);
            last7Days.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                amount: stat ? stat.totalSpent : 0
            });
        }

        res.json({
            success: true,
            data: {
                chartData: last7Days,
                totalSavings: estimatedSavings,
                totalSpent: totalDebit
            }
        });

    } catch (error) {
        logger.error("getWalletStats Error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch spending stats'
        });
    }
};

// Helper to debit wallet with auto-recharge support
exports.debitWallet = async (customerId, amount, description, referenceId, transactionType) => {
    try {
        let wallet = await CustomerWallet.findOne({ customer: customerId });
        if (!wallet) {
            wallet = new CustomerWallet({ customer: customerId, balance: 0 });
            await wallet.save();
        }

        // Check for Auto-Recharge before debiting
        if (wallet.settings?.autoRecharge && wallet.balance < wallet.settings.thresholdAmount) {
            const rechargeAmt = wallet.settings.rechargeAmount || 500;
            const masterBank = await getMasterBank();

            if (masterBank.balance >= rechargeAmt) {
                // Perform Auto-Topup
                masterBank.balance -= rechargeAmt;
                await masterBank.save();

                wallet.balance += rechargeAmt;
                wallet.totalAdded = (wallet.totalAdded || 0) + rechargeAmt;

                // Sync with User model
                await User.findByIdAndUpdate(customerId, { walletBalance: wallet.balance });

                // Create Topup Transaction record
                const topupTx = new Transaction({
                    customer: customerId,
                    type: 'credit',
                    transactionType: 'Wallet Topup',
                    amount: rechargeAmt,
                    description: 'Auto-recharge Triggered',
                    referenceId: `AUTO-${Date.now()}`,
                    status: 'Success',
                    bankDetails: {
                        accountNumber: masterBank.accountNumber,
                        bankName: masterBank.bankName
                    }
                });
                await topupTx.save();
                logger.info(`Auto-recharge triggered for user ${customerId}: ₹${rechargeAmt}`);
            }
        }

        // Check if sufficient balance after potential auto-recharge
        if (wallet.balance < amount) {
            return { success: false, message: 'Insufficient wallet balance' };
        }

        // Perform Debit
        wallet.balance -= amount;
        await wallet.save();

        // Sync with User model walletBalance
        await User.findByIdAndUpdate(customerId, { walletBalance: wallet.balance });

        // Create Debit Transaction
        const transaction = new Transaction({
            customer: customerId,
            type: 'debit',
            transactionType: transactionType || 'Order Payment',
            amount,
            description,
            referenceId,
            status: 'Success'
        });
        await transaction.save();

        return { success: true, newBalance: wallet.balance };

    } catch (error) {
        logger.error("debitWallet Error:", error);
        return { success: false, message: 'Transaction failed' };
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

/**
 * Export Wallet Statement (CSV/JSON/PDF)
 */
exports.getWalletStatement = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { format = 'csv' } = req.query;

        const transactions = await Transaction.find({ customer: customerId })
            .sort({ createdAt: -1 })
            .lean();

        if (format === 'json') {
            return res.json({
                success: true,
                data: transactions
            });
        }

        if (format === 'pdf') {
            const user = await User.findById(customerId);
            const wallet = await CustomerWallet.findOne({ customer: customerId });

            const doc = new PDFDocument({ margin: 40, size: 'A4' });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=wallet-statement-${Date.now()}.pdf`);
            doc.pipe(res);

            // --- HEADER & BRANDING ---
            // Dark Header Bar
            doc.rect(0, 0, 612, 120).fill('#2D241E');

            doc.fillColor('#FFFFFF')
                .fontSize(24)
                .font('Helvetica-Bold')
                .text('SMART TIFFIN', 40, 45);

            doc.fontSize(10)
                .font('Helvetica')
                .text('PREMIUM WALLET STATEMENT', 40, 75, { characterSpacing: 2 });

            doc.fontSize(8)
                .text('Generated on: ' + new Date().toLocaleString(), 400, 50, { align: 'right' })
                .text('Support: hello@smarttiffin.com', 400, 65, { align: 'right' });

            // --- USER DETAILS ---
            doc.fillColor('#2D241E')
                .fontSize(14)
                .font('Helvetica-Bold')
                .text('Customer Details', 40, 150);

            doc.moveTo(40, 168).lineTo(200, 168).strokeColor('#EEEEEE').stroke();

            doc.fontSize(10)
                .font('Helvetica')
                .fillColor('#5C4D42')
                .text('Name:', 40, 185)
                .fillColor('#2D241E')
                .font('Helvetica-Bold')
                .text(user.fullName, 100, 185);

            doc.font('Helvetica')
                .fillColor('#5C4D42')
                .text('Email:', 40, 200)
                .fillColor('#2D241E')
                .text(user.email, 100, 200);

            doc.font('Helvetica')
                .fillColor('#5C4D42')
                .text('Wallet ID:', 40, 215)
                .fillColor('#2D241E')
                .text(wallet?._id.toString() || 'N/A', 100, 215);

            // --- SUMMARY CARDS ---
            const totalCredit = transactions.filter(t => t.type === 'credit' && t.status === 'Success').reduce((sum, t) => sum + t.amount, 0);
            const totalDebit = transactions.filter(t => t.type === 'debit' && t.status === 'Success').reduce((sum, t) => sum + t.amount, 0);

            // Summary Boxes
            const drawSummaryBox = (label, value, x, color) => {
                doc.rect(x, 250, 110, 60).fill('#F9FAFB');
                doc.fillColor(color).fontSize(8).font('Helvetica-Bold').text(label, x + 10, 262);
                doc.fillColor('#2D241E').fontSize(14).text('₹' + value.toLocaleString(), x + 10, 278);
            };

            drawSummaryBox('TOTAL CREDITS', totalCredit, 40, '#10B981');
            drawSummaryBox('TOTAL DEBITS', totalDebit, 160, '#EF4444');
            drawSummaryBox('CURRENT BALANCE', wallet?.balance || 0, 280, '#2D241E');
            drawSummaryBox('TOTAL SAVINGS', totalDebit * 0.05, 400, '#F59E0B'); // Estimated savings

            // --- TRANSACTION TABLE ---
            doc.fillColor('#2D241E')
                .fontSize(14)
                .font('Helvetica-Bold')
                .text('Recent Activity', 40, 340);

            const tableTop = 370;
            const itemHeight = 30;

            // Table Header
            doc.rect(40, tableTop, 510, 25).fill('#F3F4F6');
            doc.fillColor('#5C4D42').fontSize(8).font('Helvetica-Bold');
            doc.text('DATE', 50, tableTop + 10);
            doc.text('DESCRIPTION', 130, tableTop + 10);
            doc.text('TYPE', 330, tableTop + 10);
            doc.text('AMOUNT', 420, tableTop + 10);
            doc.text('STATUS', 490, tableTop + 10);

            let currentY = tableTop + 25;

            transactions.slice(0, 15).forEach((tx, i) => {
                if (i % 2 === 0) {
                    doc.rect(40, currentY, 510, itemHeight).fill('#FFFFFF');
                } else {
                    doc.rect(40, currentY, 510, itemHeight).fill('#FAFAFA');
                }

                doc.fillColor('#2D241E').fontSize(8).font('Helvetica');
                doc.text(new Date(tx.createdAt).toLocaleDateString(), 50, currentY + 11);

                const desc = tx.description || tx.transactionType || 'Transaction';
                doc.text(desc.length > 40 ? desc.substring(0, 37) + '...' : desc, 130, currentY + 11);

                doc.font('Helvetica-Bold');
                doc.fillColor(tx.type === 'credit' ? '#10B981' : '#2D241E')
                    .text(tx.type.toUpperCase(), 330, currentY + 11);

                doc.fillColor('#2D241E')
                    .text('₹' + tx.amount, 420, currentY + 11);

                const statusColor = tx.status === 'Success' ? '#10B981' : tx.status === 'Pending' ? '#F59E0B' : '#EF4444';
                doc.fillColor(statusColor).text(tx.status, 490, currentY + 11);

                currentY += itemHeight;
            });

            // Footer
            doc.fillColor('#9CA3AF')
                .fontSize(8)
                .font('Helvetica')
                .text('This is a computer generated document and does not require a physical signature.', 40, 780, { align: 'center', width: 510 });

            doc.end();
            return;
        }

        // Prepare data for CSV
        const fields = [
            { label: 'Date', value: (row) => new Date(row.createdAt).toLocaleString() },
            { label: 'Type', value: 'type' },
            { label: 'Category', value: 'transactionType' },
            { label: 'Description', value: 'description' },
            { label: 'Amount', value: 'amount' },
            { label: 'Status', value: 'status' },
            { label: 'Reference ID', value: 'referenceId' }
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(transactions);

        res.header('Content-Type', 'text/csv');
        res.attachment(`wallet-statement-${Date.now()}.csv`);
        return res.send(csv);

    } catch (error) {
        logger.error("getWalletStatement Error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate statement'
        });
    }
};

// Helper to verify PIN
const verifyPin = async (customerId, pin) => {
    try {
        const wallet = await CustomerWallet.findOne({ customer: customerId });
        if (!wallet || !wallet.transactionPin) {
            return { success: false, message: 'Transaction PIN is not set' };
        }

        const isMatch = await bcrypt.compare(pin, wallet.transactionPin);
        if (!isMatch) {
            return { success: false, message: 'Incorrect Transaction PIN' };
        }

        return { success: true };
    } catch (error) {
        logger.error("verifyPin Error:", error);
        return { success: false, message: 'PIN verification failed' };
    }
};

exports.verifyPin = verifyPin;

// Endpoint for PIN verification
exports.verifyPinEndpoint = async (req, res) => {
    try {
        const result = await verifyPin(req.user._id, req.body.pin);
        if (result.success) {
            res.json({ success: true, message: 'PIN verified' });
        } else {
            res.status(401).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Verification error' });
    }
};