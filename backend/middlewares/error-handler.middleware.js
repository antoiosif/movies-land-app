const logger = require('../logger/logger');

exports.errorHandler = (err, req, res, next) => {
  logger.error(err.message);
  res.status(err.statusCode || 400).json({status: false, data: {...err, message: err.message}});
}