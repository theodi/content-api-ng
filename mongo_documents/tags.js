function find_tags(options, db) {
  const tags_collection = db.get('tags');
  return tags_collection.find(options);
} // all_tags

function tags(db) {
  return find_tags({}, db);
} // tags

function by_type(type = '<all>', db) {
  if (type == '<all>')
    return tags(db);
  return find_tags({'tag_type': type}, db);
} // by_type

function by_ids(tag_ids, db) {
  // find tags matching the supplied ids, ignoring keywords
  const query = {
    '$and': [
      { 'tag_id': { '$in': tag_ids.split(',') } },
      { 'tag_type': { '$nin': ['keyword'] } }
    ]
  };
  return find_tags(query, db);
} // by_ids


module.exports = tags;
tags.by_type = by_type;
tags.by_ids = by_ids;
