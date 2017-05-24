const result_set = require('./result_set.js');
const known_tag_types = require('../presenters/tag_types.js');
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
  known_tag_types(db, url_helper).
    then(tts => res.json(result_set(tts, "All tag types")));
} // tag_types_json_formatter

function make_tag_types_json_formatter(db, url_helper) {
  return (req, res) =>
    tag_types_json_formatter(req, res, db, url_helper);
} // make_tag_types_json_formatter

module.exports = make_tag_types_json_formatter;
