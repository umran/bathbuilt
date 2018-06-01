var mongoose = require('mongoose')
//var mongoosastic = require('mongoosastic')

var orderSchema = new mongoose.Schema({
  product: {type: String, required: true, es_indexed: true, es_index: 'not_analyzed'},
  custom: {type: Boolean, required: true, es_indexed: false},
  name: {type: String, required: true, es_indexed: true, es_index: 'not_analyzed'},
  email: {type: String, required: true, es_indexed: true, es_index: 'not_analyzed'},
  phone: {type: String, required: true, es_indexed: true, es_index: 'not_analyzed'},
  quantity: {type: Number, required: true, es_indexed: true, es_index: 'not_analyzed'},
  size: {type: String, required: false, es_indexed: true, es_index: 'not_analyzed'},
  material: {type: String, required: false, es_indexed: true, es_index: 'not_analyzed'},
  stain: {type: String, required: false, es_indexed: true, es_index: 'not_analyzed'},
  details: {type: String, required: false, es_indexed: true, es_analyzer: 'english'},
  date_created: {type:Date, required: true, es_indexed: true, es_type: 'date'}
})

//docSchema.plugin(mongoosastic, config.elasticServer)

var Order = mongoose.model('Order', orderSchema)

module.exports = Order
