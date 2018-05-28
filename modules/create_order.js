var data = require('./data')
var validate_order = require('./validate_order')
var mailer = require('../modules/mailer.js');

module.exports = function(post, callback) {
  validate_order(post, function(err, clean) {
    if(err) {
      callback({status: "error", message: err})
      return
    }

    data.createOrder(clean.post, function(err, res) {
      if (err) {
        callback({status: "error", message: err})
        return
      }

      //send mail
      var orderType = 'Regular Order'
      if(clean.post.custom == true) {
        orderType = 'Custom Order'
      }

      var messageContent = '<p>'+clean.post.email+'</p><p>'+clean.post.phone+'</p><p>'+clean.post.product+'</p>'

      if(clean.post.size) {
        messageContent += '<p>'+clean.post.size+'</p>'
      }

      if(clean.post.material) {
        messageContent += '<p>'+clean.post.material+'</p>'
      }

      if(clean.post.stain) {
        messageContent += '<p>'+clean.post.stain+'</p>'
      }

      var mailOptions = {
        from: '"The Website" <bathbuiltcustom@gmx.com>', // sender address
        to: 'bathbuiltcustom@gmail.com', // list of receivers
        subject: orderType +': ' + clean.post.product, // Subject line
        text: 'Check HTML message', // plain text body
        html: messageContent // html body
      }

      mailer.sendMail(mailOptions, (error, info) => {
        if (error) {
          callback({status: "error", message: error})
          return
        }
        console.log('Message sent: %s', info.messageId);

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        callback(null, {status: "success", message: res.message})
      })

    })
  })
}
