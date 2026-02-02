/**
 * =============================================================================
 * REQUEST LOGGER MIDDLEWARE
 * =============================================================================
 * Logs all incoming API requests with timing
 * =============================================================================
 */

const logger = require('../utils/logger');

/**
 * Request logging middleware
 * Logs method, path, and response time for all requests
 */
const requestLogger = (req, res, next) => {
    // Skip if production
    if (process.env.NODE_ENV === 'production') {
        return next();
    }

    const startTime = Date.now();

    // Log incoming request
    const params = { ...req.query, ...req.params };
    const bodyKeys = req.body ? Object.keys(req.body) : [];

    if (bodyKeys.length > 0) {
        params._body = bodyKeys.join(', ');
    }

    logger.api(req.method, req.originalUrl, Object.keys(params).length > 0 ? params : null);

    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const statusColor = res.statusCode >= 400 ? 'error' : 'success';

        // Only log response for non-200 or slow responses
        if (res.statusCode >= 400 || duration > 500) {
            logger.response(res.statusCode, res.statusMessage || '', duration);
        }
    });

    next();
};

module.exports = requestLogger;
