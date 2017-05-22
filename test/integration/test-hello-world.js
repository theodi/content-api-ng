const supertest = require('supertest');
const app = require('../../app');

describe("smoke", () => {
  it("hello world", done => {
    supertest(app).
      get('/').
      expect('Content-Type', 'text/html; charset=utf-8').
      expect(200, 'Hello World').
      end(done);
  }); // hello_world

  it("hello.json", done => {
    supertest(app).
      get('/hello.json').
      expect('Content-Type', 'application/json; charset=utf-8').
      expect(200, { greeting: 'Hello World'}).
      end(done);
  }); // hello_json

  it("notfound", done => {
    supertest(app).
      get('/no-way-dude').
      expect(404).
      end(done);
  }); // not_found
});
