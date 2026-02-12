/**
 * =============================================================================
 * SETTINGS CONTROLLER
 * =============================================================================
 * Handles admin settings operations
 * =============================================================================
 */

const Settings = require("../../models/settings.model");

const Log = require("../../models/log.model");

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

/**
 * Get system audit logs
 * @route GET /api/admin/settings/logs
 */
exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await Log.find()
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('admin', 'fullName role');

        return sendSuccess(res, 200, "Audit logs retrieved", logs);
    } catch (error) {
        return sendError(res, 500, "Failed to fetch audit logs", error);
    }
};

/**
 * Purge system cache
 * @route POST /api/admin/settings/purge-cache
 */
exports.purgeCache = async (req, res) => {
    try {
        // In a real app, this would clear Redis or temp folders
        // Here we'll update the cacheHealth and add a log
        const settings = await getOrCreateSettings();
        settings.cacheHealth = 100;
        await settings.save();

        await createLog(
            'CACHE_PURGE',
            'System-wide cache purged and optimized',
            req.user.id,
            'delete_sweep',
            'text-emerald-500'
        );

        return sendSuccess(res, 200, "System cache purged successfully");
    } catch (error) {
        return sendError(res, 500, "Failed to purge cache", error);
    }
};
