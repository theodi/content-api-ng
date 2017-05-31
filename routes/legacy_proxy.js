const httpGet = require('simple-get').concat;
const url_parse = require('url').parse;
const str_replace = require('str_replace');
const error_503 = require('./error_503.js');

function legacy_proxy(req, res, endpoint) {
  const host = 'contentapi-legacy.theodi.org';
  const query = url_parse(req.url).query;
  const path = `${endpoint}?${query}`;
  const legacy_url = `http://${host}${path}`;

  console.log(`Proxying ${legacy_url}`);
  httpGet({
    url: legacy_url,
    method: 'GET',
    headers: {
      'User-Agent': 'content-api-ng'
    }
  }, function (err, response, data) {
    if (err) {
      console.log(`Legacy error: ${err}`);
      return error_503(res);
    } // if (err)

    const fixed_up = str_replace('contentapi-legacy', 'contentapi', data);
    try {
      res.json(JSON.parse(fixed_up));
    } catch (err) {
      console.log(`Legacy json parsing error: ${err}`);
      return error_503(res);
    } //
  });
} // legacy_proxy

function make_legacy_proxy(endpoint) {
  console.log("woo");
  return (req, res) =>
    legacy_proxy(req, res, endpoint);
} // make_legacy_proxy

module.exports = make_legacy_proxy
