const app = require('../../app');
const request = require('supertest')(app);
const assert = require('assert');
const equal = assert.equal;
const monk = require('monk');
const mongo_config = require('config').get('mongo');

const db = monk(`${mongo_config.hostname}:${mongo_config.port}/${mongo_config.database}`);
const tags_collection = db.get('tags');
const artefacts_collection = db.get('artefacts');

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
  before(async () => {
    const test_artefacts = [];

    for (let i = 0; i != 5; ++i)
      test_artefacts.push({
	'title': `job ${i}`,
	'state': 'live',
	'kind': 'job',
	'tag_ids': ['odi', 'job']
      });
    test_artefacts.push({
      'title': `job not live`,
      'state': 'pending',
      'kind': 'job',
      'tag_ids': ['odi', 'job']
    });
    for (let i = 0; i != 35; ++i)
      test_artefacts.push({
	'title': `case study ${i}`,
	'state': 'live',
	'kind': 'case_study',
	'tag_ids': ['odi', 'case_studies']
      });
    test_artefacts.push({
      'title': `case study cancelled`,
      'state': 'cancelled',
      'kind': 'case_study',
      'tag_ids': ['odi', 'case_studies']
    });

    for (const r of ['foo', 'bar'])
      test_artefacts.push({
	'title': `course ${r}`,
	'state': 'live',
	'kind': 'course',
	'tag_ids': [r, 'course']
      });
    
    await artefacts_collection.insert(test_artefacts);	  
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

