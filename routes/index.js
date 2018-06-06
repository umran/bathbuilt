var express = require('express')
var router = express.Router()
var data = require('../modules/data')
var utilities = require('../modules/utilities')
var create_order = require('../modules/create_order')
var create_inquiry = require('../modules/create_inquiry')
var get_price = require('../modules/get_price')
var showdown  = require('showdown')

/* GET home page. */
router.get('/', function(req, res, next) {
  data.getHome(function(err, result){
    if(err) {
      var httpError = new Error('Not Found');
      httpError.status = 404;
      next(httpError)
      //res.render('error')
      return
    }
    res.render('index', { title: 'Bath Built Custom Wood Furniture Vancouver BC', rooms: result[0], stains: result[1], materials: result[2], feature: result[3][0] })
  })
})

router.get('/rooms/:id', function(req, res, next) {
  var id = req.params.id
  id = id.toLowerCase()

  data.getRoomBySlug(id, function(err, result) {
    if(err) {
      var httpError = new Error('Not Found');
      httpError.status = 404;
      next(httpError)
      //res.render('error')
      return
    }

    if(result[3].length == 0) {
      var httpError = new Error('Not Found');
      httpError.status = 404;
      next(httpError)
      //res.render('error')
      return
    }

    res.render('room', { title: result[3][0].entry.fields.name["en-US"] + ' | Bathbuilt Custom Wood Furniture Vancouver BC', rooms: result[0], stains: result[1], materials: result[2], result: result[3][0], products: result[4]})
  })
})

// stain palette
router.get('/wood-stains', function(req, res, next) {

  data.getStainsPalette(function(err, result) {
    if(err) {
      var httpError = new Error('Not Found');
      httpError.status = 404;
      next(httpError)
      //res.render('error')
      return
    }

    res.render('stain-palette', { title: 'Stains | Bathbuilt Custom Wood Furniture Vancouver BC', rooms: result[0], stains: result[1], materials: result[2]})
  })
})

router.get('/stains/:id', function(req, res, next) {
  var id = req.params.id
  id = id.toLowerCase()

  data.getStainBySlug(id, function(err, result) {
    if(err) {
      var httpError = new Error('Not Found');
      httpError.status = 404;
      next(httpError)
      //res.render('error')
      return
    }

    if(result[3].length == 0) {
      var httpError = new Error('Not Found');
      httpError.status = 404;
      next(httpError)
      //res.render('error')
      return
    }

    res.render('stain', { title: result[3][0].entry.fields.name["en-US"] + ' | Bathbuilt Custom Wood Furniture Vancouver BC', rooms: result[0], stains: result[1], materials: result[2], result: result[3][0], products: result[4]})
  })
})

router.get('/materials/:id', function(req, res, next) {
  var id = req.params.id
  id = id.toLowerCase()

  data.getMaterialBySlug(id, function(err, result) {
    if(err) {
      var httpError = new Error('Not Found');
      httpError.status = 404;
      next(httpError)
      //res.render('error')
      return
    }

    if(result[3].length == 0) {
      var httpError = new Error('Not Found');
      httpError.status = 404;
      next(httpError)
      //res.render('error')
      return
    }

    res.render('material', { title: result[3][0].entry.fields.name["en-US"] + ' | Bathbuilt Custom Wood Furniture Vancouver BC', rooms: result[0], stains: result[1], materials: result[2], result: result[3][0], products: result[4]})
  })
})

router.get('/products/:id', function(req, res, next) {
  var converter = new showdown.Converter()

  var id = req.params.id
  id = id.toLowerCase()

  data.getProductBySlug(id, function(err, result) {
    if(err) {
      var httpError = new Error('Not Found');
      httpError.status = 404;
      next(httpError)
      //res.render('error')
      return
    }

    if(result[3].length == 0) {
      var httpError = new Error('Not Found');
      httpError.status = 404;
      next(httpError)
      //res.render('error')
      return
    }

    var raw = result[3][0]

    if(raw.entry.fields.specifications['en-US']) {
      raw.entry.fields.specifications['en-US'] = converter.makeHtml(raw.entry.fields.specifications['en-US'])
    }

    res.render('product', { title: result[3][0].entry.fields.name["en-US"] + ' | Bathbuilt Custom Wood Furniture Vancouver BC', rooms: result[0], stains: result[1], materials: result[2], result: raw })
  })
})

// testimonials
router.get('/testimonials', function(req, res, next) {
  data.getTestimonialPage(function(err, result){
    if(err) {
      var httpError = new Error('Not Found');
      httpError.status = 404;
      next(httpError)
      //res.render('error')
      return
    }
    res.render('testimonials', { title: 'Testimonials | Bath Built Custom Wood Furniture Vancouver BC', rooms: result[0], stains: result[1], materials: result[2], testimonials: result[3] })
  })
})

// static pages
router.get('/about', function(req, res, next) {
  data.getStaticPage(function(err, result){
    if(err) {
      var httpError = new Error('Not Found');
      httpError.status = 404;
      next(httpError)
      //res.render('error')
      return
    }
    res.render('about', { title: 'About Us | Bath Built Custom Wood Furniture Vancouver BC', rooms: result[0], stains: result[1], materials: result[2] })
  })
})

router.get('/contact', function(req, res, next) {
  data.getStaticPage(function(err, result){
    if(err) {
      var httpError = new Error('Not Found');
      httpError.status = 404;
      next(httpError)
      //res.render('error')
      return
    }
    res.render('contact', { title: 'Contact | Bathbuilt Custom Wood Furniture Vancouver BC', rooms: result[0], stains: result[1], materials: result[2] })
  })
})

// post pages
router.route('/new-order').post(function(req, res) {
  create_order(req.body, function(err, result){
    if(err) {
      res.send(err)
      return
    }

    res.send(result)
  })
})

router.route('/new-inquiry').post(function(req, res) {
  create_inquiry(req.body, function(err, result){
    if(err) {
      res.send(err)
      return
    }

    res.send(result)
  })
})

// asynchronous resources
router.route('/get-price').post(function(req, res) {
  get_price(req.body, function(err, result){
    if(err) {
      res.send(err)
      return
    }

    res.send(result)
  })
})

// redirects
router.get('/stains', function(req, res, next) {
  res.redirect(301, '/wood-stains')
})

module.exports = router
