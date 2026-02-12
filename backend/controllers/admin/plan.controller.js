const Plan = require("../../models/plan.model");
const { sendSuccess, sendError } = require("../../utils/responseHelper");

/**
 * Get all subscription plans
 * @route GET /api/admin/plans
 */
exports.getPlans = async (req, res) => {
    try {
        const plans = await Plan.find({})
            .populate("provider", "fullName email") // Populate creator info
            .sort({ createdAt: -1 });
        return sendSuccess(res, 200, "Plans retrieved successfully", plans);
    } catch (error) {
        console.error("Get Plans Error:", error.message);
        return sendError(res, 500, "Failed to fetch plans", error);
    }
};

exports.createPlan = async (req, res) => {
    return sendError(res, 405, "Platform Admin cannot create plans. Plans must be created by Providers.");
};

/**
 * Approve a provider's plan
 */
exports.approvePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await Plan.findByIdAndUpdate(id, {
            verificationStatus: 'Approved',
            isActive: true
        }, { new: true });

        if (!plan) return sendError(res, 404, "Plan not found");

        return sendSuccess(res, 200, "Plan approved successfully", plan);
    } catch (error) {
        return sendError(res, 500, "Failed to approve plan", error);
    }
};

/**
 * Reject a provider's plan
 */
exports.rejectPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const plan = await Plan.findByIdAndUpdate(id, {
            verificationStatus: 'Rejected',
            rejectionReason: reason || "Does not meet platform standards",
            isActive: false
        }, { new: true });

        if (!plan) return sendError(res, 404, "Plan not found");

        return sendSuccess(res, 200, "Plan rejected", plan);
    } catch (error) {
        return sendError(res, 500, "Failed to reject plan", error);
    }
};

exports.updatePlan = async (req, res) => {
    return sendError(res, 405, "Platform Admin cannot edit plans.");
};

exports.deletePlan = async (req, res) => {
    return sendError(res, 405, "Platform Admin cannot delete plans.");
};
