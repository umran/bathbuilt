
var createDOMPurify = require('dompurify')
var { JSDOM } = require('jsdom')

module.exports = function(post, callback) {
  var window = (new JSDOM('')).window
  var DOMPurify = createDOMPurify(window)

  var clean = {}

  if (!post.name || !post.email || !post.phone || !post.message) {
    callback('The post was submitted with incomplete information')
    return
  }

  clean.name = DOMPurify.sanitize(post.name, {SAFE_FOR_TEMPLATES: true})
  clean.email = DOMPurify.sanitize(post.email, {SAFE_FOR_TEMPLATES: true})
  clean.phone = DOMPurify.sanitize(post.phone, {SAFE_FOR_TEMPLATES: true})
  clean.message = DOMPurify.sanitize(post.message, {SAFE_FOR_TEMPLATES: true})

  callback(null, {post: clean})
}
