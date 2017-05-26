const error_404 = require('./error_404.js');
const error_410 = require('./error_410.js');
const Artefacts = require('../mongo_documents/artefacts.js');
const Editions = require('../mongo_documents/editions.js');
const format_artefact = require('../json_format/artefacts.js');

async function artefact_formatter(req, res, db, url_helper) {
  const slug = req.params['artefactSlug'];
  const role = req.query['role'];
  const version = req.query['edition'];

  const artefact = await Artefacts.by_slug(db, slug, role);
  if (artefact_no_good(res, artefact, version))
    return;

  const edition = await Editions.for_artefact(db, artefact, version);
  if (edition_no_good(res, edition, version))
    return;

  // attach assets here

  res.json(format_artefact(artefact, url_helper));
} // artefact_formatter

function make_artefact_formatter(db, url_helper) {
  return (req, res) =>
    artefact_formatter(req, res, db, url_helper);
} // make_artefact_formatter

module.exports = make_artefact_formatter;

/////////////////////////////////
function artefact_no_good(res, artefact, version) {
  if (!artefact)
    return error_404(res);
  if (!version) {
    if (artefact.state == 'archived')
      return error_410(res);
    if (artefact.state != 'live')
      return error_404(res);
  } // if ...
} // valid_artefact

function edition_no_good(res, edition, version) {
  if (version && !edition)
    return error_404(res);

  if (edition && !version) {
    // hmmmm
    if (edition.state == 'archived')
      return error_410(res);
    if (edition.state != 'published')
      return error_404(res);
  } // if ...
} // edition_no_good
