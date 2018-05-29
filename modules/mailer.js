var nodemailer = require('nodemailer')
var config = require('../config')

var transporter = nodemailer.createTransport({
    host: 'mail.gmx.com',
    port: 465,
    secure: true,
    auth: {
        user: config.gmx.username,
        pass: config.gmx.password
    }
})

module.exports = transporter
