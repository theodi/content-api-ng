const app = require('../../app');
const request = require('supertest')(app);

describe('Smoke', () => {
  basic('/', 'text/html', 'Hello World');

  basic('/hello.json', 'application/json', { greeting: 'Hello World'});

  it('notfound', done => {
    request.
      get('/no-way-dude').
      expect(404).
      end(done);
  }); // not_found
});

/////////////////////////
function basic(url, content_type, content) {
  it(url, done => {
    request.
      get(url).
      expect('Content-Type', `${content_type}; charset=utf-8`).
      expect(200, content).
      end(done);
  });
} // basic
