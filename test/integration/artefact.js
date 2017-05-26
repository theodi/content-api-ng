const app = require('../../app');
const request = require('supertest')(app);
const assert = require('assert');
const equal = assert.equal;
const monk = require('monk');
const mongo_config = require('config').get('mongo');

const db = monk(`${mongo_config.hostname}:${mongo_config.port}/${mongo_config.database}`);
const tags_collection = db.get('tags');
const artefacts_collection = db.get('artefacts');
const editions_collection = db.get('editions');

describe('Artefact', () => {
  expect_404('artefact does not exist', 'unleash-the-hounds');
  expect_404('if artefact is in draft', 'a-draft-artefact');
  expect_404('if live date is in the future', 'future-live');
  expect_410('if artefact is archived', 'archived-artefact');

  before(async() => {
    // this date munging is so horrible
    const the_future = new Date();
    the_future.setTime(Date.now() + (24*60*60*1000));
    await artefacts_collection.insert([
      {
	'name': 'a-draft-artefact',
	'slug': 'a-draft-artefact',
	'state': 'draft',
	'tag_ids': ['odi']
      },
      {
	'name': 'future-live',
	'slug': 'future-live',
	'state': 'published',
	'live_at': the_future,
	'tag_ids': ['odi']
      },
      {
	'name': 'archived-artefact',
	'slug': 'archived-artefact',
	'state': 'archived',
	'tag_ids': ['odi']
      }

    ]);
  });

  after(() => {
    artefacts_collection.remove({});
    editions_collection.remove({});
  });
});

//////////////////////////
function expect_404(label, slug) {
  expect_error(404, label, slug);
} // expect_404

function expect_410(label, slug) {
  expect_error(410, label, slug);
} // expect_410

function expect_error(code, label, slug) {
  it(`${code} when ${label}`, done => {
    request.
      get(`/${slug}.json`).
      expect(code).
      end(done);
  });
} // expect_error
