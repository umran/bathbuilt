var async = require('async')
var mongoose = require('mongoose')
var State = require('../models/state')
var Product = require('../models/product')
var Room = require('../models/room')
var Entry = require('../models/entry')
var Order = require('../models/order')
var crypto = require('./crypto_primitives')
var slug = require("slug")

var config = require('../config')

exports.updateEntry = function(cid, entry, type, callback) {
  var hash = crypto.sha256(JSON.stringify(entry))
  if (type == 'product' || type == 'rooms') {
    var entry_slug = slug(entry.fields.name['en-US'])
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

exports.getRandomProducts = function(limit, callback) {
  Entry.aggregate([{$match: {"type": "product"}}, {$sample: {"size": limit}}], function(err, res){
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

exports.getProductsByStain = function(id, callback) {
  Entry.aggregate([{
    $unwind : "$entry.fields.stains.en-US"
  },
  {
    $match: {
      "entry.fields.stains.en-US.sys.id": id
    }
  }], function(err, res) {
    if (err) {
      callback(err)
      return
    }

    callback(null, res)
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
  }], function(err, res) {
    if (err) {
      callback(err)
      return
    }

    callback(null, res)
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
    exports.getRandomProducts(1, cb)
  }], function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
  })
}

exports.getProductById = function(id, callback) {
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

exports.createOrder = function(entry, callback) {
  entry.date_created = new Date()
  var newOrder = new Order(entry)

  newOrder.save(function(err){
    if(err) {
      console.log(err)
      callback('something went wrong')
      return
    }

    callback(null, {message: 'Your order has been placed. Bath Built will get back to you shortly. Thank you!'})
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
  }

  Entry.findOne(query, function(err, res) {
    if(err) {
      callback(err)
      return
    }

    callback(null, res)
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
