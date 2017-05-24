const result_set = require('./result_set.js');
const error_404 = require('./error_404.js');
const content_types = require('../presenters/content_types.js');
const tags = require('../presenters/tags.js');
const singular = require('pluralize').singular;

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

//////////////////////////////////////////////////////////////
async function handle_tag_param(req, res, db, url_helper) {
  const tag = req.query["tag"];
  const possible_tags = await tags.by_ids(tag, db);

  const modifiers = modifier_params(req);
  // If we can unambiguously determine the tag, redirect to its correct URL
  if (possible_tags.length == 1)
    res.redirect(url_helper.with_tag_url(possible_tags, modifiers));
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
