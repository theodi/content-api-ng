const supertest = require('supertest');
const app = require('../../app');

exports.hello_world = done => {
    supertest(app).
	get('/').
	expect(200).
	end(done);
} // hello_world
