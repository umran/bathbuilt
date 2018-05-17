var express = require('express')
var router = express.Router()
var data = require('../modules/data')

/* GET home page. */
router.get('/', function(req, res, next) {
  data.getHome(function(err, result){
    if(err) {
      res.render('error')
      return
    }
    res.render('index', { title: 'Bath Built', rooms: result[0], stains: result[1], materials: result[2], products: result[3] })
  })
})

router.get('/rooms/:id', function(req, res, next) {
  var id = req.params.id

  data.getRoom(id, function(err, result) {
    if(err) {
      res.render('error')
      return
    }

    if(result[3].length == 0) {
      res.render('error')
      return
    }

    res.render('room', { title: result[3][0].entry.fields.name["en-US"], rooms: result[0], stains: result[1], materials: result[2], result: result[3][0], products: result[4]})
  })
})

router.get('/stains/:id', function(req, res, next) {
  var id = req.params.id

  data.getStain(id, function(err, result) {
    if(err) {
      res.render('error')
      return
    }

    if(result[3].length == 0) {
      res.render('error')
      return
    }

    res.render('stain', { title: result[3][0].entry.fields.name["en-US"], rooms: result[0], stains: result[1], materials: result[2], result: result[3][0], products: result[4]})
  })
})

router.get('/materials/:id', function(req, res, next) {
  var id = req.params.id

  data.getMaterial(id, function(err, result) {
    if(err) {
      res.render('error')
      return
    }

    if(result[3].length == 0) {
      res.render('error')
      return
    }

    res.render('material', { title: result[3][0].entry.fields.name["en-US"], rooms: result[0], stains: result[1], materials: result[2], result: result[3][0], products: result[4]})
  })
})

router.get('/products/:id', function(req, res, next) {
  var id = req.params.id

  data.getProduct(id, function(err, result) {
    if(err) {
      res.render('error')
      return
    }

    if(result[3].length == 0) {
      res.render('error')
      return
    }

    res.render('product', { title: result[3][0].entry.fields.name["en-US"], rooms: result[0], stains: result[1], materials: result[2], result: result[3][0] })
  })
})

module.exports = router
