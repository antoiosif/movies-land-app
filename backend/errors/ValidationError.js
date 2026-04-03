const httpStatusCodes = require("../utils/http-status-codes");

class ValidationError extends Error {
  constructor(errors) {
    super('Validation failed.');
    this.name = 'ValidationError';
    this.statusCode = httpStatusCodes.BAD_REQUEST;
    this.errors = extractValidationErrors(errors);
    Error.captureStackTrace(this, this.constructor);
  }
}

function extractValidationErrors(errors) {
  for (const [key, value] of Object.entries(errors)) {
    errors[key] = value.message; // show only the message for each error
  }
  return errors;
}

module.exports = ValidationError;