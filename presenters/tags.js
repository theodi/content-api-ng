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

module.exports = tags;
tags.by_type = by_type;
