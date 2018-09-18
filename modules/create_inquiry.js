var data = require('./data')
var validate_order = require('./validate_inquiry')
var mailer = require('../modules/mailer-mailgun.js')

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
        from: '"The Website" <noreply@bathbuiltfurniture.com>', // sender address
        to: 'sales@bathbuiltfurniture.com', // list of receivers
        subject: header, // Subject line
        text: 'Check HTML message', // plain text body
        html: messageContent // html body
      }

      mailer.messages().send(mailOptions, (error, info) => {
        if (error) {
          console.log(error)
          callback({status: "error", message: 'Oops! Something went wrong. We are looking into it.'})
          return
        }
        console.log('Message sent: %s', info)
        callback(null, {status: "success", message: successMessage})
      })

    })
  })
}
