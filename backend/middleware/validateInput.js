/**
 * =============================================================================
 * INPUT VALIDATION MIDDLEWARE
 * =============================================================================
 * Simple validation middleware for customer APIs.
 * No extra npm packages required - uses plain JavaScript.
 * Usage: router.post('/add', validate('addMoney'), controller);
 * =============================================================================
 */

const { WALLET, FEEDBACK } = require('../config/constants');

// Validation Rules
const validationRules = {
    // Wallet: Add Money
    addMoney: (body) => {
        const errors = [];

        if (!body.amount || typeof body.amount !== 'number') {
            errors.push('Amount is required and must be a number');
        } else if (body.amount <= 0) {
            errors.push('Amount must be greater than 0');
        } else if (body.amount < WALLET.MIN_TOPUP) {
            errors.push(`Minimum topup amount is ₹${WALLET.MIN_TOPUP}`);
        } else if (body.amount > WALLET.MAX_TOPUP) {
            errors.push(`Maximum topup amount is ₹${WALLET.MAX_TOPUP}`);
        }

        if (!body.transactionId || typeof body.transactionId !== 'string') {
            errors.push('Transaction ID (UTR) is required');
        } else if (body.transactionId.length !== WALLET.UTR_LENGTH) {
            errors.push(`Transaction ID must be exactly ${WALLET.UTR_LENGTH} characters`);
        }

        return errors;
    },

    // Feedback: Submit Review
    submitFeedback: (body) => {
        const errors = [];

        if (!body.orderId) {
            errors.push('Order ID is required');
        }

        if (!body.rating || typeof body.rating !== 'number') {
            errors.push('Rating is required and must be a number');
        } else if (body.rating < FEEDBACK.MIN_RATING || body.rating > FEEDBACK.MAX_RATING) {
            errors.push(`Rating must be between ${FEEDBACK.MIN_RATING} and ${FEEDBACK.MAX_RATING}`);
        }

        if (body.tags && !Array.isArray(body.tags)) {
            errors.push('Tags must be an array');
        }

        return errors;
    },

    // Profile: Update Profile
    updateProfile: (body) => {
        const errors = [];

        if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
            errors.push('Name is required and must be at least 2 characters');
        }

        if (!body.email || typeof body.email !== 'string') {
            errors.push('Email is required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
            errors.push('Invalid email format');
        }

        if (!body.phone || typeof body.phone !== 'string') {
            errors.push('Phone number is required');
        } else if (!/^\d{10}$/.test(body.phone)) {
            errors.push('Phone must be a 10-digit number');
        }

        return errors;
    },

    // Subscription: Toggle Meal Skip
    toggleMealSkip: (body) => {
        const errors = [];

        if (!body.date) {
            errors.push('Date is required');
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
            errors.push('Date must be in YYYY-MM-DD format');
        }

        if (!body.mealType) {
            errors.push('Meal type is required');
        } else if (!['lunch', 'dinner'].includes(body.mealType.toLowerCase())) {
            errors.push('Meal type must be "lunch" or "dinner"');
        }

        return errors;
    }
};

/**
 * Validation Middleware Factory
 * @param {string} ruleName - Name of the validation rule to apply
 * @returns {Function} Express middleware function
 */
const validate = (ruleName) => {
    return (req, res, next) => {
        const rule = validationRules[ruleName];

        if (!rule) {
            console.warn(`Validation rule "${ruleName}" not found. Skipping validation.`);
            return next();
        }

        const errors = rule(req.body);

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        next();
    };
};

module.exports = { validate, validationRules };
