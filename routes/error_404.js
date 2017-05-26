function error_404(res) {
  return res.status(404).json({
    '_response_info' : {
      'status': 'not found',
      'status_message': 'Resource not found'
    }
  });
} // error_404

module.exports = error_404;
