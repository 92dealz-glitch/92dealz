/**
 * Centralized error handling middleware
 * - Normalizes Sequelize and generic errors into JSON responses
 * - Logs errors to console for server-side visibility
 */
const { ValidationError, UniqueConstraintError } = require('sequelize');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Default to 500 Internal Server Error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details;

  // Normalize common Sequelize errors
  if (err instanceof ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    details = err.errors.map(e => ({ field: e.path, message: e.message }));
  } else if (err instanceof UniqueConstraintError) {
    statusCode = 409;
    message = 'Resource conflict';
    details = err.errors.map(e => ({ field: e.path, message: e.message }));
  }

  // Always log server-side
  // Include stack only in development
  const payload = {
    success: false,
    message,
    ...(details ? { details } : {}),
  };

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.error('[Error]', err);
    payload.stack = err.stack;
  } else {
    // eslint-disable-next-line no-console
    console.error('[Error]', message);
  }

  return res.status(statusCode).json(payload);
}

module.exports = errorHandler;

