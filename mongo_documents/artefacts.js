const Tags = require('./tags.js');
const Editions = require('./editions.js');
const stream_from = require('rillet').from;
const wrap_artefact = require('./artefact_class.js');

function by_type(db, type, role = 'odi', sort = '<not-set>', summary = false) {
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

function by_ids(db, ids, sort = '<not-set>', summary = true) {
  const query = { '_id': {'$in': ids } };

  return find(db, query, sort, summary);
} // by_ids

function by_tags(db, tags, role = 'odi', sort = '<not-set>', filter = {}, summary = false) {
  const tag_query = tags.split(',').concat([role]).map(t => { return {'tag_ids': t}; });
  const filter_query = format_filter(filter);

  const field_query = tag_query.concat(filter_query);

  const query = {
    '$and': field_query,
    'state': 'live'
  };

  return find(db, query, sort);
} // by_tags

async function by_slug(db, slug, role = 'odi', summary = false) {
  const query = {
    'slug': slug
  };

  const results = await find(db, query);
  return results.length ? results[0] : null;
} // by_slug

async function find(db, query, sort = '<not-set>', summary = false) {
  const projection = (sort == 'date') ? { 'sort': {'created_at': -1} } : undefined;
  const artefacts = await do_find(db, query, projection);

  await populate_tags(db, artefacts);

  if (summary)
    return artefacts;

  await populate_related(db, artefacts);

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
async function populate_tags(db, artefacts) {
  const all_tag_ids =
	stream_from(artefacts).
    	map(a => a.tag_ids).
	flatten().
	filter(id => id != 'odi').  // content_api is not return odi tags, either role or keyword, can't work out why
	uniq().
	toArray();

  const all_tags = await fetch_all_tags(all_tag_ids, db);
  artefacts.forEach(a => populate_artefact_tags(a, all_tags));
  return artefacts;
} // populate_tags

async function fetch_all_tags(all_tag_ids, db) {
  const tags = {};
  for (const tag of await Tags.scoped(all_tag_ids, db))
    tags[tag.tag_id] = tag;
  return tags;
} // all_tags

function populate_artefact_tags(artefact, all_tags) {
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

//////////////////////////////////////
async function populate_related(db, artefacts) {
  const all_related_ids =
	stream_from(artefacts).
	filter(a => a.related_artefact_ids).
	map(a => a.related_artefact_ids).
	flatten().
	toArray();
  if (all_related_ids.length == 0)
    return;

  const all_related = await fetch_all_related(db, all_related_ids);
  artefacts.forEach(a => populate_artefact_related(a, all_related));
  return artefacts;
} // populate_related

async function fetch_all_related(db, all_related_ids) {
  const related_artefacts = await by_ids(db, all_related_ids);
  await Editions.map_onto(db, related_artefacts);

  const related = {};
  for (const artefact of related_artefacts)
    related[artefact._id.toString()] = artefact;

  return related;
} // fetch_all_related

function populate_artefact_related(artefact, all_related) {
  const related = [];
  for (const related_id of artefact.related_artefact_ids)
    related.push(all_related[related_id.toString()]);
  artefact.related_artefacts = related;
} // populate_related
