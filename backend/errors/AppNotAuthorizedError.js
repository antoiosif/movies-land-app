const AppGenericError = require('./AppGenericError');
const httpStatusCodes = require('../utils/http-status-codes');

class AppNotAuthorizedError extends AppGenericError {
  constructor(message) {
    super(httpStatusCodes.UNAUTHORIZED, message);
    this.name = 'AppNotAuthorizedError';
  }
}

module.exports = AppNotAuthorizedError;