const routesUser = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('../middlewares/logger');

routesUser.use(requestLogger);

const {
  getAllUsers, getUserById, updateProfile, updateAvatar, getCurrentUser,
} = require('../controllers/users');

routesUser.get('/users', celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getAllUsers);

routesUser.get('/users/me', celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getCurrentUser);

routesUser.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).required().max(30),
    about: Joi.string().min(2).required().max(30),
  }).unknown(true),
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), updateProfile);

routesUser.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/),
  }).unknown(true),
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), updateAvatar);

routesUser.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }).unknown(true),
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getUserById);

routesUser.use(errorLogger);

module.exports = routesUser;
