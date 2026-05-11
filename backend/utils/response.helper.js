/**
 * Centralised HTTP response helpers.
 * All controllers use these instead of raw res.json() calls.
 */

/**
 * Send a successful JSON response.
 * @param {import('express').Response} res
 * @param {*}      data       - Payload to include under the `data` key
 * @param {string} message    - Human-readable success message
 * @param {number} statusCode - HTTP status code (default 200)
 */
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  const body = { success: true, message };
  if (data !== null) body.data = data;
  return res.status(statusCode).json(body);
};

/**
 * Send an error JSON response.
 * @param {import('express').Response} res
 * @param {string} message    - Human-readable error message
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {*}      errors     - Optional field-level validation errors
 */
const errorResponse = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};

module.exports = { successResponse, errorResponse };
