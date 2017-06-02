const tag_types = require('../mongo_documents/tag_types.js');
const result_set = require('../json_format/result_set.js');
const format = require('../json_format/tag_types.js');
const error_503 = require('./error_503.js');

/*
  get "/tag_types.json" do

    presenter = ResultSetPresenter.new(
      FakePaginatedResultSet.new(known_tag_types),
      url_helper,
      TagTypePresenter,
      description: "All tag types"
    )
    presenter.present.to_json
  end
*/

function tag_types_formatter(req, res, db, url_helper, outputter) {
  tag_types.with_counts(db).
    then(tts => tts.map(tt => format(tt, url_helper))).
    then(tts => outputter(res, tts)).
    catch(err => {
      console.log(err);
      error_503(res);
    });
} // tag_types_formatter

function make_tag_types_json_formatter(db, url_helper) {
  return (req, res) =>
    tag_types_formatter(req, res, db, url_helper, json_outputter);
} // make_tag_types_json_formatter

function make_tag_types_csv_formatter(db, url_helper) {
  return (req, res) =>
    tag_types_formatter(req, res, db, url_helper, csv_outputter);
} // make_tag_types_json_formatter

exports.json = make_tag_types_json_formatter;
exports.csv = make_tag_types_csv_formatter

///////////////////////////////
function json_outputter(res, tagtypes) {
  res.json(result_set(tagtypes, "All tag types"));
} // json_outputter

function csv_outputter(res, tagtypes) {
  res.csv(tagtypes, true);
} // csv_outputter
