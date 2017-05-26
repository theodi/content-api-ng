const app = require('../../app');
const request = require('supertest')(app);

function expect_ok(label, path, test) {
  it(label, done => {
    request.
      get(path).
      expect('Content-Type', 'application/json; charset=utf-8').
      expect(200).
      end((err, res) => {
	if (err)
	  done(err, res);

	if (!res.body)
	  assert(false, 'No JSON found');
	test(res.body);
	done(err, res);
      });
  });
}

function expect_404(label, path) {
  expect_error(404, label, path);
} // expect_404

function expect_410(label, path) {
  expect_error(410, label, path);
} // expect_410

function expect_error(code, label, path) {
  it(label, done => {
    request.
      get(path).
      expect(code).
      end(done);
  });
} // expect_error

function expect_redirect(label, path, location) {
  it(label, done => {
    request.
      get(path).
      expect(302).
      expect('Location', location).
      end(done);
  });
} // expect redirec

////////////////
exports.ok = expect_ok;
exports._404 = expect_404;
exports._410 = expect_410;
exports.redirect = expect_redirect;
