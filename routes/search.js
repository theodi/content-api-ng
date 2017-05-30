const url = require('url'); 

function search_json_formatter(req, res, db, url_helper) {
  res.redirect(302,"https://contentapi.theodi.org/search.json?" + (require('url').parse(req.url).query));
} 

function search(db, url_helper) {
  return (req, res) =>
    search_json_formatter(req, res, db, url_helper);
}

module.exports = search;