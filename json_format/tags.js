const result_set = require('./result_set.js');
const tags = require('../mongo_documents/tags.js');

function format(tag, url_helper) {
  return {
    'id': url_helper.tag_url(tag),
    'web_url': null,
    'title': tag.title,
    'details': {
      'description': tag.description,
      'short_description': tag.short_description,
      'type': tag.tag_type
    },
    'content_with_tag': {
      'id': url_helper.with_tag_url(tag),
      'web_url': url_helper.tag_web_url(tag),
      'slug': tag.tag_id
    }
  };
} // format

function tags_json_formatter(req, res, db, url_helper) {
  const tag_type = req.query['type'];
  const label = tag_type ? `${tag_type} tags` : "All tags";

  tags.by_type(tag_type, db).
    then(ts => ts.map(tag => format(tag, url_helper))).
    then(ts => res.json(result_set(ts, label)));
} // tags_json_formatter

function make_tag_json_formatter(db, url_helper) {
  return (req, res) =>
    tags_json_formatter(req, res, db, url_helper);
} // make_tag_json_formatter

module.exports = make_tag_json_formatter;
