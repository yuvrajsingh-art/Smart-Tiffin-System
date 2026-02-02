/**
 * =============================================================================
 * DATE HELPER UTILITIES
 * =============================================================================
 * Standardized date formatting functions
 * =============================================================================
 */

/**
 * Format date to Indian locale string
 * @param {Date} date - Date object
 * @returns {String} - Formatted date string
 */
const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

/**
 * Format time to HH:MM format
 * @param {Date} date - Date object
 * @returns {String} - Formatted time string
 */
const formatTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Get start of day (00:00:00)
 * @param {Date} date - Date object (default: today)
 * @returns {Date} - Start of day
 */
const getStartOfDay = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

/**
 * Get end of day (23:59:59)
 * @param {Date} date - Date object (default: today)
 * @returns {Date} - End of day
 */
const getEndOfDay = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
};

/**
 * Get date range for last N days
 * @param {Number} days - Number of days
 * @returns {Object} - { startDate, endDate }
 */
const getLastNDays = (days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return { startDate, endDate };
};

module.exports = {
    formatDate,
    formatTime,
    getStartOfDay,
    getEndOfDay,
    getLastNDays
};
