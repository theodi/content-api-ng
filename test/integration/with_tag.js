const app = require('../../app');
const request = require('supertest')(app);
const assert = require('assert');
const equal = assert.equal;
const monk = require('monk');
const mongo_config = require('config').get('mongo');

const db = monk(`${mongo_config.hostname}:${mongo_config.port}/${mongo_config.database}`);
const tags_collection = db.get('tags');
const artefacts_collection = db.get('artefacts');

describe('With Tag, tag param', () => {
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
  expect_redirect('when filtering by multiple tags', '?tag=crime,business', '?section=crime%2Cbusiness');

  /////////////////////////////////////////
  before(() => {
    tags_collection.insert(test_tag_data);
  });

  after(() => {
    tags_collection.remove({});
  });
});

describe('With Tag, type param', () => {
  for (const [type, count] of [['job', 5], ['case_study', 35]])
    test_with_tag(
      `return live artefacts of type ${type}`,
      `?type=${type}`,
      body => equal(body.results.length, count)
    );

  for (const [type, count] of [['jobs', 5], ['case_studies', 35]])
    test_with_tag(
      `return live artefacts of plural type ${type}`,
      `?type=${type}`,
      body => equal(body.results.length, count)
    );

  test_with_tag(
    "return zero-length list if no artefacts of type",
    "?type=article",
    body => equal(body.results.length, 0)
  );

  for (const [role, title] of [['foo', 'course foo'], ['bar', 'course bar']])
    test_with_tag(
      `return artefacts for role ${role}`,
      `?type=course&role=${role}`,
      body => {
	equal(body.results.length, 1);
	equal(body.results[0].title, title);
      }
    );

  /////////////////////////////////////////
  before(() => {
    for (let i = 0; i != 5; ++i)
      artefacts_collection.insert({
	'title': `job ${i}`,
	'state': 'live',
	'kind': 'job',
	'tag_ids': ['odi', 'job']
      });
    artefacts_collection.insert({
      'title': `job not live`,
      'state': 'pending',
      'kind': 'job',
      'tag_ids': ['odi', 'job']
    });
    for (let i = 0; i != 35; ++i)
      artefacts_collection.insert({
	'title': `case study ${i}`,
	'state': 'live',
	'kind': 'case_study',
	'tag_ids': ['odi', 'case_studies']
      });
    artefacts_collection.insert({
      'title': `case study cancelled`,
      'state': 'cancelled',
      'kind': 'case_study',
      'tag_ids': ['odi', 'case_studies']
    });

    for (const r of ['foo', 'bar'])
      artefacts_collection.insert({
	'title': `course ${r}`,
	'state': 'live',
	'kind': 'course',
	'tag_ids': [r, 'course']
      });
  });

  after(() => {
    artefacts_collection.remove({});
  });
});

function test_with_tag(label, query, test, header_to_check, header_value) {
  it(label, done => {
    let t = request.
	get(`/with_tag.json${query}`).
	expect('Content-Type', 'application/json; charset=utf-8');
    if (header_to_check)
      t = t.expect(header_to_check, header_value);

    t.expect(200).
      end((err, res) => {
	if (!res.body)
	  assert(false, 'No JSON found');
	test(res.body);
	done(err, res);
      });
  });
}

////////////////////////////////////////////
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

  //
  {
    'title': 'Trout',
    'tag_type': 'article',
    'tag_id': 'trout'
  },

  //
  {
    'title': 'Crime',
    'tag_type': 'section',
    'tag_id': 'crime'
  },
  {
    'title': 'Business',
    'tag_type': 'section',
    'tag_id': 'business'
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
