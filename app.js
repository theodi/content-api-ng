const express = require('express');
const logger = require('morgan');

const app = express();
app.use(logger('dev'));

app.get('/', (req, res) => res.send('Hello World'));

app.get('/hello.json',
	(req, res) => res.status(200).json({ greeting: 'Hello World' })
       );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
