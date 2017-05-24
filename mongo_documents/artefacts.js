
function by_type(db, type, role = 'odi', sort = '<not-set>') {
  const query = {
    'kind': type,
    'state': 'live',
    'tag_ids': role
  };

  const artefacts_collection = db.get('artefacts');
  const artefacts = artefacts_collection.find(query);

  if (sort == 'date')
    artefacts = artefacts.sort({'created_at': -1});

  return artefacts;
} // by_type

exports.by_type = by_type;
