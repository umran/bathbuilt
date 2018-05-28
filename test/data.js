var mongoose = require('mongoose')
var data = require('../modules/data-static')
var config = require('../config')

mongoose.connect(config.mongo_url)
mongoose.connection.on('connected', function(){
  console.log("Connection to mongodb established")
})
mongoose.connection.on('error', function(err){
  console.log(err)
})
mongoose.connection.on('disconnected', function(){
  console.log("Connection to mongodb disconnected")
})

data.getRandomProducts(1, function(err, res){
  if(err){
    console.log(err)
    return
  }

  console.log(res)
})
