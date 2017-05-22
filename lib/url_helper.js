const config = require('config');

class url_helper {
  constructor(hostname, port = '', prefix = '', secure = false) {
    const protocol = secure ? 'https' : 'http';
    const port_part = port ? `:${port}` : '';
    const prefix_part = prefix ? `/${prefix}` : '';

    this.root_url = `${protocol}://${hostname}${port_part}${prefix_part}`;
  } // constructor

  api_url(url = '') {
    if (!url)
      url = '/';
    if (url[0] != '/')
      url = '/' + url;
    return this.root_url + url;
  } // api_url

  tag_type_url(tag_type) {
    const tt = tag_type.plural ? tag_type.plural : tag_type;
    return this.api_url(`/tags/${encodeURIComponent(tt)}.json`);
  } // tag_type_url
};

function default_url_helper(env) {
  if (env == 'test')
    return new url_helper('example.org');
  if (env == 'development')
    return new url_helper('localhost', config.get('express.port'));

  const hostname = config.get('server.hostname');
  const port = config.get('server.port');
  const prefix = config.get('server.prefix');
  const secure = config.get('server.secure');
  return new url_helper(hostname, port, prefix, secure);
} // default_url_helper

function make_url_helper(hostname, port, prefix, secure) {
  return new url_helper(hostname, port, prefix, secure);
} // make_url_helper

exports = module.exports = default_url_helper;
exports.custom = make_url_helper;
