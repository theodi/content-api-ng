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

function make_url_helper(hostname, port, prefix, secure) {
    return new url_helper(hostname, port, prefix, secure);
} // make_url_helper

module.exports = make_url_helper;
