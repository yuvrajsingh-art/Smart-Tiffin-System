/**
 * =============================================================================
 * MENU CONTROLLER
 * =============================================================================
 * Handles menu approval operations
 * =============================================================================
 */

const Menu = require("../../models/menu.model");

const { sendSuccess, sendError } = require("../../utils/responseHelper");
const { isValidObjectId } = require("../../utils/validationHelper");
const { createLog } = require("./helpers");

/**
 * Get pending menus awaiting approval
 * @route GET /api/admin/menus/pending
 */
exports.getPendingMenus = async (req, res) => {
    try {
        const pendingMenus = await Menu.find({ approvalStatus: 'Pending' })
            .populate('provider', 'fullName')
            .sort({ createdAt: -1 });

        return sendSuccess(res, 200, "Pending menus retrieved successfully", pendingMenus);
    } catch (error) {
        console.error("Get Pending Menus Error:", error.message);
        return sendError(res, 500, "Failed to fetch pending menus", error);
    }
};

/**
 * Approve menu
 * @route PUT /api/admin/menus/:id/approve
 * @param {String} id - Menu ID
 */
exports.approveMenu = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid menu ID");
        }

        const menu = await Menu.findByIdAndUpdate(
            id,
            {
                approvalStatus: 'Approved',
                isPublished: true,
                publishedAt: new Date()
            },
            { new: true }
        ).populate('provider', 'fullName');

        if (!menu) {
            return sendError(res, 404, "Menu not found");
        }

        // Log action
        await createLog(
            'MENU_APPROVED',
            `Menu for ${menu.provider?.fullName} was approved and published.`,
            req.user.id,
            'restaurant_menu',
            'text-emerald-500'
        );

        return sendSuccess(res, 200, "Menu approved successfully", menu);
    } catch (error) {
        console.error("Approve Menu Error:", error.message);
        return sendError(res, 500, "Failed to approve menu", error);
    }
};

/**
 * Reject menu
 * @route PUT /api/admin/menus/:id/reject
 * @param {String} id - Menu ID
 * @body {String} reason - Rejection reason
 */
exports.rejectMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid menu ID");
        }

        const menu = await Menu.findByIdAndUpdate(
            id,
            {
                approvalStatus: 'Rejected',
                adminRemarks: reason || 'Rejected by admin'
            },
            { new: true }
        ).populate('provider', 'fullName');

        if (!menu) {
            return sendError(res, 404, "Menu not found");
        }

        // Log action
        await createLog(
            'MENU_REJECTED',
            `Menu for ${menu.provider?.fullName} was rejected. Reason: ${reason}`,
            req.user.id,
            'cancel_presentation',
            'text-rose-500'
        );

        return sendSuccess(res, 200, "Menu rejected", menu);
    } catch (error) {
        console.error("Reject Menu Error:", error.message);
        return sendError(res, 500, "Failed to reject menu", error);
    }
};

/**
 * Get all menus
 * @route GET /api/admin/menus
 */
exports.getAllMenus = async (req, res) => {
    try {
        const menus = await Menu.find()
            .populate('provider', 'fullName email')
            .sort({ createdAt: -1 });

        return sendSuccess(res, 200, "Menus retrieved successfully", menus);
    } catch (error) {
        console.error("Get All Menus Error:", error.message);
        return sendError(res, 500, "Failed to fetch menus", error);
    }
};

/**
 * Update menu
 * @route PUT /api/admin/menus/:id
 * @param {String} id - Menu ID
 */
exports.updateMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid menu ID");
        }

        const menu = await Menu.findByIdAndUpdate(id, updateData, { new: true })
            .populate('provider', 'fullName');

        if (!menu) {
            return sendError(res, 404, "Menu not found");
        }

        // Log action
        await createLog(
            'MENU_UPDATED',
            `Menu for ${menu.provider?.fullName} was updated by admin.`,
            req.user.id,
            'edit',
            'text-blue-500'
        );

        return sendSuccess(res, 200, "Menu updated successfully", menu);
    } catch (error) {
        console.error("Update Menu Error:", error.message);
        return sendError(res, 500, "Failed to update menu", error);
    }
};

/**
 * Delete menu
 * @route DELETE /api/admin/menus/:id
 * @param {String} id - Menu ID
 */
exports.deleteMenu = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return sendError(res, 400, "Invalid menu ID");
        }

        const menu = await Menu.findByIdAndDelete(id).populate('provider', 'fullName');

        if (!menu) {
            return sendError(res, 404, "Menu not found");
        }

        // Log action
        await createLog(
            'MENU_DELETED',
            `Menu for ${menu.provider?.fullName} was deleted by admin.`,
            req.user.id,
            'delete',
            'text-rose-500'
        );

        return sendSuccess(res, 200, "Menu deleted successfully");
    } catch (error) {
        console.error("Delete Menu Error:", error.message);
        return sendError(res, 500, "Failed to delete menu", error);
    }
};
