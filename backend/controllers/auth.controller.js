const bcrypt = require('bcrypt');
const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const AppNotAuthorizedError = require('../errors/AppNotAuthorizedError');
const httpStatusCodes = require('../utils/http-status-codes');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await userService.getUserByUsername(username);
  // Check if the user is active - only active users can login
  if (!user.isActive) {
    throw new AppNotAuthorizedError(`User with 'username=${username}' is not active.`);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppNotAuthorizedError(`Authentication failed. User with 'username=${username}' not logged in.`);
  }
  const token = authService.generateAccessToken(user);
  console.log(`User with 'username=${username}' logged in.`);
  res.status(httpStatusCodes.OK).json({status: true, data: token});
}