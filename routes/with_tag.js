const result_set = require('./result_set.js');
const error_404 = require('./error_404.js');
const content_types = require('../presenters/content_types.js');
const Tags = require('../presenters/tags.js');
const singular = require('pluralize').singular;

//////////////////////////////////////////////////////////////
async function handle_tag_param(req, res, db, url_helper) {
  const tag = req.query["tag"];
  const tags = await Tags.by_ids(tag, db);

  const modifiers = modifier_params(req);
  const possible_tags = tags.filter(uniq_by_tag_type());

  // If we can unambiguously determine the tag type, redirect to its correct URL
  if (possible_tags.length == 1)
    res.redirect(url_helper.with_tag_url(tags, modifiers));
  else if (content_types.some(ct => ct == singular(tag)))
    res.redirect(url_helper.with_type_url(tag, modifiers));
  else
    error_404(res);
} // handle_tag_param

function with_tag_formatter(req, res, db, url_helper) {
  if (req.query["tag"])
    return handle_tag_param(req, res, db, url_helper);

  error_404(res);
} // with_tags_formatter

function make_with_tag_formatter(db, url_helper) {
  return (req, res) =>
    with_tag_formatter(req, res, db, url_helper);
} // make_with_tag_formatter

module.exports = make_with_tag_formatter;


///////////////////////////
///////////////////////////
const modifiers = [
  'sort',
  'author',
  'node',
  'organization_name',
  'role',
  'whole_body',
  'page',
  'order_by',
  'summary'
];

function modifier_params(req) {
  const m = {};
  for (const p of modifiers)
    if (req.query[p])
      m[p] = req.query[p];
  return m;
} // modifier_params

function uniq_by_tag_type() {
  const seen = {};
  return (tag) => {
    if (seen[tag.tag_type])
      return false;
    return seen[tag.tag_type] = true;
  };
} // uniq
