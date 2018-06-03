var data = require('./data')
var validate_order = require('./validate_inquiry')
var mailer = require('../modules/mailer.js');

module.exports = function(post, callback) {
  validate_order(post, function(err, clean) {
    if(err) {
      callback({status: "error", message: err})
      return
    }

    data.createInquiry(clean.post, function(err, res) {
      if (err) {
        console.log(err)
        callback({status: "error", message: 'Oops! Something went wrong. We are looking into it.'})
        return
      }

      //send mail
      var header = 'New Inquiry'
      var successMessage = 'Your inquiry has been submitted. Bath Built will get back to you shortly!'

      var messageContent = '<p> Name: '+clean.post.name+'</p><p>Email: '+clean.post.email+'</p><p>Phone: '+clean.post.phone+'</p><p>Product: '+clean.post.message+'</p>'

      var mailOptions = {
        from: '"The Website" <bathbuilttemp@gmx.com>', // sender address
        to: 'bathbuiltcustom@gmail.com', // list of receivers
        subject: header, // Subject line
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
