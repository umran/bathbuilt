var async = require('async')
var mongoose = require('mongoose')
var State = require('../models/state')
var Product = require('../models/product')
var Room = require('../models/room')
var Entry = require('../models/entry')
var crypto = require('./crypto_primitives')

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
  Entry.findOne({cid: cid}, function(err, res) {
    if (err) {
      callback(err)
      return
    }

    if (res) {
      if (res.hash == hash) {
        callback(null, {status: 300})
      } else {
        Entry.update({_id: res.id}, {cid: cid, entry: entry, type: type, hash: hash, date_modified: new Date()}, function(err) {
          if(err) {
            callback(err)
            return
          }

          callback(null, {status: 400})
        })
      }
    } else {
      var newEntry = new Entry({cid: cid, entry: entry, type: type, hash: hash, date_modified: new Date()})
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
  Entry.find({type: "product"}).sort({date_created: -1}).limit(limit).exec(function(err, res) {
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
    exports.getRandomProducts(12, cb)
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
