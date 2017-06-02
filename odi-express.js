const res = require('http').ServerResponse.prototype;

const error_404 = require('./routes/error_404');
const error_503 = require('./routes/error_404');
const result_set = require('./json_format/result_set.js');
const artefact_json_formatter = require('./json_format/artefacts.js');
const artefact_csv_formatter = require('./csv_format/artefacts.js');

res.artefacts = function (req_or_string, artefacts, label, url_helper) {
  const format = find_format(req_or_string, 'artefacts');
  if (!format)
    return error_404(this);

  try {
    const formatted_objects = artefacts.map(a => format.formatter(a, url_helper));
    format.outputter(this, formatted_objects, label);
  } catch(err) {
    console.log(err);
    error_503(this);
  } // catch
} // artefacts

const formats = {
  'json': {
    'artefacts' : {
      'formatter' : artefact_json_formatter,
      'outputter' : json_result_set_output
    },
  },
  'csv': {
    'artefacts' : {
      'formatter': artefact_csv_formatter,
      'outputter': csv_output
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

function json_result_set_output(res, artefacts, label) {
  res.json(result_set(artefacts, label));
} // json_result_set_outputter

function csv_output(res, artefacts) {
  res.csv(artefacts, true);
} // csv_output
