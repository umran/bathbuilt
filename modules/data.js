var async = require('async')
var mongoose = require('mongoose')
var State = require('../models/state')
var Product = require('../models/product')
var Room = require('../models/room')
var Entry = require('../models/entry')
var Order = require('../models/order')
var Inquiry = require('../models/inquiry')
var crypto = require('./crypto_primitives')
var slug = require("slug")

var config = require('../config')

mongoose.connect(config.mongo_url)
mongoose.connection.on('connected', function(){
  console.log("Connection to mongodb established")
})
mongoose.connection.on('error', function(err){
  console.log(err)
})
mongoose.connection.on('disconnected', function(){
  console.log("Connection to mongodb disconnected")
})

exports.updateEntry = function(cid, entry, type, callback) {
  var hash = crypto.sha256(JSON.stringify(entry))
  if (type == 'product' || type == 'rooms' || type == 'stains' || type == 'materials' || type == 'sets') {
    var entry_slug = slug(entry.fields.name['en-US'], {lower: true})
  }
  Entry.findOne({cid: cid}, function(err, res) {
    if (err) {
      callback(err)
      return
    }

    if (res) {
      if (res.hash == hash) {
        callback(null, {status: 300})
      } else {
        var update_query = {cid: cid, entry: entry, type: type, hash: hash, date_modified: new Date()}
        if(entry_slug) {
          update_query.slug = entry_slug
        }
        Entry.update({_id: res.id}, update_query, function(err) {
          if(err) {
            callback(err)
            return
          }

          callback(null, {status: 400})
        })
      }
    } else {
      var create_query = {cid: cid, entry: entry, type: type, hash: hash, date_modified: new Date()}
      if(entry_slug) {
        create_query.slug = entry_slug
      }
      var newEntry = new Entry(create_query)
      newEntry.save(function(err){
        if(err) {
          callback(err)
          return
        }

        callback(null, {status: 200})
      })
    }
  })
}

exports.removeEntry = function(cid, callback) {
  Entry.remove({cid: cid}, function(err) {
    if (err) {
      callback(err)
      return
    }

    callback(null, {status: 500})
  })
}

exports.getEntry = function(query, callback) {
  Entry.find(query, function(err, res) {
    if(err) {
      callback(err)
      return
    }

    console.log("returning results")
    callback(null, res)
  })
}

