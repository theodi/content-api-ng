const url = require('url'); 
const http = require('http');
const str_replace = require('str_replace');
const error_503 = require('./error_503.js');

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
      try {
      	res.json(JSON.parse(str));
      } catch(err) {
      	console.log(err);
   		error_503(res);
      }
    });
  }

  try {
  	http.request(options,callback).end();
  } catch(err) {
  	console.log(err);
    error_503(res);
  }
} 

function section(db, url_helper) {
  return (req, res) =>
    section_json_formatter(req, res, db, url_helper);
}

module.exports = section;