var mailgun = require('mailgun-js')
var config = require('../config')

var transporter = mailgun({apiKey: config.mailgun.key, domain: config.mailgun.domain})

module.exports = transporter
