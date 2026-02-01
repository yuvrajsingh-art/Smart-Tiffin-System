/**
 * =============================================================================
 * PAGINATION HELPER UTILITIES
 * =============================================================================
 * Helper functions for pagination logic
 * =============================================================================
 */

/**
 * Calculate pagination parameters
 * @param {Number} page - Current page number (default: 1)
 * @param {Number} limit - Items per page (default: 10)
 * @returns {Object} - { skip, limit, page }
 */
const getPaginationParams = (page = 1, limit = 10) => {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10)); // Max 100 items
    
    return {
        skip: (pageNum - 1) * limitNum,
        limit: limitNum,
        page: pageNum
    };
};

/**
 * Create pagination metadata
 * @param {Number} total - Total items count
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @returns {Object} - Pagination metadata
 */
const getPaginationMeta = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    
    return {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
};

/**
 * Apply pagination to query
 * @param {Object} query - Mongoose query object
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @returns {Object} - Query with pagination applied
 */
const applyPagination = (query, page = 1, limit = 10) => {
    const { skip, limit: limitNum } = getPaginationParams(page, limit);
    return query.skip(skip).limit(limitNum);
};

module.exports = {
    getPaginationParams,
    getPaginationMeta,
    applyPagination
};
