var mongoose = require('mongoose')
//var mongoosastic = require('mongoosastic')

var roomSchema = new mongoose.Schema({
  room: {type: Object, required: true, es_indexed: false},
  hash: {type: String, required: true, es_indexed: true, es_index: 'not_analyzed'},
  date_modified: {type:Date, required: true, es_indexed: true, es_type: 'date'}
})

//docSchema.plugin(mongoosastic, config.elasticServer)

var Room = mongoose.model('Room', roomSchema)

module.exports = Room
