const app = require('../../app');
const request = require('supertest')(app);
const assert = require('assert');
const equal = assert.equal;
const monk = require('monk');
const mongo_config = require('config').get('mongo');

const db = monk(`${mongo_config.hostname}:${mongo_config.port}/${mongo_config.database}`);

describe('With Tag', () => {
  expect_404('no tag query param');
  expect_404('empty tag query param', '?tag=');
  expect_404('unknown tag', '?tag=monkeypunks');
  expect_404('multiple tags found', '?tag=ambiguity');

  it('ignore keywords', done => {
    request.
      get('/with_tag.json?tag=farmers').
      expect(302).
      expect('Location', 'http://www.example.org/with_tag.json?section=farmers').
      end(done);
  }); // ignore keywords

  it('redirect to typed URL even when zero results', done => {
    request.
      get('/with_tag.json?tag=trout').
      expect(302).
      expect('Location', 'http://www.example.org/with_tag.json?article=farmers').
      end(done);
  });

});

function expect_404(label, query = '') {
  it('404 when ' + label, done => {
    request.
      get(`/with_tag.json${query}`).
      expect(404).
      end(done);
  });
} // expect_404
