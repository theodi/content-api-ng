const app = require('../../app');
const request = require('supertest')(app);
const assert = require('assert');
const equal = assert.equal;
const monk = require('monk');
const mongo_config = require('config').get('mongo');

const db = monk(`${mongo_config.hostname}:${mongo_config.port}/${mongo_config.database}`);
const tags_collection = db.get('tags');

describe("Tag Types", () => {
  test_tag_types("display a list of tag types", res => {
    equal(res.body.description, "All tag types");
    equal(res.body.total, 13);
    equal(res.body.start_index, 1);
    equal(res.body.page_size, 13);
    equal(res.body.current_page, 1);
    equal(res.body.pages, 1);
    if (res.body.results)
      for (const result of res.body.results) {
	assert(result.id, "Result must have an id");
	assert(result.type, "Result must have a type");
	assert(isNumber(result.total),"Result must have a total, and it must be numeric");
      }
    else if (res.body)
      assert(false, "JSON found, but not the right shape");
  }); // list_of_tag_types

  test_tag_types("links to tag type url", res => {
    const section = res.body.results.find(s => s.type == "section");
    equal(section.id, "http://example.org/tags/sections.json");
  });

  test_tag_types("include the number of tags of each type", res => {
    for (const [type, expected] of [['person',2],['section',1],['article',0]]) {
      const tag_type = res.body.results.find(s => s.type == type);
      equal(tag_type.total, expected);
    } // for ...
  });

  ////////////////////////////
  before(() => {
    tags_collection.insert([
      {
	"title": "Team",
	"tag_type": "person",
	"tag_id": "writers"
      },
      {
	"title": "About",
	"tag_type": "section",
	"tag_id": "about"
      },
      {
	"title": "Jez",
	"tag_type": "person",
	"tag_id": "jez"
      }
    ]);
  });

  after(() => {
    tags_collection.remove({});
  }); // after
});

/////////////////////////////////////////
function test_tag_types(label, test) {
  it(label, done => {
    request.
      get('/tag_types.json').
      expect('Content-Type', 'application/json; charset=utf-8').
      expect(200).
      end((err, res) => {
	test(res);
	done();
      });
  });
};

function isNumber(v){
   return typeof v === 'number' && isFinite(v);
};
