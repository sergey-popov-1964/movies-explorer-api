const routesMovie = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { requestLogger, errorLogger } = require('../middlewares/logger');

routesMovie.use(requestLogger);

const {
  createMovie, getAllMovies, deleteMovie,
} = require('../controllers/movies');

routesMovie.get('/movies', celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getAllMovies);

routesMovie.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(1).required(),
    director: Joi.string().min(1).required(),
    duration: Joi.number().required(),
    year: Joi.string().min(4).max(4).required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле image заполненно некорректно');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле trailer заполненно некорректно');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле thumbnail заполненно некорректно');
    }),
    movieId: Joi.number(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }).unknown(true),
}), createMovie);

routesMovie.delete('/movies/:movieId', deleteMovie);

routesMovie.use(errorLogger);

module.exports = routesMovie;
