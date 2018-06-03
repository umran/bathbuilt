var mongoose = require('mongoose')
//var mongoosastic = require('mongoosastic')

var inquirySchema = new mongoose.Schema({
  name: {type: String, required: true, es_indexed: true, es_index: 'not_analyzed'},
  email: {type: String, required: true, es_indexed: true, es_index: 'not_analyzed'},
  phone: {type: String, required: true, es_indexed: true, es_index: 'not_analyzed'},
  message: {type: String, required: true, es_indexed: true, es_analyzer: 'english'},
  date_created: {type:Date, required: true, es_indexed: true, es_type: 'date'}
})

//docSchema.plugin(mongoosastic, config.elasticServer)

var Inquiry = mongoose.model('Inquiry', inquirySchema)

module.exports = Inquiry
