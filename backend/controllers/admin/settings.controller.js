/**
 * =============================================================================
 * SETTINGS CONTROLLER
 * =============================================================================
 * Handles admin settings operations
 * =============================================================================
 */

const Settings = require("../../models/settings.model");

const { sendSuccess, sendError } = require("../../utils/responseHelper");
const { createLog, getOrCreateSettings } = require("./helpers");

/**
 * Get admin settings
 * @route GET /api/admin/settings
 */
exports.getSettings = async (req, res) => {
    try {
        const settings = await getOrCreateSettings();
        return sendSuccess(res, 200, "Settings retrieved successfully", settings);
    } catch (error) {
        console.error("Get Settings Error:", error.message);
        return sendError(res, 500, "Failed to fetch settings", error);
    }
};

/**
 * Update admin settings
 * @route PUT /api/admin/settings
 * @body {Object} updates - Settings update data
 */
exports.updateSettings = async (req, res) => {
    try {
        const updates = req.body;
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create(updates);
        } else {
            Object.assign(settings, updates);
            await settings.save();
        }

        // Log the change
        await createLog(
            'SETTINGS_UPDATED',
            'Global configuration was modified by admin',
            req.user.id,
            'settings',
            'text-orange-500'
        );

        return sendSuccess(res, 200, "Settings updated successfully", settings);
    } catch (error) {
        console.error("Update Settings Error:", error.message);
        return sendError(res, 500, "Failed to update settings", error);
    }
};
