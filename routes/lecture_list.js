const error_503 = require('./error_503.js');
const Artefacts = require('../mongo_documents/artefacts.js');
const result_set = require('../json_format/result_set.js');
const format_artefact = require('../json_format/artefacts.js');
const stream_from = require('rillet').from;

function send_previous_upcoming_artefacts(res, artefacts, url_helper) {
  const today = today_timestamp();
  const previous = stream_from(artefacts).
	  filter(a => a.edition.start_date.getTime() < today).
  	  map(a => format_artefact(a, url_helper)).
	  toArray();
  const upcoming = stream_from(artefacts).
	  filter(a => a.edition.start_date.getTime() >= today).
  	  map(a => format_artefact(a, url_helper)).
	  toArray();

  res.json({
    'previous': previous,
    'upcoming': upcoming
  });
} // send_previous_upcoming_artefacts

async function lecture_list_formatter(req, res, db, url_helper) {
  Artefacts.by_tags(
      db,
      'lunchtime-lecture,event:lunchtime-lecture',
      req.query["role"],
      { sort: req.query["sort"], filter: tag_extra_params(req) }
  ).
  then(artefacts => send_previous_upcoming_artefacts(res, artefacts, url_helper)).
  catch(err => {
    console.log(err);
    error_503(res);
  });
} // lecture_list_formatter

function make_lecture_list_formatter(db, url_helper) {
  return (req, res) =>
    lecture_list_formatter(req, res, db, url_helper);
} // make_lecture_list_formatter

module.exports = make_lecture_list_formatter;

/////////////////////////
function today_timestamp() {
  const now = new Date();
  const today =  new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return today.getTime();
} // today_timestamp

const tag_extras = [
  'author',
  'node',
  'organization_name'
];

function tag_extra_params(req) {
  return grab_request_params(req, tag_extras);
} // tag_extras

function grab_request_params(req, names) {
  const m = {};
  for (const p of names)
    if (req.query[p])
      m[p] = req.query[p];
  return m;
} // grab_request_params
