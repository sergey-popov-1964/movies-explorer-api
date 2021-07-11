const routesUser = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('../middlewares/logger');

routesUser.use(requestLogger);

const {
  updateProfile, getCurrentUser,
} = require('../controllers/users');

routesUser.get('/users/me', celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getCurrentUser);

routesUser.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().pattern(/.+@.+\..+/i),
  }).unknown(true),
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), updateProfile);

routesUser.use(errorLogger);

module.exports = routesUser;
