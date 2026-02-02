/**
 * =============================================================================
 * VALIDATION HELPER UTILITIES
 * =============================================================================
 * Input validation functions for common data types
 * =============================================================================
 */

/**
 * Validate email format
 * @param {String} email - Email to validate
 * @returns {Boolean} - True if valid
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate Indian mobile number (10 digits)
 * @param {String} mobile - Mobile number to validate
 * @returns {Boolean} - True if valid
 */
const isValidMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
};

/**
 * Validate password strength
 * @param {String} password - Password to validate
 * @param {Number} minLength - Minimum length (default: 6)
 * @returns {Object} - { valid: Boolean, message: String }
 */
const isValidPassword = (password, minLength = 6) => {
    if (!password || password.length < minLength) {
        return {
            valid: false,
            message: `Password must be at least ${minLength} characters`
        };
    }
    return { valid: true, message: 'Valid password' };
};

/**
 * Validate ObjectId format
 * @param {String} id - ID to validate
 * @returns {Boolean} - True if valid ObjectId
 */
const isValidObjectId = (id) => {
    const mongoose = require('mongoose');
    return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Sanitize string input (remove extra spaces, trim)
 * @param {String} str - String to sanitize
 * @returns {String} - Sanitized string
 */
const sanitizeString = (str) => {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/\s+/g, ' ');
};

/**
 * Validate required fields
 * @param {Object} data - Data object
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} - { valid: Boolean, missing: Array }
 */
const validateRequired = (data, requiredFields) => {
    const missing = [];
    
    requiredFields.forEach(field => {
        if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
            missing.push(field);
        }
    });
    
    return {
        valid: missing.length === 0,
        missing
    };
};

module.exports = {
    isValidEmail,
    isValidMobile,
    isValidPassword,
    isValidObjectId,
    sanitizeString,
    validateRequired
};
