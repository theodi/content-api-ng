const tags = require('../mongo_documents/tags.js');
const result_set = require('../json_format/result_set.js');
const format = require('../json_format/tags.js');
const error_503 = require('./error_503.js');

function tags_json_formatter(req, res, db, url_helper) {
  const tag_type = req.query['type'];
  const label = tag_type ? `${tag_type} tags` : "All tags";

  tags.by_type(tag_type, db).
    then(ts => ts.map(tag => format(tag, url_helper))).
    then(ts => res.json(result_set(ts, label))).
    catch(err => {
      console.log(err);
      error_503(res);
    });
} // tags_json_formatter

function make_tag_json_formatter(db, url_helper) {
  return (req, res) =>
    tags_json_formatter(req, res, db, url_helper);
} // make_tag_json_formatter

module.exports = make_tag_json_formatter;
