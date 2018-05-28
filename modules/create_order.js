var data = require('./data')
var validate_order = require('./validate_order')

module.exports = function(post, callback) {
  validate_order(post, function(err, clean) {
    if(err) {
      callback({status: "error", message: err})
      return
    }

    data.createOrder(clean.post, function(err, res) {
      if (err) {
        callback({status: "error", message: err})
        return
      }

      callback(null, {status: "success", message: res.message})
    })
  })
}
