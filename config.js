require('dotenv').config();

const { JWT_SECRET = 'some-secret-key', MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

module.exports = {
  JWT_SECRET,
  MONGO_URL,
};
