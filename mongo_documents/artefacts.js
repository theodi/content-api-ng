const Tags = require('./tags.js');

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
  const results = artefacts_collection.find(query);

  if (sort == 'date')
    results = results.sort({'created_at': -1});

  return results.then(artefacts => {
    artefacts.forEach(a => {
      a.db = db;
      a.original_tag_ids = a.tag_ids;
      a.load_tags = async function() {
	this.tags_ = await Tags.scoped(this.original_tag_ids, this.db);
	this.tag_ids_ = this.tags_.map(t => t.tag_id);
      };
      a.load_tags_if_not = function(field) {
	if (!this[field])
	  this.load_tags();
	return this[field];
      }; // load_tags_if_not
      // lazy properties
      Object.defineProperty(a, 'tags', {
	get: function() { return this.load_tags_if_not('tags_'); }
      });
      Object.defineProperty(a, 'tag_ids', {
	get: function() { return this.load_tags_if_not('tag_ids_'); }
      });

    });
    return artefacts;
  });
} // find

exports.by_type = by_type;
exports.by_tags = by_tags;
