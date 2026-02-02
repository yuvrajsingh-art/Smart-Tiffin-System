/**
 * =============================================================================
 * ADMIN HELPERS
 * =============================================================================
 * Shared helper functions for admin controllers
 * =============================================================================
 */

const Log = require("../../models/log.model");
const Settings = require("../../models/settings.model");

/**
 * Create audit log entry
 * @param {String} event - Event name
 * @param {String} detail - Event details
 * @param {String} adminId - Admin user ID
 * @param {String} icon - Icon name (default: 'info')
 * @param {String} color - Color class (default: 'text-indigo-500')
 */
const createLog = async (event, detail, adminId, icon = 'info', color = 'text-indigo-500') => {
    try {
        await Log.create({ event, detail, admin: adminId, icon, color });
    } catch (error) {
        console.error("Logging Error:", error.message);
    }
};

/**
 * Get or create default settings
 * @returns {Object} Settings object
 */
const getOrCreateSettings = async () => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = await Settings.create({});
    }
    return settings;
};

module.exports = {
    createLog,
    getOrCreateSettings
};
