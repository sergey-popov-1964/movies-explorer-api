const routesCard = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('../middlewares/logger');

routesCard.use(requestLogger);

const {
  createCard, getAllCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

routesCard.get('/cards', celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getAllCards);

routesCard.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).required().max(30),
    link: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/),
  }).unknown(true),
}), createCard);

routesCard.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);

routesCard.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), likeCard);

routesCard.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), dislikeCard);

routesCard.use(errorLogger);

module.exports = routesCard;
