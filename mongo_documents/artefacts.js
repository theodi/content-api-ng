const Tags = require('./tags.js');
const stream_from = require('rillet').from;
const wrap_artefact = require('./artefact_class.js');

function by_type(db, type, role = 'odi', sort = '<not-set>') {
  const query = {
    'kind': type,
    'tag_ids': role,
    'state': 'live'
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
    '$and': field_query,
    'state': 'live'
  };

  return find(db, query, sort);
} // by_tags

async function by_slug(db, slug, role = 'odi') {
  const query = {
    'slug': slug
  };

  const results = await find(db, query);
  return results.length ? results[0] : null;
} // by_slug

async function find(db, query, sort = '<not-set>') {
  const projection = (sort == 'date') ? { sort: {'created_at': -1} } : undefined;
  const artefacts = await do_find(db, query, projection);

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

async function do_find(db, query, projection) {
  const artefacts_collection = db.get('artefacts');
  const artefacts = [];
  await artefacts_collection.find(query, projection).
    each((artefact, {close, pause, resume}) => {
      artefacts.push(wrap_artefact(artefact));
      resume();
    });
  return artefacts;
} // do_find

exports.by_type = by_type;
exports.by_tags = by_tags;
exports.by_slug = by_slug;

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
  const seen = {'odi': true };  // content_api is not return odi tags, either role or keyword, can't work out why
  return (tagid) => {
    if (seen[tagid])
      return false;
    return seen[tagid] = true;
  };
} // uniq
