var data = require('../modules/data')
data.removeEntry('some bullshit', function(err, res) {
  if(err) {
    console.log(err)
    return
  }

  console.log(res)
})
