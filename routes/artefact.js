const error_404 = require('./error_404.js');
const Artefacts = require('../mongo_documents/artefacts.js');
const Editions = require('../mongo_documents/editions.js');

function artefact_formatter(req, res, db, url_helper) {
  console.log(req.params);
  error_404(res);
} // artefact_formatter

function make_artefact_formatter(db, url_helper) {
  return (req, res) =>
    artefact_formatter(req, res, db, url_helper);
} // make_artefact_formatter

module.exports = make_artefact_formatter;
