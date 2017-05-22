const app = require('../../app');
const request = require('supertest')(app);
const assert = require('assert');
const monk = require('monk');
const mongo_config = require('config').get('mongo');

const db = monk(`${mongo_config.hostname}:${mongo_config.port}/${mongo_config.database}`);
const collection = db.get('tags');

function isNumber(v){
   return typeof v === 'number' && isFinite(v);
};

describe("Tag Types", () => {
  before(() => {
    collection.insert({
	"_type": "Tag",
	"title": "Team",
	"tag_type": "person",
	"tag_id": "writers"
    });
    collection.insert({
	"_type": "Tag",
	"title": "ODI",
	"tag_type": "odi",
	"tag_id": "role"
    });
  });

  after(async () => {
    await collection.remove({});
  }); // after

  it("display a list of tag types", (done) => {
    request.
	get('/tag_types.json').
	expect('Content-Type', 'application/json; charset=utf-8').
	expect(200).
	end((err, res) => {
	    //console.log(res.body);
	    assert.equal(res.body.description, "All tag types");
	    assert.equal(res.body.total, 13);
	    assert.equal(res.body.start_index, 1);
	    assert.equal(res.body.page_size, 13);
	    assert.equal(res.body.current_page, 1);
	    assert.equal(res.body.pages, 1);
	    if (res.body.results)
		for (const result of res.body.results) {
		    assert(result.id, "Result must have an id");
		    assert(result.type, "Result must have a type");
		    assert(isNumber(result.total),"Result must have a total, and it must be numeric");
		}
	    else if (res.body)
		assert(false, "JSON found, but not the right shape");
	    else
		assert(false, "No JSON body found");
	    done();
	});
  }); // list_of_tag_types
});
