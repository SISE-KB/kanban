'use strict';

var mongoose = require('mongoose')
   , server = require('./app')
   ,  config=require('./config')
     
var port=config.server.listenPort

mongoose.connect(config.mongo.MongoDB, function(err) {
  if (err) {
    console.log(config.mongo.MongoDB+ ' connection error. ', err)
    throw(err)
  } else{
    console.log(config.mongo.MongoDB + ' connected.')
  }
})

server.listen(port, function() {
  console.log('Express server listening on port ' + port)
    var open = require('open');
    open('http://localhost:' + config.server.listenPort + '/');
})