exports.getAllProducts = function(callback) {
  Entry.find({type: "product"}).sort({date_modified: -1}).exec(function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getRecentProducts = function(limit, callback) {
  Entry.find({type: "product"}).sort({date_created: -1}).limit(limit).exec(function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getRandomFeaturedProducts = function(limit, callback) {
  Entry.aggregate([{$match: {"type": "product", "entry.fields.featured.en-US": true}}, {$sample: {"size": limit}}], function(err, res){
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getProductsByRoom = function(id, callback) {
  Entry.aggregate([{
    $unwind : "$entry.fields.rooms.en-US"
  },
  {
    $match: {
      "entry.fields.rooms.en-US.sys.id": id
    }
  }, {
    $sort: {
      "entry.fields.name.en-US": 1
    }
  }], function(err, res) {
    if (err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getProductsByRoomSlug = function(slug, callback) {
  // first get cid
  exports.getEntry({slug: slug, type: "rooms"}, function(error, result) {
    if(error) {
      callback(error)
      return
    }

    if(result.length == 0) {
      var dataError = new Error('Not Found');
      callback(dataError)
      return
    }

    var id = result[0].cid
    var roomDetails = result

    Entry.aggregate([{
      $unwind : "$entry.fields.rooms.en-US"
    },
    {
      $match: {
        "entry.fields.rooms.en-US.sys.id": id
      }
    }, {
      $sort: {
        "entry.fields.name.en-US": 1
      }
    }], function(err, res) {
      if (err) {
        callback(err)
        return
      }

      callback(null, [roomDetails, res])
    })

  })
}

exports.getProductsByStain = function(id, callback) {
  Entry.aggregate([{
    $unwind : "$entry.fields.stains.en-US"
  },
  {
    $match: {
      "entry.fields.stains.en-US.sys.id": id
    }
  }, {
    $sort: {
      "entry.fields.name.en-US": 1
    }
  }], function(err, res) {
    if (err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getProductsByStainSlug = function(slug, callback) {
  // first get cid
  exports.getEntry({slug: slug, type: "stains"}, function(error, result) {
    if(error) {
      callback(error)
      return
    }

    if(result.length == 0) {
      var dataError = new Error('Not Found');
      callback(dataError)
      return
    }

    var id = result[0].cid
    var stainDetails = result

    Entry.aggregate([{
      $unwind : "$entry.fields.stains.en-US"
    },
    {
      $match: {
        "entry.fields.stains.en-US.sys.id": id
      }
    }, {
      $sort: {
        "entry.fields.name.en-US": 1
      }
    }], function(err, res) {
      if (err) {
        callback(err)
        return
      }

      callback(null, [stainDetails, res])
    })

  })
}

exports.getProductsByMaterial = function(id, callback) {
  Entry.aggregate([{
    $unwind : "$entry.fields.materials.en-US"
  },
  {
    $match: {
      "entry.fields.materials.en-US.sys.id": id
    }
  }, {
    $sort: {
      "entry.fields.name.en-US": 1
    }
  }], function(err, res) {
    if (err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getProductsByMaterialSlug = function(slug, callback) {
  // first get cid
  exports.getEntry({slug: slug, type: "materials"}, function(error, result) {
    if(error) {
      callback(error)
      return
    }

    if(result.length == 0) {
      var dataError = new Error('Not Found');
      callback(dataError)
      return
    }

    var id = result[0].cid
    var materialDetails = result

    Entry.aggregate([{
      $unwind : "$entry.fields.materials.en-US"
    },
    {
      $match: {
        "entry.fields.materials.en-US.sys.id": id
      }
    }, {
      $sort: {
        "entry.fields.name.en-US": 1
      }
    }], function(err, res) {
      if (err) {
        callback(err)
        return
      }

      callback(null, [materialDetails, res])
    })

  })
}

exports.getProductsBySet = function(id, callback) {
  Entry.aggregate([{
    $unwind : "$entry.fields.sets.en-US"
  },
  {
    $match: {
      "entry.fields.sets.en-US.sys.id": id
    }
  }, {
    $sort: {
      "entry.fields.name.en-US": 1
    }
  }], function(err, res) {
    if (err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getProductsBySetSlug = function(slug, callback) {
  // first get cid
  exports.getEntry({slug: slug, type: "sets"}, function(error, result) {
    if(error) {
      callback(error)
      return
    }

    if(result.length == 0) {
      var dataError = new Error('Not Found');
      callback(dataError)
      return
    }

    var id = result[0].cid
    var setDetails = result

    Entry.aggregate([{
      $unwind : "$entry.fields.sets.en-US"
    },
    {
      $match: {
        "entry.fields.sets.en-US.sys.id": id
      }
    }, {
      $sort: {
        "entry.fields.name.en-US": 1
      }
    }], function(err, res) {
      if (err) {
        callback(err)
        return
      }

      callback(null, [setDetails, res])
    })

  })
}

exports.getAllRooms = function(callback) {
  Entry.find({type: "rooms"}).sort({date_modified: -1}).exec(function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getAllMaterials = function(callback) {
  Entry.find({type: "materials"}).sort({date_modified: -1}).exec(function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getAllStains = function(callback) {
  Entry.find({type: "stains"}).sort({date_modified: -1}).exec(function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getHome = function(callback) {
  async.parallel([function(cb) {
    exports.getAllRooms(cb)
  }, function(cb) {
    exports.getAllStains(cb)
  }, function(cb) {
    exports.getAllMaterials(cb)
  }, function(cb) {
    exports.getRandomFeaturedProducts(4, cb)
  }], function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getProduct = function(id, callback) {
  async.parallel([function(cb) {
    exports.getAllRooms(cb)
  }, function(cb) {
    exports.getAllStains(cb)
  }, function(cb) {
    exports.getAllMaterials(cb)
  }, function(cb) {
    exports.getEntry({cid: id, type: "product"}, cb)
  }], function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getProductBySlug = function(slug, callback) {
  async.parallel([function(cb) {
    exports.getAllRooms(cb)
  }, function(cb) {
    exports.getAllStains(cb)
  }, function(cb) {
    exports.getAllMaterials(cb)
  }, function(cb) {
    exports.getEntry({slug: slug, type: "product"}, cb)
  }], function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getRoom = function(id, callback) {
  async.parallel([function(cb) {
    exports.getAllRooms(cb)
  }, function(cb) {
    exports.getAllStains(cb)
  }, function(cb) {
    exports.getAllMaterials(cb)
  }, function(cb) {
    exports.getEntry({cid: id, type: "rooms"}, cb)
  }, function(cb) {
    exports.getProductsByRoom(id, cb)
  }], function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getRoomBySlug = function(slug, callback) {
  async.parallel([function(cb) {
    exports.getAllRooms(cb)
  }, function(cb) {
    exports.getAllStains(cb)
  }, function(cb) {
    exports.getAllMaterials(cb)
  }, function(cb) {
    exports.getProductsByRoomSlug(slug, cb)
  }], function(err, res) {
    if(err) {
      callback(err)
      return
    }

    var formattedRes = []
    formattedRes[0] = res[0]
    formattedRes[1] = res[1]
    formattedRes[2] = res[2]
    formattedRes[3] = res[3][0]
    formattedRes[4] = res[3][1]

    callback(null, formattedRes)
  })
}

exports.getStain = function(id, callback) {
  async.parallel([function(cb) {
    exports.getAllRooms(cb)
  }, function(cb) {
    exports.getAllStains(cb)
  }, function(cb) {
    exports.getAllMaterials(cb)
  }, function(cb) {
    exports.getEntry({cid: id, type: "stains"}, cb)
  }, function(cb) {
    exports.getProductsByStain(id, cb)
  }], function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getStainBySlug = function(slug, callback) {
  async.parallel([function(cb) {
    exports.getAllRooms(cb)
  }, function(cb) {
    exports.getAllStains(cb)
  }, function(cb) {
    exports.getAllMaterials(cb)
  }, function(cb) {
    exports.getProductsByStainSlug(slug, cb)
  }], function(err, res) {
    if(err) {
      callback(err)
      return
    }

    var formattedRes = []
    formattedRes[0] = res[0]
    formattedRes[1] = res[1]
    formattedRes[2] = res[2]
    formattedRes[3] = res[3][0]
    formattedRes[4] = res[3][1]

    callback(null, formattedRes)
  })
}

exports.getMaterial = function(id, callback) {
  async.parallel([function(cb) {
    exports.getAllRooms(cb)
  }, function(cb) {
    exports.getAllStains(cb)
  }, function(cb) {
    exports.getAllMaterials(cb)
  }, function(cb) {
    exports.getEntry({cid: id, type: "materials"}, cb)
  }, function(cb) {
    exports.getProductsByMaterial(id, cb)
  }], function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getMaterialBySlug = function(slug, callback) {
  async.parallel([function(cb) {
    exports.getAllRooms(cb)
  }, function(cb) {
    exports.getAllStains(cb)
  }, function(cb) {
    exports.getAllMaterials(cb)
  }, function(cb) {
    exports.getProductsByMaterialSlug(slug, cb)
  }], function(err, res) {
    if(err) {
      callback(err)
      return
    }

    var formattedRes = []
    formattedRes[0] = res[0]
    formattedRes[1] = res[1]
    formattedRes[2] = res[2]
    formattedRes[3] = res[3][0]
    formattedRes[4] = res[3][1]

    callback(null, formattedRes)
  })
}

exports.getSet = function(id, callback) {
  async.parallel([function(cb) {
    exports.getAllRooms(cb)
  }, function(cb) {
    exports.getAllStains(cb)
  }, function(cb) {
    exports.getAllMaterials(cb)
  }, function(cb) {
    exports.getEntry({cid: id, type: "materials"}, cb)
  }, function(cb) {
    exports.getProductsBySet(id, cb)
  }], function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getSetBySlug = function(slug, callback) {
  async.parallel([function(cb) {
    exports.getAllRooms(cb)
  }, function(cb) {
    exports.getAllStains(cb)
  }, function(cb) {
    exports.getAllMaterials(cb)
  }, function(cb) {
    exports.getProductsBySetSlug(slug, cb)
  }], function(err, res) {
    if(err) {
      callback(err)
      return
    }

    var formattedRes = []
    formattedRes[0] = res[0]
    formattedRes[1] = res[1]
    formattedRes[2] = res[2]
    formattedRes[3] = res[3][0]
    formattedRes[4] = res[3][1]

    callback(null, formattedRes)
  })
}

exports.getStainsPalette = function(callback) {
  async.parallel([function(cb) {
    exports.getAllRooms(cb)
  }, function(cb) {
    exports.getAllStains(cb)
  }, function(cb) {
    exports.getAllMaterials(cb)
  }], function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getMaterialsPalette = function(callback) {
  async.parallel([function(cb) {
    exports.getAllRooms(cb)
  }, function(cb) {
    exports.getAllStains(cb)
  }, function(cb) {
    exports.getAllMaterials(cb)
  }], function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getAllTestimonials = function(callback) {
  Entry.find({type: "testimonial"}).sort({date_modified: -1}).exec(function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getTestimonialPage = function(callback) {
  async.parallel([function(cb) {
    exports.getAllRooms(cb)
  }, function(cb) {
    exports.getAllStains(cb)
  }, function(cb) {
    exports.getAllMaterials(cb)
  }, function(cb) {
    exports.getAllTestimonials(cb)
  }], function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getStaticPage = function(callback) {
  async.parallel([function(cb) {
    exports.getAllRooms(cb)
  }, function(cb) {
    exports.getAllStains(cb)
  }, function(cb) {
    exports.getAllMaterials(cb)
  }], function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getSitemapPage = function(callback) {
  async.parallel([function(cb) {
    exports.getAllRooms(cb)
  }, function(cb) {
    exports.getAllStains(cb)
  }, function(cb) {
    exports.getAllMaterials(cb)
  }, function(cb) {
    exports.getAllProducts(cb)
  }], function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getPrice = function(data, callback) {
  var query = {}
  if(data.material_id && data.size_id) {
    query = {$and:[{"entry.fields.material.en-US.sys.id": data.material_id}, {"type": "prices"}, {"entry.fields.size.en-US.sys.id": data.size_id}, {"entry.fields.product.en-US.sys.id": data.product_id}]}
  } else if (data.material_id) {
    query = {$and:[{"entry.fields.material.en-US.sys.id": data.material_id}, {"type": "prices"}, {"entry.fields.product.en-US.sys.id": data.product_id}]}
  } else if (data.size_id) {
    query = {$and:[{"type": "prices"}, {"entry.fields.size.en-US.sys.id": data.size_id}, {"entry.fields.product.en-US.sys.id": data.product_id}]}
  } else {
    query = {$and:[{"type": "prices"}, {"entry.fields.product.en-US.sys.id": data.product_id}]}
  }

  Entry.findOne(query, function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.createOrder = function(entry, callback) {
  entry.date_created = new Date()
  var newOrder = new Order(entry)

  newOrder.save(function(err){
    if(err) {
      console.log(err)
      callback('something went wrong')
      return
    }

    callback(null, {status: 200})
  })
}

exports.createInquiry = function(entry, callback) {
  entry.date_created = new Date()
  var newInquiry = new Inquiry(entry)

  newInquiry.save(function(err){
    if(err) {
      console.log(err)
      callback('something went wrong')
      return
    }

    callback(null, {status: 200})
  })
}

exports.getNextSyncToken = function(callback) {
  State.find().sort({date_created: -1}).limit(1).exec(function(err, res) {
    if(err) {
      callback(err)
      return
    }

    if(res.length == 0) {
      res = 'unavailable'
    } else {
      res = res[0].next_token
    }

    callback(null, res)
  })
}

exports.setNextSyncToken = function(nextSyncToken, callback) {
  var newState = new State({next_token: nextSyncToken, date_created: new Date()})
  newState.save(function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, {status: 100})
  })
}
