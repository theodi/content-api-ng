const error_404 = require('./error_404.js');
const error_410 = require('./error_410.js');
const Artefacts = require('../mongo_documents/artefacts.js');
const Editions = require('../mongo_documents/editions.js');
const format_artefact = require('../json_format/artefacts.js');

async function artefact_formatter(req, res, db, url_helper) {
  const slug = req.params['artefactSlug'];
  const role = req.query['role'];

  const artefact = await Artefacts.by_slug(db, slug, role);

  if (!artefact)
    return error_404(res);
  if (artefact.state == 'archived')
    return error_410(res);
  if (artefact.state != 'live')
    return error_404(res);

  res.json(format_artefact(artefact, url_helper));
} // artefact_formatter

function make_artefact_formatter(db, url_helper) {
  return (req, res) =>
    artefact_formatter(req, res, db, url_helper);
} // make_artefact_formatter

module.exports = make_artefact_formatter;
