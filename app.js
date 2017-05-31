const express = require('express');
const make_url_helper = require('./lib/url_helper.js');
const make_asset_api_client = require('./lib/asset_api.js');
const config = require('config');
const monk = require('monk');
const asset_api = require('./lib/asset_api.js');

const app = express();
const app_env = app.get('env');

const dev_mode = (app_env === 'development');
const test_mode = (app_env === 'test');

if (!test_mode) {
  const logger = require('morgan');
  app.use(logger('dev'));
} // if ...

const url_helper = make_url_helper(app_env);
const asset_api_client = make_asset_api_client(app_env);

const db = open_mongo(config.get('mongo'));
if (!test_mode)
  db.asset_api_client = asset_api_client;

//////////////////////
const tag_types_json = require('./routes/tag_types.js');
const tags_json = require('./routes/tags.js');
const with_tag_json = require('./routes/with_tag.js');
const latest_json = require('./routes/latest.js');
const artefact_json = require('./routes/artefact.js');
const search_json = require('./routes/search.js');
const section_json = require('./routes/section.js');
const artefact_image = require('./routes/image.js');

app.get('/', (req, res) => res.send('Hello World'));
app.get('/hello.json', (req, res) => res.json({ greeting: 'Hello World' }));
app.get('/tag_types.json', tag_types_json(db, url_helper));
app.get('/tags.json', tags_json(db, url_helper));
app.get('/with_tag.json', with_tag_json(db, url_helper));
app.get('/latest.json', latest_json(db, url_helper));
app.get('/:artefactSlug.json', artefact_json(db, url_helper));
app.get('/:artefactSlug/image', artefact_image(db));

app.get('/search.json', search_json(db, url_helper));
app.get('/section.json', section_json(db, url_helper));


console.log("Available endpoints are " + app._router.stack.filter(r => r.route).map(r => r.route.path).join(', '));

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
  const mongo_url = find_mongo_url(mongo_config);
  const db = monk(mongo_url);

  if (!test_mode)
    console.log(`Connected to mongo at ${mongo_url}`);

  return db;
} // open_mongo

function find_mongo_url(mongo_config) {
  if (process.env.MONGODB_URI) {
    console.log("Using MONGODB_URI environment variable");
    return process.env.MONGODB_URI;
  } // find_mongo_url

  const hostname = mongo_config.hostname;
  const port = mongo_config.port;
  const database = mongo_config.database;
  return `${hostname}:${port}/${database}`;
} // find_mongo_url

module.exports = app;
