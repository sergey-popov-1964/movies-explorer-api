const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/users');

const getAllUsers = (req, res, next) => User.find({})
  .then((user) => res.status(200).send({data: user}))
  .catch(next);

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      const { password, ...publicUser } = user.toObject();
      res.status(200).send({data: publicUser});
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const err = new Error('Переданы некорректные данные при создании пользователя');
        err.statusCode = 400;
        next(err);
      } else if (err.name === 'MongoError' && err.code === 11000) {
        const err = new Error('Такой пользователь уже зарегистрирован');
        err.statusCode = 409;
        next(err);
      }
      next(err);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const {userId} = req.params;
  return User.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send({data: user}))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        const err = new Error('Пользователь по указанному _id не найден');
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

const updateProfile = (req, res, next) => {
  const ownerID = req.user._id;
  const {name, about} = req.body;
  const opts = {runValidators: true, new: true};
  return User.findByIdAndUpdate(ownerID, {name, about}, opts)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send({data: user}))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        const err = new Error('Пользователь по указанному _id не найден');
        err.statusCode = 404;
        next(err);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        const err = new Error('Переданы некорректные данные при обновлении профиля');
        err.statusCode = 400;
        next(err);
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const ownerID = req.user._id;
  const {avatar} = req.body;
  const opts = {runValidators: true, new: true};
  return User.findByIdAndUpdate(ownerID, {avatar}, opts)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send({data: user}))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        const err = new Error('Пользователь по указанному _id не найден');
        err.statusCode = 404;
        next(err);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        const err = new Error('Переданы некорректные данные при обновлении профиля');
        err.statusCode = 400;
        next(err);
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const {email, password} = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      let jwtKey = '';
      NODE_ENV === 'production' ? jwtKey = JWT_SECRET : jwtKey = 'some-secret-key';
      const token = jwt.sign({_id: user._id}, jwtKey, {expiresIn: '7d'});
      res.send({ token });
    })
    .catch((e) => {
      const err = new Error('Ошибка авторизации11');
      err.statusCode = 401;
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  return User.findById(req.user._id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send({data: user}))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        const err = new Error('Пользователь по указанному _id не найден');
        err.statusCode = 404;
        next(err);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        const err = new Error('Переданы некорректные данные при обновлении профиля');
        err.statusCode = 400;
        next(err);
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllUsers, createUser, getUserById, updateProfile, updateAvatar, login, getCurrentUser,
};
