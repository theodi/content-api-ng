function format(tag_type, url_helper) {
  return {
    'id': url_helper.tag_type_url(tag_type),
    'type': tag_type.singular,
    'total': tag_type.total
  }
} // format

module.exports = format;
