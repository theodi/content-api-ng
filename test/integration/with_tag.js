const app = require('../../app');
const request = require('supertest')(app);
const assert = require('assert');
const equal = assert.equal;
const monk = require('monk');
const mongo_config = require('config').get('mongo');

const db = monk(`${mongo_config.hostname}:${mongo_config.port}/${mongo_config.database}`);

describe('With Tag', () => {
  expect_404('no tag query param', '/with_tag.json');
  expect_404('empty tag query param', '/with_tag.json?tag=');
  expect_404('unknown tag', '/with_tag.json?tag=farmers');


});

function expect_404(label, url) {
  it('404 when ' + label, done => {
    request.
      get(url).
      expect(404).
      end(done);
  });
} // expect_404
