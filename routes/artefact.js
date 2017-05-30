const error_503 = require('./error_503.js');
const single_artefact = require('./single_artefact.js');

function artefact_formatter(req, res, db, url_helper) {
  const slug = req.params['artefactSlug'];

  single_artefact(slug, req, res, db, url_helper).
    catch(err => {
      console.log(err);
      error_503(res);
    });
} // artefact_formatter

function make_artefact_formatter(db, url_helper) {
  return (req, res) =>
    artefact_formatter(req, res, db, url_helper);
} // make_artefact_formatter

module.exports = make_artefact_formatter;
