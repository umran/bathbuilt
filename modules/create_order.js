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
        console.log(err)
        callback({status: "error", message: 'Oops! Something went wrong. We are looking into it.'})
        return
      }

      //send mail
      var orderType = 'Regular Order'
      var successMessage = 'Your order has been received. Bath Built will get back to you shortly!'
      if(clean.post.custom == 1) {
        orderType = 'Custom Order'
        successMessage = 'Your custom request has been received. Bath Built will get back to you shortly!'
      }

      var messageContent = '<p> Name: '+clean.post.name+'</p><p>Email: '+clean.post.email+'</p><p>Phone: '+clean.post.phone+'</p><p>Product: '+clean.post.product+'</p><p> Quantity: '+clean.post.quantity+'</p>'

      if(clean.post.size) {
        messageContent += '<p>Size: '+clean.post.size+'</p>'
      }

      if(clean.post.material) {
        messageContent += '<p>Material: '+clean.post.material+'</p>'
      }

      if(clean.post.stain) {
        messageContent += '<p>Stain: '+clean.post.stain+'</p>'
      }

      if(clean.post.details) {
        messageContent += '<p>Details: '+clean.post.details+'</p>'
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
          console.log(error)
          callback({status: "error", message: 'Oops! Something went wrong. We are looking into it.'})
          return
        }
        console.log('Message sent: %s', info.messageId);

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        callback(null, {status: "success", message: successMessage})
      })

    })
  })
}
