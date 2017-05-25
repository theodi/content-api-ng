const stream_of = require('rillet').of;
const tag_format = require('./tags.js');

function edition_or_artefact(artefact, edition_field, artefact_field) {
  if (artefact.edition && artefact.edition[edition_field])
    return artefact.edition[edition_field];
  return artefact[artefact_field];
} // edition_field

function minimal_artefact_format(artefact, url_helper) {
  return {
    'id': url_helper.artefact_url(artefact),
    'web_url': url_helper.artefact_web_url(artefact),
    'slug': artefact.slug,
    'title': edition_or_artefact(artefact, 'title', 'name'),
    'format': underscorify(edition_or_artefact(artefact, 'format', 'kind'))
  };
} // minimal_artefact_format

function basic_artefact_format(artefact, url_helper) {
  return merge(
    minimal_artefact_format(artefact, url_helper),
    {
      'updated_at': updated_date(artefact),
      'created_at': created_date(artefact),
      'tag_ids': artefact.tag_ids
    }
  );
} // basic_artefact_format

function format(artefact, url_helper) {
  const pretty = basic_artefact_format(artefact, url_helper);

  pretty.tags = tag_format(artefact.tags, url_helper);

  return pretty;
} // format

module.exports = format;

///////////////////////////////////////////////
function underscorify(str) {
  if (!str)
    return str;
  return str.replace(/ /g, '_');
} // underscorify

function merge(object1, object2) {
  for (const [k,v] of Object.entries(object2))
    object1[k] = v;
  return object1;
} // merge

function updated_date(artefact) {
  try {
    const ud = stream_of(artefact.updated_at, artefact.edition ? artefact.edition.updated_at : undefined).
  	filter(d => d).
 	max();
    return ud ? ud.iso8601 : '';
  } catch(err) {
    return '';
  } // catch
} // updated_date


function created_date(artefact) {
  return artefact.created_at ? artefact.created_at.iso8601 : '';
} // created_date
