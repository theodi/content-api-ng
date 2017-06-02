const res = require('http').ServerResponse.prototype;

const error_404 = require('./routes/error_404');
const error_503 = require('./routes/error_404');
const result_set = require('./json_format/result_set.js');
const artefact_json_formatter = require('./json_format/artefacts.js');
const section_json_formatter = require('./json_format/section.js');
const tag_json_formatter = require('./json_format/tags.js');
const artefact_csv_formatter = require('./csv_format/artefacts.js');
const section_csv_formatter = require('./csv_format/section.js');
const tag_csv_formatter = require('./csv_format/tags.js');

res.artefacts = function(req_or_string, artefacts, label, url_helper) {
  format_and_output(this, req_or_string, 'artefacts', artefacts, label, url_helper);
} // artefacts

res.artefact = function(req_or_string, artefact, url_helper) {
  format_and_output(this, req_or_string, 'artefact', artefact, '', url_helper);
} // artefact

res.tag_types = function(req_or_string, tagtypes, url_helper) {
  format_and_output(this, req_or_string, 'tagtypes', tagtypes, 'All tag types', url_helper);
} // tag_types

res.section = function(req_or_string, section, url_helper) {
  format_and_output(this, req_or_string, 'section', section, '', url_helper);
} // section

res.tags = function(req_or_string, tags, label, url_helper) {
  format_and_output(this, req_or_string, 'tags', tags, label, url_helper);
} // tags

res.tag = function(req_or_string, tag, url_helper) {
  format_and_output(this, req_or_string, 'tag', tag, '', url_helper);
} // tags

function format_and_output(res, req_or_string, type, objects, label, url_helper) {
  const format = find_format(req_or_string, type);
  if (!format)
    return error_404(res);

  try {
    const formatted_objects = Array.isArray(objects) ?
	  objects.map(a => format.formatter(a, url_helper)) :
	  format.formatter(objects, url_helper);
    format.outputter(res, formatted_objects, label);
  } catch(err) {
    console.log(err);
    error_503(res);
  } // catch
} // objects

////////////////////////////////////////////////////////////
const formats = {
  'json': {
    'artefacts' : {
      'formatter' : artefact_json_formatter,
      'outputter' : json_result_set_output
    },
    'artefact' : {
      'formatter' : artefact_json_formatter,
      'outputter' : json_output
    },
    'tagtypes': {
      'formatter' : identity_formatter,
      'outputter' : json_result_set_output,
    },
    'section': {
      'formatter' : section_json_formatter,
      'outputter' : json_output
    },
    'tags': {
      'formatter' : tag_json_formatter,
      'outputter' : json_result_set_output
    },
    'tag': {
      'formatter' : tag_json_formatter,
      'outputter' : json_output
    }
  },
  'csv': {
    'artefacts' : {
      'formatter': artefact_csv_formatter,
      'outputter': csv_output
    },
    'artefact' : {
      'formatter': artefact_csv_formatter,
      'outputter': csv_output
    },
    'tagtypes': {
      'formatter' : identity_formatter,
      'outputter' : csv_output
    },
    'section': {
      'formatter' : section_csv_formatter,
      'outputter' : csv_output
    },
    'tags': {
      'formatter' : tag_csv_formatter,
      'outputter' : csv_output
    },
    'tag': {
      'formatter' : tag_csv_formatter,
      'outputter' : csv_output
    }
  }
};

function find_format(req_or_string, object_type) {
  const format_name = typeof(req_or_string) === 'string' ? req_or_string : req_or_string.params['ext'];
  const format = formats[format_name];
  if (!format)
    return;

  return format[object_type];
} // find_format

function identity_formatter(obj) {
  return obj;
} // identity_formatter

function json_result_set_output(res, objects, label) {
  res.json(result_set(objects, label));
} // json_result_set_outputter

function json_output(res, objects) {
  res.json(objects);
} // json_outputter

function csv_output(res, objects) {
  const array = arrayify(objects);
  res.csv(array, true);
} // csv_output

function arrayify(objects) {
  return Array.isArray(objects) ? objects : [ objects ];
} // arrayify
