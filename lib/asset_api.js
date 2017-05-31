const config = require('config');
const construct_url = require('./config_helper.js').construct_url;
const httpGet = require('simple-get').concat;

class asset_api_client {
  constructor(asset_api_url, bearer_token) {
    this.asset_api_url_ = asset_api_url;
    this.bearer_token_ = bearer_token;
  } // constructor

  get(asset_id) {
    return new Promise((resolve, reject) => {
      httpGet({
	url: `${this.asset_api_url_}/assets/${asset_id}`,
	method: 'GET',
	headers: {
	  'Authorization': `Bearer ${this.bearer_token_}`,
	  'Accept': 'application/json',
	  'User-Agent': 'content-api-ng'
	}
      }, function (err, res, data) {
	if (err)
	  return reject(err);
	resolve(JSON.parse(data));
      });
    });
  } // get
} // class asset_api_client

function asset_api_url(asset_api_config) {
  const url = construct_url(asset_api_config);
  console.log(`Asset-api URL is ${url}`);
  return url;
} // asset_api_url

function asset_api_bearer_token(asset_api_config) {
  if (process.env['CONTENTAPI_ASSET_MANAGER_BEARER_TOKEN']) {
    console.log(`Asset-api bearer token found in environment`);
    return process.env['CONTENTAPI_ASSET_MANAGER_BEARER_TOKEN'];
  } // if ...

  const bearer = config.has('bearer-token') ? config.get('bearer-token') : undefined;
  if (!bearer)
    console.log(`Asset-api bearer token not set`);
  return bearer;
} // asset_api_bearer_token

function default_asset_api() {
  const asset_api_config = config.get('asset-api');

  return new asset_api_client(asset_api_url(asset_api_config), asset_api_bearer_token(asset_api_config));
} // default_asset_api

module.exports = default_asset_api;

/*
const asset_api = new asset_api_client(
  'https://odi-asset-manager.herokuapp.com',
  '1a7f7fd420ccd66b4e70591ab57823aa263228c49cdbd6dd78b2e1922aea27ad'
);

asset_api.get('527a1ed71f986a3aa300005e').
  then(body => console.log(body)).
  catch(reason => console.error(`OOPS: ${reason}`));

asset_api.get('chunkle').
  then(body => console.log(body)).
  catch(reason => console.error(`OOPS: ${reason}`));
*/
