const AppGenericError = require('./AppGenericError');
const httpStatusCodes = require('../utils/http-status-codes');

class AccessDeniedError extends AppGenericError {
  constructor(message) {
    super(httpStatusCodes.FORBIDDEN, message);
    this.name = 'AccessDeniedError';
  }
}

module.exports = AccessDeniedError;