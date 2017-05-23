const equal = require('assert').equal;

const url_helper = require('../../lib/url_helper.js');

const default_url = url_helper('test');

describe('URL Helper', () => {
  it('app url', () => {
    equal(url_helper.custom('localhost').api_url(), 'http://localhost/');
    equal(url_helper.custom('localhost', '8080').api_url(), 'http://localhost:8080/');
    equal(url_helper.custom('localhost', 8099).api_url(), 'http://localhost:8099/');
    equal(url_helper.custom('localhost', 80, '', true).api_url(), 'https://localhost:80/');
    equal(url_helper.custom('localhost', 80, 'the-odi', true).api_url(), 'https://localhost:80/the-odi/');
  });

  it('tag type', () => {
    equal(default_url.tag_type_url('fish'), 'http://example.org/tags/fish.json');
    equal(default_url.tag_type_url('big_train'), 'http://example.org/tags/big_trains.json');

    const tt = { 'singular': 'banana', 'plural': 'bananas' };
    equal(default_url.tag_type_url(tt), 'http://example.org/tags/bananas.json');
  });

  it('tag', () => {
    const about = { tag_id: 'about', tag_type: 'section' };
    equal(default_url.tag_url(about), 'http://example.org/tags/sections/about.json');
    equal(default_url.with_tag_url(about), 'http://example.org/with_tag.json?section=about');
    equal(default_url.tag_web_url(about), 'http://theodi.test/tags/about');

    const halibut = { tag_id: 'halibut', tag_type: 'fish' };
    equal(default_url.tag_url(halibut), 'http://example.org/tags/fish/halibut.json');
    equal(default_url.with_tag_url(halibut), 'http://example.org/with_tag.json?fish=halibut');
    equal(default_url.tag_web_url(halibut), 'http://theodi.test/tags/halibut');

    equal(default_url.with_tag_url([halibut, about]), 'http://example.org/with_tag.json?fish=halibut&section=about');
  });
});
