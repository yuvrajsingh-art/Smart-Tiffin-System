/**
 * =============================================================================
 * PLAN CONTROLLER
 * =============================================================================
 * Handles subscription plan operations
 * =============================================================================
 */

const { sendSuccess, sendError } = require("../../utils/responseHelper");

/**
 * Get all subscription plans
 * @route GET /api/admin/plans
 */
exports.getPlans = async (req, res) => {
    try {
        // TODO: Move to database model
        const plans = [
            { id: '1', name: 'Basic', price: 2999, duration: '30 days', meals: 60, type: 'veg' },
            { id: '2', name: 'Standard', price: 4999, duration: '30 days', meals: 90, type: 'veg' },
            { id: '3', name: 'Premium', price: 7999, duration: '30 days', meals: 90, type: 'both' }
        ];

        return sendSuccess(res, 200, "Plans retrieved successfully", plans);
    } catch (error) {
        console.error("Get Plans Error:", error.message);
        return sendError(res, 500, "Failed to fetch plans", error);
    }
};

/**
 * Create new plan
 * @route POST /api/admin/plans
 * @body {String} name - Plan name
 * @body {Number} price - Plan price
 * @body {String} duration - Plan duration
 * @body {Number} meals - Number of meals
 * @body {String} type - Plan type (veg/non-veg/both)
 */
exports.createPlan = async (req, res) => {
    try {
        const { name, price, duration, meals, type } = req.body;

        // TODO: Save to database when Plan model is created
        return sendSuccess(res, 201, "Plan created successfully", {
            name,
            price,
            duration,
            meals,
            type,
            id: Date.now().toString()
        });
    } catch (error) {
        console.error("Create Plan Error:", error.message);
        return sendError(res, 500, "Failed to create plan", error);
    }
};

/**
 * Update plan
 * @route PUT /api/admin/plans/:id
 * @param {String} id - Plan ID
 * @body {Object} updateData - Plan update data
 */
exports.updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // TODO: Update in database when Plan model is created
        return sendSuccess(res, 200, "Plan updated successfully", { id, ...updateData });
    } catch (error) {
        console.error("Update Plan Error:", error.message);
        return sendError(res, 500, "Failed to update plan", error);
    }
};

/**
 * Delete plan
 * @route DELETE /api/admin/plans/:id
 * @param {String} id - Plan ID
 */
exports.deletePlan = async (req, res) => {
    try {
        const { id } = req.params;

        // TODO: Delete from database when Plan model is created
        return sendSuccess(res, 200, "Plan deleted successfully");
    } catch (error) {
        console.error("Delete Plan Error:", error.message);
        return sendError(res, 500, "Failed to delete plan", error);
    }
};
