const equal = require('assert').equal;

const url_helper = require('../../lib/url_helper.js');

const du = url_helper('test');

const about_tag = { 'tag_id': 'about', 'tag_type': 'section' };
const halibut_tag = { 'tag_id': 'halibut', 'tag_type': 'fish' };
const trout_tag = { 'tag_id': 'trout', 'tag_type': 'fish' };

const brick_artefact = { 'slug': 'brick' };
const mortar_artefact = { 'slug': 'mortar', 'rendering_path': '/render-with-lime' };

describe('URL Helper', () => {
  it('app url', () => {
    equal(url_helper.custom('localhost').api_url(), 'http://localhost/');
    equal(url_helper.custom('localhost', '8080').api_url(), 'http://localhost:8080/');
    equal(url_helper.custom('localhost', 8099).api_url(), 'http://localhost:8099/');
    equal(url_helper.custom('localhost', 80, '', true).api_url(), 'https://localhost:80/');
    equal(url_helper.custom('localhost', 80, 'the-odi', true).api_url(), 'https://localhost:80/the-odi/');
  });

  it('tag type', () => {
    url_equal(du.tag_type_url('fish'), 'tags/fish.json');
    url_equal(du.tag_type_url('big_train'), 'tags/big_trains.json');

    const tt = { 'singular': 'banana', 'plural': 'bananas' };
    url_equal(du.tag_type_url(tt), 'tags/bananas.json');
  });

  it('tag', () => {
    url_equal(du.tag_url(about_tag), 'tags/sections/about.json');
    url_equal(du.tag_web_url(about_tag), 'http://theodi.test/tags/about');

    url_equal(du.tag_url(halibut_tag), 'tags/fish/halibut.json');
    url_equal(du.tag_web_url(halibut_tag), 'http://theodi.test/tags/halibut');
  });

  it('with_tag', () => {
    url_equal(du.with_tag_url(about_tag), 'with_tag.json?section=about');
    url_equal(du.with_tag_url(halibut_tag), 'with_tag.json?fish=halibut');
    url_equal(du.with_tag_url([halibut_tag, about_tag]), 'with_tag.json?fish=halibut&section=about');
    url_equal(du.with_tag_url([halibut_tag, trout_tag]), 'with_tag.json?fish=halibut%2Ctrout');
    url_equal(du.with_tag_url(about_tag, { 'sort': 'title' }), 'with_tag.json?section=about&sort=title');
  });

  it('with_type', () => {
    url_equal(du.with_type_url('muffin'), 'with_tag.json?type=muffin');
    url_equal(du.with_type_url('truffle', { 'sort': 'title' }), 'with_tag.json?type=truffle&sort=title');
  });

  it('artefact', () => {
    url_equal(du.artefact_url(brick_artefact), 'brick.json');
    url_equal(du.artefact_web_url(brick_artefact), 'http://theodi.test/brick');

    url_equal(du.artefact_url(mortar_artefact), 'mortar.json');
    url_equal(du.artefact_web_url(mortar_artefact), 'http://theodi.test/render-with-lime');
  });
});

function url_equal(actual, url_or_path) {
  const expected = url_or_path.startsWith('http') ? url_or_path : `http://example.org/${url_or_path}`;

  equal(actual, expected);
} // url_equal
