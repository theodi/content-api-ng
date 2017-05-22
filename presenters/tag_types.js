const known_tag_types = [
  // from odi_content_models/app/decorators/models/artefact_decorator
    "section",
    "writing_teams",
    "propositions",
    "featured",
    "keywords",
    "legacy_sources",
    "team",
    "person",
    "timed_item",
    "asset",
    "article",
    "organization",
    "event"
];

function tag_types() {
    return known_tag_types.
	map(item => { return {
	    'id': 'something',
	    'type': item,
	    'total': 0
	}});
} // tag_types

module.exports = tag_types;
