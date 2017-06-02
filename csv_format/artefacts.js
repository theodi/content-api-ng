function format(artefact, url_helper) {
  return {
    'title': edition_or_artefact(artefact, 'title', 'name'),
    'url': url_helper.artefact_web_url(artefact),
    'author': author_name(artefact),
    'tags': artefact.tag_ids.join(),
    'created_at': artefact.created_at.toISOString(),
    'updated_at': artefact.updated_at.toISOString(),
    'excerpt': artefact.excerpt
  };
} // format

module.exports = format;

////////////////////////////////////
function author_name(artefact) {
  const author = artefact.author_artefact;
  if (!author || !author.edition)
    return '';

  return author.edition.title;
} // author_name

function edition_or_artefact(artefact, edition_field, artefact_field) {
  if (artefact.edition && artefact.edition[edition_field])
    return artefact.edition[edition_field];
  return artefact[artefact_field];
} // edition_field
