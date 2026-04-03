const AppGenericError = require('./AppGenericError');
const httpStatusCodes = require('../utils/http-status-codes');

class AppEntityAlreadyExistsError extends AppGenericError {
  constructor(message) {
    super(httpStatusCodes.CONFLICT, message);
    this.name = 'AppEntityAlreadyExistsError';
  }
}

module.exports = AppEntityAlreadyExistsError;