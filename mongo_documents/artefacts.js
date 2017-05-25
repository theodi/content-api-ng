
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

function find(db, query, sort = '<not-set>') {
  query['state'] = 'live'; // we only want live objects

  const artefacts_collection = db.get('artefacts');
  const artefacts = artefacts_collection.find(query);

  if (sort == 'date')
    artefacts = artefacts.sort({'created_at': -1});

  return artefacts;
} // find

exports.by_type = by_type;
exports.by_tags = by_tags;
