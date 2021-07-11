const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country : {
    type: String,
    required: true,
  },
  director : {
    type: String,
    required: true,
  },
  duration : {
    type: Number,
    required: true,
  },
  year : {
    type: String,
    required: true,
  },
  description  : {
    type: String,
    required: true,
  },
  image  : {
    type: String,
    required: true,
    validate: [{ validator: isUrl }],
  },
  trailer  : {
    type: String,
    required: true,
    validate: [{ validator: isUrl }],
  },
  thumbnail  : {
    type: String,
    required: true,
    validate: [{ validator: isUrl }],
  },
  owner  : {
    type: String,
    required: true,
  },
  movieId  : {
    type: String,
    required: true,
  },
  nameRU  : {
    type: String,
    required: true,
  },
  nameEN  : {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
