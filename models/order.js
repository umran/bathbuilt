var mongoose = require('mongoose')
//var mongoosastic = require('mongoosastic')

var orderSchema = new mongoose.Schema({
  cid: {type: Object, required: true, es_indexed: false},
  email: {type: String, required: true, es_indexed: true, es_index: 'not_analyzed'},
  phone: {type: String, required: true, es_indexed: true, es_index: 'not_analyzed'},
  size: {type: String, required: false, es_indexed: true, es_index: 'not_analyzed'},
  material: {type: String, required: false, es_indexed: true, es_index: 'not_analyzed'},
  stain: {type: String, required: false, es_indexed: true, es_index: 'not_analyzed'},
  notes: {type: String, required: false, es_indexed: true, es_analyzer: 'english'}
  date_created: {type:Date, required: true, es_indexed: true, es_type: 'date'}
})

//docSchema.plugin(mongoosastic, config.elasticServer)

var Product = mongoose.model('Product', productSchema)

module.exports = Product
