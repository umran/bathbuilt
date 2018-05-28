var mongoose = require('mongoose')
var config = require('../config')
var contentful = require('contentful')
var data = require('./data-static')

exports.init = function(callback) {

  var client = contentful.createClient({
    space: config.contentful.space,
    accessToken: config.contentful.access_token
  })

  /*
  var syncQuery = { initial: true, resolveLinks: true }

  client.sync(syncQuery).then(function(response) {
    console.log(response.entries.length)
    console.log(response.assets.length)
    callback(null, response)
  })
  */

  data.getNextSyncToken(function(err, nextSyncToken) {
    var syncQuery = { initial: true, resolveLinks: true }

    if (err) {
      callback(err)
      return
    }

    if (nextSyncToken == 'unavailable') {
      client.sync(syncQuery).then(function(response) {
        console.log(response.entries.length)
        console.log(response.assets.length)
        callback(null, {response: response})
      })
      return
    }

    var trackerQuery = { nextSyncToken: nextSyncToken, resolveLinks: true }
    client.sync(trackerQuery).then(function(tracker) {
      client.sync(syncQuery).then(function(response) {
        console.log(response.entries.length)
        console.log(response.assets.length)
        callback(null, {response: response, tracker: tracker})
      })
    })

  })
}

exports.process = function(response) {
  var results = response.response.entries
  var deletedEntries = []
  var nextSyncToken = response.response.nextSyncToken
  if (response.tracker) {
    deletedEntries = response.tracker.deletedEntries
    nextSyncToken = response.tracker.nextSyncToken
  }

  for(i=0; i<results.length; i++) {
    var type = getContentType(results[i])
    var cid = getItemId(results[i])
    data.updateEntry(cid, results[i], type, function(err, res) {
      if(err) {
        console.log(err)
        return
      }

      console.log(res)
    })
  }

  // deal with deleted entries
  for (item in deletedEntries) {
    var cid = deletedEntries[item].sys.id
    data.removeEntry(cid, function(err, res) {
      if(err) {
        console.log(err)
        return
      }

      console.log(res)
    })
  }

  // add new sync token to database
  data.setNextSyncToken(nextSyncToken, function(err, res) {
    if(err) {
      console.log(err)
      return
    }

    console.log(res)
  })
}

function getContentType(item) {
  if(isObject(item.sys.contentType)) {
    return item.sys.contentType.sys.id
  }

  return item.sys.contentType
}

function getItemId(item) {
  return item.sys.id
}

function isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}
