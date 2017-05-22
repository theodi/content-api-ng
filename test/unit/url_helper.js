const equal = require('assert').equal;

const url_helper = require('../../lib/url_helper.js');

function url() {
    return url_helper('localhost', 3000);
} // url

describe('URL Helper', () => {
    it('app url', () => {
	equal(url_helper('localhost').api_url(), 'http://localhost/');
	equal(url_helper('localhost', '8080').api_url(), 'http://localhost:8080/');
	equal(url_helper('localhost', 8099).api_url(), 'http://localhost:8099/');
	equal(url_helper('localhost', 80, '', true).api_url(), 'https://localhost:80/');
	equal(url_helper('localhost', 80, 'the-odi', true).api_url(), 'https://localhost:80/the-odi/');
    });

    it('tag type', () => {
	equal(url().tag_type_url('fish'), 'http://localhost:3000/tags/fish.json');
	equal(url().tag_type_url('big_train'), 'http://localhost:3000/tags/big_train.json');

	const tt = { 'singular': 'banana', 'plural': 'bananas' };
	equal(url().tag_type_url(tt), 'http://localhost:3000/tags/bananas.json');
    });
});
