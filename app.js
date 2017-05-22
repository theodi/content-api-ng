const express = require('express');
const make_url_helper = require('./lib/url_helper.js');
const config = require('config');
const monk = require('monk');

const app = express();
const app_env = app.get('env');

const dev_mode = (app_env === 'development');
const test_mode = (app_env === 'test');

if (!test_mode) {
  const logger = require('morgan');
  app.use(logger('dev'));
} // if ...

const url_helper = make_url_helper(app_env);

const db = open_mongo(config.get('mongo'));

//////////////////////
const tag_types_json = require('./routes/tag_types.js');

app.get('/', (req, res) => res.send('Hello World'));
app.get('/hello.json', (req, res) => res.json({ greeting: 'Hello World' }));
app.get('/tag_types.json', tag_types_json(db, url_helper));

////////////////////////////////////////////
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/////////////////////////////////////////////
// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
  if (!test_mode)
    console.log(err);
});

//////////////////////////////////////////////
function open_mongo(mongo_config) {
  const hostname = mongo_config.hostname;
  const port = mongo_config.port;
  const database = mongo_config.database;

  const mongo_url = `${hostname}:${port}/${database}`;
  const db = monk(mongo_url);

  if (!test_mode)
    console.log(`Connected to mongo at ${mongo_url}`);

  return db;
} // open_mongo

module.exports = app;
