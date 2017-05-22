
function present(items, description = "No description", pagination = unpaginated(items)) {
  const result_set = {
    "_response_info": { "links": [] },
    "description": description,
    "results": items
  };

  for (const k of Object.keys(pagination))
    result_set[k] = pagination[k];

  return result_set;
} // present

function unpaginated(items) {
  return {
    "start_index": 1,
    "current_page": 1,
    "pages": 1,
    "total": items.length,
    "page_size": items.length
  };
} // unpaginated

module.exports = present;
