const jwt = require('jsonwebtoken');
const UnauthorizedErr = require('../errors/unauthorized-err');
const { JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedErr('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    next(new UnauthorizedErr('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
