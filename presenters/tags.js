function find_tags(options, db) {
  const tags_collection = db.get('tags');
  return tags_collection.find(options);
} // all_tags


async function tags(options, db, url_helper) {
  const tags = await find_tags(options, db);
  return tags;
} // tags

module.exports = tags;
