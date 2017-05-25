const tag_types = require('../mongo_documents/tag_types.js');
const result_set = require('../json_format/result_set.js');
const format = require('../json_format/tag_types.js');

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

function tag_types_json_formatter(req, res, db, url_helper) {
  tag_types.with_counts(db).
    then(tts => tts.map(tt => format(tt, url_helper))).
    then(tts => res.json(result_set(tts, "All tag types")));
} // tag_types_json_formatter

function make_tag_types_json_formatter(db, url_helper) {
  return (req, res) =>
    tag_types_json_formatter(req, res, db, url_helper);
} // make_tag_types_json_formatter

module.exports = make_tag_types_json_formatter;
