const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const routesUser = require('./users');
const routesMovies = require('./movies');
const auth = require('../middlewares/auth');
const {
  login, createUser,
} = require('../controllers/users');

routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).required()
      .max(30),
  }).unknown(true),
}), login);

routes.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).required()
      .max(30),
  }).unknown(true),
}), createUser);

routes.use(auth);

routes.use('/', routesUser);
routes.use('/', routesMovies);

module.exports = routes;
