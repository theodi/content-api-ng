const stream_of = require('rillet').of;
const stream_from = require('rillet').from;
const tag_format = require('./tags.js');
const markdown = require('markdown').markdown;

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

function related_artefact_format(related_artefact, url_helper) {
  return basic_artefact_format(related_artefact, url_helper);
} // related_artefact_format

//////////////////////////////////
function format(artefact, url_helper) {
  const pretty = basic_artefact_format(artefact, url_helper);

  pretty.tags = tag_format(artefact.tags, url_helper);

  // populate the details
  pretty.details = {}

  merge_fields(pretty, BASE_FIELDS, artefact);
  merge_fields(pretty, OPTIONAL_FIELDS, artefact.edition);
  merge_fields(pretty, ODI_FIELDS, artefact.edition);

  pretty.related_external_links = stream_from(artefact.external_links).
    map(l => { return { 'title': l.title, 'url': l.url }; }).
    toArray();
  if (artefact.related_artefacts)
    pretty.related = stream_from(artefact.related_artefacts).
    map(r => related_artefact_format(r, url_helper)).
    toArray();

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

function merge_fields(pretty, field_names, source) {
  if (!source)
    return;
  stream_of(field_names).flatten().
    filter(f => source[f] !== undefined).
    map(f => [f, source[f]]).
    map(fv => convertIfGovspeak(...fv)).
    map(fv => convertIfDate(...fv)).
    forEach(([f, v]) => pretty.details[f] = v);
} // merge_fields

function convertIfGovspeak(f, v) {
  if (GOVSPEAK.indexOf(f) == -1)
    return [f, v];

  return [f, markdown.toHTML(v)];
} // convertIfGovspeak

function convertIfDate(f, v) {
  if (!f.endsWith('date'))
    return [f, v];

  return [f, content_api_date(v)];
} // convertIfDate

function updated_date(artefact) {
  try {
    const ud = stream_of(artefact.updated_at, artefact.edition ? artefact.edition.updated_at : undefined).
  	filter(d => d).
 	max();
    return ud ? content_api_date(ud) : '';
  } catch(err) {
    return '';
  } // catch
} // updated_date


function created_date(artefact) {
  return artefact.created_at ? content_api_date(artefact.created_at) : '';
} // created_date

// if javascripts toISOString is ok, we can use that instead
function content_api_date(date) {
  return date.getUTCFullYear() +
        '-' + pad(date.getUTCMonth() + 1) +
        '-' + pad(date.getUTCDate()) +
        'T' + pad(date.getUTCHours()) +
        ':' + pad(date.getUTCMinutes()) +
        ':' + pad(date.getUTCSeconds()) +
        '+00:00';
} // content_api_date

function pad(n) {
  return (n < 10) ? `0${n}` : n;
} // pad

const BASE_FIELDS = [
  'need_id',
  'business_proposition',
  'description',
  'excerpt',
  'language',
  'need_extended_font'
];

const OPTIONAL_FIELDS = [
  'additional_information',
  'alternate_methods',
  'alternative_title',
  'body',
  'change_description',
  'introduction',
  'link',
  'more_information',
  'organiser',
  'place_type',
  'reviewed_at',
  'short_description',
  'summary',
  'video_summary',
  'video_url'
];

const ODI_FIELDS = [
  'honorific_prefix',
  'honorific_suffix',
  'role',
  'description',
  'affiliation',
  'url',
  'telephone',
  'twitter',
  'linkedin',
  'github',
  'email',
  'length',
  'outline',
  'outcomes',
  'audience',
  'prerequisites',
  'requirements',
  'materials',
  'subtitle',
  'content',
  'end_date',
  'media_enquiries_name',
  'media_enquiries_email',
  'media_enquiries_telephone',
  'location',
  'salary',
  'closing_date',
  'joined_at',
  'graduated',
  'tagline',
  'involvement',
  'want_to_meet',
  'case_study',
  'date_published',
  'course',
  'date',
  'price',
  'trainers',
  'start_date',
  'booking_url',
  'hashtag',
  'level',
  'region',
  'end_date',
  'beta',
  'join_date',
  'area',
  'host'
];

const GOVSPEAK = [
  'content',
  'description',
  'license_overview',
  'body'
];
