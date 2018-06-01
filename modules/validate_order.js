var createDOMPurify = require('dompurify')
var { JSDOM } = require('jsdom')

module.exports = function(post, callback) {
  var window = (new JSDOM('')).window
  var DOMPurify = createDOMPurify(window)

  var clean = {}

  if (!post.product || !post.email || !post.phone || !post.custom || !post.name || !post.quantity) {
    callback('The post was submitted with incomplete information')
    return
  }

  clean.product = DOMPurify.sanitize(post.product, {SAFE_FOR_TEMPLATES: true})
  clean.name = DOMPurify.sanitize(post.name, {SAFE_FOR_TEMPLATES: true})
  clean.email = DOMPurify.sanitize(post.email, {SAFE_FOR_TEMPLATES: true})
  clean.phone = DOMPurify.sanitize(post.phone, {SAFE_FOR_TEMPLATES: true})
  clean.custom = DOMPurify.sanitize(post.custom, {SAFE_FOR_TEMPLATES: true})
  clean.quantity = DOMPurify.sanitize(post.quantity, {SAFE_FOR_TEMPLATES: true})

  if(post.size) {
    clean.size = DOMPurify.sanitize(post.size, {SAFE_FOR_TEMPLATES: true})
  }

  if(post.stain) {
    clean.stain = DOMPurify.sanitize(post.stain, {SAFE_FOR_TEMPLATES: true})
  }

  if(post.material) {
    clean.material = DOMPurify.sanitize(post.material, {SAFE_FOR_TEMPLATES: true})
  }

  if(post.details) {
    clean.details = DOMPurify.sanitize(post.details, {SAFE_FOR_TEMPLATES: true})
  }

  callback(null, {post: clean})
}
