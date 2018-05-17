var mongoose = require('mongoose')
//var mongoosastic = require('mongoosastic')

var stateSchema = new mongoose.Schema({
  next_token: {type: String, required: true, es_indexed: true, es_index: 'not_analyzed'},
  date_created: {type:Date, required: true, es_indexed: true, es_type: 'date'}
})

//docSchema.plugin(mongoosastic, config.elasticServer)

var State = mongoose.model('State', stateSchema)

module.exports = State
