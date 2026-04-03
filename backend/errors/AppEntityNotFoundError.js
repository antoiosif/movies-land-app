const AppGenericError = require('./AppGenericError');
const httpStatusCodes = require('../utils/http-status-codes');

class AppEntityNotFoundError extends AppGenericError {
  constructor(message) {
    super(httpStatusCodes.NOT_FOUND, message);
    this.name = 'AppEntityNotFoundError';
  }
}

module.exports = AppEntityNotFoundError;