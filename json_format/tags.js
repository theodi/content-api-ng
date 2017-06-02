function format_tag(tag, url_helper) {
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
} // format_tag

module.exports = format_tag;
