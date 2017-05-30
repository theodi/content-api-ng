const error_404 = require('./error_404.js');
const single_artefact = require('./single_artefact.js');
const Content_types = require('../mongo_documents/content_types.js');
const Tags = require('../mongo_documents/tags.js');
const Artefacts = require('../mongo_documents/artefacts.js');
const singular = require('pluralize').singular;

async function latest_formatter(req, res, db, url_helper) {
  const slug = await find_and_verify_slug(db, req);
  if (!slug)
    return error_404(res);
  single_artefact(slug, req, res, db, url_helper);
} // latest_formatter

function make_latest_formatter(db, url_helper) {
  return (req, res) =>
    latest_formatter(req, res, db, url_helper);
} // make_latest_formatter

module.exports = make_latest_formatter;

//////////////////////////////
function find_and_verify_slug(db, req) {
  const type = req.query["type"];
  const tag = req.query["tag"];
  const role = req.query["role"];

  if (type)
    return verify_type_and_find_slug(db, singular(type), role);
  if (tag)
    return verify_tag_and_find_slug(db, tag, role);
  return null;
} // find_and_verify_slug

async function verify_type_and_find_slug(db, type, role) {
  if (!Content_types.some(ct => ct == type))
    return;

  return await latest_artefact_slug(db, Artefacts.by_type, type, role);
} // verify_type_and_find_slug

async function verify_tag_and_find_slug(db, tag, role) {
  const possible_tags = await Tags.by_ids(tag, db);  // I think this check may be redundant
  if (possible_tags.length == 0)
    return;

  return await latest_artefact_slug(db, Artefacts.by_tags, tag, role);
} // verify_tag_and_find_slug

async function latest_artefact_slug(db, query_method, param, role) {
  const artefacts = await query_method(db, param, role,
		  		       { sort: 'date', limit: 1});
  if (!artefacts.length)
    return;

  const artefact = artefacts[0];
  return artefact.slug;
} // latest_artefact_slug
