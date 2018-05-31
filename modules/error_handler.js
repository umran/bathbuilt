var data = require('../modules/data')

module.exports = function(err, req, res, next) {
  data.getHome(function(error, result){
    if(error) {
      res.status(err.status || 500)
      res.render('basic-error')
      return
    }

    res.status(err.status || 500)
    res.render('error', { title: 'Page Not Found', rooms: result[0], stains: result[1], materials: result[2], feature: result[3][0] })
  })
}
