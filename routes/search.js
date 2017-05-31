const url = require('url'); 
const http = require('http');
const str_replace = require('str_replace');

function search_json_formatter(req, res, db, url_helper) {
  var options = {
    host: "contentapi-legacy.theodi.org",
    path: "/search.json?" + (require('url').parse(req.url).query)
  };

  callback = function(response) {
    var str = '';

    response.on('data', function(chunk) {
      str += str_replace('contentapi-legacy','contentapi',chunk);
    });

    response.on('end', function () {
      res.json(JSON.parse(str));
    });
  }
  http.request(options,callback).end();
} 

function search(db, url_helper) {
  return (req, res) =>
    search_json_formatter(req, res, db, url_helper);
}

module.exports = search;