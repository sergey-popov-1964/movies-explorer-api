const routes = require('express').Router();
const routesUser = require('./users');
const routesMovies = require('./movies');

routes.use('/', routesUser);
routes.use('/', routesMovies);

module.exports = routes;
