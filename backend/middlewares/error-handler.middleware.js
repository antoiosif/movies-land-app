exports.errorHandler = (err, req, res, next) => {
  console.error(err.message);
  res.status(err.statusCode || 400).json({status: false, data: {...err, message: err.message}});
}