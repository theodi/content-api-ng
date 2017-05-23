function all_tags(db) {
  const tags_collection = db.get('tags');
  return tags_collection.find();
} // all_tags


async function tags(db, url_helper) {
  const tags = await all_tags(db);
  return tags;
} // tags

module.exports = tags;
