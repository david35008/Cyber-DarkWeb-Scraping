const api = require('express').Router();
const helmet = require('helmet');

api.use(helmet());

api.use('/v1', require('./v1'));

module.exports = api;
