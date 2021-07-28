const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Users = require('../models/users');
const ConflictRequestErr = require('../errors/conflict-request-err');
const BadRequestErr = require('../errors/bad-request-err');
const NotFoundErr = require('../errors/not-found-err');
const UnauthorizedErr = require('../errors/unauthorized-err');
const { JWT_SECRET } = require('../config');

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => Users.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      const { password, ...publicUser } = user.toObject();
      res.status(200).send({ data: publicUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные при создании пользователя'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictRequestErr('Такой пользователь уже зарегистрирован'));
      }
      next(err);
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const ownerID = req.user._id;
  const { name, email } = req.body;
  const opts = { runValidators: true, new: true };
  return Users.findByIdAndUpdate(ownerID, { name, email }, opts)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundErr('Пользователь по указанному _id не найден'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные при обновлении профиля'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictRequestErr('Такой пользователь уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedErr('Неправильная почта или пароль'));
    });
};

const getCurrentUser = (req, res, next) => Users.findById(req.user._id)
  .orFail(new Error('NotValidId'))
  .then((user) => res.status(200).send({ data: user }))
  .catch((err) => {
    if (err.message === 'NotValidId') {
      next(new NotFoundErr('Пользователь по указанному _id не найден'));
    } else if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequestErr('Переданы некорректные данные при обновлении профиля'));
    } else {
      next(err);
    }
  });

module.exports = {
  createUser, updateProfile, login, getCurrentUser,
};
