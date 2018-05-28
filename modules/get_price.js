var data = require('./data')
var validate_price = require('./validate_price')

module.exports = function(post, callback) {
  validate_price(post, function(err, clean) {
    if(err) {
      callback({status: "error", message: err})
      return
    }

    data.getPrice(clean.post, function(err, res) {
      if (err) {
        callback({status: "error", response: err})
        return
      }

      callback(null, {status: "success", response: res})
    })
  })
}
