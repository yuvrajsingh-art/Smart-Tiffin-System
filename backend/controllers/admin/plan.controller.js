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

/**
 * Create new plan
 * @route POST /api/admin/plans
 */
exports.createPlan = async (req, res) => {
    try {
        const { name, price, period, type, description, color, badge } = req.body;
        
        const newPlan = await Plan.create({
            name,
            price,
            period: period || 'Monthly',
            type: type || 'Veg',
            description: description || '',
            color: color || 'from-emerald-400 to-emerald-600',
            badge: badge || 'Standard',
            provider: req.user.id,
            verificationStatus: 'Approved',
            isActive: true
        });
        
        return sendSuccess(res, 201, "Plan created successfully", newPlan);
    } catch (error) {
        console.error("Create Plan Error:", error.message);
        return sendError(res, 500, "Failed to create plan", error);
    }
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

/**
 * Update plan
 * @route PUT /api/admin/plans/:id
 */
exports.updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const plan = await Plan.findByIdAndUpdate(id, updateData, { new: true });
        if (!plan) return sendError(res, 404, "Plan not found");
        
        return sendSuccess(res, 200, "Plan updated successfully", plan);
    } catch (error) {
        console.error("Update Plan Error:", error.message);
        return sendError(res, 500, "Failed to update plan", error);
    }
};

/**
 * Delete plan
 * @route DELETE /api/admin/plans/:id
 */
exports.deletePlan = async (req, res) => {
    try {
        const { id } = req.params;
        
        const plan = await Plan.findByIdAndDelete(id);
        if (!plan) return sendError(res, 404, "Plan not found");
        
        return sendSuccess(res, 200, "Plan deleted successfully");
    } catch (error) {
        console.error("Delete Plan Error:", error.message);
        return sendError(res, 500, "Failed to delete plan", error);
    }
};
