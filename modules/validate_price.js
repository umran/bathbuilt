var createDOMPurify = require('dompurify')
var { JSDOM } = require('jsdom')

module.exports = function(post, callback) {
  var window = (new JSDOM('')).window
  var DOMPurify = createDOMPurify(window)

  var clean = {}

  if (!post.product_id) {
    callback('The post was submitted with incomplete information')
    return
  }

  clean.product_id = DOMPurify.sanitize(post.product_id, {SAFE_FOR_TEMPLATES: true});

  if(post.size_id) {
    clean.size_id = DOMPurify.sanitize(post.size_id, {SAFE_FOR_TEMPLATES: true});
  }

  if(post.material_id) {
    clean.material_id = DOMPurify.sanitize(post.material_id, {SAFE_FOR_TEMPLATES: true});
  }

  callback(null, {post: clean})
}
