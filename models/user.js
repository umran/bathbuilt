var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  kdf: {type: String, required: true},
  fullname: {type: String, required: true},
  bio: {type: String, required: false},
  social: {type: String, required: false},
  date_created: {type:Date, required: true},
  date_modified: {type:Date, required: true},
  admin_status: {type: Boolean, required: true, default: false},
  doc_hash: {type: String, required: true}
})

var User = mongoose.model('User', userSchema)

module.exports = User
