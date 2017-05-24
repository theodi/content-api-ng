const result_set = require('./result_set.js');
const tags = require('../presenters/tags.js');

function options(req) {
  const o = { };

  // not sure parent_id or root_sections are used - no tests, and no data with parent_id
  for (const [opt, q] of [['tag_type', 'type'], ['parent_id', 'parent_id']])
    if (req.query[q])
      o[opt] = req.query[q];
  if (req.query['root_sections'])
    o['parent_id'] = null;

  return o;
} // options

function tags_json_formatter(req, res, db, url_helper) {
  const opts = options(req);
  const label = opts.tag_type ? `${opts.tag_type} tags` : "All tags";

  tags(opts, db, url_helper).
    then(ts => res.json(result_set(ts, label)));
} // tags_json_formatter

function make_tag_json_formatter(db, url_helper) {
  return (req, res) =>
    tags_json_formatter(req, res, db, url_helper);
} // make_tag_json_formatter

module.exports = make_tag_json_formatter;
