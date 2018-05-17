var sync = require('../modules/sync_v2')
var data = require('../modules/data')

sync.init(function(err, res) {
  if (err) {
    console.log(err)
    return
  }

  sync.process(res)
})

// function doNext() {
//
//   sync.init(function(err, response) {
//     var res = response.entries
//     var nextSyncToken = response.nextSyncToken
//
//     if(err) {
//       console.log(err)
//       return
//     }
//
//     for(i=0; i<res.length; i++) {
//       var type = getContentType(res[i])
//       var id = getItemId(res[i])
//       var fields = res[i].fields
//       if(type === 'product') {
//         data.updateProduct(res[i], function(err, res) {
//           if(err) {
//             console.log(err)
//             return
//           }
//
//           console.log(res)
//         })
//       }
//
//       if(type === 'room') {
//         data.updateRoom(res[i], function(err, res) {
//           if(err) {
//             console.log(err)
//             return
//           }
//
//           console.log(res)
//         })
//       }
//     }
//
//     // add new sync token to database
//     data.setNextSyncToken(nextSyncToken, function(err, res) {
//       if(err) {
//         console.log(err)
//         return
//       }
//
//       console.log(res)
//     })
//   })
// }
//
// function getContentType(item) {
//   if(isObject(item.sys.contentType)) {
//     return item.sys.contentType.sys.id
//   }
//
//   return item.sys.contentType
// }
//
// function getItemId(item) {
//   return item.sys.id
// }
//
// function isObject(val) {
//     if (val === null) { return false;}
//     return ( (typeof val === 'function') || (typeof val === 'object') );
// }
//
// doNext()
