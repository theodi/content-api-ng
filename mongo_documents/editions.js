const stream_from = require('rillet').from;
const wrap_edition = require('./edition_classes.js');

async function find(db, query) {
  const editions = [];
  const editions_collection = db.get('editions');
  await editions_collection.find(query).
	each((edition, {close, pause, resume}) => {
	  editions.push(wrap_edition(edition));
	  resume();
	});
  return editions;
} // find

async function for_artefacts(db, artefacts, state = 'published') {
  if (artefacts.length == 0)
    return [];

  const slugs = artefacts.map(a => a.slug);
  const query = {
    'slug': { '$in': slugs },
    'state': state
  };
  const editions = await find(db, query);

  const slug_edition = {};
  editions.forEach(e => slug_edition[e.slug] = e);
  return slug_edition;
} // for_artefacts

async function map_onto(db, artefacts) {
  const editions = await for_artefacts(db, artefacts);

  // plug editions into artefacts, discarding any artefacts without editions
  const results = stream_from(artefacts).
	//filter(a => a.owning_app == 'publisher').
	filter(a => editions[a.slug]).
	map(a => (a.edition = editions[a.slug], a)).
	toArray();

  return results;
} // map_onto

exports.map_onto = map_onto;
