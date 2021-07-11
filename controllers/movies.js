const Movie = require('../models/movies');

const createMovie = (req, res, next) => {
  // console.log("createMovie")
  const ownerID = req.user._id;
  const {country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId} = req.body;
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
    owner: ownerID
  })
    .then((card) => res.status(200).send({data: card}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const err = new Error('Переданы некорректные данные при создании фильма');
        err.statusCode = 400;
        next(err);
      }
      next(err);
    });
};

const getAllMovies = (req, res) => Movie.find({})
  .then((movie) => res.status(201).send({data: movie}))
  .catch((err) => res.status(500).send({message: err.message}));

const deleteMovie = (req, res, next) => {
  console.log("deleteMovie")
  const {movieId} = req.params;
  console.log('movieId', movieId)
  console.log('user._id', req.user._id)
  return Movie.findById(movieId)
    .orFail(new Error('NotValidId'))
    .then((movie) => {
      console.log('owner', movie.owner)
      console.log(movie)
      if (movie.owner !== (req.user._id)) {
        const err = new Error('Редактирование/удаление чужих данных запрещено');
        err.statusCode = 403;
        next(err);
      } else {
        return Movie.findByIdAndRemove(movieId)
          .then((movie) => res.status(201).send({data: movie}));
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        const err = new Error('Фильм с указанным _id не найден');
        err.statusCode = 404;
        next(err);
      } else if (err.name === 'CastError') {
        const err = new Error('Переданы некорректные данные');
        err.statusCode = 400;
        next(err);
      } else {
        next(err);
      }
    });
};

module.exports = {
  createMovie, getAllMovies, deleteMovie,
};
