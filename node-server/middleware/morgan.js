const morgan = require('morgan');

module.exports = morgan((tokens, req, res) => {
  const myTiny = [tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'];
  return myTiny.join(' ');
});
