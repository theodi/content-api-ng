const supertest = require('supertest');
const app = require('../../app');

exports.hello_world = done => {
    supertest(app).
	get('/').
	expect('Content-Type', 'text/html; charset=utf-8').
	expect(200, 'Hello World').
	end(done);
} // hello_world

exports.hello_json = done => {
    supertest(app).
	get('/hello.json').
	expect('Content-Type', 'application/json; charset=utf-8').
	expect(200, { greeting: 'Hello World'}).
	end(done);
} // hello_json
