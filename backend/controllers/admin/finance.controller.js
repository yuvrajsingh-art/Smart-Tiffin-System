const Order = require('../../models/order.model');
const Subscription = require('../../models/subscription.model');
const Wallet = require('../../models/wallet.model');
const Transaction = require('../../models/transaction.model');

// Get finance stats
exports.getFinanceStats = async (req, res) => {
    try {
        // Calculate gross revenue from all delivered orders
        const deliveredOrders = await Order.find({ status: 'delivered' });
        const grossRevenue = deliveredOrders.reduce((sum, order) => {
            const subscription = order.subscription;
            return sum + 50; // Default 50 per meal
        }, 0);

        // Calculate total payouts from wallets
        const wallets = await Wallet.find({});
        const totalPayouts = wallets.reduce((sum, w) => sum + (w.totalEarnings || 0), 0);

        // Calculate pending liabilities (withdrawable balance)
        const pendingLiabilities = wallets.reduce((sum, w) => sum + (w.withdrawableBalance || 0), 0);

        // Net profit = gross revenue - total payouts
        const netProfit = grossRevenue - totalPayouts;

        res.json({
            success: true,
            data: {
                grossRevenue,
                totalPayouts,
                pendingLiabilities,
                netProfit
            }
        });

    } catch (error) {
        console.error('Get Finance Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch finance stats'
        });
    }
};

// Get payouts list
exports.getPayouts = async (req, res) => {
    try {
        const wallets = await Wallet.find({})
            .populate('provider', 'fullName businessName')
            .sort({ updatedAt: -1 });

        const payouts = wallets.map(wallet => ({
            id: wallet._id,
            kitchen: wallet.provider?.businessName || wallet.provider?.fullName || 'Provider',
            amount: `₹${wallet.totalEarnings.toLocaleString()}`,
            status: wallet.withdrawableBalance > 0 ? 'Pending' : 'Success',
            date: new Date(wallet.updatedAt).toLocaleDateString('en-IN')
        }));

        res.json({
            success: true,
            data: payouts
        });

    } catch (error) {
        console.error('Get Payouts Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payouts'
        });
    }
};

// Get invoices list
exports.getInvoices = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({})
            .populate('customer', 'fullName email')
            .sort({ createdAt: -1 })
            .limit(50);

        const invoices = subscriptions.map(sub => ({
            rawId: sub._id,
            id: `INV-${sub._id.toString().slice(-6).toUpperCase()}`,
            user: sub.customer?.fullName || 'Customer',
            email: sub.customer?.email || '',
            amount: `₹${sub.price.toLocaleString()}`,
            status: sub.status === 'active' ? 'Paid' : 'Pending',
            date: new Date(sub.createdAt).toLocaleDateString('en-IN')
        }));

        res.json({
            success: true,
            data: invoices
        });

    } catch (error) {
        console.error('Get Invoices Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch invoices'
        });
    }
};

// Get refunds list
exports.getRefunds = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({
            refundAmount: { $exists: true, $gt: 0 },
            refundStatus: 'pending'
        })
        .populate('customer', 'fullName email')
        .populate('plan', 'name')
        .sort({ updatedAt: -1 });

        const refunds = subscriptions.map(sub => ({
            id: sub._id,
            customer: sub.customer?.fullName || 'Customer',
            email: sub.customer?.email || '',
            planName: sub.plan?.name || 'Plan',
            refundAmount: sub.refundAmount,
            reason: sub.refundReason || 'Customer request'
        }));

        res.json({
            success: true,
            data: refunds
        });

    } catch (error) {
        console.error('Get Refunds Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch refunds'
        });
    }
};

// Approve refund
exports.approveCancellation = async (req, res) => {
    try {
        const { id } = req.params;

        const subscription = await Subscription.findById(id);
        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'Subscription not found'
            });
        }

        subscription.refundStatus = 'approved';
        await subscription.save();

        res.json({
            success: true,
            message: 'Refund approved successfully'
        });

    } catch (error) {
        console.error('Approve Refund Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve refund'
        });
    }
};

// Get refund requests
exports.getRefundRequests = exports.getRefunds;

// Process payout (placeholder)
exports.processPayout = async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Payout processed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to process payout'
        });
    }
};
