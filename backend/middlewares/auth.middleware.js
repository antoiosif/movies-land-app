const authService = require('../services/auth.service');
const AppNotAuthorizedError = require('../errors/AppNotAuthorizedError');
const AccessDeniedError = require('../errors/AppAccessDeniedError');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    throw new AppNotAuthorizedError('Access Denied: no token provided');
  }
  const result = authService.verifyAccessToken(token);
  if (!result.verified) {
    throw new AccessDeniedError('Access Denied: ' + result.data);
  }
  req.user = result.data;   // add the logged in user in the request
  next();
}