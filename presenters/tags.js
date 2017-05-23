function find_tags(options, db) {
  const tags_collection = db.get('tags');
  return tags_collection.find(options);
} // all_tags

function format(tag, url_helper) {
  return {
    'id': url_helper.tag_url(tag),
    'web_url': null,
    'title': tag.title,
    'details': {
      'description': tag.description,
      'short_description': tag.short_description,
      'type': tag.tag_type
    },
    'content_with_tag': {
      'id': url_helper.with_tag_url(tag),
      'web_url': url_helper.tag_web_url(tag),
      'slug': tag.tag_id
    }
  };
} // format

async function tags(options, db, url_helper) {
  const tags = await find_tags(options, db);
  return tags.map(tag => format(tag, url_helper));
} // tags

module.exports = tags;
