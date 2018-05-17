var data = require('../modules/data')

data.getProductsByRoom("2U6naUCXYcA48ikkkAU0ow", function(err, res) {
  if(err) {
    console.log(err)
    return
  }

  console.log(res)
})
