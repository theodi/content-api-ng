const app = require('../../app');
const request = require('supertest')(app);
const assert = require('assert');
const monk = require('monk');
const mongo_config = require('config').get('mongo');

const db = monk(`${mongo_config.hostname}:${mongo_config.port}/${mongo_config.database}`);
const collection = db.get('tags');

exports.before = () => {
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
} // before

exports.after = async () => {
    await collection.remove({});
} // after

exports.display_a_list_of_tag_types = done => {
/*
    request.
	get('/tag_type.json').
	expect('Content-Type', 'application/json; charset=utf-8').
	expect(200).
	end((err, res) => {
	    if (res.body.results)
		for (const result of res.body.results) {
		    assert(result.id);
		    assert(result.type);
		}
	    else
		assert(false, "No JSON body found");
	    done();
	});
*/
} // list_of_tag_types
