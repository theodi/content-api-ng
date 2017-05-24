const result_set = require('../presenters/result_set.js');
const error_404 = require('./error_404.js');

function handle_tag_param(tag, db, url_helper) {
} // handle_tag_param

function with_tag_formatter(req, res, db, url_helper) {
  error_404(res);
} // with_tags_formatter

function make_with_tag_formatter(db, url_helper) {
  return (req, res) =>
    with_tag_formatter(req, res, db, url_helper);
} // make_with_tag_formatter

module.exports = make_with_tag_formatter;
