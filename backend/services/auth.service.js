const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    firstname: user.firstname,
    roles: user.roles
  };
  const secret = process.env.TOKEN_SECRET;
  const options = {
    expiresIn: '1h'
  };
  return jwt.sign(payload, secret, options);
}

exports.verifyAccessToken = (token) => {
  try {
    const secret = process.env.TOKEN_SECRET;
    const decoded = jwt.verify(token, secret);
    return {verified: true, data: decoded};
  } catch (err) {
    return {verified: false, data: err.message};
  }
}