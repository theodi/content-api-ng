const equal = require('assert').equal;

const url_helper = require('../../lib/url_helper.js');

const default_url = url_helper('test');

const about = { tag_id: 'about', tag_type: 'section' };
const halibut = { tag_id: 'halibut', tag_type: 'fish' };
const trout = { tag_id: 'trout', tag_type: 'fish' };

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
    equal(default_url.tag_url(about), 'http://example.org/tags/sections/about.json');
    equal(default_url.tag_web_url(about), 'http://theodi.test/tags/about');

    equal(default_url.tag_url(halibut), 'http://example.org/tags/fish/halibut.json');
    equal(default_url.tag_web_url(halibut), 'http://theodi.test/tags/halibut');
  });

  it('with_tag', () => {
    equal(default_url.with_tag_url(about), 'http://example.org/with_tag.json?section=about');
    equal(default_url.with_tag_url(halibut), 'http://example.org/with_tag.json?fish=halibut');
    equal(default_url.with_tag_url([halibut, about]), 'http://example.org/with_tag.json?fish=halibut&section=about');
    equal(default_url.with_tag_url([halibut, trout]), 'http://example.org/with_tag.json?fish=halibut%2Ctrout');
    equal(default_url.with_tag_url(about, { 'sort': 'title' }), 'http://example.org/with_tag.json?section=about&sort=title');
  });

  it('with_type', () => {
    equal(default_url.with_type_url('muffin'), 'http://example.org/with_tag.json?type=muffin');
    equal(default_url.with_type_url('truffle', { 'sort': 'title' }), 'http://example.org/with_tag.json?type=truffle&sort=title');
  });
});
