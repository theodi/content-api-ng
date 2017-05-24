const app = require('../../app');
const request = require('supertest')(app);
const assert = require('assert');
const equal = assert.equal;
const monk = require('monk');
const mongo_config = require('config').get('mongo');

const db = monk(`${mongo_config.hostname}:${mongo_config.port}/${mongo_config.database}`);
const tags_collection = db.get('tags');

describe('With Tag', () => {
  expect_404('no tag query param');
  expect_404('empty tag query param', '?tag=');
  expect_404('unknown tag', '?tag=monkeypunks');
  expect_404('multiple tag instances found', '?tag=ambiguity');

  expect_redirect('to typed url', '?tag=trout', '?article=trout');
  expect_redirect('to typed url, ignoring keywords', '?tag=farmers', '?section=farmers');
  expect_redirect('to typed url with sort', '?tag=trout&sort=date', '?article=trout&sort=date');
  expect_redirect('to typed url with order by', '?tag=trout&order_by=date', '?article=trout&order_by=date');
  expect_redirect('to typed url with author', '?tag=trout&author=jez', '?article=trout&author=jez');
  expect_redirect('to content type', '?tag=job', '?type=job');

  /////////////////////////////////////////
  before(() => {
    tags_collection.insert(test_tag_data);
  });

  after(() => {
    tags_collection.remove({});
  });
});

const test_tag_data = [
  // ambiguous tag
  {
    'title': 'Ambiguity',
    'tag_type': 'section',
    'tag_id': 'ambiguity'
  },
  {
    'title': 'Ambiguity',
    'tag_type': 'article',
    'tag_id': 'ambiguity'
  },

  // unambiguous, keywords are ignored
  {
    'title': 'Farmers',
    'tag_type': 'section',
    'tag_id': 'farmers'
  },
  {
    'title': 'Farmers',
    'tag_type': 'keyword',
    'tag_id': 'farmers'
  },

  {
    'title': 'Trout',
    'tag_type': 'article',
    'tag_id': 'trout'
  }
];

////////////////////////////////////////
function expect_404(label, query = '') {
  it(`404 when ${label}`, done => {
    request.
      get(`/with_tag.json${query}`).
      expect(404).
      end(done);
  });
} // expect_404

function expect_redirect(label, query, location) {
  it(`redirect ${label}`, done => {
    request.
      get(`/with_tag.json${query}`).
      expect(302).
      expect('Location', `http://example.org/with_tag.json${location}`).
      end(done);
  });
} // expect redirect
