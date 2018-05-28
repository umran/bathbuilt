var mongoose = require('mongoose')
//var mongoosastic = require('mongoosastic')

var entrySchema = new mongoose.Schema({
  cid: {type: String, required: true, es_indexed: true, es_index: 'not_analyzed'},
  slug: {type: String, required: false, es_indexed: true, es_index: 'not_analyzed'},
  entry: {type: Object, required: true, es_indexed: false},
  type: {type: String, required: true, es_indexed: true},
  hash: {type: String, required: true, es_indexed: true, es_index: 'not_analyzed'},
  date_modified: {type:Date, required: true, es_indexed: true, es_type: 'date'}
})

//docSchema.plugin(mongoosastic, config.elasticServer)

var Entry = mongoose.model('Entry', entrySchema)

module.exports = Entry
