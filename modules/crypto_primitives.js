var crypto = require('crypto')

exports.sha256 = function(data) {
  var hash = crypto.createHash('sha256')
  hash.update(data)
  return hash.digest('hex')
}
