/**
 * =============================================================================
 * FINANCE CONTROLLER
 * =============================================================================
 * Handles finance and payout operations
 * =============================================================================
 */

const mongoose = require("mongoose");
const Transaction = require("../../models/transaction.model");
const Provider = require("../../models/providerprofile.model");

const { sendSuccess, sendError } = require("../../utils/responseHelper");
const { isValidObjectId } = require("../../utils/validationHelper");
const { formatDate } = require("../../utils/dateHelper");
const { getOrCreateSettings } = require("./helpers");

/**
 * Get finance statistics
 * @route GET /api/admin/finance/stats
 */
exports.getFinanceStats = async (req, res) => {
    try {
        // Total revenue
        const revenueData = await Transaction.aggregate([
            { $match: { status: 'Success' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        // Pending payouts
        const pendingPayouts = await Provider.aggregate([
            { $group: { _id: null, total: { $sum: { $ifNull: ["$pendingBalance", 0] } } } }
        ]);
        const pendingTotal = pendingPayouts.length > 0 ? pendingPayouts[0].total : 0;

        // Monthly transactions
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyTransactions = await Transaction.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        // Get commission rate from settings
        const settings = await getOrCreateSettings();
        const commissionRate = settings.baseCommission || 15;

        return sendSuccess(res, 200, "Finance stats retrieved successfully", {
            totalRevenue,
            pendingPayouts: pendingTotal,
            monthlyTransactions,
            platformFees: Math.round(totalRevenue * (commissionRate / 100))
        });
    } catch (error) {
        console.error("Finance Stats Error:", error.message);
        return sendError(res, 500, "Failed to fetch finance statistics", error);
    }
};

/**
 * Get pending payouts list
 * @route GET /api/admin/finance/payouts
 */
exports.getPayouts = async (req, res) => {
    try {
        const providers = await Provider.find({
            pendingBalance: { $gt: 0 }
        }).populate('owner', 'fullName email');

        const payouts = providers.map(p => ({
            id: p._id,
            name: p.owner?.fullName || p.businessName,
            email: p.owner?.email,
            amount: p.pendingBalance,
            status: 'Pending'
        }));

        return sendSuccess(res, 200, "Payouts retrieved successfully", payouts);
    } catch (error) {
        console.error("Get Payouts Error:", error.message);
        return sendError(res, 500, "Failed to fetch payouts", error);
    }
};

/**
 * Process payout to provider
 * @route POST /api/admin/finance/payout/:id
 * @param {String} id - Provider profile ID
 */
exports.processPayout = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid provider ID");
        }

        const provider = await Provider.findById(id);
        if (!provider) {
            return sendError(res, 404, "Provider not found");
        }

        const amount = provider.pendingBalance;

        // Use transaction for data consistency
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            provider.pendingBalance = 0;
            provider.lastPayout = new Date();
            await provider.save({ session });

            await Transaction.create([{
                type: 'payout',
                amount: amount,
                status: 'Success',
                provider: provider._id,
                description: `Payout to ${provider.businessName}`
            }], { session });

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

        return sendSuccess(res, 200, `Payout of ₹${amount} processed successfully`);
    } catch (error) {
        console.error("Process Payout Error:", error.message);
        return sendError(res, 500, "Failed to process payout", error);
    }
};

/**
 * Get invoices
 * @route GET /api/admin/finance/invoices
 */
exports.getInvoices = async (req, res) => {
    try {
        const transactions = await Transaction.find({ status: 'Success' })
            .populate('customer', 'fullName')
            .populate('provider', 'businessName')
            .sort({ createdAt: -1 })
            .limit(20);

        const invoices = transactions.map(t => ({
            id: `INV-${t._id.toString().slice(-6).toUpperCase()}`,
            rawId: t._id,
            user: t.customer?.fullName || t.provider?.businessName || 'Unknown',
            date: formatDate(t.createdAt),
            amount: `₹${t.amount}`,
            status: 'Paid',
            items: [{ name: t.description || 'Service', price: `₹${t.amount}` }]
        }));

        return sendSuccess(res, 200, "Invoices retrieved successfully", invoices);
    } catch (error) {
        console.error("Get Invoices Error:", error.message);
        return sendError(res, 500, "Failed to fetch invoices", error);
    }
};

/**
 * Get pending refund requests
 * @route GET /api/admin/finance/refunds
 */
exports.getRefundRequests = async (req, res) => {
    try {
        const Subscription = require("../../models/subscription.model");
        const { formatDate } = require("../../utils/dateHelper");

        const refunds = await Subscription.find({ status: 'cancellation_requested' })
            .populate('customer', 'fullName email phone')
            .populate('provider', 'businessName')
            .sort({ cancelledAt: -1 });

        const formattedRefunds = refunds.map(sub => ({
            id: sub._id,
            customer: sub.customer?.fullName || 'Unknown',
            email: sub.customer?.email,
            phone: sub.customer?.phone,
            planName: sub.planName,
            refundAmount: sub.refundAmount || 0,
            date: formatDate(sub.cancelledAt || new Date()),
            reason: sub.cancellationReason
        }));

        return sendSuccess(res, 200, "Refund requests retrieved successfully", formattedRefunds);
    } catch (error) {
        console.error("Get Refunds Error:", error.message);
        return sendError(res, 500, "Failed to fetch refund requests", error);
    }
};

/**
 * Approve Subscription Cancellation & Process Refund
 * @route POST /api/admin/finance/refund/:id/approve
 */
exports.approveCancellation = async (req, res) => {
    try {
        const { id } = req.params;
        const Subscription = require("../../models/subscription.model");
        const CustomerWallet = require("../../models/customerWallet.model");

        const subscription = await Subscription.findById(id);
        if (!subscription) {
            return sendError(res, 404, "Subscription not found");
        }

        if (subscription.status !== 'cancellation_requested') {
            return sendError(res, 400, "Subscription is not in cancellation requested state");
        }

        const refundAmount = subscription.refundAmount || 0;
        const customerId = subscription.customer;

        // 1. Update Subscription Status
        subscription.status = 'cancelled';
        subscription.adminApproval = 'approved';
        await subscription.save();

        // 2. Credit Wallet
        let wallet = await CustomerWallet.findOne({ customer: customerId });
        if (!wallet) {
            wallet = new CustomerWallet({
                customer: customerId,
                balance: 0
            });
        }
        wallet.balance = (wallet.balance || 0) + refundAmount;
        await wallet.save();

        // 3. Create Transaction Record
        await Transaction.create({
            customer: customerId,
            type: 'credit',
            transactionType: 'Refund',
            amount: refundAmount,
            description: `Refund for cancelled subscription: ${subscription.planName}`,
            referenceId: `REF-${subscription._id.toString().slice(-6).toUpperCase()}`,
            status: 'Success',
            subscriptionId: subscription._id
        });

        return sendSuccess(res, 200, "Cancellation approved and refund processed successfully");

    } catch (error) {
        console.error("Approve Cancellation Error:", error);
        return sendError(res, 500, "Failed to approve cancellation", error);
    }
};
