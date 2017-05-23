const result_set = require('../presenters/result_set.js');
const tags = require('../presenters/tags.js');

function tags_json_formatter(req, res, db, url_helper) {
  tags(db, url_helper).
    then(ts => res.json(result_set(ts, "All tags")));
} // tags_json_formatter

function make_tag_json_formatter(db, url_helper) {
  return (req, res) =>
    tags_json_formatter(req, res, db, url_helper);
} // make_tag_json_formatter

module.exports = make_tag_json_formatter;
