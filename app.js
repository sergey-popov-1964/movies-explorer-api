const express = require('express');
const cors = require('cors');
require('dotenv').config();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { limiter } = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGO_URL } = require('./config');
const NotFoundErr = require('./errors/not-found-err');
const handlererror = require('./middlewares/handlererror');

const { PORT = 3000 } = process.env;
const routes = require('./routes/index');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://sergeypopov.nomoredomains.rocks',
      'https://sergeypopov.nomoredomains.rocks',
      'http://api.sergeypopov.nomoredomains.rocks',
      'http://api.sergeypopov.nomoredomains.rocks/signin',
      'http://api.sergeypopov.nomoredomains.rocks/signup',
      'https://api.sergeypopov.nomoredomains.rocks',
      'https://api.sergeypopov.nomoredomains.rocks/signin',
      'https://api.sergeypopov.nomoredomains.rocks/signup',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
    credentials: true,
  }),
);

app.use(bodyParser.json());

app.use(limiter);
app.use(requestLogger);

app.use(routes);

routes.use((req, res, next) => {
  next(new NotFoundErr('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(handlererror);

mongoose.connect(MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT);
