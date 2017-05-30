function error_503(res) {
  return res.status(503).json({
    '_response_info' : {
      'status': 'unavailable',
      'status_message': 'Something went wrong'
    }
  });
} // error_503

module.exports = error_503;
