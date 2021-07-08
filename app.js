const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const auth = require('./middlewares/auth');
const {createUser, login} = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {PORT = 3000} = process.env;
const routes = require('./routes/index');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://sergeykms.students.nomoredomains.club',
      'https://sergeykms.students.nomoredomains.club',
      'http://back.sergeykms.students.nomoredomains.club',
      'http://back.sergeykms.students.nomoredomains.club/signin',
      'http://back.sergeykms.students.nomoredomains.club/signup',
      'https://back.sergeykms.students.nomoredomains.club',
      'https://back.sergeykms.students.nomoredomains.club/signin',
      'https://back.sergeykms.students.nomoredomains.club/signup',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
    credentials: true,
  }),
);

app.use(bodyParser.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).required()
      .max(30),
  }).unknown(true),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).required()
      .max(30),
  }).unknown(true),
}), createUser);

app.use(auth);
app.use(routes);

routes.use((req, res, next) => {
  const err = new Error('Запрашиваемый ресурс не найден');
  err.statusCode = 404;
  next(err);
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const {statusCode = 500, message} = err;
  res.status(statusCode)
    .send({message: statusCode === 500 ? 'На сервере произошла ошибка' : message});
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
});
