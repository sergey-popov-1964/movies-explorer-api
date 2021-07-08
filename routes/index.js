const routes = require('express').Router();
const routesUser = require('./users');
const routesCards = require('./cards');

routes.use('/', routesUser);
routes.use('/', routesCards);

module.exports = routes;
