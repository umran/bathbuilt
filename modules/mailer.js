const nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
    host: 'mail.gmx.com',
    port: 465,
    secure: true,
    auth: {
        user: 'bathbuiltcustom@gmx.com',
        pass: 'butfirstcoffee9.'
    }
});

module.exports = transporter
