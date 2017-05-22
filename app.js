const express = require('express');
const logger = require('morgan');

const app = express();
app.use(logger('dev'));

const tag_types = require('./routes/tag_types.js');

app.get('/', (req, res) => res.send('Hello World'));

app.get('/hello.json',
	(req, res) => res.json({ greeting: 'Hello World' })
       );

app.get('/tag_types.json', tag_types);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
  console.log(err);
});

module.exports = app;
