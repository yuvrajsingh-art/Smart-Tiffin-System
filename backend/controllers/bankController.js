const DummyBank = require("../models/dummyBank.model");

// Get linked bank details
exports.getBankDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        let bank = await DummyBank.findOne({ user: userId });

        if (!bank) {
            // Auto-initialize for existing users if missing
            bank = new DummyBank({
                user: userId,
                accountNumber: `STB${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                vpa: `${req.user.fullName.toLowerCase().replace(/\s/g, '')}@stbank`,
                balance: 10000
            });
            await bank.save();
        }

        res.json({
            success: true,
            data: bank
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch bank details"
        });
    }
};

// Add/Sync balance from dummy bank to wallet
// This is used by the wallet controller internally or via API
exports.deductFromBank = async (userId, amount) => {
    const bank = await DummyBank.findOne({ user: userId });
    if (!bank || bank.balance < amount) {
        throw new Error("Insufficient bank balance");
    }

    bank.balance -= amount;
    await bank.save();
    return bank.balance;
};

// Reset/Add money to bank (For testing purposes)
exports.resetBankBalance = async (req, res) => {
    try {
        const userId = req.user._id;
        const { amount = 10000 } = req.body;

        const bank = await DummyBank.findOneAndUpdate(
            { user: userId },
            { balance: amount },
            { new: true, upsert: true }
        );

        res.json({
            success: true,
            message: "Bank balance reset successfully",
            data: bank
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to reset bank balance"
        });
    }
};
