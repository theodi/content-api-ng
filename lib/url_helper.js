const config = require('config');
const pluralize = require('pluralize');
const querystring = require('querystring').stringify;

class url_helper {
  constructor(hostname, port = '', prefix = '', secure = false, frontend = 'not-set') {
    const protocol = secure ? 'https' : 'http';
    const port_part = port ? `:${port}` : '';
    const prefix_part = prefix ? `/${prefix}` : '';

    this.apiroot_ = `${protocol}://${hostname}${port_part}${prefix_part}`;

    if (frontend[frontend.length-1] == '/')
      frontend = frontend.slice(0, -1);
    this.webroot_ = frontend;
  } // constructor

  make_url(root, path = '') {
    if (!path)
      path = '/';
    if (path[0] != '/')
      path = '/' + path;
    return root + path;
  } // api_url

  api_url(path) {
    return this.make_url(this.apiroot_, path);
  } // api_url

  public_web_url(path) {
    return this.make_url(this.webroot_, path);
  } // public_web_url

  tag_type_url(tag_type) {
    const tt = plural_tag_type(tag_type);
    return this.api_url(`/tags/${encodeURIComponent(tt)}.json`);
  } // tag_type_url

  tag_url(tag) {
    const plural = plural_tag_type(tag.tag_type);
    return this.api_url(`/tags/${encodeURIComponent(plural)}/${encodeURIComponent(tag.tag_id)}.json`);
  } // tag_url

  with_tag_url(tag_or_tags, params = {}) {
    const tags = Array.isArray(tag_or_tags) ? tag_or_tags : Array.of(tag_or_tags);
    const query = {}
    for (const tag of tags)
      query[tag.tag_type] = tag.tag_id;
    for (const [k,v] of Object.entries(params))
      query[k] = v;

    return this.api_url(`with_tag.json?${querystring(query)}`);
  } // with_tag_url

  tag_web_url(tag) {
    return this.public_web_url(`/tags/${encodeURIComponent(tag.tag_id)}`);
  } // with_tag_web_url
};

function plural_tag_type(tag_type) {
  return tag_type.plural ? tag_type.plural : pluralize(tag_type);
} // plural_tag_type

function default_url_helper() {
  const hostname = config.get('api.hostname');
  const port = config.get('api.port');
  const prefix = config.get('api.prefix');
  const secure = config.get('api.secure');

  const frontend = config.get('frontend.webroot');
  return new url_helper(hostname, port, prefix, secure, frontend);
} // default_url_helper

function make_url_helper(hostname, port, prefix, secure, frontend) {
  return new url_helper(hostname, port, prefix, secure, frontend);
} // make_url_helper

exports = module.exports = default_url_helper;
exports.custom = make_url_helper;
