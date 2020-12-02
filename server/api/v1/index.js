const v1Router = require('express').Router();

v1Router.use('/data', require('./data'));
v1Router.use("/keyword", require("./keyWords"));
v1Router.use("/alerts", require("./alerts"));

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
};

v1Router.use(unknownEndpoint);

module.exports = v1Router;
