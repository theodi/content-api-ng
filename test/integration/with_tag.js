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

describe('With Tag', () => {
  test_with_tag(
    'fetch array of results',
    '?article=farmers',
    body => {
      equal(body.results.length, 1);

      const article = body.results[0];
      equal(article.title, 'Farmers Rule');
      assert(article.tag_ids.some(t => t == 'farmers'));
      equal(article.details.description, 'A description of farmers');
      equal(article.details.excerpt, 'A really long description of farmers');
    }
  );



  //////////////////////////////////////
  before(async() => {
    await tags_collection.insert([
      {
	'tag_id': 'farmers',
	'title': 'Farmers',
	'tag_type': 'article'
      },
      {
	'tag_id': 'business',
	'title': 'Business',
	'tag_type': 'section'
      }]);
    await artefacts_collection.insert(
      {
	'name': 'Farmers Rule',
	'owning_app': 'publisher',
	'description': 'A description of farmers',
	'state': 'live',
	'slug': 'farmers-rule',
	'kind': 'course',
	'tag_ids': ['farmers', 'odi']
      });
    await editions_collection.insert(
      {
	'title': 'Farmers Rule',
	'content': 'A really long description\n\nWith line breaks',
	'state': 'published',
	'slug': 'farmers-rule'
      });
  });

  after(() => {
    tags_collection.remove({});
    artefacts_collection.remove({});
    editions_collection.remove({});
  });

});

function test_with_tag(label, query, test) {
  it(label, done => {
    request.
      get(`/with_tag.json${query}`).
      expect('Content-Type', 'application/json; charset=utf-8').
      expect(200).
      end((err, res) => {
	if (!res.body)
	  assert(false, 'No JSON found');
	test(res.body);
	done(err, res);
      });
  });
}
