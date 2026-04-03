class AppGenericError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'AppGenericError';
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppGenericError;