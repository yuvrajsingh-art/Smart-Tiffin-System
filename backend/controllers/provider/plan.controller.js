const Plan = require("../../models/plan.model");
const { sendSuccess, sendError } = require("../../utils/responseHelper");

/**
 * Get all plans for the logged-in provider
 */
exports.getMyPlans = async (req, res) => {
    try {
        const plans = await Plan.find({ provider: req.user._id, isActive: true }).sort({ price: 1 });
        return sendSuccess(res, 200, "Your plans retrieved successfully", plans);
    } catch (error) {
        console.error("Get Provider Plans Error:", error.message);
        return sendError(res, 500, "Failed to fetch your plans", error);
    }
};

/**
 * Create a new plan (Provider Specific)
 */
exports.createPlan = async (req, res) => {
    try {
        const { name, price, period, type, description, color, badge } = req.body;

        const newPlan = await Plan.create({
            name,
            price,
            period,
            type,
            description,
            color,
            badge,
            isStandard: false,
            provider: req.user._id
        });

        return sendSuccess(res, 201, "Plan created successfully", newPlan);
    } catch (error) {
        console.error("Provider Create Plan Error:", error.message);
        return sendError(res, 500, "Failed to create plan", error);
    }
};

/**
 * Update provider's plan
 */
exports.updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const plan = await Plan.findOne({ _id: id, provider: req.user._id });
        if (!plan) {
            return sendError(res, 404, "Plan not found or access denied");
        }

        const updatedPlan = await Plan.findByIdAndUpdate(id, updateData, { new: true });
        return sendSuccess(res, 200, "Plan updated successfully", updatedPlan);
    } catch (error) {
        console.error("Provider Update Plan Error:", error.message);
        return sendError(res, 500, "Failed to update plan", error);
    }
};

/**
 * Delete provider's plan
 */
exports.deletePlan = async (req, res) => {
    try {
        const { id } = req.params;

        const plan = await Plan.findOne({ _id: id, provider: req.user._id });
        if (!plan) {
            return sendError(res, 404, "Plan not found or access denied");
        }

        await Plan.findByIdAndDelete(id);
        return sendSuccess(res, 200, "Plan deleted successfully");
    } catch (error) {
        console.error("Provider Delete Plan Error:", error.message);
        return sendError(res, 500, "Failed to delete plan", error);
    }
};
