const error_404 = require('./error_404.js');
const single_artefact = require('./single_artefact.js');
const Tags = require('../mongo_documents/tags.js');
const Artefacts = require('../mongo_documents/artefacts.js');

function latest_formatter(req, res, db, url_helper) {
  const slug = find_and_verify_slug(db, req);

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
    return verify_type_and_find_slug(db, type);
  if (tag)
    return verify_tag_and_find_slug(db, tag, role);
  return null;
} // find_and_verify_slug

function verify_type_and_find_slug(db, type) {
} // verify_type_and_find_slug

async function verify_tag_and_find_slug(db, tag, role) {
  const possible_tags = await Tags.by_ids(tag, db);

  console.log(possible_tags);
  if (possible_tags.length == 0)
    return;

  const aretfact = await Artefacts.by_tags(tag, role, 'date')
} // verify_tag_and_find_slug
