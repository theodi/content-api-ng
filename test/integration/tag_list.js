const app = require('../../app');
const request = require('supertest')(app);
const assert = require('assert');
const equal = assert.equal;
const monk = require('monk');
const mongo_config = require('config').get('mongo');

const db = monk(`${mongo_config.hostname}:${mongo_config.port}/${mongo_config.database}`);
const tags_collection = db.get('tags');

describe('Tag List', () => {
  test_tags('list of tags', '/tags.json', body => {
    equal(body.description, 'All tags');
    equal(body.total, test_tag_data.length);
    equal(body.start_index, 1);
    equal(body.page_size, test_tag_data.length);
    equal(body.current_page, 1);
    equal(body.pages, 1);
    equal(body.results.length, test_tag_data.length);
  });

  for (const [type, expected] of [['section', 3], ['person', 1], ['article', 0]])
    test_tags(`filter by type=${type}`, `/tags.json?type=${type}`, body => {
      equal(body.description, `${type} tags`);
      equal(body.results.length, expected);
    });

  /////////////////////////////////////////
  before(() => {
    tags_collection.insert(test_tag_data);
  });

  after(() => {
    tags_collection.remove({});
  });
});

const test_tag_data = [
  {
    'title': 'Team',
    'tag_type': 'person',
    'tag_id': 'writers'
  },
  {
    'title': 'Crime',
    'tag_type': 'section',
    'tag_id': 'crime'
  },
  {
    'title': 'About',
    'tag_type': 'section',
    'tag_id': 'about'
  },
  {
    'title': 'Membership',
    'tag_type': 'section',
    'tag_id': 'membership'
  }
];

//////////////////////////////
function test_tags(label, url, test) {
  it(label, done => {
    request.
      get(url).
      expect('Content-Type', 'application/json; charset=utf-8').
      expect(200).
      end((err, res) => {
	if (!res.body)
	  assert(false, 'No JSON found');
	test(res.body);
	done();
      });
  });
}
