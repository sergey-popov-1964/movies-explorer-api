const routesUser = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('../middlewares/logger');

routesUser.use(requestLogger);

const {
  updateProfile, getCurrentUser,
} = require('../controllers/users');

routesUser.get('/users/me', getCurrentUser);

routesUser.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email(),
  }).unknown(true),
}), updateProfile);

routesUser.use(errorLogger);

module.exports = routesUser;
