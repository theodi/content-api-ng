const singular = require('pluralize').singular;

const known_tag_types = [
  // from odi_content_models/app/decorators/models/artefact_decorator
    'sections',
    'writing_teams',
    'propositions',
    'featured',
    'keywords',
    'legacy_sources',
    'team',
    'person',
    'timed_item',
    'asset',
    'article',
    'organization',
    'event'
].map(tt => create_tag_type(tt));

function create_tag_type(tt_plural) {
    return { 'singular': singular(tt_plural), 'plural': tt_plural };
} // create_tag_type

//////////////////////////////////////
function count_tag_type(collection, tag_type) {
    return collection.count({'tag_type': tag_type.singular}).
	then(count => [tag_type.singular, count]);
} // count_tag_type

async function all_tag_counts(db) {
    const tags_collection = db.get('tags');

    const countQueries = [];
    for (const tt of known_tag_types)
	countQueries.push(count_tag_type(tags_collection, tt));
    const countResults = await Promise.all(countQueries);

    const counts = {};
    for (const r of countResults)
	counts[r[0]] = r[1];
    return counts;
} // all_tag_counts

async function tag_types(db, url_helper) {
    const counts = await all_tag_counts(db);
    return known_tag_types.
	map(tt => { return {
	    'id': url_helper.tag_type_url(tt),
	    'type': tt.singular,
	    'total': counts[tt.singular]
	}});
} // tag_types

module.exports = tag_types;
