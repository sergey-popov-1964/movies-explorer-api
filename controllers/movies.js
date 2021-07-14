const Movie = require('../models/movies');
const BadRequestErr = require('../errors/bad-request-err');
const NotFoundErr = require('../errors/not-found-err');
const ForbiddenErr = require('../errors/forbidden-err');

const createMovie = (req, res, next) => {
  const ownerID = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: ownerID,
  })
    .then(() => res.status(200)
      .send({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailer,
        nameRU,
        nameEN,
        thumbnail,
        movieId,
      }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные при создании фильма'));
        // const err = new Error('Переданы некорректные данные при создании фильма');
        // err.statusCode = 400;
        // next(err);
      }
      next(error);
    });
};

const getAllMovies = (req, res) => Movie.find({})
  .then(() => res.status(200) .send({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  }))
  .catch((err) => res.status(500).send({ message: err.message }));

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  return Movie.findById(movieId)
    .orFail(new Error('NotValidId'))
    .then((movie) => {
      if (movie.owner !== (req.user._id)) {
        next(new ForbiddenErr('Редактирование/удаление чужих данных запрещено'));
        // const err = new Error('Редактирование/удаление чужих данных запрещено');
        // err.statusCode = 403;
        // next(err);
      } else {
        Movie.findByIdAndRemove(movieId)
          .then((mov) => res.status(201).send({ data: mov }));
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundErr('Фильм с указанным _id не найден'));
        // const err = new Error('Фильм с указанным _id не найден');
        // err.statusCode = 404;
        // next(err);
      } else if (err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные'));
        // const err = new Error('Переданы некорректные данные');
        // err.statusCode = 400;
        // next(err);
      } else {
        next(err);
      }
    });
};

module.exports = {
  createMovie, getAllMovies, deleteMovie,
};
