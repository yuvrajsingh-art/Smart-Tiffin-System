/**
 * =============================================================================
 * LOGGER UTILITY
 * =============================================================================
 * Centralized logging for development with colors and formatting
 * Usage: const logger = require('../utils/logger');
 *        logger.api('GET', '/api/admin/stats');
 * =============================================================================
 */

// Console colors
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',

    // Foreground colors
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',

    // Background colors
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
};

// Check if we're in development mode
const isDev = process.env.NODE_ENV !== 'production';

// Get formatted timestamp
const getTimestamp = () => {
    const now = new Date();
    return `${colors.gray}[${now.toLocaleTimeString()}]${colors.reset}`;
};

// Method colors
const methodColors = {
    GET: colors.green,
    POST: colors.blue,
    PUT: colors.yellow,
    DELETE: colors.red,
    PATCH: colors.magenta,
};

const logger = {
    // =============================================
    // API Request Logging
    // =============================================

    /**
     * Log API request
     * @param {String} method - HTTP method
     * @param {String} path - API path
     * @param {Object} params - Query/body params (optional)
     */
    api: (method, path, params = null) => {
        if (!isDev) return;

        const methodColor = methodColors[method] || colors.white;
        const methodBadge = `${methodColor}${colors.bright}${method.padEnd(6)}${colors.reset}`;

        console.log(`${getTimestamp()} ${methodBadge} ${colors.cyan}${path}${colors.reset}`);

        if (params && Object.keys(params).length > 0) {
            console.log(`           ${colors.dim}└── Params: ${JSON.stringify(params)}${colors.reset}`);
        }
    },

    /**
     * Log API response
     * @param {Number} status - HTTP status code
     * @param {String} message - Response message
     * @param {Number} time - Response time in ms (optional)
     */
    response: (status, message, time = null) => {
        if (!isDev) return;

        const statusColor = status >= 400 ? colors.red : status >= 300 ? colors.yellow : colors.green;
        const statusBadge = `${statusColor}${status}${colors.reset}`;
        const timeStr = time ? `${colors.dim}(${time}ms)${colors.reset}` : '';

        console.log(`           ${colors.dim}└──${colors.reset} ${statusBadge} ${message} ${timeStr}`);
    },

    // =============================================
    // General Logging
    // =============================================

    /**
     * Info log (cyan)
     */
    info: (message, data = null) => {
        if (!isDev) return;
        console.log(`${getTimestamp()} ${colors.cyan}ℹ${colors.reset}  ${message}`);
        if (data) console.log(`           ${colors.dim}└── ${JSON.stringify(data)}${colors.reset}`);
    },

    /**
     * Success log (green)
     */
    success: (message, data = null) => {
        if (!isDev) return;
        console.log(`${getTimestamp()} ${colors.green}✓${colors.reset}  ${message}`);
        if (data) console.log(`           ${colors.dim}└── ${JSON.stringify(data)}${colors.reset}`);
    },

    /**
     * Warning log (yellow)
     */
    warn: (message, data = null) => {
        console.log(`${getTimestamp()} ${colors.yellow}⚠${colors.reset}  ${colors.yellow}${message}${colors.reset}`);
        if (data) console.log(`           ${colors.dim}└── ${JSON.stringify(data)}${colors.reset}`);
    },

    /**
     * Error log (red) - Always shows
     */
    error: (message, error = null) => {
        console.log(`${getTimestamp()} ${colors.red}✗${colors.reset}  ${colors.red}${message}${colors.reset}`);
        if (error) {
            console.log(`           ${colors.dim}└── Error: ${error.message || error}${colors.reset}`);
            if (error.stack && isDev) {
                console.log(`           ${colors.dim}└── Stack: ${error.stack.split('\n')[1].trim()}${colors.reset}`);
            }
        }
    },

    /**
     * Debug log (magenta) - Only in development
     */
    debug: (message, data = null) => {
        if (!isDev) return;
        console.log(`${getTimestamp()} ${colors.magenta}◉${colors.reset}  ${colors.dim}${message}${colors.reset}`);
        if (data) console.log(`           ${colors.dim}└── ${JSON.stringify(data)}${colors.reset}`);
    },

    // =============================================
    // Admin-specific Logging
    // =============================================

    /**
     * Log admin action
     */
    adminAction: (action, details = '') => {
        if (!isDev) return;
        console.log(`${getTimestamp()} ${colors.bgMagenta}${colors.white} ADMIN ${colors.reset} ${colors.magenta}${action}${colors.reset} ${details}`);
    },

    /**
     * Log database query
     */
    db: (operation, collection, query = null) => {
        if (!isDev) return;
        console.log(`${getTimestamp()} ${colors.blue}🗄${colors.reset}  ${colors.blue}${operation}${colors.reset} → ${colors.cyan}${collection}${colors.reset}`);
        if (query) console.log(`           ${colors.dim}└── Query: ${JSON.stringify(query)}${colors.reset}`);
    },

    /**
     * Log socket event
     */
    socket: (event, data = null) => {
        if (!isDev) return;
        console.log(`${getTimestamp()} ${colors.yellow}📡${colors.reset} Socket: ${colors.yellow}${event}${colors.reset}`);
        if (data) console.log(`           ${colors.dim}└── ${JSON.stringify(data)}${colors.reset}`);
    },

    /**
     * Log authentication event
     */
    auth: (action, user = null) => {
        if (!isDev) return;
        const userInfo = user ? `${colors.cyan}${user}${colors.reset}` : '';
        console.log(`${getTimestamp()} ${colors.green}🔑${colors.reset} Auth: ${colors.green}${action}${colors.reset} ${userInfo}`);
    },

    // =============================================
    // Section Dividers
    // =============================================

    /**
     * Print a divider line
     */
    divider: () => {
        if (!isDev) return;
        console.log(`${colors.dim}───────────────────────────────────────────────────────────${colors.reset}`);
    },

    /**
     * Print a section header
     */
    section: (title) => {
        if (!isDev) return;
        console.log('');
        console.log(`${colors.dim}─── ${colors.reset}${colors.bright}${title}${colors.reset}${colors.dim} ───${colors.reset}`);
        console.log('');
    },

    /**
     * Print a table-like format
     */
    table: (data) => {
        if (!isDev) return;
        console.table(data);
    }
};

module.exports = logger;
