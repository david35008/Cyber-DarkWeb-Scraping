const express = require('express');
const path = require('path');
const app = express();
app.use(express.json({ limit: '50mb' }));

app.use(require("./middleware/morgan"));

app.use('/api', require('./api'));

app.use(express.static(path.join(__dirname, '.', 'build')));

app.use('*', (req, res) => {
    res.sendStatus(404);
});

module.exports = app;
