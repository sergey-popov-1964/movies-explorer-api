const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const {authorization} = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new Error('Необходима авторизация1');
    err.statusCode = 401;
    next(err);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    let jwtKey = '';
    NODE_ENV === 'production' ? jwtKey = JWT_SECRET : jwtKey = 'some-secret-key';
    payload = jwt.verify(token, jwtKey);
  } catch (e) {
    const err = new Error('Необходима авторизация2');
    err.statusCode = 401;
    next(err);
  }
  req.user = payload;
  next();
};
