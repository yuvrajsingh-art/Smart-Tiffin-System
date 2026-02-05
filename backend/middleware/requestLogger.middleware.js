/**
 * =============================================================================
 * REQUEST LOGGER MIDDLEWARE
 * =============================================================================
 * Logs all incoming HTTP requests for debugging
 * =============================================================================
 */

const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url} - ${ip}`);
  
  next();
};

module.exports = requestLogger;