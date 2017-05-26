function error_410(res) {
  return res.status(410).json({
    '_response_info' : {
      'status': 'gone',
      'status_message': 'This item is no longer available'
    }
  });
} // error_410

module.exports = error_410;
