const Card = require('../models/cards');

const createCard = (req, res, next) => {
  const ownerID = req.user._id;
  const {name, link} = req.body;
  return Card.create({ name, link, owner: ownerID })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const err = new Error('Переданы некорректные данные при создании карточки');
        err.statusCode = 400;
        next(err);
      }
      next(err);
    });
};

const getAllCards = (req, res) => Card.find({})
  .then((card) => res.status(201).send({ data: card }))
  .catch((err) => res.status(500).send({ message: err.message }));

const deleteCard = (req, res, next) => {
  const {cardId} = req.params;
  return Card.findById(cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        const err = new Error('Редактирование/удаление чужих данных запрещено');
        err.statusCode = 403;
        next(err);
      } else {
        return Card.findByIdAndRemove(cardId)
          .then((card) => res.status(201).send({ data: card }));
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        const err = new Error('Карточка с указанным _id не найдена');
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

const likeCard = (req, res, next) => {
  const ownerID = req.user._id;
  const {cardId} = req.params;
  return Card.findByIdAndUpdate(cardId, {$addToSet: {likes: ownerID}}, {new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        const err = new Error('Карточка с указанным _id не найдена');
        err.statusCode = 404;
        next(err);
      } else if (err.name === 'CastError') {
        const err = new Error('Переданы некорректные данные для постановки/снятии лайка');
        err.statusCode = 400;
        next(err);
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const ownerID = req.user._id;
  const {cardId} = req.params;
  return Card.findByIdAndUpdate(cardId, {$pull: {likes: ownerID}}, {new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        const err = new Error('Переданы некорректные данные для постановки/снятии лайка');
        err.statusCode = 400;
        next(err);
      } else if (err.name === 'CastError') {
        const err = new Error('Переданы некорректные данные для постановки/снятии лайка');
        err.statusCode = 400;
        next(err);
      } else {
        next(err);
      }
    });
};

module.exports = {
  createCard, getAllCards, deleteCard, likeCard, dislikeCard,
};
