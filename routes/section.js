const url = require('url'); 
const http = require('http');
const str_replace = require('str_replace');

function section_json_formatter(req, res, db, url_helper) {
  var options = {
    host: "contentapi-legacy.theodi.org",
    path: "/section.json?" + (require('url').parse(req.url).query)
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

function section(db, url_helper) {
  return (req, res) =>
    section_json_formatter(req, res, db, url_helper);
}

module.exports = section;