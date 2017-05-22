const result_set = require('../presenters/result_set.js');
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

function tag_types(req, res) {
    res.json(result_set(known_tag_types(), "All tag types"));
};

module.exports = tag_types;
