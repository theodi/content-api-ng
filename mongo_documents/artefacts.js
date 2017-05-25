const Tags = require('./tags.js');
const stream_from = require('rillet').from;

function by_type(db, type, role = 'odi', sort = '<not-set>') {
  const query = {
    'kind': type,
    'tag_ids': role
  };

  return find(db, query, sort);
} // by_type

function format_filter(filter = {}) {
  const query = [];

  for (const [k,v] of Object.entries(filter)) {
    const f = (v != "all") ? v : { "$nin" : ['', null] };
    query.push({k, v});
  }

  return query;
} // format_filter

function by_tags(db, tags, role = 'odi', sort = '<not-set>', filter = {}) {
  const tag_query = tags.split(',').concat([role]).map(t => { return {'tag_ids': t}; });
  const filter_query = format_filter(filter);

  const field_query = tag_query.concat(filter_query);

  const query = {
    '$and': field_query
  };

  return find(db, query, sort);
} // by_tags

async function find(db, query, sort = '<not-set>') {
  query['state'] = 'live'; // we only want live objects
  const projection = (sort == 'date') ? { sort: {'created_at': -1} } : undefined;

  const artefacts_collection = db.get('artefacts');
  const results = artefacts_collection.find(query, projection);

  const artefacts = await results;

  const all_tag_ids =
	stream_from(artefacts).
    	map(a => a.tag_ids).
	flatten().
	filter(uniq_tag_ids()).
	toArray();

  const all_tags = await fetch_all_tags(all_tag_ids, db);

  artefacts.forEach(a => populate_tags(a, all_tags));

  return artefacts;
} // find

exports.by_type = by_type;
exports.by_tags = by_tags;

///////////////////////////
async function fetch_all_tags(all_tag_ids, db) {
  const tags = {};
  for (const tag of await Tags.scoped(all_tag_ids, db))
    tags[tag.tag_id] = tag;
  return tags;
} // all_tags

function populate_tags(artefact, all_tags) {
  const tags = [];
  const tag_ids = [];

  for (const tag_id of artefact.tag_ids) {
    if (!all_tags[tag_id])
      continue;
    tag_ids.push(tag_id);
    tags.push(all_tags[tag_id]);
  } // for ...

  artefact.tag_ids = tag_ids;
  artefact.tags = tags;
} // populate_tags

function uniq_tag_ids() {
  const seen = {};
  return (tagid) => {
    if (seen[tagid])
      return false;
    return seen[tagid] = true;
  };
} // uniq
